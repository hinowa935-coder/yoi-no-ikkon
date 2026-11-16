import fs from 'node:fs';
import {reviewedCutoverPreflight} from './reviewed-cutover-preflight.mjs';
const review = JSON.parse(fs.readFileSync(new URL('../../docs/recommendation-date-fix/source-changes.json', import.meta.url)));
const allowed = new Set(['src/data/discovery.js', 'src/app/components/DiscoveryQueryFlow.jsx', 'src/app/components/useCurrentTokyoDay.js', 'src/app/food/[slug]/page.jsx', 'src/app/night/[slug]/page.jsx']);
export function reviewedRecommendationDate(file, beforeHash, afterHash) {
  return allowed.has(file) && review.reviewed === true &&
    review.sourceCommit === '66e04962e960518906063c280d926918687f2477' &&
    review.authorizedByAttachment === '044d8e3e-3095-4656-a4e6-4cf2a6854ea1' &&
    review.selectionChangeApproved === true && review.changes.some(c =>
      c.file === file && c.historicalBeforeHashes.includes(beforeHash) &&
      (c.afterSha256 === afterHash || reviewedCutoverPreflight(file, c.afterSha256, afterHash)));
}
