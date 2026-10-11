"use client";
import { useEffect, useRef } from "react";
import { observeAffiliate } from "../../commerce/tracking.js";

export default function AffiliateTracker({ offer, children }) {
  const ref = useRef(null);
  const { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate } = offer;
  useEffect(() => observeAffiliate(ref.current, { sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate }), [sakeId, provider, productId, validUntil, matchType, destinationType, isAffiliate]);
  return <div ref={ref} className="affiliate-offer">{children}</div>;
}
