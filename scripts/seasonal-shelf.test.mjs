import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {shelfPolicy, shelfQualityGroup, seasonalReviewWindows, commerceReviewHorizon, planShelfUpdate, isSavedHistoryProduct} from '../src/catalog/shelfUpdates.js';
import {activeCatalog, catalogItem} from '../src/catalog/operations.js';
import {allSakePairings, getSakeById, visibleSakePairings} from '../src/data/siteData.js';
import {migrateFavorites} from '../src/data/favoriteReferences.js';
import {productMediaFor} from '../src/commerce/productMedia.js';
import {productFingerprint} from '../src/commerce/validation.js';
import {reviewedCommerceUpdate,digest} from './lib/reviewed-commerce-update.mjs';
import {purchaseUnavailable,imageDisplayUnavailable,unavailableSearchLink} from '../src/commerce/availability.js';
import {projectFinalCommerce} from '../src/commerce/finalCommerce.js';
const read = file => JSON.parse(fs.readFileSync(new URL('../' + file, import.meta.url)));
const now = '2026-10-20T00:00:00Z', sources = [1, 2].map(i => ({sourceUrl: `https://item.rakuten.co.jp/store-${i}/product/`, checkedAt: now, retrieved: true, sourceType: 'rakuten_retail'}));
const removal = (sakeId, extra = {}) => ({sakeId, status: 'INACTIVE', reviewed: true, reasonCode: 'UNRESOLVED_AFTER_RESCUE', whyInactive: '複数店舗と現行SKUを審査した結果、同一SKUの購入先を確認できない。', rescueReview: {reviewed: true, stockConclusion: 'NO_CONFIRMED_PURCHASABLE_SAME_SKU', sources, searches: [{query: 'current sku', ok: true, checkedAt: now}]}, ...extra});
const items = Array.from({length: 500}, (_, i) => ({id: 'old-' + i}));
const plan = extra => planShelfUpdate({items, batchId: 'winter-2026-review', approved: true, now, ...extra});

test('the shelf target and batch sizes are guidance, not a count growth KPI or scheduler', () => {
  assert.equal(shelfPolicy.targetActive.preferred, 500); assert.equal(shelfPolicy.targetActive.hardLimit, false);
  assert.equal(shelfPolicy.typicalBatch.mandatoryQuota, false);
  assert.equal(shelfPolicy.automaticPublicationAllowed, false); assert.equal(shelfPolicy.automaticDeactivationAllowed, false);
  assert.equal(shelfPolicy.weeklyMonitoringEnabled, false); assert.equal(shelfPolicy.scheduledExecutionEnabled, false);
});
test('all four quality groups are independent of price and affiliate commission', () => {
  assert.equal(shelfQualityGroup({directLink: true, formalImage: true}), 'A');
  assert.equal(shelfQualityGroup({directLink: true, formalImage: false}), 'B');
  assert.equal(shelfQualityGroup({directLink: false, formalImage: true}), 'C');
  assert.equal(shelfQualityGroup({directLink: false, formalImage: false, commission: 99}), 'D');
});
test('four annual manual review windows wrap correctly and use Japan time', () => {
  const windows = seasonalReviewWindows('2026-10-20'); assert.equal(windows.length, 4);
  assert.equal(windows[0].id, 'winter'); assert.equal(windows[0].opensOn, '2026-11-20');
  assert.equal(windows[1].opensOn, '2027-02-20'); assert(windows.every(w => !w.scheduled));
  assert(seasonalReviewWindows('2026-11-19T15:00:00Z')[0].current);
  assert.equal(seasonalReviewWindows('2026-12-31T15:00:00Z')[0].id, 'spring');
  assert.throws(() => seasonalReviewWindows('not-a-date'));
});
test('missing links, failed retrievals and a single sold-out shop cannot deactivate products', () => {
  assert(plan({removals: [removal('old-0', {rescueReview: null})]}).errors.includes('RESCUE_REVIEW_REQUIRED'));
  const failed = {reviewed: true, stockConclusion: 'NO_CONFIRMED_PURCHASABLE_SAME_SKU', sources: sources.map(s => ({...s, retrieved: false})), searches: [{ok: false, checkedAt: now}]};
  assert(plan({removals: [removal('old-0', {rescueReview: failed})]}).errors.includes('RESCUE_REVIEW_REQUIRED'));
  const single = {...removal('old-0').rescueReview, sources: sources.slice(0, 1)};
  assert(plan({removals: [removal('old-0', {rescueReview: single})]}).errors.includes('ALTERNATIVE_MERCHANT_REVIEW_REQUIRED'));
});
test('season end alone is not a stock failure, and discontinuation requires explicit official evidence', () => {
  const seasonOnly = {...removal('old-0').rescueReview, stockConclusion: 'SEASON_ENDED'};
  assert(!plan({removals: [removal('old-0', {rescueReview: seasonOnly})]}).ready);
  assert(plan({removals: [removal('old-0', {reasonCode: 'DISCONTINUED_OFFICIAL'})]}).errors.includes('DISCONTINUATION_NOT_VERIFIED'));
});
test('reviewed off-shelf status retains the product and never rewrites favorites or URLs', () => {
  const snapshot = JSON.stringify(items), p = plan({removals: [removal('old-0')]});
  assert(p.ready); assert.equal(p.activeAfter, 499); assert.equal(items.length, p.retainedProductIds.length);
  assert.equal(JSON.stringify(items), snapshot); assert.equal(catalogItem(items, 'old-0').id, 'old-0');
  assert(!activeCatalog(items, p.records).some(i => i.id === 'old-0')); assert(isSavedHistoryProduct('old-0', p.records));
  assert.deepEqual(p.migrations, []); assert.deepEqual(p.redirects, []); assert.deepEqual(p.deletions, []);
  assert(!JSON.stringify(p.records).includes('rescueReview')); assert(p.auditLog[0].rescueReview);
});
test('automatic removal, deletion, redirects and favorite transfer are rejected', () => {
  for (const change of [{automatic: true}, {deleteProduct: true}, {redirectTo: 'new'}, {migrateFavoritesTo: 'new'}]) assert(plan({removals: [removal('old-0', change)]}).errors.includes('RETENTION_POLICY_VIOLATION'));
});
test('a large unbalanced removal is rejected instead of dropping the shelf to 400', () => {
  const removals = items.slice(0, 100).map(i => removal(i.id));
  assert(plan({removals}).errors.includes('UNBALANCED_MASS_DEACTIVATION'));
  assert(!plan({removals}).ready);
});
test('valid smaller collections can be explicitly reviewed without padding to 500', () => {
  const removals = items.slice(0, 30).map(i => removal(i.id));
  const p = plan({removals, minimumActiveException: {reviewed: true, reason: '品質を優先し470商品で維持'}});
  assert(p.ready); assert.equal(p.activeAfter, 470); assert(p.warnings.includes('OUTSIDE_SOFT_ACTIVE_TARGET'));
});
test('new products require new IDs and all current publication gates; no name-only adoption', () => {
  const p = plan({additions: [{product: {id: 'old-0'}, candidate: {productionProductId: 'old-0'}, whyAdded: '季節酒'}]});
  assert(p.errors.includes('NEW_PRODUCT_ID_REQUIRED')); assert(p.errors.includes('NEW_PRODUCT_PUBLICATION_GATE_FAILED'));
  assert(!plan({approved: false}).ready);
});
test('the first maintenance batch changes commerce only for the explicitly reviewed products', () => {
  const batch = read('data/catalog-operations/seasonal-shelf-batches.json');
  assert(batch.reviewed); assert.equal(batch.automaticPublicationAllowed, false);
  assert.deepEqual(batch.additions, []); assert.deepEqual(batch.inactivated, []); assert.deepEqual(batch.archived, []);
  const matches = read('src/commerce/generated/purchase-matches.json');
  for (const change of batch.commerceChanges) {
    assert(['src/commerce/generated/purchase-matches.json','src/commerce/generated/product-media.json'].includes(change.file));
    const changedRecord=change.file.endsWith('product-media.json')?read(change.file).records[change.sakeId]:matches[change.sakeId];
    assert.equal(createHash('sha256').update(JSON.stringify(changedRecord)).digest('hex'), change.afterSha256);
    const item = getSakeById(change.sakeId), image = productMediaFor(item);
    if(imageDisplayUnavailable(item.id)){assert(purchaseUnavailable(item.id));continue;}
    assert(image); assert.equal(image.productFingerprint, productFingerprint(item));
    assert.equal(image.productUrl, matches[item.id].normalUrl); assert.equal(image.capacityMl, matches[item.id].capacityMl);
    assert.equal(image.originalUnmodified, true);
  }
  assert.equal(allSakePairings.length, visibleSakePairings.length);
});
test('favorite IDs remain stable across a future inactive state and archive references remain accessible', () => {
  const id = allSakePairings[0].id, saved = [id, 'ginban-i4si9d'];
  assert.deepEqual(migrateFavorites(saved), saved); assert.equal(getSakeById(id).id, id);
  assert(isSavedHistoryProduct(id, {[id]: {status: 'ARCHIVED'}}));
  assert.equal(shelfPolicy.retention.redirectToDifferentSku, false);
});
test('restock alone does not reactivate an unknown SKU or bypass current publication gates', () => {
  const p = plan({lifecycle: {'old-0': {status: 'INACTIVE'}}, reactivations: [{sakeId: 'old-0', reviewed: true, whyRestored: '再入荷'}]});
  assert(!p.ready); assert(p.errors.includes('SAME_EXISTING_SKU_REVIEW_REQUIRED')); assert(p.errors.includes('REACTIVATION_PUBLICATION_GATE_FAILED'));
});
test('the later commerce ledger cannot waive unrelated or subsequently tampered records', () => {
  const batch = read('data/catalog-operations/seasonal-shelf-batches.json'), change = batch.commerceChanges[0];
  const current = read(change.file)[change.sakeId];
  assert(reviewedCommerceUpdate(change.file, change.sakeId, change.beforeSha256, current));
  assert(!reviewedCommerceUpdate(change.file, 'unrelated', change.beforeSha256, current));
  assert(!reviewedCommerceUpdate(change.file, change.sakeId, change.beforeSha256, {...current, capacityMl: 999}));
  assert(!reviewedCommerceUpdate('src/data/discoveryCatalog.json', change.sakeId, change.beforeSha256, current));
  assert.equal(digest(current), change.afterSha256);
});
test('quarterly shelf updates never silently extend earlier commerce review deadlines', () => {
  const horizon = commerceReviewHorizon([{validUntil: '2026-11-13T08:49:33Z'}], '2026-10-20');
  assert.equal(horizon.manualPreflightDueOn, '2026-11-06'); assert(horizon.expiresBeforeNextSeasonalWindow);
  assert.equal(horizon.automaticExtensionAllowed, false); assert.equal(horizon.scheduled, false);
  assert(horizon.internalReviewDeadlineNotProviderLicenseTerm);
});
test('stock and permission remain independent; broken product pages fail closed without deleting history', () => {
  const broken=getSakeById('shichihonyari-lvvrsw'),soldOut=getSakeById('kurawanka-junmai-usunigori-v1');
  const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
  assert(imageDisplayUnavailable(broken.id));assert.equal(productMediaFor(broken),null);
  assert(purchaseUnavailable(soldOut.id));assert(!imageDisplayUnavailable(soldOut.id));assert(productMediaFor(soldOut));
  assert.deepEqual(projectFinalCommerce(broken,config),{normal:[],offer:null});
  const fallback=unavailableSearchLink(broken);assert.equal(fallback.isAffiliate,false);assert.equal(new URL(fallback.url).hostname,'search.rakuten.co.jp');
  assert(visibleSakePairings.some(i=>i.id===broken.id));assert.deepEqual(migrateFavorites([broken.id]),[broken.id]);
});
