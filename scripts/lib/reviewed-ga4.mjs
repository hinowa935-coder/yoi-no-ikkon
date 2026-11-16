import fs from 'node:fs';
const review=JSON.parse(fs.readFileSync(new URL('../../docs/ga4/source-changes.json',import.meta.url)));
const allowed=new Set([
  'src/app/layout.jsx',
  'src/app/components/FoodBrowser.jsx',
  'src/app/components/DiscoveryFlow.jsx',
  'src/app/components/FoodRecommendations.jsx',
  'src/app/components/SakeCardPreview.jsx',
  'src/app/components/TrackedLink.jsx',
  'src/app/components/DetailAccordion.jsx',
  'src/app/components/LocalSakana.jsx',
  'src/app/components/AffiliateCommerce.jsx',
  'src/app/components/ProductWindow.jsx',
  'src/app/components/FoodExternalLink.jsx',
  'src/app/sake/[slug]/page.jsx',
  'scripts/netlify-export.mjs',
]);

export function reviewedGa4(file,beforeHash,afterHash,previousReview) {
  if (review.authorizedByAttachment!=='3ed34ada-0567-4cf4-8649-84c47cf363d2'||!allowed.has(file)) return false;
  return review.changes.some(change=>change.file===file&&change.afterSha256===afterHash&&(
    change.beforeSha256===beforeHash||previousReview?.(file,beforeHash,change.beforeSha256)
  ));
}
