import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productMediaFor} from '../src/commerce/productMedia.js';
import {additions} from './lib/catalog-fixture.mjs';
import {reviewedCommerceUpdate,reviewedImageRescueIds,reviewedPurchaseHoldIds,reviewedDirectRescueIds} from './lib/reviewed-commerce-update.mjs';
import {reviewedHistoricalRecovery} from './lib/reviewed-historical-update.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url))),hash=v=>createHash('sha256').update(JSON.stringify(v)).digest('hex');
const catalog=read('src/data/discoveryCatalog.json'),matches=read('src/commerce/generated/purchase-matches.json'),media=read('src/commerce/generated/product-media.json');
const audit=read('docs/rakuten-deep-review/audit.json'),published=read('docs/rakuten-deep-review/published.json').rows,protection=read('docs/rakuten-deep-review/protection.json');
test('all 140 have contextual decisions, brand searches and retained different-SKU evidence',()=>{
 assert.equal(audit.rows.length,140);assert.equal(new Set(audit.rows.map(r=>r.sakeId)).size,140);
 for(const row of audit.rows){assert(row.reason.length>15);assert(row.searches.some(q=>q.kind==='brand'));assert(row.currentProduct.classification&&row.currentProduct.specs);assert(row.officialSources);assert(['EXACT_RECOVERED','SAME_BRAND_REPLACED','SAME_BREWERY_REPLACED','KEEP_EXISTING_FALLBACK','UNRESOLVED','NO_VALID_CANDIDATE'].includes(row.finalDecision));assert.equal(row.availabilityStatus,'availability_unknown');}
 const yamori=audit.rows.find(r=>r.sakeId==='okunokami-junmai-ginjo-muchosei-nama-v1');assert(yamori.rakutenCandidates.some(c=>c.name.includes('直汲')&&c.differences.length));assert(yamori.rakutenCandidates.some(c=>c.name.includes('雄町')));
});
test('original 352 links, 344 media and 491 untouched catalog records stay byte-equivalent as objects',()=>{
 assert.equal(catalog.items.length,492);assert.equal(new Set(catalog.items.map(i=>i.id)).size,492);
 assert.equal(Object.keys(protection.links).length,352);assert.equal(Object.keys(protection.images).length,344);assert.equal(Object.keys(protection.items).length,491);
 for(const[id,digest]of Object.entries(protection.links))assert(hash(matches[id])===digest||reviewedCommerceUpdate('src/commerce/generated/purchase-matches.json',id,digest,matches[id]));
 for(const[id,digest]of Object.entries(protection.images))assert(hash(media.records[id])===digest||reviewedCommerceUpdate('src/commerce/generated/product-media.json',id,digest,media.records[id]));
 for(const[id,digest]of Object.entries(protection.items))assert.equal(hash(catalog.items.find(i=>i.id===id)),digest);
 assert.equal(Object.values(matches).filter(m=>m.directLinkAllowed).length,378+additions.length-reviewedPurchaseHoldIds.length+reviewedDirectRescueIds.length);assert.equal(Object.keys(media.records).length,370+additions.length+reviewedImageRescueIds.length);
});
test('26 additions use matching original creatives, capacity, successful links and explicit current visual review',()=>{
 const visual=read('docs/rakuten-deep-review/visual-review-decisions.json').rows,links=read('docs/rakuten-deep-review/link-validation.json').rows;
 assert.equal(published.length,26);
 for(const p of published){const item=catalog.items.find(i=>i.id===p.sakeId),m=matches[p.sakeId],image=productMediaFor(item);assert(image);assert.equal(m.identityVerified,false);assert.equal(m.matchType,'COMMERCIAL_MATCH');assert.equal(m.normalUrl,media.records[p.sakeId].imageProductUrl);assert.equal(m.capacityMl,media.records[p.sakeId].imageCapacityMl);assert.equal(media.records[p.sakeId].originalUnmodified,true);assert(visual.some(v=>v.sakeId===p.sakeId&&v.labelObserved&&v.imageHtmlSha256===media.records[p.sakeId].originalSha256));assert(links.some(l=>l.sakeId===p.sakeId&&l.passed&&l.mobileProductPageConfirmed&&l.image.passed));}
});
test('Ginban replacement has fresh identity, independent specifications and no invented temperature or official dishes',()=>{
 const old='ginban-i4si9d',id='ginban-chotokusen-komenoshin-standard-v1',item=catalog.items.find(i=>i.id===id),r=item.sakeResearch;
 assert(!catalog.items.some(i=>i.id===old));assert.equal(r.specs.alcoholPercentage,'16%');assert.equal(r.specs.polishingRatio,'35%');assert.deepEqual(r.specs.riceVariety,['山田錦']);assert.equal(r.classification.genshu,null);assert.equal(r.classification.junmaiDaiginjo,true);assert.equal(r.classification.nonJunmai,false);
 assert.deepEqual(r.servingTemperatures,[]);assert.deepEqual(item.officialPairings,[]);assert.equal(item.editorialPairingEvidence.length,3);assert(item.editorialPairingEvidence.every(e=>e.provenance==='yoiEditorial'));
 assert(r.verifiedFeatureTags.every(tag=>r.featureEvidence.some(e=>e.feature===tag&&e.sourceType==='breweryOfficial')));
 const ref=catalog.references.find(r=>r.legacyId===old);assert.equal(ref.status,'replaced_archive');assert.equal(ref.canonicalId,null);assert.equal(ref.automaticFavoriteMigration,false);assert.equal(ref.suggestedReplacementId,id);
 const refs=read('src/data/favoriteReferences.json');assert(refs.activeIds.includes(id)&&!refs.activeIds.includes(old));
 const d=read('src/commerce/generated/discovery-links.json');assert(!d[old]);assert(d[id].links.some(l=>l.provider==='amazon'&&new URL(l.url).searchParams.get('k')===item.productName&&!l.isAffiliate));
 const brewery=read('src/commerce/generated/merchant-links.json').records[id];assert.equal(brewery.url,null);assert.equal(brewery.type,'E');
});
test('non-single destinations, version differences and incomplete official evidence do not become automatic approvals',()=>{
 assert(!matches['fudo-ichido-hiire-tokubetsu-junmai-v1']?.directLinkAllowed);
 const unresolved=audit.rows.filter(r=>!['EXACT_RECOVERED','SAME_BRAND_REPLACED','SAME_BREWERY_REPLACED'].includes(r.finalDecision));assert.equal(unresolved.length,114);
 for(const row of unresolved)assert(!matches[row.sakeId]?.directLinkAllowed||reviewedHistoricalRecovery(row.sakeId,matches[row.sakeId],media.records[row.sakeId]));
 for(const row of audit.rows)for(const c of row.replacementCandidates)if(c.status!=='APPROVED_AS_NEW_PRODUCT')assert.equal(c.officialApproval,false);
 assert.equal(matches['okunokami-junmai-ginjo-muchosei-nama-v1'].normalUrl,'https://item.rakuten.co.jp/jizake-watanabe/10009025/');
});
