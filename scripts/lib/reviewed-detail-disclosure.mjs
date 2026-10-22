import fs from 'node:fs';
import {reviewedLocalSakanaV2} from './reviewed-local-sakana-v2.mjs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/detail-disclosure/source-changes.json',import.meta.url)));
const allowed=new Set(['src/app/sake/[slug]/page.jsx','src/app/globals.css','src/app/components/DetailAccordion.jsx','src/app/components/LocalSakana.jsx','src/app/components/SakeDiscoveryContext.jsx']);
export function reviewedDetailDisclosure(file,beforeHash,afterHash){
 return reviewedLocalSakanaV2(file,beforeHash,afterHash)||(allowed.has(file)&&review.reviewed===true&&review.sourceCommit==='52d516dd6cf224ba90742017685feef7fd756b8f'&&review.authorizedBy==='a40558e1-babe-4ddc-9e18-fd02f2f82fd9'&&review.changes.some(c=>c.file===file&&c.beforeSha256===beforeHash&&c.afterSha256===afterHash));
}
