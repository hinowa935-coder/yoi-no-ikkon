import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COMMERCE_SITE} from '../../src/data/siteIdentity.js';
import {createCommerceContext,resolveCommerceState} from '../../src/commerce/commerceState.js';
import {visibleSakePairings} from '../../src/data/siteData.js';

const read=(f)=>JSON.parse(fs.readFileSync(new URL(f,import.meta.url),'utf8'));
const save=(f,x)=>fs.writeFileSync(new URL(f,import.meta.url),JSON.stringify(x,null,2)+'\n');
const dayMs=86_400_000;
const dates=['2026-12-01','2026-12-03','2026-12-05','2026-12-07','2026-12-09','2026-12-11'];
const scope=read('./commerce-after.json');
const batches=dates.map((recommendedRecheckDate,i)=>({batchId:String.fromCharCode(65+i),recommendedRecheckDate,rows:[]}));
const ctx=createCommerceContext({enabled:true,registeredSite:COMMERCE_SITE,enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}});
const reference=Date.parse(scope.checkedAt);
const states=visibleSakePairings.map(item=>({item,state:resolveCommerceState(item,ctx,reference)}));
const storeGroups=new Map();
for(const {item,state} of states){
 const {imageValidUntil,affiliateValidUntil,purchaseStore,imageStore,availabilityStatus,purchaseRoute}=state;
 if(!imageValidUntil&&!affiliateValidUntil)continue;
 const store=purchaseStore??imageStore;
 const records=storeGroups.get(store)??[];
 records.push({store,imageStore,sakeId:item.id,sakeName:item.productName,
   imageApproval:imageValidUntil?'APPROVED':null,affiliateApproval:affiliateValidUntil?'APPROVED':null,
   imageValidUntil,affiliateValidUntil,availability:availabilityStatus,route:purchaseRoute});
 storeGroups.set(store,records);
}
for(const rows of [...storeGroups.values()].sort((a,b)=>b.length-a.length)) {
 const assignment=batches.reduce((a,b)=>a.rows.length<=b.rows.length?a:b);
 assignment.rows.push(...rows.map(row=>({...row,batchId:assignment.batchId,
   recommendedRecheckDate:assignment.recommendedRecheckDate})));
}
const all=batches.flatMap(b=>b.rows);
assert.equal(new Set(all.map(x=>x.sakeId)).size,all.length);
const selected=process.argv.find(arg=>arg.startsWith('--as-of='));
const now=selected?Date.parse(selected.slice('--as-of='.length)):Date.now();
assert(Number.isFinite(now));
const count=field=>{
  const times=all.filter(row=>row[field]).map(row=>Date.parse(row[field])-now);
  return {expired:times.filter(t=>t<=0).length,
    ...Object.fromEntries([30,14,7,3].map(n=>[n+'days',times.filter(t=>t>0&&t<=n*dayMs).length]))};
};
const summary={asOf:new Date(now).toISOString(),targetProducts:all.length,
  image:count('imageValidUntil'),affiliate:count('affiliateValidUntil'),
  batchCounts:batches.map(b=>({id:b.batchId,on:b.recommendedRecheckDate,products:b.rows.length,
    stores:new Set(b.rows.map(r=>r.store)).size}))};
save('expiry-batches.json',{summary,batches});
console.log(summary);
