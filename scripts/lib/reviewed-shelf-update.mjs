import fs from 'node:fs';
import {createHash} from 'node:crypto';
export const shelfFinalBatch=JSON.parse(fs.readFileSync(new URL('../../data/catalog-operations/shelf-final-batch.json',import.meta.url)));
const digest=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const reviewed=()=>shelfFinalBatch.reviewed===true&&shelfFinalBatch.automaticPublicationAllowed===false;
export function reviewedShelfCommerce(file,id,beforeDigest,current){return reviewed()&&(shelfFinalBatch.commerceChanges||[]).some(c=>c.file===file&&c.sakeId===id&&c.beforeSha256===beforeDigest&&c.afterSha256===digest(current));}
export function reviewedShelfLifecycle(before,after){return reviewed()&&shelfFinalBatch.lifecycleFile.beforeSha256===before&&shelfFinalBatch.lifecycleFile.afterSha256===after;}
export function reviewedShelfRecovery(id,match,image){return reviewed()&&shelfFinalBatch.exactRecoveries.includes(id)&&['src/commerce/generated/purchase-matches.json','src/commerce/generated/product-media.json'].every((file,index)=>shelfFinalBatch.commerceChanges.some(c=>c.file===file&&c.sakeId===id&&c.afterSha256===digest(index?image:match)));}
