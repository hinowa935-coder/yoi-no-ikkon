import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {allSakePairings,getSakeById} from '../src/data/siteData.js';
import {discoveryProducts,dishesForSake,nightsForSake,recommendationPool,scorePairing} from '../src/data/discovery.js';
import {resolveFavorite} from '../src/data/favoriteReferences.js';
import {normalizeBreweryName,eligibleSensoryEvidence,publicationGate} from '../src/catalog/operations.js';
import {seasonallyRecommended} from '../src/catalog/seasonality.js';
import {reviewedLineupLifecycle,reviewedLineupAdditionCount} from './lib/reviewed-lineup-update.mjs';
import {reviewedCommerceUpdate} from './lib/reviewed-commerce-update.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const audit=read('docs/catalog-review-52/adjudications.json'),baseline=read('docs/catalog-review-52/baseline-integrity.json'),newItems=read('src/data/catalogAdditions.json').items.filter(i=>audit.rows.some(a=>a.sakeId===i.id));
const pool=read('data/catalog-operations/candidates.json');
const shelfBatch=read('data/catalog-operations/seasonal-shelf-batches.json');

test('the immutable fixed cohort has a specific outcome for every candidate without reset',()=>{
 const outcomes=['ACTIVE','PRODUCTION_READY_BUT_NOT_PUBLISHED','WAITING_FOR_COMMERCIAL_IMAGE','WAITING_FOR_STOCK','OFFICIAL_CONFIRMATION_WEAK','SPEC_UNRESOLVED','SENSORY_EVIDENCE_INSUFFICIENT','PAIRING_EVIDENCE_INSUFFICIENT','VARIANT_CONFLICT','DUPLICATE_EXISTING_PRODUCT','NO_VALID_RAKUTEN_PRODUCT','REJECTED'];
 assert.equal(audit.rows.length,52);assert.equal(new Set(audit.rows.map(r=>r.candidateProductId)).size,audit.rows.length);
 for(const a of audit.rows){assert(outcomes.includes(a.reviewOutcome));assert(a.reason.length>25);const c=pool.candidates.find(c=>c.candidateProductId===a.candidateProductId);assert(c.reviewPreserved);assert.notEqual(c.reviewOutcome,undefined);assert.equal(c.automaticPublicationAllowed,false);}
 assert.equal(pool.automaticPublicationAllowed,false);
});
test('all prior product identities, Verified fields, commerce and PWA stay intact',()=>{
 for(const [file,expected]of Object.entries(baseline.wholeFiles)){const actual=hash(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8').replaceAll('\r\n','\n'));assert(actual===expected||(file==='src/data/catalogLifecycle.json'&&reviewedLineupLifecycle(expected,actual)),file);}
 const additions=read('src/data/catalogAdditions.json').items;
 for(const [id,expected]of Object.entries(baseline.priorAdditions))assert.equal(hash(additions.find(x=>x.id===id)),expected);
 for(const [file,records]of Object.entries(baseline.records)){const current=read(file),map=file.endsWith('product-media.json')||file.endsWith('merchant-links.json')?current.records:current;for(const[id,expected]of Object.entries(records)){
  const actual=hash(map[id]);
  const approved=shelfBatch.reviewed&&shelfBatch.commerceChanges.find(change=>change.file===file&&change.sakeId===id&&change.beforeSha256===expected&&change.afterSha256===actual);
  assert(actual===expected||approved||reviewedCommerceUpdate(file,id,expected,map[id]),file+' '+id+' must match baseline or an explicitly audited later commerce-only update');
 }}
 assert.equal(hash(read('src/commerce/generated/commerce-final-approvals.json').links.slice(0,baseline.approvalCount)),baseline.approvalHash);
 assert.equal(allSakePairings.length,baseline.products+newItems.length+reviewedLineupAdditionCount(allSakePairings));assert.equal(new Set(allSakePairings.map(i=>i.id)).size,allSakePairings.length);
});
test('new data has per-value sources and does not launder community evidence into Verified',()=>{
 for(const i of newItems){const r=i.sakeResearch;assert(i.capacityMl>0);assert(r.verifiedFeatureTags.length<=3);assert(r.verifiedFeatureTags.every(t=>r.featureEvidence.some(e=>e.feature===t&&e.sourceUrl&&e.verifiedAt&&e.meaning)));
 assert(r.fieldEvidence.every(e=>!['community','review','rakuten_review','editorial'].includes(e.sourceType)));
 assert(!(r.classification.junmai&&r.classification.nonJunmai));assert(!(r.classification.nama&&r.classification.hiire));
 assert(i.editorialPairingEvidence.length>=3);assert(i.editorialPairingEvidence.every(e=>e.provenance==='yoiEditorial'&&e.dishEvidence.foodId&&e.sourceUrls.length));
 assert(i.communityPairings.every(p=>p.official===false));assert(r.pairingEvidence.every(e=>r.officialPairings.includes(e.dish)));
 }
});
test('a mixed ordinary sake and namachozo are not mislabeled as junmai or unpasteurized',()=>{
 const blend=newItems.find(i=>i.id.startsWith('koshino-happo-')),fresh=newItems.find(i=>i.id.startsWith('kanbe-'));
 assert.equal(blend.sakeResearch.classification.tokuteiMeishoshu,'普通酒');assert.notEqual(blend.sakeResearch.classification.junmai,true);
 assert.equal(fresh.sakeResearch.classification.nama,false);assert.equal(fresh.sakeResearch.classification.hiire,true);
 const rice=newItems.find(i=>i.id.startsWith('tenjinbayashi-')).sakeResearch.specs;assert.equal(rice.polishingRatio,null);assert.notEqual(rice.polishingByRole.koji,rice.polishingByRole.kake);
});
test('formal direct links and both original image sizes match the new identity and capacity',()=>{
 const media=read('src/commerce/generated/product-media.json').records,matches=read('src/commerce/generated/purchase-matches.json');
 for(const i of newItems){const m=media[i.id],a=audit.rows.find(a=>a.sakeId===i.id),match=matches[i.id];assert(a.visualEvidence.reviewed&&a.visualEvidence.capacityCompatible);assert.equal(m.imageCapacityMl,i.capacityMl);assert.equal(m.capacityMl,i.capacityMl);assert.equal(m.originalSha256,hash(m.html));assert.equal(m.compactOriginalSha256,hash(m.compactHtml));assert.equal(m.originalUnmodified,true);assert.equal(new URL(m.src).hostname,'hbb.afl.rakuten.co.jp');assert.equal(match.matchType,'COMMERCIAL_MATCH');assert.equal(match.normalUrl,m.productUrl);assert.equal(match.identityVerified,false);}
});
test('published additions participate normally in search, dishes, nights and favorites',()=>{
 for(const i of newItems){assert.equal(getSakeById(i.id).productName,i.productName);assert(discoveryProducts.some(x=>x.id===i.id));assert.equal(resolveFavorite(i.id).canonicalId,i.id);assert(nightsForSake(i,Infinity).length>0);assert(dishesForSake(i).length>=3);}
});
test('season filtering affects automatic choices only, never search or direct lookup',()=>{
 const summer=newItems.find(i=>i.id.startsWith('koshino-happo-')),autumn=newItems.find(i=>i.id.startsWith('koshijifubuki-'));
 assert(!seasonallyRecommended(summer,'2026-10-18'));assert(seasonallyRecommended(summer,'2026-07-18'));
 assert(seasonallyRecommended(autumn,'2026-10-18'));assert(!seasonallyRecommended(autumn,'2026-04-18'));
 assert(!recommendationPool('冷奴','ordinary','2026-10-18').some(r=>r.item.id===summer.id));
 assert(scorePairing(summer,'冷奴','ordinary').strength>=6);assert(getSakeById(summer.id));
 assert(seasonallyRecommended({id:'old-unmarked-product'},'2026-01-01'));
});
test('review independence and old-version filters remain effective on actual cohort data',()=>{
 const kasho=newItems.find(i=>i.id.startsWith('hokushika-')),shin=newItems.find(i=>i.id.startsWith('chiyonohikari-'));
 assert.equal(kasho.sensoryConsensus.fields.sweetness.confidence,'medium');assert.equal(kasho.sensoryConsensus.fields.bitterness.value,null);
 assert(kasho.sensoryConsensus.excluded.some(e=>e.reason==='OLD_REVIEW_NEEDS_REVALIDATION'));assert.equal(eligibleSensoryEvidence(shin.communityEvidence,{skuId:shin.id}).accepted.length,0);
 assert.equal(normalizeBreweryName('株式会社 土佐酒造'),normalizeBreweryName('土佐酒造'));
});
test('an explicit ready/active state still requires every publication gate',()=>{
 for(const i of newItems){const c=pool.candidates.find(c=>c.publishedSakeId===i.id);const gate=publicationGate(c,{now:c.publicationApprovedAt||new Date().toISOString()});assert.deepEqual(gate.missing,c.qaPassed?[]:['qa']);}
});
test('official URL values cite the read official page and BY never implies a shinshu season',()=>{
 for(const item of newItems){const r=item.sakeResearch,url=r.identity.officialProductUrl;if(!url)continue;const e=r.fieldEvidence.find(e=>e.field==='identity.officialProductUrl');assert.equal(e.value,url);assert.equal(e.sourceUrl,url);assert(['official','official_shop'].includes(e.sourceType));}
 const sakuyabi=newItems.find(i=>i.id.startsWith('sakuyabi14-'));assert.equal(sakuyabi.seasonality.vintage,'R7BY');assert.deepEqual(sakuyabi.seasonality.types,[]);
});
