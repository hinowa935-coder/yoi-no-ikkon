import fs from 'node:fs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/taste-rewrite/source-changes.json',import.meta.url)));
export function reviewedTasteRewrite(file,beforeHash,afterHash){
 return file==='src/app/sake/[slug]/page.jsx'&&review.reviewed===true&&review.sourceCommit==='167ed5b8899d3ea6a7bc6f53267b3a9cfc8533c4'&&review.authorizedByAttachment==='6b1e9815-2755-4dc1-9d67-36340010dc74'&&review.changes.some(c=>c.file===file&&c.historicalBeforeHashes.includes(beforeHash)&&c.afterSha256===afterHash);
}
