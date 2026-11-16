import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {COMMERCE_SITE as origin} from '../src/data/siteIdentity.js';

export const requiredHostingEnv=['AFFILIATE_ENABLED','AFFILIATE_REGISTERED_SITE','AFFILIATE_RAKUTEN_ENABLED','AFFILIATE_RAKUTEN_ROUTE'];

export function validateHostingEnvironment(env){
 const missing=requiredHostingEnv.filter(key=>!env[key]);
 if(missing.length)throw new Error('Missing hosting settings: '+missing.join(', ')+' (values not logged)');
 const stage=env.NETLIFY_MIGRATION_STAGE||'preview';
 if(!['preview','production'].includes(stage))throw new Error('NETLIFY_MIGRATION_STAGE must be preview or production');
 if(!['true','false'].includes(env.AFFILIATE_ENABLED)||env.AFFILIATE_RAKUTEN_ENABLED!=='true'||env.AFFILIATE_RAKUTEN_ROUTE!=='rakuten'||env.AFFILIATE_REGISTERED_SITE!==origin)throw new Error('Hosting settings must name the registered Netlify media');
 if(stage==='production'){
   if(env.NETLIFY==='true')throw new Error('Production cutover must use reviewed local prebuilt output; Git-hosted Netlify builds remain preview-only');
   if(env.AFFILIATE_ENABLED!=='true')throw new Error('Production cutover requires full Commerce');
   if(env.NETLIFY_PRODUCTION_CUTOVER_APPROVED!=='true')throw new Error('Production cutover requires explicit approval');
 }
 return requiredHostingEnv.map(key=>({key,status:'configured'}));
}

const googleTag='https://www.googletagmanager.com';
const analyticsSources={
 'script-src':[googleTag],
 'img-src':[googleTag,'https://*.google-analytics.com'],
 'connect-src':[googleTag,'https://*.google-analytics.com','https://*.analytics.google.com'],
};

export function netlifyRouting(vercel,measurementId=process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,stage=process.env.NETLIFY_MIGRATION_STAGE||'preview'){
 const enabled=/^G-[A-Z0-9]{6,20}$/.test(measurementId||'');
 const preview=stage!=='production';
 const headers=['/*',...vercel.headers.flatMap(rule=>rule.headers.map(h=>{
  const value=enabled&&h.key.toLowerCase()==='content-security-policy'
   ? h.value.replace(/(^|;\s*)(script-src|img-src|connect-src)( [^;]+)/g,(_,prefix,directive,sources)=>prefix+directive+sources+' '+analyticsSources[directive].join(' '))
   : h.value;
  return '  '+h.key+': '+value;
 })),
  ...(preview?['  X-Robots-Tag: noindex, nofollow, noarchive']:[]),
  '  Cache-Control: public, max-age=0, must-revalidate',
  '/sw.js','  Cache-Control: no-cache, no-store, must-revalidate',
  '/manifest.webmanifest','  Cache-Control: no-cache, max-age=0',
  '/_next/static/*','  Cache-Control: public, max-age=31536000, immutable',''];
 const redirects=vercel.redirects.map(r=>`${r.source} ${r.destination} ${r.permanent?301:302}!`);
 return{headers:headers.join('\n'),redirects:redirects.join('\n')+'\n'};
}

export function prepareNetlifyExport(directory,vercel,env=process.env){
 const output=path.resolve(directory);if(!fs.statSync(output).isDirectory()||!fs.existsSync(path.join(output,'index.html')))throw new Error('A completed static export is required');
 const stage=env.NETLIFY_MIGRATION_STAGE||'preview';
 const generated=netlifyRouting(vercel,env.NEXT_PUBLIC_GA_MEASUREMENT_ID,stage);fs.writeFileSync(path.join(output,'_headers'),generated.headers);fs.writeFileSync(path.join(output,'_redirects'),generated.redirects);
 // Preview is protected by X-Robots-Tag; production is indexable only after an explicit local cutover build.
 fs.writeFileSync(path.join(output,'robots.txt'),`User-agent: *\nAllow: /\n\nSitemap: ${origin}sitemap.xml\n`);
 return{previewOnly:stage!=='production',canonicalOrigin:origin,headersPreserved:vercel.headers[0].headers.length,redirectsPreserved:vercel.redirects.length,functions:0,imageTransformations:0};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=prepareNetlifyExport('out',JSON.parse(fs.readFileSync('vercel.json','utf8')));console.log(JSON.stringify(result));
}
