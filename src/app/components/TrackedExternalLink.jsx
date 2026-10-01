"use client";

import { trackEvent } from "../../data/siteData";

export default function TrackedExternalLink({
  href,
  children,
  className,
  event = "affiliate_click",
  parameters = {},
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => trackEvent(event, parameters)}
      className={className}
    >
      {children}
    </a>
  );
}
