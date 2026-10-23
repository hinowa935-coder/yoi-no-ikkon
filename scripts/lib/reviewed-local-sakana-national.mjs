import fs from 'node:fs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/local-sakana-national/source-changes.json',import.meta.url)));
const allowed=new Set(['src/specialties/master.json','src/specialties/pairings.json','src/commerce/localSakana.json']);
export function reviewedLocalSakanaNational(file,beforeHash,afterHash){
 return allowed.has(file)&&review.reviewed===true&&review.sourceCommit==='0125ff6709b041db9dcb95bed00dcfa8be41b516'&&review.authorizedByAttachment==='0e4c472c-5ca6-446b-af56-f857aa3d0bc1'&&review.changes.some(c=>c.file===file&&c.historicalBeforeHashes.includes(beforeHash)&&c.afterSha256===afterHash);
}
