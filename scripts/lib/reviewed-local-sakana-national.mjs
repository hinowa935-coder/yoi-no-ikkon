import fs from 'node:fs';
import {reviewedRecommendationDate} from './reviewed-recommendation-date.mjs';
import {reviewedGa4} from './reviewed-ga4.mjs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/local-sakana-national/source-changes.json',import.meta.url)));
const allowed=new Set(['src/specialties/master.json','src/specialties/pairings.json','src/commerce/localSakana.json']);
export function reviewedLocalSakanaNational(file,beforeHash,afterHash){
 if(reviewedGa4(file,beforeHash,afterHash,reviewedLocalSakanaNational))return true;
 return reviewedRecommendationDate(file,beforeHash,afterHash)||(allowed.has(file)&&review.reviewed===true&&review.sourceCommit==='0125ff6709b041db9dcb95bed00dcfa8be41b516'&&review.authorizedByAttachment==='0e4c472c-5ca6-446b-af56-f857aa3d0bc1'&&review.changes.some(c=>c.file===file&&c.historicalBeforeHashes.includes(beforeHash)&&c.afterSha256===afterHash));
}
