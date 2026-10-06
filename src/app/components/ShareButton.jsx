"use client";

import { trackEvent } from "../../data/telemetry.js";

export default function ShareButton({ title, text, path, eventName = "share" }) {
  const url =
    typeof window === "undefined"
      ? path
      : new URL(path, window.location.origin).toString();

  const share = async () => {
    trackEvent(eventName, { title, path });

    if (navigator.share) {
      await navigator.share({ title, text, url });
      return;
    }

    await navigator.clipboard.writeText(url);
  };

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full border border-[#d8bd7a]/35 px-4 py-2 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
    >
      この夜をシェアする
    </button>
  );
}
