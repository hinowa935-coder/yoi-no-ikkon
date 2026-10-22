"use client";

import { useState } from "react";
import { ChevronRight } from "lucide-react";

export default function DetailAccordion({ id, title, className = "", children }) {
  const [expanded, setExpanded] = useState(false);

  return <details className={`detail-accordion ${className}`} onToggle={event => setExpanded(event.currentTarget.open)}>
    <summary id={`${id}-toggle`} aria-expanded={expanded} aria-controls={`${id}-content`}>
      <h2>{title}を{expanded ? "閉じる" : "見る"}</h2>
      <ChevronRight size={18} strokeWidth={1.5} aria-hidden="true" />
    </summary>
    <div className="detail-accordion-content" id={`${id}-content`} aria-labelledby={`${id}-toggle`}>{children}</div>
  </details>;
}
