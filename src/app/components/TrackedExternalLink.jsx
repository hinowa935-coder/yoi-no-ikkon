"use client";

import { trackEvent } from "../../data/telemetry.js";

export default function TrackedExternalLink({
  href,
  children,
  className,
  event = "external_link_click",
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
