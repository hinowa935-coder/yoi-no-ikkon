"use client";
import Link from "next/link";
import { trackEvent } from "../../data/telemetry.js";
import { trackAnalytics } from "../../data/analytics.js";
import {recordSakeEntry} from '../../commerce/entryTracking.js';
export default function TrackedLink({ href, event, parameters = {}, recommendationSelection, children, ...props }) {
  return <Link href={href} {...props} onClick={() => {
    recordSakeEntry(href);
    if(event)trackEvent(event, parameters);
    if(recommendationSelection)trackAnalytics('recommendation_select', recommendationSelection);
  }}>{children}</Link>;
}
