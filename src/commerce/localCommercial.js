import fs from "node:fs";
import path from "node:path";
import { productFingerprint, sha256, isHttps } from "./validation.js";
import { classifyCommercial, current } from "../../scripts/lib/affiliate-commercial-match.mjs";

export const LOCAL_COMMERCIAL_SITE = "https://yoi-no-ikkon.vercel.app/";
export const LOCAL_COMMERCIAL_TARGETS = Object.freeze({
  "hakurakusei-tokubetsu-junmai": Object.freeze({ capacityMl: 720, itemCode: "hasegawasaketen:10000311", productUrl: "https://item.rakuten.co.jp/hasegawasaketen/1001412/" }),
  "kamo-kinshu-tokubetsu-junmai": Object.freeze({ capacityMl: 1800, itemCode: "meishu-honpo:10001492", productUrl: "https://item.rakuten.co.jp/meishu-honpo/050130/" }),
});

export function readLocalCommercialRegistry(env = {}, mode = "production") {
  if (mode !== "development" || env.AFFILIATE_PHASE4_LOCAL !== "true" ||
      !/^[a-f0-9]{64}$/.test(env.AFFILIATE_PHASE4_REGISTRY_SHA256 || "")) return null;
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), ".cache/affiliate/phase4/registry.json"));
    if (sha256(raw) !== env.AFFILIATE_PHASE4_REGISTRY_SHA256) return null;
    const registry = JSON.parse(raw);
    if (registry.schemaVersion !== 1 || registry.scope !== "local_validation" ||
        !Array.isArray(registry.commercialOffers) || registry.commercialOffers.length > 2 ||
        registry.commercialOffers.some(o => !LOCAL_COMMERCIAL_TARGETS[o.sakeId])) return null;
    return registry;
  } catch { return null; }
}

// Rejection only: originals are never rewritten, decoded into new links or logged.
export function publicAffiliateHrefIsSafe(value, env = {}) {
  if (typeof value !== "string" || value.length > 12000 || !isHttps(value, ["hb.afl.rakuten.co.jp", "a.r10.to"])) return false;
  const parsed = new URL(value);
  if (parsed.port || parsed.hash || /[\s\\\u0000-\u001f]/.test(value)) return false;
  const secrets = [env.RAKUTEN_APPLICATION_ID, env.RAKUTEN_ACCESS_KEY, env.RAKUTEN_AFFILIATE_ID].filter(s => typeof s === "string" && s.trim()).map(s => s.trim());
  if (secrets.length !== 3) return false;
  const forms = new Set([value]);
  for (let round = 0; round < 4; round++) {
    for (const form of [...forms]) {
      try { forms.add(decodeURIComponent(form)); } catch { /* Invalid encoding is checked below. */ }
      for (const fragment of form.match(/[A-Za-z0-9_+/-]{12,}={0,2}/g) || []) {
        try { forms.add(Buffer.from(fragment, "base64url").toString("utf8")); } catch { /* Not every URL segment is base64. */ }
      }
    }
  }
  if (/%(?![a-f0-9]{2})/i.test(value)) return false;
  return ![...forms].some(form => /(?:applicationId|accessKey|affiliateId)\s*[=:]/i.test(form) ||
    secrets.some(secret => [secret, encodeURIComponent(secret), Buffer.from(secret).toString("base64")].some(s => form.includes(s))));
}

export function projectLocalCommercialOffers(item, registry, config, env = {}, mode = "production", now = Date.now()) {
  if (mode !== "development" || env.AFFILIATE_PHASE4_LOCAL !== "true" || !registry ||
      !config?.enabled || config.registeredSite !== LOCAL_COMMERCIAL_SITE ||
      !config.enabledProviders?.includes("rakuten") || config.routes?.rakuten !== "rakuten" || !Array.isArray(registry.commercialOffers)) return [];
  const target = LOCAL_COMMERCIAL_TARGETS[item.id];
  if (!target) return [];
  const output = [];
  for (const o of registry.commercialOffers || []) {
    try {
    if (o.sakeId !== item.id || o.itemCode !== target.itemCode || o.productUrl !== target.productUrl ||
        o.capacityMl !== target.capacityMl || o.productName !== item.productName ||
        o.productFingerprint !== productFingerprint(item) || o.decision !== "COMMERCIAL_MATCH" ||
        classifyCommercial(o.review).decision !== "COMMERCIAL_MATCH" || Date.parse(o.review.reviewedAt) > now || o.review.capacityMl !== o.capacityMl ||
        !o.review.evidence.some(e => e.side === "retailer" && e.scope === "product" && e.sourceUrl === o.productUrl) ||
        !o.storeName?.trim()) continue;
    const { link, provenance, permission, localApproval, media } = o;
    const bound = r => r?.sakeId === o.sakeId && r.itemCode === o.itemCode && r.productFingerprint === o.productFingerprint &&
      r.capacityMl === o.capacityMl && r.productUrl === o.productUrl;
    if (!current(link, now) || !bound(link) || link.status !== "product_page" || link.finalProductUrl !== o.productUrl ||
        link.creativeHash !== sha256(o.affiliateUrl || "") || !link.desktopReviewed || !link.mobileReviewed ||
        !current(provenance, now) || !bound(provenance) || provenance.sourceTool !== "rakutenOfficialTool" ||
        provenance.originalUnmodified !== true || provenance.creativeHash !== link.creativeHash ||
        !current(permission, now) || permission.textLinkAllowed !== true || permission.registeredSite !== config.registeredSite ||
        !isHttps(permission.sourceUrl, ["affiliate.rakuten.co.jp"]) ||
        !current(media, now) || media.confirmed !== true || !media.confirmedBy?.trim() || media.registeredSite !== config.registeredSite ||
        !current(localApproval, now) || !bound(localApproval) || localApproval.scope !== "local_validation" ||
        localApproval.approved !== true || !localApproval.approvedBy?.trim() || localApproval.registeredSite !== config.registeredSite ||
        localApproval.creativeHash !== link.creativeHash || !publicAffiliateHrefIsSafe(o.affiliateUrl, env)) continue;
    output.push({ sakeId: item.id, provider: "rakuten", marketplace: "rakuten", productId: o.itemCode,
      capacityMl: o.capacityMl, storeName: o.storeName, capacityVariant: false,
      mode: "url", url: o.affiliateUrl, label: "楽天でこのお酒を見る", matchType: "commercial", destinationType: "product_page", isAffiliate: true,
      validUntil: [link, provenance, permission, localApproval, media].map(r => r.validUntil).sort((a,b) => Date.parse(a)-Date.parse(b))[0] });
    } catch { /* A malformed private record must not expose a link or break the detail page. */ }
  }
  return output.slice(0, 1);
}
