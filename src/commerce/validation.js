import { createHash } from "node:crypto";
import { parseFragment } from "parse5";
import { PROVIDERS, MARKETPLACES } from "./providers.js";
import { evaluateSkuMatchV2 } from "./skuPolicy.js";

export const MATCH_FIELDS = ["brand", "brewery", "productName", "classification", "rice", "polishing", "namaHiire", "limitedSeasonal", "vintage", "capacity"];
export const sha256 = value => createHash("sha256").update(value).digest("hex");
export function productFingerprint(item) {
  return sha256(JSON.stringify({ id: item.id, productName: item.productName, brandName: item.brandName, brewery: item.brewery, research: item.sakeResearch }));
}
export function isHttps(value, hosts) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && !u.username && !u.password && (!hosts || hosts.includes(u.hostname));
  } catch { return false; }
}
export function currentReview(review, now) {
  return review?.approved === true && typeof review.reviewedBy === "string" && review.reviewedBy.trim().length > 0 &&
    Number.isFinite(Date.parse(review.verifiedAt)) && Date.parse(review.verifiedAt) <= now &&
    Number.isFinite(Date.parse(review.validUntil)) && Date.parse(review.validUntil) > now && isHttps(review.sourceUrl);
}
export function matchIsConfirmed(match, item, now = Date.now()) {
  if (match?.policyVersion === 2) {
    const result = evaluateSkuMatchV2(match, now);
    return currentReview(match, now) && match.productFingerprint === productFingerprint(item) &&
      match.officialProductUrl === item.sakeResearch?.identity?.officialProductUrl &&
      (result.decision === "EXACT" && match.kind === "sameSku" || result.decision === "VARIANT" && match.kind === "capacityVariant");
  }
  return currentReview(match, now) && match.productFingerprint === productFingerprint(item) &&
    ["sameSku", "capacityVariant"].includes(match.kind) &&
    MATCH_FIELDS.every(field => {
      const check = match.checks?.[field];
      return check && ["matched", "notApplicable", ...(field === "capacity" && match.kind === "capacityVariant" ? ["capacityOnlyDifference"] : [])].includes(check.result) &&
        typeof check.meaning === "string" && check.meaning.trim().length > 0 && isHttps(check.sourceUrl);
    }) && (match.kind !== "capacityVariant" || match.sameContentsConfirmed === true);
}

// Parse for rejection only. Never serialize/sanitize approved provider HTML:
// doing so could alter tracking pixels, attributes or the advertising code.
export function staticCreativeIsSafe(html, hosts) {
  if (typeof html !== "string" || html.length > 50000) return false;
  let valid = true;
  let anchors = 0;
  const errors = [];
  const tree = parseFragment(html, { onParseError: error => errors.push(error) });
  const tags = new Set(["a", "img", "div", "span", "p", "br", "table", "tbody", "tr", "td"]);
  const attrs = new Set(["href", "src", "alt", "title", "target", "rel", "width", "height", "border", "style"]);
  function visit(node) {
    if (node.tagName) {
      if (!tags.has(node.tagName) || node.namespaceURI !== "http://www.w3.org/1999/xhtml") valid = false;
      if (node.tagName === "a") anchors++;
      for (const a of node.attrs || []) {
        if (!attrs.has(a.name)) valid = false;
        if (["href", "src"].includes(a.name) && !isHttps(a.value, hosts)) valid = false;
        if (a.name === "style" && /[\\@]|url\s*\(|expression|position\s*:|behavior|content\s*:|!important/i.test(a.value)) valid = false;
      }
      if (node.tagName === "a" && !(node.attrs || []).some(a => a.name === "href")) valid = false;
      if (node.tagName === "a") {
        const attributes = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
        // Modern _blank links implicitly isolate opener; explicit opt-in is unsafe.
        if (attributes.rel?.toLowerCase().split(/\s+/).includes("opener") ||
            (attributes.target && !["_blank", "_self"].includes(attributes.target.toLowerCase()))) valid = false;
      }
    } else if (!["#text", "#comment", "#document-fragment"].includes(node.nodeName)) valid = false;
    for (const child of node.childNodes || []) visit(child);
  }
  visit(tree);
  return valid && anchors > 0 && errors.length === 0;
}

export function resolveCreative(creative, approval, env, provider) {
  if (!creative || !/^AFFILIATE_[A-Z0-9_]+$/.test(creative.envKey || "")) return null;
  const value = env[creative.envKey];
  if (typeof value !== "string" || sha256(value) !== creative.sha256) return null;
  const hosts = [...provider.hosts, ...(approval.allowedHosts || [])];
  if (creative.mode === "url" && approval.customLinkAllowed === true && isHttps(value, hosts)) return { mode: "url", url: value };
  if (creative.mode === "html" && approval.staticHtmlAllowed === true && approval.mobileReviewed === true &&
      staticCreativeIsSafe(value, hosts)) return { mode: "html", html: value };
  return null;
}

export function projectOffers(item, registry, config, env = {}, now = Date.now()) {
  if (!config.enabled || !isHttps(config.registeredSite)) return [];
  const seen = new Set();
  const results = [];
  for (const o of registry.offers || []) {
    const provider = PROVIDERS[o.provider];
    if (o.entityType !== "sake" || o.entityId !== item.id || o.status !== "confirmed" || !provider ||
        !provider.marketplaces.includes(o.marketplace) || !config.enabledProviders.includes(o.provider) ||
        (o.marketplace !== "merchant" && config.routes[o.marketplace] !== o.provider) ||
        !currentReview(o.approval, now) || o.approval.registeredSite !== config.registeredSite ||
        !matchIsConfirmed(o.match, item, now) || !/^[a-zA-Z0-9_.:-]{1,100}$/.test(o.productId || "") ||
        !Number.isInteger(o.capacityMl) || o.capacityMl <= 0 || typeof o.storeName !== "string" || !o.storeName.trim()) continue;
    const creative = resolveCreative(o.creative, o.approval, env, provider);
    if (!creative) continue;
    const key = `${o.provider}:${o.productId}:${o.capacityMl}`;
    if (seen.has(key)) continue;
    seen.add(key);
    results.push({ provider: o.provider, marketplace: o.marketplace, storeName: o.storeName,
      productId: o.productId, sakeId: item.id, capacityMl: o.capacityMl,
      capacityVariant: o.match.kind === "capacityVariant", label: `${MARKETPLACES[o.marketplace]}で見る`,
      matchType: o.match.kind === "capacityVariant" ? "variant" : "exact", destinationType: "product_page", isAffiliate: true,
      validUntil: [o.approval.validUntil, o.match.validUntil].sort((a, b) => Date.parse(a) - Date.parse(b))[0], ...creative });
  }
  return results;
}

export function projectLabelImage(item, registry, offers, now = Date.now(), env = {}, config = { enabled: false }) {
  for (const image of registry.images || []) {
    if (image.standaloneCreative === true) {
      const provider = PROVIDERS[image.provider];
      if (image.provider !== "rakuten" || image.marketplace !== "rakuten" || !config.enabled || !provider || !config.enabledProviders?.includes(image.provider) ||
          !provider.marketplaces.includes(image.marketplace) || config.routes?.[image.marketplace] !== image.provider ||
          !isHttps(config.registeredSite) || image.permission?.registeredSite !== config.registeredSite ||
          image.status !== "confirmed" || image.entityType !== "sake" || image.entityId !== item.id ||
          image.sourceType !== "providerTool" || image.match?.policyVersion !== 2 || !matchIsConfirmed(image.match, item, now) ||
          !currentReview(image.permission, now) || image.permission.isAdvertisement !== true || image.permission.linkRequired !== true ||
          image.permission.resizeAllowed !== false || image.width !== 240 || image.height !== 240 ||
          typeof image.alt !== "string" || !image.alt.trim() || !Number.isInteger(image.capacityMl) || image.capacityMl <= 0 ||
          image.match.capacity?.retailerMl !== image.capacityMl || !/^[a-zA-Z0-9_.:-]{1,100}$/.test(image.productId || "") ||
          !Array.isArray(image.permission.allowedHosts) || image.permission.allowedHosts.length !== 2 ||
          !["hb.afl.rakuten.co.jp", "hbb.afl.rakuten.co.jp"].every(host => image.permission.allowedHosts.includes(host))) continue;
      const creative = resolveCreative(image.creative, image.permission, env, provider);
      if (creative?.mode !== "html" || !imageOnlyCreativeMatches(creative.html, image)) continue;
      return { ...creative, provider: image.provider, marketplace: image.marketplace, sakeId: item.id, productId: image.productId,
        matchType: image.match.kind === "capacityVariant" ? "variant" : "exact", destinationType: "product_page", isAffiliate: true,
        sourceType: image.sourceType, alt: image.alt, isAdvertisement: true, isLinkedCreative: true,
        notice: typeof image.publicNotice === "string" ? image.publicNotice : "",
        validUntil: [image.permission.validUntil, image.match.validUntil].sort((a, b) => Date.parse(a) - Date.parse(b))[0] };
    }
    if (image.entityType !== "sake" || image.entityId !== item.id || image.status !== "confirmed" ||
        !matchIsConfirmed(image.match, item, now) || !currentReview(image.permission, now) ||
        !["advertiserPermission", "ownedPhoto", "providerTool"].includes(image.sourceType) ||
        typeof image.alt !== "string" || !image.alt.trim() ||
        !Number.isInteger(image.width) || !Number.isInteger(image.height) || image.width <= 0 || image.height <= 0 ||
        (image.permission.resizeAllowed !== true && image.width > 295)) continue;
    const local = typeof image.src === "string" && /^\/images\/[a-zA-Z0-9/_-]+\.(png|jpg|jpeg|webp)$/.test(image.src) && !image.src.includes("..");
    if (!isHttps(image.src, image.permission.allowedHosts || []) && !(local && (image.sourceType === "ownedPhoto" || image.permission.storageAllowed === true))) continue;
    if (image.permission.isAdvertisement === true && !offers.some(o => o.provider === image.provider && o.productId === image.productId)) continue;
    if (image.sourceType === "providerTool" || image.permission.linkRequired) {
      // Image and text codes are generated independently; never extract/rebuild a link.
      const linked = offers.find(o => o.provider === image.provider && o.productId === image.productId);
      const creative = linked && resolveCreative(image.creative, image.permission, env, PROVIDERS[image.provider]);
      if (creative?.mode !== "html" || !staticCreativeContainsImage(creative.html, image.src)) continue;
      return { ...linked, ...creative, alt: image.alt, sourceType: image.sourceType, isAdvertisement: true, isLinkedCreative: true,
        validUntil: [linked.validUntil, image.permission.validUntil, image.match.validUntil].sort((a, b) => Date.parse(a) - Date.parse(b))[0] };
    }
    return { src: image.src, alt: image.alt, width: image.width, height: image.height,
      resizeAllowed: image.permission.resizeAllowed === true, sourceType: image.sourceType,
      isAdvertisement: image.permission.isAdvertisement === true,
      validUntil: [image.permission.validUntil, image.match.validUntil].sort((a, b) => Date.parse(a) - Date.parse(b))[0] };
  }
  return null;
}
function imageOnlyCreativeMatches(html, image) {
  let anchors = 0;
  let images = 0;
  let valid = true;
  function visit(node) {
    const attrs = Object.fromEntries((node.attrs || []).map(a => [a.name, a.value]));
    if (node.tagName === "a") {
      anchors++;
      valid &&= attrs.href === image.destinationAffiliateUrl && isHttps(attrs.href, ["hb.afl.rakuten.co.jp"]);
      try {
        valid &&= new URL(attrs.href).searchParams.get("pc") === image.match.candidateProductUrl;
      } catch { valid = false; }
    } else if (node.tagName === "img") {
      images++;
      valid &&= attrs.src === image.src && isHttps(attrs.src, image.permission.allowedHosts);
    } else if (node.tagName || node.nodeName === "#text" && node.value.trim()) valid = false;
    for (const child of node.childNodes || []) visit(child);
  }
  visit(parseFragment(html));
  return valid && anchors === 1 && images === 1;
}
function staticCreativeContainsImage(html, src) {
  let found = false;
  function visit(n) { if (n.tagName === "img" && n.attrs?.some(a => a.name === "src" && a.value === src)) found = true; for (const c of n.childNodes || []) visit(c); }
  visit(parseFragment(html));
  return found;
}
