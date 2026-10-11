// Audit-only v3. Never imported by the public application or used to update Sake facts.
const accepted = value => ["EXACT", "COMMERCIAL_MATCH"].includes(value);
const https = value => { try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; } };
export const current = (value, now) => Number.isFinite(Date.parse(value?.verifiedAt)) && Date.parse(value.verifiedAt) <= now &&
  Number.isFinite(Date.parse(value?.validUntil)) && Date.parse(value.validUntil) > now;

export function normalizeProductName(value, { brewery = "", brand = "" } = {}) {
  const clean = text => String(text || "").normalize("NFKC").toLowerCase()
    .replace(/純米大吟醸酒/g, "純米大吟醸").replace(/純米吟醸酒/g, "純米吟醸")
    .replace(/特別純米酒/g, "特別純米").replace(/純米酒/g, "純米")
    .replace(/大吟醸酒/g, "大吟醸").replace(/吟醸酒/g, "吟醸")
    .replace(/本醸造酒/g, "本醸造").replace(/無ろ過|無ろか/g, "無濾過")
    .replace(/火入れ/g, "火入").replace(/四合瓶/g, "720ml").replace(/一升瓶/g, "1800ml")
    .replace(/(^|[^\d])1\.8\s*l\b/g, (_, prefix) => `${prefix}1800ml`).replace(/(^|[^\d])0\.72\s*l\b/g, (_, prefix) => `${prefix}720ml`)
    .replace(/\d+(?:\.\d+)?\s*(?:ml|ミリリットル)/g, "")
    .replace(/[\s「」『』【】\[\]()（）・、。:：,／/\-―_]/g, "");
  let name = clean(value);
  const maker = clean(brewery), b = clean(brand);
  if (maker && maker !== b) name = name.replace(maker, "");
  // Only reposition a declared, observed brand; do not invent a missing brand.
  if (b && name.includes(b)) name = b + name.replace(b, "");
  return name;
}

export function classifyCommercial(review) {
  if (!review) return { decision: "CANDIDATE", confidence: "low", reason: "no_review" };
  if (review.majorConflicts?.length) return { decision: "REJECTED", confidence: "medium", reason: "explicit_major_conflict" };
  if (review.strictPreserved && ["EXACT", "VARIANT"].includes(review.strictDecision)) {
    return { decision: "EXACT", confidence: review.strictConfidence, reason: "preserved_v2_identity" };
  }
  const namesMatch = Boolean(review.officialName && review.retailName) &&
    normalizeProductName(review.officialName, review.nameContext) === normalizeProductName(review.retailName, review.nameContext);
  const evidence = review.evidence || [];
  const body = evidence.some(e => e.side === "retailer" && e.scope === "product" && e.acquisitionStatus === "confirmed_body_read" && https(e.sourceUrl));
  const official = evidence.some(e => e.side === "official" && ["product", "lineup"].includes(e.scope) && e.acquisitionStatus === "confirmed_body_read" && https(e.sourceUrl));
  const human = Boolean(review.reviewedBy?.trim() && Number.isFinite(Date.parse(review.reviewedAt)));
  const usable = id => evidence.some(e => e.id === id && e.acquisitionStatus === "confirmed_body_read" && https(e.sourceUrl) && e.meaning);
  const cores = ["brewery", "brand", "classification", "series"].every(k => review.core?.[k]?.matched === true && review.core[k].evidenceIds?.length && review.core[k].evidenceIds.every(usable));
  const guards = ["namaHiire", "genshu", "muroka", "origarami", "nigori", "aged", "limitedSeasonal", "vintage", "polishingDesign", "riceDesign"].every(k => {
    const g = review.guards?.[k];
    return g && ["matched", "unknown_not_suspected"].includes(g.result) && g.meaning && g.evidenceIds?.length && g.evidenceIds.every(usable);
  });
  const unresolved = (review.unresolvedIdentity || []).length > 0;
  const badDifference = (review.differences || []).some(d => d.disposition !== "tolerated" || !d.reason || !d.evidenceIds?.length ||
    d.evidenceIds.some(id => !usable(id)) ||
    (["polishing", "rice", "version"].includes(d.field) && d.sameContentsConfirmed !== true));
  if (!human || !body || !official || !namesMatch || !cores || !guards || unresolved || badDifference || review.purchaseKind !== "singleBottle" || !Number.isInteger(review.capacityMl) || review.capacityMl <= 0) {
    return { decision: "CANDIDATE", confidence: "low", reason: "identity_or_difference_unresolved", normalizedNamesMatch: namesMatch };
  }
  return { decision: "COMMERCIAL_MATCH", confidence: "medium", reason: "human_body_review_v3", normalizedNamesMatch: true };
}

export function textAffiliateGates(offer, now = Date.now()) {
  const identity = accepted(offer?.decision) && offer?.purchaseKind === "singleBottle" && Number.isInteger(offer?.capacityMl) && offer.capacityMl > 0 && Boolean(offer?.sakeId && offer?.shopId && offer?.offerId && offer?.productFingerprint) && https(offer?.registeredSite);
  const link = offer?.link;
  const destination = current(link, now) && link.status === "product_page" && link.offerId === offer.offerId && link.finalProductUrl === offer.productUrl && https(offer.productUrl);
  const provenance = offer?.affiliate?.originalProviderLink === true && offer.affiliate.provider === offer.provider && offer.affiliate.offerId === offer.offerId;
  const publicHrefSafe = offer?.affiliate?.publicHrefSecurityConfirmed === true;
  const terms = offer?.terms;
  const permission = current(terms, now) && terms.textLinkAllowed === true && terms.registrationConfirmed === true && terms.registeredSite === offer.registeredSite && https(terms.sourceUrl);
  const a = offer?.approval;
  const approved = current(a, now) && a.approved === true && Boolean(a.approvedBy?.trim()) && a.sakeId === offer.sakeId && a.offerId === offer.offerId && a.productFingerprint === offer.productFingerprint && a.registeredSite === offer.registeredSite;
  const stock = offer?.stock;
  const sellable = current(stock, now) && stock.status === "SELLABLE" && stock.offerId === offer.offerId && stock.sourceUrl === offer.productUrl && stock.purchaseActionObserved === true;
  // Viewing a product page need not claim availability; image permission is deliberately absent.
  return { identity, destination, provenance, publicHrefSafe, permission, approved, sellable,
    technicalDirectCandidate: identity && destination && provenance,
    publishableTextLink: identity && destination && provenance && publicHrefSafe && permission && approved,
    canClaimBuyable: identity && destination && provenance && publicHrefSafe && permission && approved && sellable };
}

const preference = ml => ml === 720 ? [0, 0] : ml >= 500 && ml <= 1000 ? [1, Math.abs(ml - 720)] : ml === 1800 ? [2, 0] : [3, Math.abs(ml - 720)];
export function selectCommercialPrimary(offers, now = Date.now(), { requireApproval = true } = {}) {
  return offers.filter(o => { const g = textAffiliateGates(o, now); return g.technicalDirectCandidate && g.sellable && (!requireApproval || g.publishableTextLink); })
    .sort((a,b) => { const x=preference(a.capacityMl), y=preference(b.capacityMl); return x[0]-y[0] || x[1]-y[1] || a.offerId.localeCompare(b.offerId); })[0] || null;
}
export function groupCommercialCapacities(offers) {
  const groups = new Map();
  for (const o of offers.filter(o=>accepted(o.decision) && Number.isInteger(o.capacityMl) && o.capacityMl > 0)) {
    const key = `${o.sakeId}:${o.capacityMl}`;
    if (!groups.has(key)) groups.set(key, { sakeId:o.sakeId, capacityMl:o.capacityMl, offers:[] });
    if (!groups.get(key).offers.some(x=>x.offerId===o.offerId)) groups.get(key).offers.push(o);
  }
  return [...groups.values()];
}

export function inspectCommerceUrl(value, expectedProvider) {
  let u;
  try { u = new URL(value); } catch { return { type:"missing_or_unknown", formatValid:false, trackingPresent:false, commissionEligibilityConfirmed:false }; }
  const valid = u.protocol === "https:" && !u.username && !u.password;
  const host = u.hostname;
  const search = host === "search.rakuten.co.jp" && u.pathname.startsWith("/search/mall/") || host === "www.amazon.co.jp" && u.pathname === "/s" && u.searchParams.has("k") || host === "shopping.yahoo.co.jp" && u.pathname === "/search" && u.searchParams.has("p");
  const normalProvider = ["search.rakuten.co.jp", "item.rakuten.co.jp"].includes(host) ? "rakuten" : ["amazon.co.jp", "www.amazon.co.jp"].includes(host) ? "amazon" : host === "shopping.yahoo.co.jp" ? "yahoo" : null;
  const providerMatched = !expectedProvider || normalProvider === expectedProvider;
  const tag = ["amazon.co.jp","www.amazon.co.jp"].includes(host) && Boolean(u.searchParams.get("tag"));
  const trackingHost = ["hb.afl.rakuten.co.jp","a.r10.to","amzn.to","ck.jp.ap.valuecommerce.com","af.moshimo.com","px.a8.net","rpx.a8.net"].includes(host);
  const trackingPresent = tag || trackingHost;
  // Short/redirect URLs need destination checks; presence never proves earning eligibility.
  const type = trackingHost ? "affiliate_destination_unverified" : tag ? search ? "affiliate_search" : "affiliate_individual" : search && providerMatched ? "ordinary_search" : "missing_or_unknown";
  return { type, formatValid:valid && (trackingPresent || (search && providerMatched)), trackingPresent,
    commissionEligibilityConfirmed:false, earningsMeasurementVerified:false };
}
