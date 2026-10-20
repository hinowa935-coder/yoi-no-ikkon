"use client";

import { trackEvent } from "../../data/telemetry.js";
import { useRef, useState } from 'react';
import { Share2 } from 'lucide-react';
import { canonicalShareUrl, shareOrCopy } from '../../data/shareActions.js';

export default function ShareButton({ title, text, path, eventName = "share", label, ariaLabel }) {
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const share = async () => {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setMessage('');
    try {
      const url = canonicalShareUrl(path);
      const result = shareOrCopy({ title, text, url });
      trackEvent(eventName, { path: new URL(url).pathname });
      const outcome = await result;
      if (outcome === 'copied') {
        setMessage('リンクをコピーしました');
        trackEvent('share_link_copy', { path: new URL(url).pathname });
      } else if (outcome === 'failed') setMessage('共有できませんでした。もう一度お試しください。');
    } catch {
      setMessage('共有できませんでした。もう一度お試しください。');
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  return <div className="share-action">
    <button
      type="button"
      onClick={share}
      className="recommend-button"
      disabled={busy}
      aria-label={ariaLabel}
    >
      <Share2 size={18} strokeWidth={1.5} aria-hidden="true" />
      {label || (eventName === 'share_sake' ? 'この一献をシェアする' : eventName === 'share_food' ? 'この組み合わせをシェアする' : 'この夜をシェアする')}
    </button>
    <p className="share-status" role="status" aria-live="polite" aria-atomic="true">{message}</p>
  </div>;
}
