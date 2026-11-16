import fs from 'node:fs';
import {reviewedGa4} from './reviewed-ga4.mjs';
const review = JSON.parse(fs.readFileSync(new URL('../../docs/netlify-cutover-preflight/source-changes.json', import.meta.url)));
const allowed = new Set(['src/data/recommendationDate.js', 'src/app/components/FoodRecommendations.jsx', 'src/app/components/DiscoveryQueryFlow.jsx']);
export function reviewedCutoverPreflight(file, beforeHash, afterHash) {
  if (reviewedGa4(file,beforeHash,afterHash,reviewedCutoverPreflight)) return true;
  return review.authorizedByAttachment === 'b2ffce5a-bb4e-4276-8e12-558dbe249059' &&
    allowed.has(file) && review.changes.some(c => c.file === file && c.beforeSha256 === beforeHash && c.afterSha256 === afterHash);
}
