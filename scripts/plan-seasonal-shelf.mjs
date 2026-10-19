import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {shelfPolicy, seasonalReviewWindows, commerceReviewHorizon, planShelfUpdate, shelfQualityGroup} from '../src/catalog/shelfUpdates.js';
import {allSakePairings, visibleSakePairings} from '../src/data/siteData.js';
import lifecycle from '../src/data/catalogLifecycle.json' with {type: 'json'};
import matches from '../src/commerce/generated/purchase-matches.json' with {type: 'json'};
import {productMediaFor} from '../src/commerce/productMedia.js';
export function shelfReviewInventory() {
  const rows = visibleSakePairings.map(item => ({sakeId: item.id, productName: item.productName, brewery: item.brewery, prefecture: item.prefecture,
    group: shelfQualityGroup({directLink: matches[item.id]?.directLinkAllowed === true && Date.parse(matches[item.id].validUntil) > Date.now(), formalImage: !!productMediaFor(item) && Date.parse(productMediaFor(item).validUntil) > Date.now()})}));
  const commerceRecords = visibleSakePairings.flatMap(item => [matches[item.id]?.directLinkAllowed ? matches[item.id] : null, productMediaFor(item)].filter(Boolean));
  return {policy: shelfPolicy, windows: seasonalReviewWindows(), commerceReviewHorizon: commerceReviewHorizon(commerceRecords), active: rows.length, total: allSakePairings.length, rows};
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  if (process.argv.includes('--apply')) throw Error('Automatic application is not supported. Apply a reviewed release with tests and production QA.');
  const index = process.argv.indexOf('--plan');
  const result = index < 0 ? shelfReviewInventory() : planShelfUpdate({...JSON.parse(fs.readFileSync(process.argv[index + 1], 'utf8')), items: allSakePairings, lifecycle: lifecycle.records});
  const report = {...result, catalogFingerprint: createHash('sha256').update(JSON.stringify(allSakePairings)).digest('hex')};
  const outputIndex = process.argv.indexOf('--output');
  if (outputIndex >= 0) fs.writeFileSync(process.argv[outputIndex + 1], JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({mode: 'read-only-plan', active: report.active || report.activeBefore, total: allSakePairings.length, ready: report.ready || false, nextWindow: report.windows?.[0]?.id, errors: report.errors || [], automaticPublicationAllowed: false}));
}
