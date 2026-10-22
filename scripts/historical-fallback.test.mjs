import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {allSakePairings,visibleSakePairings,getSakeById} from '../src/data/siteData.js';
import {discoveryProducts,dishesForSake,nightsForSake,scorePairing} from '../src/data/discovery.js';
import {publicationGate,validateCandidate,compareIdentity,breweryKey} from '../src/catalog/operations.js';
import {resolveFavorite,migrateFavorites} from '../src/data/favoriteReferences.js';
import {productMediaFor} from '../src/commerce/productMedia.js';
import {projectFinalCommerce} from '../src/commerce/finalCommerce.js';
import {reviewedHistoricalCommerce,reviewedHistoricalLifecycle,reviewedHistoricalRecovery} from './lib/reviewed-historical-update.mjs';
import {reviewedDetailLayout} from './lib/reviewed-detail-layout.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const hash=s=>createHash('sha256').update(s).digest('hex');
const batch=read('data/catalog-operations/historical-fallback-batch.json'),states=read('src/data/catalogLifecycle.json').records;
const additions=allSakePairings.filter(i=>batch.additions.includes(i.id)),pool=read('data/catalog-operations/candidates.json').candidates;
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};

test('review exemptions reject a different ID, file, baseline or mutated commerce record',()=>{
 for(const c of batch.commerceChanges){const content=read(c.file),value=(content.records||content)[c.sakeId];
  assert(reviewedHistoricalCommerce(c.file,c.sakeId,c.beforeSha256,value));
  assert(!reviewedHistoricalCommerce(c.file,'unreviewed-product',c.beforeSha256,value));
  assert(!reviewedHistoricalCommerce('unreviewed-file.json',c.sakeId,c.beforeSha256,value));
  assert(!reviewedHistoricalCommerce(c.file,c.sakeId,'wrong-baseline',value));
  assert(!reviewedHistoricalCommerce(c.file,c.sakeId,c.beforeSha256,{...value,unreviewed:true}));
 }
 assert(!reviewedHistoricalLifecycle(batch.lifecycleFile.beforeSha256,'different-state'));
 assert(!reviewedHistoricalRecovery('unreviewed-product',{},{}));
});
test('historical review preserves every old product record and all protected functions',()=>{
 const raw=[...read('src/data/discoveryCatalog.json').items,...read('src/data/catalogAdditions.json').items];
 for(const[id,digest]of Object.entries(batch.priorProductHashes))assert.equal(hash(JSON.stringify(raw.find(i=>i.id===id))),digest,id);
 for(const[file,digest]of Object.entries(batch.protectedWholeFiles)){const actual=hash(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8').replaceAll('\r\n','\n'));assert(actual===digest||reviewedDetailLayout(file,digest,actual),file);}
 assert.equal(new Set(raw.map(i=>i.id)).size,raw.length);
});
test('replacement IDs never alias old pages or silently migrate saved favorites',()=>{
 for(const r of batch.replacements){assert.notEqual(r.oldProductId,r.replacementProductId);assert.equal(getSakeById(r.oldProductId).id,r.oldProductId);assert.equal(resolveFavorite(r.oldProductId).canonicalId,r.oldProductId);assert.deepEqual(migrateFavorites([r.oldProductId]),[r.oldProductId]);assert(visibleSakePairings.some(i=>i.id===r.replacementProductId));}
 for(const id of batch.inactivated){assert.equal(states[id].status,'INACTIVE');assert(!visibleSakePairings.some(i=>i.id===id));assert(!discoveryProducts.some(i=>i.id===id));assert.equal(states[id].notIdentityAlias,true);}
 for(const id of batch.additions)assert(!Object.hasOwn(batch.priorProductHashes,id));
});
test('recovered and new products keep original creatives, capacities, links and approval guards',()=>{
 for(const id of [...batch.exactRecoveries,...batch.additions]){const item=getSakeById(id),image=productMediaFor(item),commerce=projectFinalCommerce(item,config);assert(image&&commerce.normal.length);assert.equal(hash(image.html),image.originalSha256);assert.equal(hash(image.compactHtml),image.compactOriginalSha256);assert.equal(image.capacityMl,image.imageCapacityMl);assert.equal(new URL(image.affiliateUrl).searchParams.get('pc'),image.productUrl);assert.equal(image.sourceType,'rakutenOfficialTool');assert.equal(image.originalUnmodified,true);if(batch.qaPassed)assert(commerce.offer,'Missing approved affiliate '+id);}
});
test('new facts are sourced individually, no inherited review or made-up consensus',()=>{
 assert.equal(additions.length,batch.additions.length);
 const kurobe=getSakeById('kurobekyo-junmai-ginjo55-current-v1').sakeResearch;
 assert.equal(kurobe.flavorProfile.aroma,null);
 assert(!kurobe.fieldEvidence.some(e=>e.field==='flavorProfile.aroma'));
 assert(kurobe.verifiedFeatureTags.includes('豊かな風味'));
 for(const i of additions){const r=i.sakeResearch;assert(r.verifiedFeatureTags.length>0&&r.verifiedFeatureTags.length<=3);assert(r.verifiedFeatureTags.every(t=>r.featureEvidence.some(e=>e.feature===t&&e.sourceUrl&&e.verifiedAt&&e.meaning)));for(const[k,v]of Object.entries(r.specs))if(v!=null&&(!Array.isArray(v)||v.length))assert(r.fieldEvidence.some(e=>e.field==='specs.'+k&&JSON.stringify(e.value)===JSON.stringify(v)),i.id+' '+k);assert(!(r.classification.nama&&r.classification.hiire));assert(!(r.classification.junmai&&r.classification.nonJunmai));assert(!(r.classification.kimoto&&r.classification.yamahai));assert(i.communityEvidence.length===0);assert(Object.values(i.sensoryConsensus.fields).every(f=>f.value===null));assert(i.sensoryConsensus.notVerifiedSpecifications);assert(i.editorialPairingEvidence.every(e=>e.provenance==='yoiEditorial'&&e.dishEvidence.foodId));assert.equal(dishesForSake(i).length>=3,true);assert(nightsForSake(i,Infinity).length>0);}
});
test('major designs remain separate and same company names in different prefectures do not merge',()=>{
 const t={brand:'A',breweryId:'X',classification:'純米酒',namaHiire:'火入れ',genshu:false,muroka:false,nigori:false,sparkling:false,riceSeries:'山田錦',series:'定番',seasonalDesign:'通年',pressingMethod:'通常',capacityMl:720};
 for(const change of [{namaHiire:'生酒'},{classification:'純米吟醸酒'},{riceSeries:'雄町'},{nigori:true},{genshu:true}])assert.equal(compareIdentity(t,{...t,...change,singleProduct:true}).decision,'DIFFERENT_SKU');
 assert.notEqual(breweryKey({brewery:'高木酒造株式会社',prefecture:'山形県'}),breweryKey({brewery:'高木酒造株式会社',prefecture:'高知県'}));
 assert.equal(breweryKey({brewery:'大賀酒造株式会社',prefecture:'福岡県'}),breweryKey({brewery:'大賀酒造',prefecture:'福岡県'}));
});
test('all new publication gates are enforced and commerce does not alter taste recommendations',()=>{
 for(const item of additions){const c=pool.find(c=>c.candidateProductId===item.id);assert(c);assert.deepEqual(publicationGate(c,{now:c.publicationApprovedAt||new Date().toISOString()}).missing,c.qaPassed?[]:['qa']);assert.deepEqual(validateCandidate(c),[]);assert.deepEqual(scorePairing(item,item.dishes[0],'ordinary'),scorePairing({...item,commission:99,reviewCount:999999,rakutenRank:1,formalImage:true},item.dishes[0],'ordinary'));}
 assert.equal(batch.automaticPublicationAllowed,false);assert.equal(batch.weeklyExecutionEnabled,false);
});
