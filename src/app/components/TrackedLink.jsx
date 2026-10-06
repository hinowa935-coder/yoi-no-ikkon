"use client";
import Link from "next/link";
import { trackEvent } from "../../data/telemetry.js";
export default function TrackedLink({ href, event, parameters = {}, children, ...props }) {
  return <Link href={href} {...props} onClick={() => event && trackEvent(event, parameters)}>{children}</Link>;
}
