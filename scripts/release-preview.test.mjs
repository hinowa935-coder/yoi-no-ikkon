import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import test from 'node:test';
import { analyticsMeasurementId } from '../src/data/analytics.js';
import { ensureCommerceBuild } from './release-materials.mjs';

const candidate='https://netlify-public-release-20261116--yoi-no-ikkon.netlify.app';
const measurement='G-EXAMPLE01';

test('only the specific opted-in branch host can run GA4 in preview builds',()=>{
 for(const origin of [candidate+'.example','https://another--yoi-no-ikkon.netlify.app','https://yoi-no-ikkon.vercel.app']){
   assert.equal(analyticsMeasurementId({location:{origin}},measurement,'production','true'),null);
 }
 assert.equal(analyticsMeasurementId({location:{origin:candidate}},measurement,'production','false'),null);
 assert.equal(analyticsMeasurementId({location:{origin:candidate}},measurement,'production','true'),measurement);
});

test('branch builds cannot leak detached originals or construct direct offers with missing originals',()=>{
 assert.throws(()=>ensureCommerceBuild({NETLIFY:'true',AFFILIATE_ENABLED:'true'}),/unverified Netlify/);
 assert.doesNotThrow(()=>ensureCommerceBuild({NETLIFY:'true',AFFILIATE_ENABLED:'false'}));
 assert.throws(()=>ensureCommerceBuild({AFFILIATE_ENABLED:'true'}),/missing or changed/);
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
