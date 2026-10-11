export const IDENTITY_FIELDS = ["brewery", "brand", "productName", "series", "classification"];
export const IDENTITY_GUARDS = ["namaHiire", "genshu", "muroka", "origarami", "nigori", "aged", "limitedSeasonal", "vintage", "polishingDesign", "riceDesign"];
const VARIABLE_SPECS = new Set(["alcohol", "nihonshudo", "acidity", "aminoAcidValue", "riceVariety", "yeast"]);
const SOURCE_TYPES = new Set(["breweryOfficial", "industry", "retailer", "specialistMedia"]);
const isHttps = value => {
  try { const u = new URL(value); return u.protocol === "https:" && !u.username && !u.password; } catch { return false; }
};
const meaningful = value => typeof value === "string" && value.trim().length > 0;

// Validate an evidence-backed review, not an automatic similarity score.
export function evaluateSkuMatchV2(review, now = Date.now()) {
  const differences = structuredClone(Array.isArray(review?.differences) ? review.differences : []);
  const outcome = (decision, reason, confidence = "low") => ({ decision, confidence, reason, differences });
  if (review?.policyVersion !== 2 || !meaningful(review.rationale) ||
      !["productLine", "specificVintage"].includes(review.identityScope) || !Array.isArray(review.differences) ||
      !Array.isArray(review.evidence)) return outcome("CANDIDATE", "Incomplete v2 review");
  const sources = new Map();
  for (const source of review.evidence || []) {
    if (!source || !meaningful(source.id) || sources.has(source.id) || !isHttps(source.sourceUrl) ||
        !["official", "retailer"].includes(source.side) ||
        !SOURCE_TYPES.has(source.sourceType) || source.acquisitionStatus !== "confirmed" ||
        !["product", "brand", "lineup", "visual"].includes(source.scope) || !meaningful(source.meaning) ||
        !Number.isFinite(Date.parse(source.verifiedAt)) || Date.parse(source.verifiedAt) > now) return outcome("CANDIDATE", "Invalid or failed evidence");
    sources.set(source.id, source);
  }
  const referenced = ids => Array.isArray(ids) && ids.length > 0 && ids.every(id => sources.has(id));
  const bothSides = ids => referenced(ids) && ids.some(id => sources.get(id).side === "official") && ids.some(id => sources.get(id).side === "retailer");
  const guards = IDENTITY_GUARDS.map(field => review.identityChecks?.[field]);
  const core = IDENTITY_FIELDS.map(field => review.identityChecks?.[field]);
  const majorDifferences = differences.some(d => d?.severity === "major" || [...IDENTITY_FIELDS, ...IDENTITY_GUARDS].includes(d?.field));
  const explicitConflict = [...core, ...guards].some(c => c?.result === "conflict" ||
    (c?.official != null && c?.retailer != null && c.official !== c.retailer));
  if (majorDifferences || explicitConflict) return outcome("REJECTED", "Major identity conflict");
  if (!core.every(c => c?.result === "matched" && meaningful(c.official) && meaningful(c.retailer) && meaningful(c.meaning) && bothSides(c.evidenceIds))) {
    return outcome("CANDIDATE", "Core product identity not confirmed", "medium");
  }
  const officialProduct = [...sources.values()].some(s => s.side === "official" && s.scope === "product" && s.sourceType === "breweryOfficial" && s.sourceUrl === review.officialProductUrl);
  const retailerProduct = [...sources.values()].some(s => s.side === "retailer" && s.scope === "product" && s.sourceUrl === review.candidateProductUrl);
  if (!officialProduct || !retailerProduct) return outcome("CANDIDATE", "Product-level evidence required");
  const visual = review.visualEvidence;
  const visualConfirmed = visual?.result === "consistent" && visual.method === "manualInspection" &&
    bothSides(visual.evidenceIds) && Array.isArray(visual.observations) && visual.observations.length > 0 &&
    visual.observations.every(meaningful) && Array.isArray(visual.limitations);
  if (!visualConfirmed) return outcome("CANDIDATE", "Visual inspection missing or unresolved", "medium");
  let contextual = false;
  for (let index = 0; index < guards.length; index++) {
    const field = IDENTITY_GUARDS[index];
    const check = guards[index];
    if (!check || !meaningful(check.meaning) || !bothSides(check.evidenceIds)) return outcome("CANDIDATE", `Missing identity guard: ${field}`, "medium");
    if (check.result === "matched") {
      if (check.official == null || check.retailer == null || check.official !== check.retailer) return outcome("CANDIDATE", `Unresolved guard: ${field}`, "medium");
    } else if (check.result === "supported") {
      // Context can support standard-product identity, but never overwrite null DB facts.
      if (!visualConfirmed || !meaningful(check.resolution) || !check.evidenceIds.some(id =>
          ["brand", "lineup"].includes(sources.get(id).scope) && sources.get(id).side === "official")) return outcome("CANDIDATE", `Insufficient contextual resolution: ${field}`, "medium");
      contextual = true;
    } else if (check.result === "notApplicable" && field === "vintage" && review.identityScope === "productLine") {
      if (!meaningful(check.resolution) || check.official != null || check.retailer != null) return outcome("CANDIDATE", "Specific BY cannot be waived");
    } else return outcome("CANDIDATE", `Unknown identity guard: ${field}`, "medium");
  }
  const capacity = review.capacity;
  if (!capacity || !bothSides(capacity.evidenceIds) || !meaningful(capacity.meaning) ||
      !Number.isInteger(capacity.retailerMl) || capacity.retailerMl <= 0) return outcome("CANDIDATE", "Capacity evidence missing");
  if (capacity.mode === "capacityIndependent") {
    if (!Array.isArray(capacity.officialSizesMl) || !capacity.officialSizesMl.includes(capacity.retailerMl)) return outcome("CANDIDATE", "Sale size not confirmed for product line");
  } else if (capacity.mode === "sameCapacity") {
    if (!Number.isInteger(capacity.registeredMl) || capacity.registeredMl <= 0 || capacity.registeredMl !== capacity.retailerMl) return outcome("CANDIDATE", "Capacity mismatch is not exact");
  } else if (capacity.mode === "capacityOnlyDifference") {
    if (capacity.sameContentsConfirmed !== true || !Number.isInteger(capacity.registeredMl) ||
        capacity.registeredMl <= 0 || capacity.registeredMl === capacity.retailerMl) return outcome("CANDIDATE", "Same contents required for variant");
  } else return outcome("CANDIDATE", "Unknown capacity scope");
  const hasVariationNote = ids => referenced(ids) && ids.some(id => {
    const source = sources.get(id);
    return source.side === "official" && source.sourceType === "breweryOfficial" && source.scope === "product" &&
      source.variationStatement === true;
  });
  for (const difference of differences) {
    if (!difference || !meaningful(difference.field) || !meaningful(difference.interpretation) ||
        !bothSides(difference.evidenceIds) || difference.official == null || difference.retailer == null) return outcome("CANDIDATE", "Incomplete difference log");
    if (difference.disposition === "possibleAnnualVariation" && VARIABLE_SPECS.has(difference.field)) {
      if (!visualConfirmed || !hasVariationNote(difference.variationEvidenceIds) || difference.causeConfirmed !== false) return outcome("CANDIDATE", "Numerical difference lacks variation context", "medium");
      contextual = true;
    } else if (difference.disposition === "unresolvedNotation" && difference.field === "riceNotation" &&
        difference.causeConfirmed === false && difference.identityImpact === "notProductDesign" && meaningful(difference.resolution)) {
      contextual = true;
    } else return outcome("CANDIDATE", "Unexplained specification difference", "medium");
  }
  const decision = capacity.mode === "capacityOnlyDifference" ? "VARIANT" : "EXACT";
  const confidence = contextual ? "medium" : "high";
  if (review.decision !== decision || review.confidence !== confidence) return outcome("CANDIDATE", "Claimed decision does not match evidence gates", "medium");
  return outcome(decision, review.rationale, confidence);
}
