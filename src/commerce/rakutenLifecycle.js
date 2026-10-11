import { productFingerprint } from "./validation.js";
import { ordinaryUrlIsSafe } from "./purchaseRouting.js";

export const RAKUTEN_STAGED_STATUSES = ["NORMAL_LINK_ONLY", "NEEDS_SETUP", "UNVERIFIED", "UNAVAILABLE", "PENDING_APPROVAL"];

// Metadata can describe a pending creative, but can never authorize or expose it.
export function rakutenStagedState(item, ledger, now = Date.now()) {
  if (ledger?.schemaVersion !== 1 || !Array.isArray(ledger.links)) return null;
  const records = ledger.links.filter(r => r?.sakeId === item.id && r.productFingerprint === productFingerprint(item));
  if (records.length !== 1) return null;
  const row = records[0];
  if (!RAKUTEN_STAGED_STATUSES.includes(row.affiliateStatus) || row.registeredSite !== "https://yoi-no-ikkon.vercel.app/") return null;
  const current = Number.isFinite(Date.parse(row.verifiedAt)) && Date.parse(row.verifiedAt) <= now &&
    Number.isFinite(Date.parse(row.validUntil)) && Date.parse(row.validUntil) > now;
  const pending = row.affiliateStatus === "PENDING_APPROVAL";
  const confirmed = row.sourceTool === "rakutenOfficialTool" && row.formalUrlConfirmed === true &&
    row.originalUnmodified === true && /^[a-f0-9]{64}$/.test(row.creativeSha256 || "") &&
    row.desktopRedirectReviewed === true && row.mobileRedirectReviewed === true && row.identityReviewed === true;
  const normalSafe = ordinaryUrlIsSafe(row.normalUrl) && new URL(row.normalUrl).hostname === "item.rakuten.co.jp";
  const status = pending && (!current || !confirmed || !normalSafe) ? "UNVERIFIED" : row.affiliateStatus;
  // An expired advertising review disables advertising, not the saved ordinary URL.
  return { status, normalProducts: row.identityReviewed === true && normalSafe ? [{
    href: row.normalUrl, provider: "rakuten", affiliate: false, label: "楽天市場で商品を見る",
  }] : [] };
}
