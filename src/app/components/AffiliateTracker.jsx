"use client";
import { useEffect, useRef } from "react";
import { observeAffiliate } from "../../commerce/tracking.js";

export default function AffiliateTracker({ offer, children }) {
  const ref = useRef(null);
  const { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture } = offer;
  useEffect(() => observeAffiliate(ref.current, { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture }), [sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate,matchConfidence,sakeName,prefecture]);
  return <div ref={ref} className="affiliate-offer">{children}</div>;
}
