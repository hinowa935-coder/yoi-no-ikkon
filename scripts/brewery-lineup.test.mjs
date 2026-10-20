import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {lineupBatch as batch,lineDigest as hash} from './lib/reviewed-lineup-update.mjs';
import {allSakePairings,visibleSakePairings,getSakeById} from '../src/data/siteData.js';
import {discoveryProducts,dishesForSake,nightsForSake,recommendationPool,scorePairing} from '../src/data/discovery.js';
import {publicationGate,normalizeBreweryName,validateCandidate} from '../src/catalog/operations.js';
import {resolveFavorite,migrateFavorites} from '../src/data/favoriteReferences.js';
import {productMediaFor} from '../src/commerce/productMedia.js';
import {projectFinalCommerce} from '../src/commerce/finalCommerce.js';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const items=read('src/data/catalogAdditions.json').items.filter(i=>batch.additions.includes(i.id));
const pool=read('data/catalog-operations/candidates.json').candidates;
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
test('lineup is explicit per SKU with no one-brewery cap or identity reuse',()=>{
 assert.equal(items.length,batch.additions.length);assert.equal(new Set(allSakePairings.map(i=>i.id)).size,allSakePairings.length);
 assert(items.every(i=>!Object.hasOwn(batch.priorProductHashes,i.id)));
 const groups=new Map();for(const i of items){const key=normalizeBreweryName(i.brewery);groups.set(key,[...(groups.get(key)||[]),i]);}
 assert([...groups.values()].some(v=>v.length>=4));
 for(const group of groups.values())assert.equal(new Set(group.map(i=>i.productName)).size,group.length);
});
test('all prior records, evidence, tags and pairing objects remain identical',()=>{
 const raw=[...read('src/data/discoveryCatalog.json').items,...read('src/data/catalogAdditions.json').items];
 for(const[id,expected]of Object.entries(batch.priorProductHashes))assert.equal(hash(raw.find(i=>i.id===id)),expected,id);
 for(const[file,expected]of Object.entries(batch.protectedWholeFiles))assert.equal(hash(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8').replaceAll('\r\n','\n')),expected,file);
});
test('new facts have individual sources; unreported fields stay empty and major types are consistent',()=>{
 for(const i of items){const r=i.sakeResearch,c=r.classification;
  assert(r.verifiedFeatureTags.length>0&&r.verifiedFeatureTags.length<=3);
  assert(r.verifiedFeatureTags.every(t=>r.featureEvidence.some(e=>e.feature===t&&e.meaning&&e.sourceUrl&&e.verifiedAt)));
  for(const[k,v]of Object.entries(r.specs))if(v!=null&&(!Array.isArray(v)||v.length))assert(r.fieldEvidence.some(e=>e.field==='specs.'+k&&hash(e.value)===hash(v)),i.id+' '+k);
  assert(!r.fieldEvidence.some(e=>['review','community','editorial','rakuten_review'].includes(e.sourceType)));
  assert(!(c.junmai&&c.nonJunmai));assert(!(c.nama&&c.hiire));assert(!(c.kimoto&&c.yamahai));
  assert.equal(c.nama,null,'No nama inferred from storage instructions');
 }
});
test('original creatives, normal destinations, capacities and formal purchase links agree',()=>{
 for(const i of items){const im=productMediaFor(i),view=projectFinalCommerce(i,config);assert(im&&view.offer);assert.equal(im.originalSha256,hash(im.html));assert.equal(im.compactOriginalSha256,hash(im.compactHtml));assert.equal(im.capacityMl,i.capacityMl);assert.equal(im.productUrl,new URL(im.affiliateUrl).searchParams.get('pc'));assert.equal(im.originalUnmodified,true);assert.equal(view.offer.matchConfidence,'high');}
 assert.equal(items.find(i=>i.id==='minatoya-tosuke-lineup-v1').capacityMl,630);
 assert.equal(items.find(i=>i.id==='mio-sparkling-lineup-v1').capacityMl,300);
});
test('same brewery variants remain separate with independently created dish reasons and nights',()=>{
 for(const i of items){assert(dishesForSake(i).length>=3);assert(nightsForSake(i,Infinity).length>0);assert.equal(i.editorialPairingEvidence.length,3);assert(i.editorialPairingEvidence.every(e=>e.provenance==='yoiEditorial'&&e.dishEvidence.foodId&&e.sourceUrls.length>0&&!/undefined|null|資料|調査済/.test(e.reason)));assert(i.sakeResearch.pairingEvidence.every(e=>i.officialPairings.includes(e.dish)));assert(i.communityPairings.every(e=>!e.official));}
 const a=items.find(i=>i.id==='masumi-shiro-lineup-v1'),b=items.find(i=>i.id==='masumi-kaya-lineup-v1');assert.notDeepEqual(a.dishes,b.dishes);assert.notDeepEqual(a.taste,b.taste);
});
test('community observations are optional and never become official specs or invented consensus',()=>{
 for(const i of items){assert.equal(i.sensoryConsensus.notVerifiedSpecifications,true);if(i.communityEvidence.length===0)assert(Object.values(i.sensoryConsensus.fields).every(f=>f.value===null));}
 const shiro=items.find(i=>i.id==='masumi-shiro-lineup-v1');assert.equal(shiro.sensoryConsensus.fields.acidity.confidence,'medium');assert.equal(shiro.sensoryConsensus.fields.bitterness.confidence,'medium');assert.equal(shiro.sensoryConsensus.fields.body.value,null);
});
test('availability, prices, images, brewery popularity and commission never raise recommendation scores',()=>{
 const i=items[0],score=scorePairing(i,i.dishes[0],'ordinary');
 assert.deepEqual(scorePairing({...i,price:999999,reviewCount:999999,rakutenRank:1,commission:99,formalImage:true},i.dishes[0],'ordinary'),score);
});
test('manual lifecycle excludes only reviewed off-shelf IDs while favorites and old pages keep identity',()=>{
 const states=read('src/data/catalogLifecycle.json').records;
 assert.equal(allSakePairings.length-visibleSakePairings.length,Object.values(states).filter(r=>r.status==='INACTIVE'||r.status==='ARCHIVED').length);
 for(const id of batch.inactivated){assert.equal(states[id].status,'INACTIVE');assert(!visibleSakePairings.some(i=>i.id===id));assert(!discoveryProducts.some(i=>i.id===id));assert.equal(getSakeById(id).id,id);assert.equal(resolveFavorite(id).canonicalId,id);assert.deepEqual(migrateFavorites([id]),[id]);}
 assert.equal(batch.archived.length,0);assert.equal(batch.automaticPublicationAllowed,false);assert.equal(batch.weeklyMonitoringEnabled,false);
});
test('ready/active candidates require every current gate rather than a label or title shortcut',()=>{
 assert(pool.every(c=>validateCandidate(c).length===0));
 for(const i of items){const c=pool.find(c=>c.publishedSakeId===i.id);assert(c);assert.deepEqual(publicationGate(c,{now:c.publicationApprovedAt||new Date().toISOString()}).missing,c.qaPassed?[]:['qa']);}
});
