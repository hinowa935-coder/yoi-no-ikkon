import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {localSpecialties,localSakanaPairings,localSakanaForSake,verifiedSpecialtyCreative} from '../src/specialties/localSakana.js';
import {visibleSakePairings} from '../src/data/siteData.js';
import {dishesForSake} from '../src/data/discovery.js';
import {reviewedLocalSakanaV2} from './lib/reviewed-local-sakana-v2.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const hash=v=>createHash('sha256').update(v).digest('hex');
const offers=read('src/commerce/localSakana.json').offers,preserved=read('docs/local-sakana-v2/preserved-records.json');
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
test('the observed original-image redirect is permitted narrowly without broad script, connection or HTTP access',()=>{
 const csp=read('vercel.json').headers.flatMap(r=>r.headers).find(h=>h.key==='Content-Security-Policy').value;
 assert.equal(csp.split(';').map(s=>s.trim()).find(s=>s.startsWith('img-src ')),"img-src 'self' data: https://hbb.afl.rakuten.co.jp https://thumbnail.image.rakuten.co.jp https://image.rakuten.co.jp");
 assert(csp.includes("connect-src 'self'")&&csp.includes("object-src 'none'")&&csp.includes("script-src-attr 'none'"));assert(!csp.includes('http:')&&!csp.includes('*'));
});
test('Phase 2 appends specialties without changing any of the original 22 foods, 22 offers or 179 pairings',()=>{
 assert.equal(preserved.specialties.length,22);assert.equal(preserved.offers.length,22);assert.equal(preserved.pairings.length,179);
 for(const p of preserved.specialties)assert.equal(hash(JSON.stringify(localSpecialties.find(s=>s.id===p.id))),p.sha256,p.id);
 for(const p of preserved.offers)assert.equal(hash(JSON.stringify(offers.find(o=>o.specialtyId===p.id))),p.sha256,p.id);
 for(const p of preserved.pairings)assert.equal(hash(JSON.stringify(localSakanaPairings.find(r=>r.sakeId===p.sakeId&&r.specialtyId===p.specialtyId))),p.sha256,p.sakeId);
});
test('only the three specialty data files and the observed Rakuten image CDN permission change',()=>{
 const baseline=read('docs/local-sakana-v2/baseline.json');assert.equal(baseline.sourceCommit,'24febe194c36ead121964400bbdc5214903aafb4');
 const changed=[];for(const r of baseline.files){const actual=hash(fs.readFileSync(new URL('../'+r.path,import.meta.url)));if(actual!==r.sha256){changed.push(r.path);assert(reviewedLocalSakanaV2(r.path,r.sha256,actual),r.path);assert(!reviewedLocalSakanaV2(r.path,r.sha256,'tampered'));}}
 assert.deepEqual(changed.sort(),['src/commerce/localSakana.json','src/specialties/master.json','src/specialties/pairings.json','vercel.json']);
});
test('new foods distinguish culture sources, ingredient origin, quantity and official creative provenance',()=>{
 const old=new Set(preserved.specialties.map(s=>s.id)),added=localSpecialties.filter(s=>!old.has(s.id));assert.equal(added.length,45);
 for(const s of added){assert(s.subregion&&s.dataConfidence==='medium'&&s.originScope);assert(s.sources.every(r=>r.url.startsWith('https://')&&r.scope==='regional_food_culture_not_retail_origin_or_quantity'));
  const o=offers.find(o=>o.specialtyId===s.id);assert(o.originEvidence.meaning&&o.quantityEvidence.meaning);assert(verifiedSpecialtyCreative(o));assert.equal(o.image.productUrl,o.rakutenUrl);assert(!/search.rakuten|f[0-9]{6}-/.test(o.rakutenUrl));
 }
 const tokyo=offers.find(o=>o.specialtyId==='tokyo-asari-tsukudani');assert(tokyo.originEvidence.meaning.includes('千葉')&&tokyo.originEvidence.meaning.includes('中国'));
 assert(offers.find(o=>o.specialtyId==='wakayama-goma-dofu').quantity.includes('4個'));assert(offers.find(o=>o.specialtyId==='nara-narazuke').quantity.includes('胡瓜'));
 assert(offers.find(o=>o.specialtyId==='oita-ayu-uruka').originEvidence.meaning.includes('天然採捕とはしない'));
});
test('new editorial matches never infer sake taste from county, method, name or packaging',()=>{
 assert.equal(visibleSakePairings.length,484);assert.equal(localSakanaPairings.length,352);
 for(const p of localSakanaPairings.slice(179)){assert.equal(p.confidence,'medium');assert(p.editorialPairing&&!p.officialPairing&&!p.communityPairing);assert(p.sakeEvidence.feature&&p.sakeEvidence.sourceUrl&&p.sakeEvidence.verifiedAt);assert(p.specialtyEvidence.sourceUrls.length>=2);assert(p.pairingReason.length<200);}
 const item=visibleSakePairings.find(i=>localSakanaPairings.some(p=>p.sakeId===i.id));assert.deepEqual(localSakanaForSake({...item,id:'without-evidence'},{config}),[]);
});
test('a finish or acidity feature never silently becomes a claim of light body',()=>{
 for(const p of localSakanaPairings.slice(179))assert(!/酒の軽さ|酒のふくらみ/.test(p.pairingReason),p.sakeId);
});
test('all active projections keep one to three distinct foods, low hidden and empty states hidden',()=>{
 const now=Date.parse('2026-10-23T23:00:00+09:00'),rows=visibleSakePairings.map(i=>({i,cards:localSakanaForSake(i,{config,now,dishes:dishesForSake(i).slice(0,6)})}));
 assert.equal(rows.filter(r=>r.cards.length).length,255);assert.equal(rows.reduce((n,r)=>n+r.cards.length,0),352);
 for(const {i,cards}of rows){assert(cards.length<=3);assert.equal(new Set(cards.map(c=>c.id)).size,cards.length);assert(cards.every(c=>c.prefecture===i.prefecture&&c.commerce?.imageHtml));}
});
