import { currentReview, isHttps, productFingerprint, sha256 } from "./validation.js";

export const STORE_ORDER = ["rakuten", "amazon", "yahoo"];
export const AFFILIATE_FOOTER_ACTIVE = "当サイトには広告・アフィリエイトリンクが含まれます。リンクを通じた購入により、運営者に紹介料が入る場合があります。";
export const AFFILIATE_FOOTER_INACTIVE = "アフィリエイトリンクを掲載する場合は、購入先の近くに「広告」と明示します。";

const affiliateHost = /(?:^|\.)(?:afl\.rakuten\.co\.jp|r10\.to|amzn\.to|moshimo\.com|valuecommerce\.com|a8\.net)$/i;
export function ordinaryUrlIsSafe(value) {
  if (!isHttps(value)) return false;
  const url = new URL(value);
  return !url.port && !affiliateHost.test(url.hostname) &&
    ![...url.searchParams.keys()].some(key => /^(?:tag|ascsubtag|affiliateId|applicationId|accessKey|af_id|a8|vc_url|sid|pid)$/i.test(key));
}

// This is an additional release gate, not a substitute for the existing SKU/ASP validators.
// Local pilot approvals never enter this ledger.
export function releaseApprovedOffer(item, offer, ledger, site, now = Date.now()) {
  const creative = offer.mode === "html" ? offer.html : offer.url;
  if (typeof creative !== "string" || ledger?.schemaVersion !== 1 || !Array.isArray(ledger.links) ||
      !Number.isFinite(Date.parse(offer.validUntil)) || Date.parse(offer.validUntil) <= now) return null;
  const review = ledger.links?.find(r => currentReview(r, now) && r.scope === "production" &&
    r.sakeId === item.id && r.productFingerprint === productFingerprint(item) &&
    r.provider === offer.provider && r.marketplace === offer.marketplace &&
    r.productId === (offer.productId || null) && r.capacityMl === (offer.capacityMl || null) &&
    r.destinationType === offer.destinationType && r.registeredSite === site &&
    r.creativeSha256 === sha256(creative) && r.generatedByOfficialTool === true &&
    r.originalUnmodified === true && r.programEligibilityConfirmed === true &&
    r.mediaRegistrationConfirmed === true && r.displayMethodAllowed === true &&
    r.desktopRedirectReviewed === true && r.mobileRedirectReviewed === true &&
    r.identityReviewed === true && ordinaryUrlIsSafe(r.finalUrl));
  if (!review) return null;
  return { ...offer, validUntil: [offer.validUntil, review.validUntil]
    .sort((a, b) => Date.parse(a) - Date.parse(b))[0] };
}

function storeOf(link) {
  if (link.provider) return link.provider;
  try {
    const host = new URL(link.href).hostname;
    if (host === "item.rakuten.co.jp") return "rakuten";
    if (["www.amazon.co.jp", "amazon.co.jp"].includes(host)) return "amazon";
    if (host === "store.shopping.yahoo.co.jp") return "yahoo";
  } catch { /* Invalid normal URLs are rejected below. */ }
  return "merchant";
}
const rank = link => link.destinationType === "product_page" ? (link.isAffiliate ? 0 : 1) :
  link.destinationType === "search_results" ? 3 : 2;
const storeRank = link => STORE_ORDER.indexOf(link.marketplace || link.provider) < 0 ? 3 : STORE_ORDER.indexOf(link.marketplace || link.provider);
const order = (a, b) => rank(a) - rank(b) || storeRank(a) - storeRank(b);

// Only already-public normal links and already-validated affiliate offers are accepted.
// No URLs are converted, tagged, or derived from a tracking URL.
export function selectPurchaseLinks(item, { offers = [], normalProducts = [], discoveryLinks = [], stagedStatuses = {} } = {}, now = Date.now()) {
  const normal = [
    ...normalProducts.filter(l => l.affiliate === false).map(l => ({ sakeId: item.id, provider: storeOf(l),
      url: l.href, label: l.label, capacityMl:l.capacityMl||null, isAffiliate: false, destinationType: "product_page" })),
    ...discoveryLinks.filter(l => l.isAffiliate === false),
  ].filter(l => ordinaryUrlIsSafe(l.url) && (!l.validUntil || Date.parse(l.validUntil) > now)).sort(order);
  const active = offers.filter(o => o.isAffiliate === true && (!o.affiliateStatus || o.affiliateStatus === "ACTIVE") && Date.parse(o.validUntil) > now).sort(order);
  const selectedOffers = active.filter(o => !normal.some(l => l.provider === (o.marketplace || o.provider) && rank(l) < rank(o)));
  const selectedNormal = normal.filter((l, index) => !selectedOffers.some(o => (o.marketplace || o.provider) === l.provider && rank(o) <= rank(l)) &&
    !normal.slice(0, index).some(other => other.url === l.url || other.provider === l.provider && rank(other) < rank(l)));
  const purchaseLinks = Object.fromEntries(STORE_ORDER.map(store => {
    const plain = normal.find(l => l.provider === store);
    const affiliate = selectedOffers.find(o => (o.marketplace || o.provider) === store);
    return [store, { normalUrl: plain?.url || null, affiliateUrl: affiliate?.mode === "url" ? affiliate.url : null,
      affiliateStatus: affiliate ? "ACTIVE" : ["NEEDS_SETUP", "UNVERIFIED", "PENDING_APPROVAL"].includes(stagedStatuses[store]) ? stagedStatuses[store] : plain ? "NORMAL_LINK_ONLY" : "UNAVAILABLE",
      destinationType: affiliate?.destinationType || plain?.destinationType || null,
      // HTML creatives are kept as originals; never extract/rebuild their URLs.
      hasAffiliateCreative: !!affiliate, source: plain?.destinationType === "product_page" ? "registeredPurchaseLink" : plain ? "generatedDiscoveryLink" : null }];
  }));
  return { offers: selectedOffers.map(o => ({ ...o,
    normalFallback: normal.find(l => l.provider === (o.marketplace || o.provider)) || null })),
    normalLinks: selectedNormal, purchaseLinks };
}
