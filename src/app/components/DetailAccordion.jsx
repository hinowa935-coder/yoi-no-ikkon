"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { trackEvent } from "../../data/telemetry.js";

export default function DetailAccordion({ id, title, summary, defaultOpen = false, sakeId, section = id, className = "", children }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    if (sakeId) trackEvent(next ? "detail_accordion_open" : "detail_accordion_close", {
      sakeId, section, entrySource: "sake_detail"
    });
  };

  return <div className={`detail-accordion ${className}`}>
    <h2 id={id} className="detail-accordion-heading">
      <button type="button" id={`${id}-toggle`} aria-expanded={expanded} aria-controls={`${id}-content`} aria-labelledby={`${id}-title`} aria-describedby={summary ? `${id}-summary` : undefined} onClick={toggle}>
        <span className="detail-accordion-labels"><span id={`${id}-title`} className="detail-accordion-title">{title}</span>
          {summary && <span id={`${id}-summary`} className="detail-accordion-summary">{summary}</span>}
        </span>
        <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>
    </h2>
    <div hidden={!expanded} className="detail-accordion-content" id={`${id}-content`} aria-labelledby={`${id}-toggle`}>{children}</div>
  </div>;
}
