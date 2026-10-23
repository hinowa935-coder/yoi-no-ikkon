import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import {createHash} from 'node:crypto';
import {visibleSakePairings} from '../src/data/siteData.js';
import {dishesForSake} from '../src/data/discovery.js';
import {localSpecialties,localSakanaPairings,localSakanaForSake,verifiedSpecialtyCreative} from '../src/specialties/localSakana.js';
import {reviewedLocalSakanaNational} from './lib/reviewed-local-sakana-national.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url))),hash=s=>createHash('sha256').update(s).digest('hex');
const baseline=read('docs/local-sakana-national/baseline.json'),preserved=read('docs/local-sakana-national/preserved-records.json'),review=read('docs/local-sakana-national/preimplementation-review.json'),offers=read('src/commerce/localSakana.json').offers;
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
test('all 47 prefectures have bounded research and explicit food decisions, without claiming every candidate published',()=>{
 const rows=read('docs/local-sakana-national/prefecture-audit.json').rows,batches=read('docs/local-sakana-national/regional-batches.json').rows;
 assert.equal(rows.length,47);assert.equal(new Set(rows.map(r=>r.prefecture)).size,47);assert(rows.every(r=>r.researchCompleted&&r.candidates>=5));assert.equal(batches.length,7);assert(batches.every(r=>r.regionalResearch));
 const okinawa=rows.find(r=>r.prefecture==='沖縄県');assert.equal(okinawa.activeSake,0);assert.equal(okinawa.displaySake,0);
 assert.equal(rows.reduce((n,r)=>n+r.activeSake,0),484);assert.equal(rows.reduce((n,r)=>n+r.pairings,0),378);
});
test('the current 484 sake and every protected source file remain exact except three reviewed food data files',()=>{
 assert.equal(hash(JSON.stringify(visibleSakePairings)),baseline.itemsHash);assert.equal(visibleSakePairings.length,baseline.active);
 for(const f of baseline.files){const actual=hash(fs.readFileSync(new URL('../'+f.path,import.meta.url)));assert(actual===f.sha256||reviewedLocalSakanaNational(f.path,f.sha256,actual),f.path);}
 assert(!reviewedLocalSakanaNational('src/data/siteData.js','wrong','wrong'));assert(!reviewedLocalSakanaNational('src/specialties/master.json','wrong','tampered'));
});
test('all 67 existing specialties, offers and 352 pairings retain exact record hashes',()=>{
 assert.equal(preserved.specialties.length,67);assert.equal(preserved.pairings.length,352);
 for(const p of preserved.specialties)assert.equal(hash(JSON.stringify(localSpecialties.find(s=>s.id===p.id))),p.sha256,p.id);
 for(const p of preserved.offers)assert.equal(hash(JSON.stringify(offers.find(o=>o.specialtyId===p.id))),p.sha256,p.id);
 for(const p of preserved.pairings)assert.equal(hash(JSON.stringify(localSakanaPairings.find(r=>r.sakeId===p.sakeId&&r.specialtyId===p.specialtyId))),p.sha256,p.sakeId);
});
test('new food identities and formal creatives stay separated; known quantity conflict remains unpublished',()=>{
 assert.equal(localSpecialties.length,review.masterAfter);assert.equal(new Set(localSpecialties.map(s=>s.id)).size,localSpecialties.length);
 const prior=new Set(preserved.specialties.map(s=>s.id));for(const s of localSpecialties.filter(s=>!prior.has(s.id))){assert(s.sources.every(r=>r.claim&&r.sourceUrl&&r.checkedAt));const o=offers.find(o=>o.specialtyId===s.id);assert(o.originEvidence.meaning&&o.quantityEvidence.meaning);assert(verifiedSpecialtyCreative(o));}
 assert(!localSpecialties.some(s=>s.id==='fukui-maruyaki-saba'));assert(offers.find(o=>o.specialtyId==='mie-sanma-maruboshi-gutted').originEvidence.meaning.includes('内臓除去'));
});
test('each new relation has two direct source-backed sensory axes and an individually edited nonduplicate reason',()=>{
 const prior=new Set(preserved.pairings.map(p=>p.sakeId+'|'+p.specialtyId)),added=localSakanaPairings.filter(p=>!prior.has(p.sakeId+'|'+p.specialtyId)),taste=read('src/data/tasteDescriptions.json').records;
 assert.equal(added.length,review.addedPairings);assert.equal(new Set(added.map(p=>p.pairingReason)).size,added.length);
 for(const p of added){assert(taste[p.sakeId].text);assert.equal(p.evidenceType,'editorialPairing');assert(p.editorialPairing&&!p.officialPairing&&!p.communityPairing);for(const e of[p.sakeEvidence,...p.additionalSakeEvidence]){assert(e.sourceUrl&&e.sourceType&&e.verifiedAt);assert(taste[p.sakeId].claims.some(c=>c.claim===e.feature&&c.sourceUrl===e.sourceUrl));}assert(p.pairingReason.length<200);assert(!/キレが良くに|引き締めとの|との調和との/.test(p.pairingReason));}
});
test('all projections preserve max-three, same-region, low-hidden, commerce and empty-state contracts',()=>{
 const rows=visibleSakePairings.map(i=>({i,cards:localSakanaForSake(i,{config,now:Date.parse('2026-10-23T23:00:00+09:00'),dishes:dishesForSake(i).slice(0,6)})}));assert.equal(rows.filter(r=>r.cards.length).length,review.displaySake);
 for(const{i,cards}of rows){assert(cards.length<=3);assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert(cards.every(c=>c.prefecture===i.prefecture&&c.commerce?.imageHtml));}
 const i=visibleSakePairings[0],p=localSakanaPairings.find(p=>p.sakeId===i.id);if(p)assert.deepEqual(localSakanaForSake(i,{config,pairings:[{...p,confidence:'low'}]}),[]);assert.deepEqual(localSakanaForSake({...i,id:'no-pairing'},{config}),[]);
});
