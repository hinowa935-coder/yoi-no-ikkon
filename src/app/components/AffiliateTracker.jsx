"use client";
import { useEffect, useRef } from "react";
import { observeAffiliate } from "../../commerce/tracking.js";

export default function AffiliateTracker({ offer, children }) {
  const ref = useRef(null);
  const { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture,hasTimedFallback } = offer;
  useEffect(() => observeAffiliate(ref.current, { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture,hasTimedFallback }), [sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture,hasTimedFallback]);
  return <div ref={ref} className="affiliate-offer">{children}</div>;
}
