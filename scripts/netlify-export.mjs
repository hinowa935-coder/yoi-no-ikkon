import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const origin='https://yoi-no-ikkon.vercel.app/';
export const requiredHostingEnv=['AFFILIATE_ENABLED','AFFILIATE_REGISTERED_SITE','AFFILIATE_RAKUTEN_ENABLED','AFFILIATE_RAKUTEN_ROUTE'];

export function validateHostingEnvironment(env){
 const missing=requiredHostingEnv.filter(key=>!env[key]);
 if(missing.length)throw new Error('Missing hosting settings: '+missing.join(', ')+' (values not logged)');
 if(env.AFFILIATE_ENABLED!=='true'||env.AFFILIATE_RAKUTEN_ENABLED!=='true'||env.AFFILIATE_RAKUTEN_ROUTE!=='rakuten'||env.AFFILIATE_REGISTERED_SITE!==origin)throw new Error('Hosting settings do not reproduce the approved Vercel commerce configuration');
 if((env.NETLIFY_MIGRATION_STAGE||'preview')!=='preview')throw new Error('Production cutover is not approved by preview QA alone: resolve canonical/share URLs, media registration and cross-origin favorites first');
 return requiredHostingEnv.map(key=>({key,status:'configured'}));
}

export function netlifyRouting(vercel){
 const headers=['/*',...vercel.headers.flatMap(rule=>rule.headers.map(h=>'  '+h.key+': '+h.value)),
  '  X-Robots-Tag: noindex, nofollow, noarchive','  Cache-Control: public, max-age=0, must-revalidate',
  '/sw.js','  Cache-Control: no-cache, no-store, must-revalidate',
  '/manifest.webmanifest','  Cache-Control: no-cache, max-age=0',
  '/_next/static/*','  Cache-Control: public, max-age=31536000, immutable',''];
 const redirects=vercel.redirects.map(r=>`${r.source} ${r.destination} ${r.permanent?301:302}!`);
 // Keep each App Router HTML page and RSC payload distinct. Never use an SPA catch-all.
 return{headers:headers.join('\n'),redirects:redirects.join('\n')+'\n'};
}

export function prepareNetlifyExport(directory,vercel){
 const output=path.resolve(directory);if(!fs.statSync(output).isDirectory()||!fs.existsSync(path.join(output,'index.html')))throw new Error('A completed static export is required');
 const generated=netlifyRouting(vercel);fs.writeFileSync(path.join(output,'_headers'),generated.headers);fs.writeFileSync(path.join(output,'_redirects'),generated.redirects);
 // Both the header and robots file protect the parallel site from accidental indexing.
 fs.writeFileSync(path.join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
 return{previewOnly:true,canonicalOrigin:origin,headersPreserved:vercel.headers[0].headers.length,redirectsPreserved:vercel.redirects.length,functions:0,imageTransformations:0};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const result=prepareNetlifyExport('out',JSON.parse(fs.readFileSync('vercel.json','utf8')));console.log(JSON.stringify(result));
}
