import fs from 'node:fs';
import {createHash} from 'node:crypto';
const batch = JSON.parse(fs.readFileSync(new URL('../../data/catalog-operations/seasonal-shelf-batches.json', import.meta.url)));
export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function reviewedCommerceUpdate(file, id, beforeDigest, current) {
  return batch.reviewed === true && batch.commerceChanges.some(change => change.file === file && change.sakeId === id && change.beforeSha256 === beforeDigest && change.afterSha256 === digest(current));
}
export const reviewedImageRescueIds = batch.imageAddedIds || [];
export const reviewedPurchaseHoldIds = batch.purchaseBlockedIds || [];
