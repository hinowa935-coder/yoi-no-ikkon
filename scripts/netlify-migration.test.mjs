import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import assert from 'node:assert/strict';
import test from 'node:test';
import {netlifyRouting,validateHostingEnvironment,prepareNetlifyExport,requiredHostingEnv} from './netlify-export.mjs';
const vercel=JSON.parse(fs.readFileSync(new URL('../vercel.json',import.meta.url)));
const previewEnv={AFFILIATE_ENABLED:'false',AFFILIATE_REGISTERED_SITE:'https://yoi-no-ikkon.netlify.app/',AFFILIATE_RAKUTEN_ENABLED:'true',AFFILIATE_RAKUTEN_ROUTE:'rakuten',NETLIFY_MIGRATION_STAGE:'preview'};
const productionEnv={...previewEnv,AFFILIATE_ENABLED:'true',NETLIFY_MIGRATION_STAGE:'production',NETLIFY_PRODUCTION_CUTOVER_APPROVED:'true'};

test('preview export preserves security headers and adds noindex',()=>{
 const r=netlifyRouting(vercel,'','preview');
 for(const h of vercel.headers[0].headers)assert(r.headers.includes(h.key+': '+h.value));
 assert(r.headers.includes('X-Robots-Tag: noindex'));
 assert(!r.headers.includes("img-src *"));
});

test('production export preserves security headers but is indexable',()=>{
 const r=netlifyRouting(vercel,'G-P83M4NJFCK','production');
 for(const h of vercel.headers[0].headers)assert(r.headers.includes(h.key+': '));
 assert(!r.headers.includes('X-Robots-Tag: noindex'));
 assert(r.headers.includes('https://www.googletagmanager.com'));
});

test('all fourteen permanent legacy food redirects are preserved and no SPA fallback is added',()=>{
 const r=netlifyRouting(vercel);
 assert.equal(r.redirects.trim().split('\n').length,14);
 for(const v of vercel.redirects)assert(r.redirects.includes(`${v.source} ${v.destination} 301!`));
 assert(!r.redirects.includes('/* /index.html'));
});

test('hosting validation accepts Netlify preview and guarded local production only',()=>{
 const result=validateHostingEnvironment(previewEnv);
 assert.equal(result.length,4);
 assert(!JSON.stringify(result).includes('https://'));
 for(const key of requiredHostingEnv)assert.throws(()=>validateHostingEnvironment({...previewEnv,[key]:''}));
 assert.throws(()=>validateHostingEnvironment({...previewEnv,AFFILIATE_REGISTERED_SITE:'https://unregistered.example/'}));
 assert.throws(()=>validateHostingEnvironment({...productionEnv,NETLIFY_PRODUCTION_CUTOVER_APPROVED:'false'}));
 assert.throws(()=>validateHostingEnvironment({...productionEnv,NETLIFY:'true'}));
 assert.doesNotThrow(()=>validateHostingEnvironment(productionEnv));
});

test('preview and production output differ only in indexing gate, keeping export bytes intact',()=>{
 for(const env of [previewEnv,productionEnv]){
  const dir=fs.mkdtempSync(path.join(os.tmpdir(),'yoi-netlify-'));
  try{
   fs.writeFileSync(path.join(dir,'index.html'),'<h1>unchanged</h1>');
   fs.writeFileSync(path.join(dir,'search.txt'),'router payload');
   const r=prepareNetlifyExport(dir,vercel,env);
   assert.equal(r.functions,0);
   assert.equal(r.previewOnly,env.NETLIFY_MIGRATION_STAGE!=='production');
   assert.equal(fs.readFileSync(path.join(dir,'index.html'),'utf8'),'<h1>unchanged</h1>');
   assert.equal(fs.readFileSync(path.join(dir,'search.txt'),'utf8'),'router payload');
   assert.equal(fs.readFileSync(path.join(dir,'robots.txt'),'utf8'),'User-agent: *\nAllow: /\n\nSitemap: https://yoi-no-ikkon.netlify.app/sitemap.xml\n');
   const headers=fs.readFileSync(path.join(dir,'_headers'),'utf8');
   assert.equal(headers.includes('X-Robots-Tag: noindex'),env.NETLIFY_MIGRATION_STAGE!=='production');
  }finally{
   assert(fs.realpathSync(dir).startsWith(path.join(fs.realpathSync(os.tmpdir()),'yoi-netlify-')));
   fs.rmSync(dir,{recursive:true,force:true});
  }
 }
});
