import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import { analyticsMeasurementId, trackAnalytics } from '../src/data/analytics.js';
import { ensureCommerceBuild } from './release-materials.mjs';
import { foodSpecialtyLinks } from '../src/commerce/foodSpecialtyModel.js';
import specialties from '../src/commerce/generated/netlify-specialty-ordinary.json' with {type:'json'};

const candidate='https://netlify-public-release-20261116--yoi-no-ikkon.netlify.app';
const measurement='G-EXAMPLE01';

test('only the specific opted-in branch host can run GA4 in preview builds',()=>{
 for(const origin of [candidate+'.example','https://another--yoi-no-ikkon.netlify.app','https://yoi-no-ikkon.vercel.app']){
   assert.equal(analyticsMeasurementId({location:{origin}},measurement,'production','true'),null);
 }
 assert.equal(analyticsMeasurementId({location:{origin:candidate}},measurement,'production','false'),null);
 assert.equal(analyticsMeasurementId({location:{origin:candidate}},measurement,'production','true'),measurement);
});

test('custom events are marked for DebugView only on the opted-in branch host',()=>{
 const previous=process.env.NEXT_PUBLIC_GA_RELEASE_PREVIEW;
 process.env.NEXT_PUBLIC_GA_RELEASE_PREVIEW='true';
 try{
   for(const origin of [candidate,'https://yoi-no-ikkon.netlify.app']){
     const calls=[];
     trackAnalytics('rakuten_click',{destination_domain:'rakuten.co.jp'},
       {location:{origin},gtag:(...args)=>calls.push(args)},measurement);
     assert.equal(calls.length,1);
     assert.equal(calls[0][2].debug_mode,origin===candidate?true:undefined);
   }
 }finally{
   if(previous===undefined)delete process.env.NEXT_PUBLIC_GA_RELEASE_PREVIEW;
   else process.env.NEXT_PUBLIC_GA_RELEASE_PREVIEW=previous;
 }
});

test('branch builds cannot leak detached originals or construct direct offers with missing originals',()=>{
 assert.throws(()=>ensureCommerceBuild({NETLIFY:'true',AFFILIATE_ENABLED:'true'}),/unverified Netlify/);
 assert.doesNotThrow(()=>ensureCommerceBuild({NETLIFY:'true',AFFILIATE_ENABLED:'false'}));
 assert.throws(()=>ensureCommerceBuild({AFFILIATE_ENABLED:'true'}),/missing or changed/);
});

test('no specialty offer data still renders a valid preview food page',()=>{
 assert.deepEqual(foodSpecialtyLinks('item-bxzivf',specialties.food),[]);
});

test('a preview without official images exports one inert media path', async()=>{
 const hook=registerHooks({resolve(specifier, context, next){
   if(specifier==='../../../commerce/server.js'){
     const mock='export const recoveredImageIds=()=>[]; export const recoveredImageFor=()=>null;';
     return {url:'data:text/javascript,'+encodeURIComponent(mock),shortCircuit:true};
   }
   return next(specifier,context);
 }});
 try{
   const {generateStaticParams,GET}=await import('../src/app/commerce-media/[asset]/route.js');
   assert.deepEqual(generateStaticParams(),[{asset:'_empty.json'}]);
   assert.equal(await (await GET(null,{params:Promise.resolve({asset:'_empty.json'})})).json(),null);
   assert.equal((await GET(null,{params:Promise.resolve({asset:'missing.json'})})).status,404);
 }finally{hook.deregister();}
});
