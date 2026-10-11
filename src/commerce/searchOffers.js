import { PROVIDERS, MARKETPLACES } from "./providers.js";
import { currentReview, resolveCreative, productFingerprint, isHttps } from "./validation.js";
import { purchaseQuery } from "./discovery.js";

// Search creatives need their own permission and query review, not a fictional SKU match.
export function projectSearchOffers(item, registry, config, env = {}, now = Date.now()) {
  if (!config.enabled || !isHttps(config.registeredSite)) return [];
  const results = [];
  const seen = new Set();
  const query = purchaseQuery(item);
  if (!query) return [];
  for (const offer of registry.searchOffers || []) {
    const provider = PROVIDERS[offer.provider];
    if (offer.entityType !== "sake" || offer.entityId !== item.id || offer.status !== "confirmed" || !provider ||
        !provider.marketplaces.includes(offer.marketplace) || !["amazon", "rakuten", "yahoo"].includes(offer.marketplace) ||
        !config.enabledProviders.includes(offer.provider) || config.routes[offer.marketplace] !== offer.provider ||
        !currentReview(offer.approval, now) || offer.approval.registeredSite !== config.registeredSite ||
        offer.approval.searchLinkAllowed !== true || !currentReview(offer.queryReview, now) ||
        offer.queryReview.productFingerprint !== productFingerprint(item) || offer.queryReview.query !== query ||
        offer.queryReview.destinationType !== "search_results") continue;
    const creative = resolveCreative(offer.creative, offer.approval, env, provider);
    if (!creative || seen.has(offer.marketplace)) continue;
    seen.add(offer.marketplace);
    results.push({ sakeId: item.id, provider: offer.provider, marketplace: offer.marketplace, storeName: MARKETPLACES[offer.marketplace],
      matchType: "search", destinationType: "search_results", isAffiliate: true,
      label: `${MARKETPLACES[offer.marketplace]}でこのお酒を探す`,
      validUntil: [offer.approval.validUntil, offer.queryReview.validUntil].sort((a, b) => Date.parse(a) - Date.parse(b))[0], ...creative });
  }
  return results;
}
