import fs from 'node:fs';
import {reviewedLocalSakanaFile} from './reviewed-local-sakana.mjs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/detail-layout/source-changes.json',import.meta.url)));
const allowed=new Set(['src/app/sake/[slug]/page.jsx','src/app/globals.css']);
export function reviewedDetailLayout(file,beforeHash,afterHash){
  return allowed.has(file)&&review.reviewed===true&&review.sourceCommit==='568eac1430e1dcf7fc5bf2c2c890f5630ed7022e'&&review.authorizedBy==='2911ec5c-c177-4a5e-81ae-e122e6a7306d'&&review.changes.some(c=>c.file===file&&c.beforeSha256===beforeHash&&(c.afterSha256===afterHash||reviewedLocalSakanaFile(file,c.afterSha256,afterHash)));
}
