import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {normalizeBreweryName,breweryKey,compareIdentity,seasonalTypes,sensoryConsensus,communityPairings,publicationGate,validateCandidate,activeCatalog,catalogItem,reviewQueue} from '../src/catalog/operations.js';
const at='2026-10-16T00:00:00Z',skuId='test-current-sku';
const evidence=(id,extra={})=>({evidenceId:id,skuId,sourceType:'community',sourceUrl:'https://example.com/'+id,checkedAt:at,publishedAt:'2026-09-01',retrieved:true,skuMatch:true,versionMatched:true,experienced:true,specificTasting:true,independenceGroup:id,contentFingerprint:id,traits:[{field:'umami',value:'旨味'}],...extra});
const identity={brand:'試験酒',breweryId:'test-brewery',classification:'純米',namaHiire:'火入れ',genshu:false,muroka:false,nigori:false,sparkling:false,riceSeries:'not-named',series:'定番',seasonalDesign:'standard',pressingMethod:'not-named',capacityMl:720,singleProduct:true};
test('brewery normalization removes legal spelling, not prefecture distinctions or maker substrings',()=>{
 assert.equal(normalizeBreweryName(' 株式会社 試験酒造 '),'試験酒造');
 assert.notEqual(breweryKey({brewery:'朝日酒造',prefecture:'新潟県'}),breweryKey({brewery:'朝日酒造',prefecture:'福井県'}));
 assert.notEqual(normalizeBreweryName('豊島屋'),normalizeBreweryName('豊島屋酒造'));
});
test('minor numerical and label differences are recorded without inventing a renewal cause',()=>{
 const result=compareIdentity({...identity,nihonshudo:'+3',alcohol:'15%',label:'旧'},{...identity,nihonshudo:'+4',alcohol:'15-16%',label:'新'});
 assert.equal(result.decision,'COMMERCIAL_MATCH');assert.equal(result.differences.length,3);assert(result.differences.every(d=>d.differenceNote.includes('未確定')));
});
test('all major SKU fields reject explicit differences; missing specifications never mean false',()=>{
 for(const field of ['classification','namaHiire','genshu','muroka','nigori','sparkling','riceSeries','series','seasonalDesign','pressingMethod'])assert.equal(compareIdentity(identity,{...identity,[field]:'different'}).decision,'DIFFERENT_SKU');
 assert.equal(compareIdentity(identity,{...identity,namaHiire:null}).decision,'NEEDS_REVIEW');
 assert.equal(compareIdentity(identity,{...identity,singleProduct:false}).decision,'DIFFERENT_SKU');
});
test('capacity is checked independently and a genuine capacity selector is supported',()=>{
 assert.equal(compareIdentity(identity,{...identity,capacityMl:1800}).decision,'NEEDS_REVIEW');
 assert.equal(compareIdentity(identity,{...identity,capacityMl:1800,capacityChoices:[720,1800]}).decision,'COMMERCIAL_MATCH');
});
test('one review cannot establish sensory consensus or a strong dish pairing',()=>{
 const e=evidence('one',{pairings:['刺身']});const result=sensoryConsensus([e],{skuId,now:at});assert.equal(result.fields.umami.value,null);assert.equal(result.fields.umami.confidence,'low');
 const pairs=communityPairings([e],{skuId,now:at,compatibleDishes:['刺身']});assert.equal(pairs[0].confidence,'low');assert.equal(pairs[0].official,false);assert(!pairs.some(p=>p.dish==='魚料理'));
});
test('duplicate content, same publisher and different versions do not create independent consensus',()=>{
 const input=[evidence('a'),evidence('dup',{contentFingerprint:'a'}),evidence('same-publisher',{independenceGroup:'a'}),evidence('wrong',{skuMatch:false}),evidence('by',{versionMatched:false})];
 const r=sensoryConsensus(input,{skuId,now:at});assert.equal(r.fields.umami.value,null);assert.equal(r.excluded.length,3);
});
test('shipping-only, failed sources and old reviews are not sensory facts',()=>{
 const r=sensoryConsensus([evidence('shipping',{traits:[],specificTasting:false}),evidence('failed',{retrieved:false}),evidence('old',{publishedAt:'2015-01-01'})],{skuId,now:at});
 assert.equal(r.acceptedEvidenceIds.length,0);assert.equal(r.excluded.length,3);
});
test('independent evidence can support editorial consensus without upgrading Verified specifications',()=>{
 const entries=[evidence('a'),evidence('b')],r=sensoryConsensus(entries,{skuId,now:at});assert.equal(r.fields.umami.value,'旨味');assert.equal(r.fields.umami.confidence,'medium');assert(r.notVerifiedSpecifications);
 const official=evidence('official',{sourceType:'official'});assert.equal(sensoryConsensus([...entries,official],{skuId,now:at}).fields.umami.confidence,'high');
 assert.equal(communityPairings(entries.map(e=>({...e,pairings:['刺身']})),{skuId,now:at,compatibleDishes:['刺身']})[0].confidence,'medium');
});
test('conflicting sensory observations remain uncertain; review scores and counts are ignored',()=>{
 const r=sensoryConsensus([evidence('a',{stars:5,reviewCount:9000}),evidence('b',{traits:[{field:'umami',value:'旨味控えめ'}],stars:1})],{skuId,now:at});assert.equal(r.fields.umami.value,null);assert(r.fields.umami.contested);
});
test('publication fails closed without original images, actual stock and individual reviewed gates',()=>{
 const p={candidateProductId:skuId,state:'PRODUCTION_READY',officialEvidence:[],communityPairings:[]};assert(!publicationGate(p,{now:at}).ready);assert(validateCandidate(p).includes('PUBLICATION_GATE_FAILED'));
 const pool=JSON.parse(fs.readFileSync(new URL('../data/catalog-operations/candidates.json',import.meta.url)));assert(pool.candidates.length>0);assert(pool.candidates.every(c=>validateCandidate(c).length===0));assert(pool.candidates.filter(c=>!['PRODUCTION_READY','ACTIVE'].includes(c.state)).every(c=>!publicationGate(c).ready));
});
test('a missing official product page is not a blocker when independently corroborated data and all gates exist',()=>{
 const source=host=>({sourceUrl:`https://${host}/product`,sourceType:'specialty_retailer',checkedAt:at,retrieved:true});
 const p={breweryId:'maker',productType:'純米',identityDecision:{breweryConfirmed:true,productConfirmed:true,skuConfirmed:true,majorConflicts:[]},specStatus:'SPEC_READY',specConfidence:'medium',specEvidence:[source('a.example'),source('b.example')],capacityMl:720,commercialStatus:'LIVE_PURCHASE_CONFIRMED',commercialDecision:{checkedAt:at,formalAffiliate:true,sameSku:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',originalSha256:'a'.repeat(64),validUntil:'2026-11-01'},imageStatus:'FORMAL_IMAGE_CONFIRMED',imageDecision:{originalUnmodified:true,sameSku:true,capacityMl:720,originalSha256:'b'.repeat(64),validUntil:'2026-11-01'},sensoryStatus:'SENSORY_READY',sensoryConfidence:'medium',pairingStatus:'PAIRING_READY',editorialPairings:[{dish:'fixture'}],nightEvidence:[{nightId:'quiet'}],duplicateChecked:true,qaPassed:true};
 assert(publicationGate(p,{now:at}).ready);assert.equal(publicationGate(p,{now:at}).automaticPublicationAllowed,false);
 assert(!publicationGate({...p,specEvidence:[source('a.example')]},{now:at}).ready);
 assert(!publicationGate({...p,commercialDecision:{...p.commercialDecision,checkedAt:'2027-01-01'}},{now:at}).ready);
 assert(!publicationGate({...p,imageDecision:{...p.imageDecision,validUntil:'2026-01-01'}},{now:at}).ready);
});
test('reviews and community pairings cannot be relabeled as official or Verified specifications',()=>{
 const r=validateCandidate({candidateProductId:skuId,state:'RESEARCH',verifiedEvidence:[{sourceType:'community'}],communityPairings:[{official:true}]});assert(r.includes('COMMUNITY_IS_NOT_OFFICIAL'));assert(r.includes('SUBJECTIVE_EVIDENCE_IS_NOT_VERIFIED_SPEC'));
});
test('a saved approval is historical evidence, not a promise of fresh stock forever',()=>{
 const pool=JSON.parse(fs.readFileSync(new URL('../data/catalog-operations/candidates.json',import.meta.url)));
 const candidate=pool.candidates.find(c=>c.qaPassed);assert(candidate.publicationApprovedAt);
 assert.deepEqual(validateCandidate(candidate),[]);
 const later=new Date(Date.parse(candidate.publicationApprovedAt)+3*86400000).toISOString();
 assert(!publicationGate(candidate,{now:later}).ready);
 assert.deepEqual(validateCandidate({...candidate,state:'ACTIVE'}),[]);
});
test('inactive and archived records remain addressable without favorite or next-year migrations',()=>{
 const items=[{id:'summer-2026'},{id:'summer-2027'},{id:'old'}],lifecycle={'summer-2026':{status:'INACTIVE'},old:{status:'ARCHIVED'}};
 assert.deepEqual(activeCatalog(items,lifecycle),[{id:'summer-2027'}]);assert.equal(catalogItem(items,'summer-2026').id,'summer-2026');assert.equal(catalogItem(items,'old').id,'old');
 assert.throws(()=>activeCatalog(items,{'old':{status:'INVALID'}}));
});
test('season discovery is metadata only and does not manufacture dishes or deactivate products',()=>{
 for(const [text,tag]of [['春酒','spring'],['夏酒','summer'],['ひやおろし','autumn'],['新酒 しぼりたて','new_sake']])assert(seasonalTypes(text).includes(tag));
 assert.equal(activeCatalog([{id:'夏酒'}]).length,1);
});
test('monitor ignores unchanged snapshots, separates retrieval failure and never publishes',()=>{
 const a={candidateProductId:skuId,retrieved:true,fingerprint:'same',specFingerprint:'v1',stock:true,merchantCodes:['shopA']};
 assert.equal(reviewQueue([a],[{...a,checkedAt:at}]).length,0);
 const failure={...a,retrieved:false,stock:false,fingerprint:'failed'};const failed=reviewQueue([a],[failure]);assert.equal(failed[0].type,'RETRIEVAL_FAILED');assert.equal(failed[0].productionMutationAllowed,false);assert.equal(reviewQueue([failure],[failure]).length,0);
 const events=reviewQueue([a],[{...a,fingerprint:'new',stock:false,merchantCodes:['shopA','shopB'],formalImage:true,specFingerprint:'v2'}]);
 assert(events.some(e=>e.type==='STOCK_REVIEW_REQUIRED'&&e.notSeasonEnd));assert(events.some(e=>e.type==='NEW_RAKUTEN_MERCHANT'));assert(events.some(e=>e.type==='SPEC_CHANGED'));assert(events.every(e=>!e.automaticPublicationAllowed&&!e.productionMutationAllowed));
});
