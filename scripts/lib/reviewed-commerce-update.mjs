import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {historicalBatch,reviewedHistoricalCommerce} from './reviewed-historical-update.mjs';
import {shelfFinalBatch} from './reviewed-shelf-update.mjs';
const batch = JSON.parse(fs.readFileSync(new URL('../../data/catalog-operations/seasonal-shelf-batches.json', import.meta.url)));
export const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
export function reviewedCommerceUpdate(file, id, beforeDigest, current) {
  return reviewedHistoricalCommerce(file,id,beforeDigest,current)||batch.reviewed === true && batch.commerceChanges.some(change => change.file === file && change.sakeId === id && change.beforeSha256 === beforeDigest && (change.afterSha256 === digest(current)||reviewedHistoricalCommerce(file,id,change.afterSha256,current)));
}
export const reviewedImageRescueIds = [...new Set([...(batch.imageAddedIds || []),...historicalBatch.exactRecoveries,...shelfFinalBatch.exactRecoveries.filter(id=>shelfFinalBatch.commerceChanges.some(c=>c.sakeId===id&&c.file.endsWith('product-media.json')&&!c.previouslyPresent))])];
export const reviewedDirectRescueIds = [...historicalBatch.exactRecoveries,...(shelfFinalBatch.newDirectRescueIds||[])];
export const reviewedPurchaseHoldIds = batch.purchaseBlockedIds || [];
