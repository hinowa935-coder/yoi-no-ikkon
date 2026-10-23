import fs from 'node:fs';
import {reviewedTasteRewrite} from './reviewed-taste-rewrite.mjs';
import {reviewedLocalSakanaNational} from './reviewed-local-sakana-national.mjs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/local-sakana-v2/source-changes.json',import.meta.url)));
const allowed=new Set(['src/specialties/master.json','src/specialties/pairings.json','src/commerce/localSakana.json','vercel.json']);
export function reviewedLocalSakanaV2(file,beforeHash,afterHash){
 return reviewedLocalSakanaNational(file,beforeHash,afterHash)||reviewedTasteRewrite(file,beforeHash,afterHash)||(allowed.has(file)&&review.reviewed===true&&review.sourceCommit==='24febe194c36ead121964400bbdc5214903aafb4'&&review.authorizedByAttachment==='404987cd-8242-4855-aa3f-d9ca81e67029'&&review.changes.some(c=>c.file===file&&c.beforeSha256===beforeHash&&c.afterSha256===afterHash));
}
