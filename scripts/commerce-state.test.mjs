import assert from 'node:assert/strict';
import test from 'node:test';
import { createCommerceContext, resolveCommerceState } from '../src/commerce/commerceState.js';
import { chooseRakutenRoute } from '../src/commerce/routeSelection.js';
import { approvalIsCurrent } from '../src/commerce/currentApproval.js';
import { COMMERCE_SITE } from '../src/data/siteIdentity.js';
import { visibleSakePairings } from '../src/data/siteData.js';

const now=Date.parse('2026-11-15T16:00:00Z');
const config={enabled:true,registeredSite:COMMERCE_SITE,enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
const ctx=createCommerceContext(config);
const rows=visibleSakePairings.map(item=>[item,resolveCommerceState(item,ctx,now)]);
const [example,state]=rows.find(([i,s])=>s.imageVisible&&s.purchaseRoute==='AFFILIATE_DIRECT'&&ctx.assets[i.id]?.html);
const [recovered]=rows.find(([i,s])=>s.imageVisible&&s.purchaseRoute==='AFFILIATE_DIRECT'&&ctx.affiliate[i.id]);
const resolve=(item=example,patch={},time=now)=>resolveCommerceState(item,{...ctx,...patch},time);

test('the 484 product states each select exactly one valid purchase route, with images independent',()=>{
 const sum={AFFILIATE_DIRECT:0,NORMAL_DIRECT:0,SEARCH:0,NONE:0,images:0};
 for(const [item,s] of rows){
   sum[s.purchaseRoute]++;
   sum.images+=Number(s.imageVisible);
   const selected=chooseRakutenRoute(s.purchase,now);
   assert.equal(selected.type,s.purchaseRoute,item.id);
   if(selected.link?.capacityMl&&item.capacityMl)assert.equal(selected.link.capacityMl,item.capacityMl,item.id);
   if(s.purchase.affiliate){
     assert.equal(s.availabilityStatus,'IN_STOCK',item.id);
     assert.equal(s.registeredSite,COMMERCE_SITE,item.id);
     assert(Date.parse(s.affiliateValidUntil)>now,item.id);
   }
   if(s.imageVisible)assert(Date.parse(s.imageValidUntil)>now,item.id);
 }
 assert.equal(rows.length,484);
 assert.deepEqual(sum,{AFFILIATE_DIRECT:387,NORMAL_DIRECT:3,SEARCH:94,NONE:0,images:399});
 assert(rows.some(([,s])=>s.imageVisible&&s.availabilityStatus==='SOLD_OUT'&&s.purchaseRoute==='SEARCH'));
 assert(rows.some(([,s])=>!s.imageVisible&&s.purchaseRoute==='AFFILIATE_DIRECT'));
});

test('blocked purchase, page gone and hide-image are independent',()=>{
 const held=resolve(example,{holdFor:()=>({purchaseBlocked:true,status:'TEMPORARILY_UNAVAILABLE'})});
 assert.deepEqual([held.purchaseRoute,held.imageVisible,held.availabilityStatus],['SEARCH',true,'SOLD_OUT']);
 const gone=resolve(example,{holdFor:()=>({status:'PAGE_GONE'})});
 assert.deepEqual([gone.purchaseRoute,gone.imageVisible,gone.availabilityStatus],['SEARCH',true,'PAGE_GONE']);
 const hidden=resolve(example,{holdFor:()=>({hideImage:true})});
 assert.deepEqual([hidden.purchaseRoute,hidden.imageVisible],['AFFILIATE_DIRECT',false]);
});

test('future, expired, different media, wrong edition or wrong fingerprint cannot authorize commerce',()=>{
 const original={...ctx.reviews.get(example.id)[0],permissionConfirmed:true};
 assert(approvalIsCurrent(original,example,now));
 for(const change of [
   {approved:false},{registeredSite:'https://example.vercel.app/'},{productFingerprint:'foreign'},
   {editionStatus:'UNKNOWN'},{verifiedAt:'bad'},{verifiedAt:'2026-11-16Z'},{validUntil:new Date(now).toISOString()}
 ])assert(!approvalIsCurrent({...original,...change},example,now));
 const after=resolve(example,{},Date.parse('2026-12-17T00:00Z'));
 assert.deepEqual([after.purchaseRoute,after.imageVisible],['SEARCH',false]);
 assert.equal(chooseRakutenRoute(state.purchase,null).type,'SEARCH');
 assert.equal(chooseRakutenRoute(state.purchase,Date.parse(state.affiliateValidUntil)).type,'SEARCH');
});

test('mismatched SKU, capacity or unresolved season leave the normal route rather than a bad approval',()=>{
 for(const change of [{itemCode:'example:0'},{capacityMl:999},{editionStatus:'UNKNOWN'}]){
   const affiliate={...ctx.affiliate,[recovered.id]:{...ctx.affiliate[recovered.id],...change}};
   assert.notEqual(resolve(recovered,{affiliate}).purchaseRoute,'AFFILIATE_DIRECT');
 }
 const item={...example,capacityMl:201};
 assert.deepEqual([resolve(item).purchaseRoute,resolve(item).imageVisible],['SEARCH',false]);
});

test('duplicate current proof is quarantined without choosing between duplicates',()=>{
 const reviews=new Map(ctx.reviews);
 const l=reviews.get(example.id);
 reviews.set(example.id,[...l,...l]);
 const s=resolve(example,{reviews});
 assert.deepEqual([s.identityStatus,s.imageStatus,s.affiliateStatus,s.purchaseRoute],['CONFLICT','CONFLICT','CONFLICT','NORMAL_DIRECT']);
});
