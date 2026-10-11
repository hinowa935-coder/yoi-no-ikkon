import { evaluateSkuMatchV2 } from "./skuPolicy.js";

const confirmed = decision => ["EXACT", "VARIANT"].includes(decision);
const fresh = (value, now) => Number.isFinite(Date.parse(value?.verifiedAt)) && Date.parse(value.verifiedAt) <= now &&
  Number.isFinite(Date.parse(value?.validUntil)) && Date.parse(value.validUntil) > now;
const https = value => { try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } };

// Identity, stock, creative rights and operator approval are separate gates.
export function evaluateOffer(sake, offer, now = Date.now()) {
  const result = evaluateSkuMatchV2(offer?.identityReview, now);
  const attached = offer?.sakeId === sake.id && offer.identityReview?.entityId === sake.id &&
    offer.identityReview?.productFingerprint === sake.productFingerprint &&
    offer.identityReview?.officialProductUrl === sake.officialProductUrl &&
    offer.identityReview?.candidateProductUrl === offer.productUrl &&
    offer.identityReview?.capacity?.retailerMl === offer.capacityMl && Number.isInteger(offer.capacityMl) && offer.capacityMl > 0 &&
    typeof offer.provider === "string" && offer.provider.length > 0 && typeof offer.shopId === "string" && offer.shopId.length > 0;
  const identityConfirmed = attached && fresh(offer.identityReview, now) && confirmed(result.decision);
  const stock = offer?.sellability;
  const stockCurrent = fresh(stock, now) && stock?.sourceUrl === offer.productUrl && https(stock?.sourceUrl);
  const productConfirmed = stockCurrent && stock.pageIdentityConfirmed === true;
  const sellability = stockCurrent && stock.status === "UNAVAILABLE" && stock.purchaseUnavailableObserved === true ? "UNAVAILABLE" :
    productConfirmed && stock.status === "SELLABLE" && stock.purchaseActionObserved === true ? "SELLABLE" : "UNKNOWN";
  const link = offer?.affiliateValidation;
  const affiliateUsable = Boolean(offer?.affiliateUrl) && fresh(link, now) && link.status === "product_page" &&
    link.offerId === offer.id && link.finalProductUrl === offer.productUrl;
  const image = offer?.image;
  const imageUsable = Boolean(image && image.provider === offer.provider && image.offerId === offer.id &&
    image.sourceType === "providerApi" && https(image.url) && image.apiSnapshotUrl === image.url && image.visualVerified === true &&
    image.urlUnmodified === true && fresh(image, now));
  const primaryEligible = identityConfirmed && offer.purchaseKind === "singleBottle" && sellability === "SELLABLE" && imageUsable && affiliateUsable;
  const permission = image?.permission;
  const publishable = primaryEligible && offer.operatorApproved === true && fresh(permission, now) &&
    permission.approved === true && permission.provider === offer.provider && https(permission.sourceUrl) &&
    permission.registeredSite === sake.registeredSite && permission.placement === "providerIsolated" &&
    image.permission.linkRequired === true;
  const reviewCurrent = attached && fresh(offer.identityReview, now);
  return { identityConfirmed, decision: reviewCurrent ? result.decision : "CANDIDATE", confidence: reviewCurrent ? result.confidence : "low",
    capacityRelation: identityConfirmed ? "CAPACITY_VARIANT" : null, sellability, imageUsable, affiliateUsable, primaryEligible, publishable };
}

export function capacityVariants(sake, offers, now = Date.now()) {
  const variants = new Map();
  for (const offer of offers) {
    const evaluation = evaluateOffer(sake, offer, now);
    if (!evaluation.identityConfirmed) continue;
    const key = `${sake.id}:${offer.capacityMl}`;
    if (!variants.has(key)) variants.set(key, { id: key, sakeId: sake.id, capacityMl: offer.capacityMl, offers: [] });
    variants.get(key).offers.push({ offer, evaluation });
  }
  return [...variants.values()].sort((a, b) => a.capacityMl - b.capacityMl);
}

function capacityPreference(ml) {
  if (ml === 720) return [0, 0];
  if (ml >= 500 && ml <= 1000) return [1, Math.abs(ml - 720)];
  if (ml === 1800) return [2, 0];
  return [3, Math.abs(ml - 720)];
}
export function primaryOffer(sake, offers, now = Date.now(), { forPublication = false } = {}) {
  return offers.map(offer => ({ offer, evaluation: evaluateOffer(sake, offer, now) }))
    .filter(row => row.evaluation.primaryEligible && (!forPublication || row.evaluation.publishable))
    .sort((a, b) => {
      const x = capacityPreference(a.offer.capacityMl), y = capacityPreference(b.offer.capacityMl);
      return x[0] - y[0] || x[1] - y[1] || (a.evaluation.confidence === "high" ? 0 : 1) - (b.evaluation.confidence === "high" ? 0 : 1) ||
        String(a.offer.id).localeCompare(String(b.offer.id));
    })[0] || null;
}

export function optimizationCategory(officialStatus, offers, replacementConfirmed = false) {
  if (officialStatus !== "confirmed_current_product") return "D";
  if (offers.some(o => o.identityConfirmed)) return "A";
  return replacementConfirmed ? "B" : "C";
}

export function replacementDraft(old, newIdentity, officialEvidence) {
  if (!officialEvidence || officialEvidence.sourceType !== "breweryOfficial" || officialEvidence.scope !== "product" ||
      officialEvidence.acquisitionStatus !== "confirmed" || !https(officialEvidence.sourceUrl)) return null;
  // Different SKU: never copy taste, recipes, discovery or verified facts from the old product.
  return { oldSakeId: old.id, oldProduct: old.productName, newOfficialProduct: newIdentity.productName,
    officialUrl: officialEvidence.sourceUrl, identity: structuredClone(newIdentity), specs: {},
    verifiedFeatureTags: [], editorialTags: [], featureEvidence: [], taste: {}, serving: [], officialPairings: [], yoiPairings: [],
    nightTags: [], description: null, pairingImpact: "REBUILD_REQUIRED", nightTagImpact: "REBUILD_REQUIRED",
    descriptionImpact: "REBUILD_REQUIRED", replacementRecommendation: "NEEDS_REVIEW", applied: false };
}
