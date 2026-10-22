import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {visibleSakePairings,getSakeById} from '../src/data/siteData.js';
import {localSpecialties,localSakanaPairings,localSakanaForSake,specialtyCommerce,verifiedSpecialtyCreative} from '../src/specialties/localSakana.js';
import {dishesForSake} from '../src/data/discovery.js';
import {productFingerprint} from '../src/commerce/validation.js';
import {resolveFavorite} from '../src/data/favoriteReferences.js';
import {reviewedLocalSakanaFile,reviewedPrefectureCorrection} from './lib/reviewed-local-sakana.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const hash=v=>createHash('sha256').update(v).digest('hex');
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
const offers=read('src/commerce/localSakana.json').offers,changes=read('docs/local-sakana-v1/source-changes.json');
const now=Date.parse('2026-10-23T23:00:00+09:00');

test('all active prefectures are known; exactly nine geo-only corrections retain SKU, research and favorite identity',()=>{
 assert.equal(visibleSakePairings.length,484);assert(visibleSakePairings.every(i=>i.prefecture&&!['UNKNOWN','undefined'].includes(i.prefecture)));
 assert.equal(changes.recordChanges.length,9);
 for(const c of changes.recordChanges){const item=getSakeById(c.sakeId);assert.equal(item.prefecture,c.afterPrefecture);assert(reviewedPrefectureCorrection(c.sakeId,c.beforeSha256,item));
  const old={...item,prefecture:c.beforePrefecture};assert.equal(productFingerprint(old),productFingerprint(item));assert.equal(resolveFavorite(item.id).canonicalId,item.id);
  assert(!reviewedPrefectureCorrection(c.sakeId,c.beforeSha256,{...item,productName:item.productName+' changed'}));
 }
 assert(getSakeById('ruka-p7oucs').prefecture==='群馬県');
});
test('all unrelated application/data/commerce/PWA files retain exact baseline bytes',()=>{
 for(const row of read('docs/local-sakana-v1/baseline.json').files){const actual=hash(fs.readFileSync(new URL('../'+row.path,import.meta.url)));assert(actual===row.sha256||reviewedLocalSakanaFile(row.path,row.sha256,actual),row.path);}
 for(const row of changes.changes){assert(reviewedLocalSakanaFile(row.file,row.beforeSha256,row.afterSha256));assert(!reviewedLocalSakanaFile(row.file,row.beforeSha256,'tampered'));}
});
test('specialty food claims, related food IDs and purchase records live in separate layers',()=>{
 assert.equal(localSpecialties.length,67);assert.equal(offers.length,67);assert.equal(new Set(localSpecialties.map(s=>s.id)).size,67);
 for(const s of localSpecialties){assert(s.prefecture&&s.description&&s.sources.length&&s.featureEvidence.length&&s.relatedFoodIds);assert(!('rakutenUrl'in s));assert(!('price'in s));assert(offers.some(o=>o.specialtyId===s.id));}
 assert(!localSpecialties.some(s=>s.id==='shio-uni'||s.id==='konka-iwashi'));
});
test('every pairing is SKU-specific, sourced, editorial, and compatible with the existing verified feature',()=>{
 for(const p of localSakanaPairings){const item=getSakeById(p.sakeId),s=localSpecialties.find(s=>s.id===p.specialtyId);assert.equal(p.prefecture,item.prefecture);assert.equal(s.prefecture,item.prefecture);
  assert.equal(p.evidenceType,'editorialPairing');assert.equal(p.officialPairing,false);assert.equal(p.communityPairing,false);
  assert(item.sakeResearch.featureEvidence.some(e=>e.feature===p.sakeEvidence.feature&&e.sourceUrl===p.sakeEvidence.sourceUrl));
  assert(item.sakeResearch.verifiedFeatureTags.includes(p.sakeEvidence.feature));assert(s.pairingTags.includes(p.sakeEvidence.axis));assert(p.pairingReason.includes(p.sakeEvidence.feature)&&p.pairingReason.includes(s.name));assert(p.pairingReason.length<200);
  assert(!/^(?:生酛|山廃|氷温熟成|三年熟成|熟成酒ブレンド)$/.test(p.sakeEvidence.feature),'Method alone is not a taste');
 }
});
test('same county is not sufficient, low is hidden, no duplicates, max three, empty sections are omitted',()=>{
 const item=getSakeById(localSakanaPairings[0].sakeId),p=localSakanaPairings.find(p=>p.sakeId===item.id),s=localSpecialties.find(s=>s.id===p.specialtyId);
 assert.deepEqual(localSakanaForSake({...item,id:'unknown'},{config,now}),[]);
 assert.deepEqual(localSakanaForSake({...item,prefecture:'沖縄県'},{config,now}),[]);
 assert.deepEqual(localSakanaForSake(item,{config,now,pairings:[{...p,confidence:'low'}]}),[]);
 assert.equal(localSakanaForSake(item,{config,now,pairings:[p,p,p,p]}).length,1);
 const food=s.relatedFoodIds[0];if(food){const all=read('src/data/foodCatalog.json').foods,other=all.find(f=>f.id===food);assert(!localSakanaForSake(item,{config,now,dishes:[{name:other.name}]}).some(r=>r.id===s.id));}
 for(const i of visibleSakePairings)assert(localSakanaForSake(i,{config,now,dishes:dishesForSake(i).slice(0,6)}).length<=3);
 const component=fs.readFileSync(new URL('../src/app/components/LocalSakana.jsx',import.meta.url),'utf8');assert(component.includes('if(!cards.length)return null'));
});
test('retail URLs, formal image originals and permissions agree; unexpected markup fails closed',()=>{
 for(const offer of offers){assert(verifiedSpecialtyCreative(offer));const sale=specialtyCommerce(offer,config,now);assert(sale.isAffiliate&&sale.imageHtml===offer.image.html);assert.equal(new URL(sale.url).searchParams.get('pc'),offer.rakutenUrl);assert.equal(new URL(offer.rakutenUrl).hostname,'item.rakuten.co.jp');}
 const first=offers[0];assert(!verifiedSpecialtyCreative({...first,image:{...first.image,html:first.image.html+'<script>alert(1)</script>'}}));
 assert(!verifiedSpecialtyCreative({...first,rakutenUrl:'https://example.com/'}));
 assert(!verifiedSpecialtyCreative({...first,registeredSite:'https://example.com/'}));
});
test('soldout, unknown, unapproved and expired offers lose CTA/images but never the food or pairing',()=>{
 const offer=offers[0],item=getSakeById(localSakanaPairings.find(p=>p.specialtyId===offer.specialtyId).sakeId);
 for(const status of ['SOLD_OUT','UNKNOWN','REMOVED'])assert.equal(specialtyCommerce({...offer,availabilityStatus:status},config,now),null);
 assert.equal(specialtyCommerce({...offer,operatorApproved:false},config,now),null);
 assert.equal(specialtyCommerce(offer,config,Date.parse('2027-02-01')),null);
 const result=localSakanaForSake(item,{config,now,offers:offers.map(o=>({...o,availabilityStatus:'SOLD_OUT'}))});assert(result.length);assert(result.every(c=>c.reason&&c.commerce===null));
 const normal=specialtyCommerce(offer,{enabled:false},now);assert.equal(normal.isAffiliate,false);assert.equal(normal.url,offer.rakutenUrl);assert.equal(normal.imageHtml,null);
});
test('detail order, lazy stable imagery and PII-free telemetry are explicit; no additional routes',()=>{
 const page=fs.readFileSync(new URL('../src/app/sake/[slug]/page.jsx',import.meta.url),'utf8'),component=fs.readFileSync(new URL('../src/app/components/LocalSakana.jsx',import.meta.url),'utf8');
 assert(page.indexOf('<LocalSakana ')>page.indexOf('className="detail-band sake-pairings"'));assert(page.indexOf('<LocalSakana ')<page.indexOf('className="detail-band sake-nights"'));
 assert(component.includes('IntersectionObserver')&&component.includes('rootMargin:')&&component.includes('onErrorCapture'));
 for(const name of ['specialty_impression','specialty_click','specialty_rakuten_click'])assert(component.includes(name));
 assert(!/email|userId|sessionId|searchParams|localStorage/.test(component));
 assert(!fs.existsSync(new URL('../src/app/specialties',import.meta.url)));
});
