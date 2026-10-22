import fs from 'node:fs';
import {createHash} from 'node:crypto';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/local-sakana-v1/source-changes.json',import.meta.url)));
const hash=v=>createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');
const allowed=new Set(['src/data/discoveryCatalog.json','src/app/sake/[slug]/page.jsx','src/app/globals.css']);
const valid=()=>review.reviewed===true&&review.sourceCommit==='1f3f021a32d8697b5daab32018f05e27ad2f6e40'&&review.authorizedBy==='f495c82d-a898-49ff-8ba2-b1c40107af79';
export function reviewedLocalSakanaFile(file,beforeHash,afterHash){return valid()&&allowed.has(file)&&review.changes.some(c=>c.file===file&&c.beforeSha256===beforeHash&&c.afterSha256===afterHash);}
export function reviewedPrefectureCorrection(id,beforeHash,current){
 const row=review.recordChanges.find(c=>c.sakeId===id);
 return valid()&&row?.beforeSha256===beforeHash&&row.afterSha256===hash(current)&&current.prefecture===row.afterPrefecture&&hash({...current,prefecture:row.beforePrefecture})===beforeHash;
}
export function originalReviewedPrefecture(item){
 const row=review.recordChanges.find(c=>c.sakeId===item.id);
 return row&&reviewedPrefectureCorrection(item.id,row.beforeSha256,item)?{...item,prefecture:row.beforePrefecture}:item;
}
