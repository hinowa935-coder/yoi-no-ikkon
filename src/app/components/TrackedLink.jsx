"use client";
import Link from "next/link";
import { trackEvent } from "../../data/telemetry.js";
import {recordSakeEntry} from '../../commerce/entryTracking.js';
export default function TrackedLink({ href, event, parameters = {}, children, ...props }) {
  return <Link href={href} {...props} onClick={() => {recordSakeEntry(href);if(event)trackEvent(event, parameters);}}>{children}</Link>;
}
