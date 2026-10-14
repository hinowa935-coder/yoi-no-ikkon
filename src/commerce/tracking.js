import { trackEvent } from "../data/telemetry.js";
import {emitAffiliateClick} from './entryTracking.js';

export function affiliateEvent(name, offer, emit = trackEvent) {
  if (!["affiliate_section_viewed", "affiliate_offer_clicked"].includes(name)) return;
  const properties = { sakeId: offer.sakeId, provider: offer.provider };
  if (offer.productId !== undefined) properties.productId = offer.productId;
  properties.sourcePage = "sake_detail";
  if (offer.matchType !== undefined) {
    if (!["exact", "variant", "commercial", "search", "official"].includes(offer.matchType)) return;
    properties.matchType = offer.matchType;
  }
  if (offer.destinationType !== undefined) {
    if (!["product_page", "search_results", "dealer_directory", "official_store", "official_site", "retailer"].includes(offer.destinationType)) return;
    properties.destinationType = offer.destinationType;
  }
  if (typeof offer.isAffiliate === "boolean") properties.linkKind = offer.isAffiliate ? "affiliate" : "ordinary";
  if (Object.values(properties).some(v => typeof v !== "string" || !/^[a-zA-Z0-9_.:-]{1,100}$/.test(v))) return;
  emit(name, properties);
}
export function observeAffiliate(element, offer, emit = trackEvent) {
  if (!element) return () => {};
  if (Date.parse(offer.validUntil) <= Date.now()) { element.hidden = true; return () => {}; }
  const click = event => {
    if (!event.target.closest?.("a")) return;
    if (Date.parse(offer.validUntil) <= Date.now()) { event.preventDefault(); element.hidden = true; return; }
    affiliateEvent("affiliate_offer_clicked", offer, emit);
    emitAffiliateClick(offer,emit);
  };
  element.addEventListener("click", click);
  element.addEventListener("auxclick", click);
  let observer;
  if (typeof IntersectionObserver !== "undefined") {
    observer = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) {
        affiliateEvent("affiliate_section_viewed", offer, emit);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(element);
  }
  return () => { observer?.disconnect(); element.removeEventListener("click", click); element.removeEventListener("auxclick", click); };
}
