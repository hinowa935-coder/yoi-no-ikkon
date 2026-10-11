import { isHttps, productFingerprint, matchIsConfirmed } from "./validation.js";

export const SEARCH_PROVIDERS = {
  amazon: { name: "Amazon", host: "www.amazon.co.jp" },
  rakuten: { name: "楽天市場", host: "search.rakuten.co.jp" },
  yahoo: { name: "Yahoo!ショッピング", host: "shopping.yahoo.co.jp" },
};
export const CANDIDATE_SOURCE_TYPES = [
  "breweryOfficial", "specialistRetailer", "trustedRetailer", "industryAssociation",
  "industryOrganization", "government", "publicInstitution", "specialistMedia", "specialistDatabase",
];

// Only canonical catalog records are passed here; never use the search form input.
// Retain rice, processing and BY qualifiers rather than broadening to a different SKU.
export function purchaseQuery(item) {
  if (!item?.id || !item.productName?.trim() || !item.brandName?.trim() || item.needsIdentification) return null;
  const name = item.productName.normalize("NFKC").replace(/\s+/g, " ").trim();
  const brand = item.brandName.normalize("NFKC").trim();
  const query = name.includes(brand) ? name : `${brand} ${name}`;
  return brand.length === 1 ? `日本酒 ${query}` : query;
}

export function ordinarySearchUrl(provider, query) {
  if (!SEARCH_PROVIDERS[provider] || typeof query !== "string" || !query.trim() || query.length > 160) return null;
  const encoded = encodeURIComponent(query);
  if (provider === "amazon") return `https://www.amazon.co.jp/s?k=${encoded}`;
  if (provider === "rakuten") return `https://search.rakuten.co.jp/search/mall/${encoded}/`;
  return `https://shopping.yahoo.co.jp/search?p=${encoded}`;
}

export function projectDiscoveryLinks(item, record, templates, now = Date.now(), disabled = []) {
  if (!record || record.sakeId !== item.id || record.productFingerprint !== productFingerprint(item)) return [];
  const query = purchaseQuery(item);
  const links = [];
  for (const provider of Object.keys(SEARCH_PROVIDERS)) {
    const review = templates?.[provider];
    const offer = record.offers?.[provider];
    if (disabled.includes(provider) || !query || offer?.status !== "confirmed" || offer.matchType !== "search" ||
        offer.query !== query || review?.status !== "confirmed" || review.isAffiliate !== false ||
        !Number.isFinite(Date.parse(review.verifiedAt)) || Date.parse(review.verifiedAt) > now ||
        !Number.isFinite(Date.parse(review.validUntil)) || Date.parse(review.validUntil) <= now) continue;
    const url = ordinarySearchUrl(provider, query);
    if (offer.url !== url) continue;
    links.push({ sakeId: item.id, provider, matchType: "search", destinationType: "search_results",
      isAffiliate: false, url, label: `${SEARCH_PROVIDERS[provider].name}でこのお酒を探す`, validUntil: review.validUntil });
  }
  for (const offer of [...(record.offers?.official || []), ...(record.offers?.specialtyRetailer || [])]) {
    if (disabled.includes(offer.provider) || offer.status !== "confirmed" || offer.isAffiliate !== false ||
        !["official", "specialtyRetailer"].includes(offer.provider) ||
        !isHttps(offer.url, offer.allowedHosts || []) ||
        !Number.isFinite(Date.parse(offer.verifiedAt)) || Date.parse(offer.verifiedAt) > now ||
        !Number.isFinite(Date.parse(offer.validUntil)) || Date.parse(offer.validUntil) <= now ||
        !isHttps(offer.sourceUrl) || !offer.reviewedBy?.trim()) continue;
    if (offer.matchType === "official") {
      if (!["dealer_directory", "official_store", "retailer"].includes(offer.destinationType) || !offer.relationshipEvidence?.trim()) continue;
    } else if (!["exact", "variant"].includes(offer.matchType) || offer.destinationType !== "product_page" ||
        typeof offer.storeName !== "string" || !offer.storeName.trim() || !matchIsConfirmed(offer.match, item, now) ||
        (offer.matchType === "variant") !== (offer.match.kind === "capacityVariant")) continue;
    links.push({ sakeId: item.id, provider: offer.provider, matchType: offer.matchType, destinationType: offer.destinationType,
      isAffiliate: false, url: offer.url, label: offer.matchType === "official" ? "蔵元・取扱店を確認する" : `${offer.storeName}で見る`,
      validUntil: offer.validUntil, capacityMl: offer.capacityMl });
  }
  return links;
}

export function coverageStatus(links) {
  return ["exact", "variant", "search", "official"].find(type => links.some(link => link.matchType === type)) || "unavailable";
}

export function coverageMetrics(records) {
  const counts = Object.fromEntries(["exact", "variant", "search", "official", "unavailable"].map(s => [s, 0]));
  const providers = Object.fromEntries([...Object.keys(SEARCH_PROVIDERS), "official", "specialtyRetailer"].map(s => [s, 0]));
  let candidates = 0, rejected = 0, images = 0;
  for (const record of records) {
    counts[record.matchStatus]++;
    if (record.imageAvailable) images++;
    for (const provider of Object.keys(providers)) {
      const offers = Array.isArray(record.offers[provider]) ? record.offers[provider] : [record.offers[provider]];
      if (record.publicDiscoveryProviders ? record.publicDiscoveryProviders.includes(provider) || record.activeAffiliateOffers?.some(o => o.marketplace === provider) : offers.some(o => o?.status === "confirmed")) providers[provider]++;
    }
    for (const o of record.candidates || []) { if (o.status === "candidate") candidates++; if (o.status === "rejected") rejected++; }
  }
  const total = records.length;
  const ratio = count => total ? count / total : 0;
  return { total, counts, providers, candidates, rejected, images,
    exactCoverage: ratio(counts.exact), directPurchaseCoverage: ratio(counts.exact + counts.variant),
    searchCoverage: ratio(counts.exact + counts.variant + counts.search),
    totalPurchaseDiscoveryCoverage: ratio(total - counts.unavailable), imageCoverage: ratio(images) };
}
