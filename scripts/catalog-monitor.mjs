import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {reviewQueue} from '../src/catalog/operations.js';
import {retailAvailability} from './lib/catalog-retail-availability.mjs';
const root=fileURLToPath(new URL('..',import.meta.url));
const dir=path.join(root,'data/catalog-operations'),cache=path.join(root,'.cache/catalog-monitor');
const read=p=>JSON.parse(fs.readFileSync(p)),hash=x=>createHash('sha256').update(x).digest('hex');
const save=(p,data)=>{fs.writeFileSync(p+'.tmp',JSON.stringify(data,null,2)+'\n');fs.renameSync(p+'.tmp',p);};
fs.mkdirSync(cache,{recursive:true});
const pool=read(path.join(dir,'candidates.json')),old=read(path.join(dir,'observations.json')).rows,queue=read(path.join(dir,'review-queue.json')).events;
const paths=['src/data','src/commerce/generated','public','vercel.json'];
function snapshot(){const result={};function walk(p){for(const e of fs.readdirSync(p,{withFileTypes:true})){const f=path.join(p,e.name);if(e.isDirectory())walk(f);else if(e.isFile())result[path.relative(root,f)]=hash(fs.readFileSync(f));}}for(const p of paths){const f=path.join(root,p);if(fs.statSync(f).isDirectory())walk(f);else result[p]=hash(fs.readFileSync(f));}return result;}
const before=snapshot(),live=process.argv.includes('--live'),rows=[];let lastRequest=0;
for(const c of pool.candidates){
 const url=new URL(c.normalUrl);assert(url.protocol==='https:'&&url.hostname==='item.rakuten.co.jp'&&!url.username&&!url.password);
 let response;const file=path.join(cache,hash(c.normalUrl)+'.json');
 if(!live){response=fs.existsSync(file)?read(file):old.find(o=>o.candidateProductId===c.candidateProductId)||{retrieved:false,reason:'CACHE_MISSING_NOT_FETCHED',checkedAt:new Date().toISOString()};}
 else{
  const wait=Math.max(0,1150-(Date.now()-lastRequest));await new Promise(resolve=>setTimeout(resolve,wait));lastRequest=Date.now();
  const checkedAt=new Date().toISOString();
  try{
   const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'Mozilla/5.0'}});
   if(r.status===429||r.status===401||r.status===403)throw Object.assign(Error('RATE_OR_ACCESS_GUARD'),{stop:true});
   const html=new TextDecoder(r.headers.get('content-type')?.match(/charset=([^;\s]+)/i)?.[1]||'euc-jp').decode(await r.arrayBuffer());
   const stock=retailAvailability(html,{expectedItemId:c.selectedItemCode.split(':')[1],normalUrl:c.normalUrl,finalUrl:r.url,status:r.status});
   const specHints=[...html.matchAll(/(?:精米歩合|アルコール度数|日本酒度|酸度|原料米|使用米|特定名称)[^<]{0,65}/g)].slice(0,15).map(m=>m[0]);
   response={retrieved:r.ok&&stock.sameDestination&&stock.itemMatches,title:stock.title,status:r.status,stock:stock.itemMatches?(stock.purchasable?true:stock.soldOut?false:null):null,stockDecision:stock.state,itemId:stock.itemId,checkedAt,sourceFingerprint:hash(html),specFingerprint:hash(JSON.stringify({title:stock.title,itemId:stock.itemId,specHints})),specProjectionStatus:'DIFF_HINT_ONLY_NOT_VERIFIED'};
  }catch(e){if(e.stop)throw e;response={retrieved:false,reason:'FETCH_FAILED_NOT_ABSENCE',checkedAt};}
  save(file,response);
 }
 const observation={...response,candidateProductId:c.candidateProductId,newBrewery:c.identityDecision?.breweryConfirmed!==true,seasonality:c.seasonality,merchantCodes:[c.selectedItemCode.split(':')[0]],formalImage:c.imageStatus==='FORMAL_IMAGE_CONFIRMED'};
 observation.fingerprint=hash(JSON.stringify({retrieved:observation.retrieved,title:observation.title,itemId:observation.itemId,stock:observation.stock,merchantCodes:observation.merchantCodes,formalImage:observation.formalImage,specFingerprint:observation.specFingerprint}));rows.push(observation);
}
const events=reviewQueue(old,rows),merged=[...new Map([...queue,...events].map(e=>[e.candidateProductId+'|'+e.type+'|'+(e.sourceFingerprint||'legacy-initial-observation'),e])).values()];
assert.deepEqual(snapshot(),before,'READ_ONLY_PRODUCTION_VIOLATION');
save(path.join(dir,'observations.json'),{checkedAt:new Date().toISOString(),readOnlyProduction:true,automaticPublicationAllowed:false,rows});
save(path.join(dir,'review-queue.json'),{checkedAt:new Date().toISOString(),automaticPublicationAllowed:false,events:merged});
const report={checkedAt:new Date().toISOString(),live,checked:rows.length,retrieved:rows.filter(r=>r.retrieved).length,stockConfirmed:rows.filter(r=>r.stock===true).length,newEvents:events.length,queue:merged.length,productionUnchanged:true,schedulerEnabled:false};save(path.join(dir,'last-monitor-run.json'),report);console.log(JSON.stringify(report));
