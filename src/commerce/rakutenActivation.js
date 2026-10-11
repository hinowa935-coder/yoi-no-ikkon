import { productFingerprint, sha256 } from "./validation.js";
import { releaseApprovedOffer } from "./purchaseRouting.js";
import { rakutenStagedState } from "./rakutenLifecycle.js";
import { publicAffiliateHrefIsSafe } from "./localCommercial.js";
import { classifyCommercial, normalizeProductName } from "../../scripts/lib/affiliate-commercial-match.mjs";

// Independent commercial identity + original creative + explicit production release approval.
// A pending record or a local pilot approval alone is never sufficient.
export function projectApprovedRakutenLink(item, staged, approvals, config, env = {}, now = Date.now()) {
  try {
    if (!config?.enabled || config.registeredSite !== "https://yoi-no-ikkon.vercel.app/" ||
        !config.enabledProviders?.includes("rakuten") || config.routes?.rakuten !== "rakuten") return null;
    if (rakutenStagedState(item, staged, now)?.status !== "PENDING_APPROVAL") return null;
    const row = staged.links.find(r => r.sakeId === item.id && r.productFingerprint === productFingerprint(item));
    const identity = row.identityReview;
    if (classifyCommercial(identity).decision !== "COMMERCIAL_MATCH" || identity.capacityMl !== row.capacityMl ||
        normalizeProductName(identity.officialName, identity.nameContext) !== normalizeProductName(item.productName, identity.nameContext) ||
        Date.parse(identity.reviewedAt) > now || sha256(JSON.stringify(identity)) !== row.identityReviewSha256 ||
        !identity.evidence.some(e => e.side === "retailer" && e.scope === "product" && e.sourceUrl === row.normalUrl) ||
        !/^AFFILIATE_[A-Z0-9_]+$/.test(row.creativeEnvKey || "")) return null;
    const url = env[row.creativeEnvKey];
    if (!publicAffiliateHrefIsSafe(url, env) || sha256(url) !== row.creativeSha256) return null;
    return releaseApprovedOffer(item, { sakeId: item.id, provider: "rakuten", marketplace: "rakuten",
      productId: row.itemCode, capacityMl: row.capacityMl, storeName: row.storeName, capacityVariant: false,
      mode: "url", url, label: `楽天市場で${item.productName}を見る`, matchType: "commercial",
      destinationType: "product_page", isAffiliate: true, validUntil: row.validUntil }, approvals, config.registeredSite, now);
  } catch { return null; }
}
