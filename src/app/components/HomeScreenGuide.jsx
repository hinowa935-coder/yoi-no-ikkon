"use client";

import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Smartphone } from 'lucide-react';
import { homeGuidePlatform } from '../../data/shareActions.js';
import { trackEvent } from '../../data/telemetry.js';

export default function HomeScreenGuide({ compact = false }) {
  const [platform, setPlatform] = useState(null);
  useEffect(() => {
    const media = window.matchMedia('(display-mode: standalone)');
    const update = () => setPlatform(homeGuidePlatform(navigator.userAgent, media.matches || navigator.standalone === true));
    const installed = () => setPlatform(null);
    update();
    media.addEventListener('change', update);
    window.addEventListener('appinstalled', installed);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('appinstalled', installed);
    };
  }, []);

  if (!platform) return null;
  return <section className={`return-note home-screen-guide${compact ? ' is-compact' : ''}`} aria-label="ホーム画面への追加案内">
    {!compact && <h2><Smartphone size={20} strokeWidth={1.5} aria-hidden="true" />スマホでも、宵の一献を。</h2>}
    <p>{compact ? '気になる一献をよく見るなら、ホーム画面に置いておくと便利です。' : 'ホーム画面に置いておくと、今夜の一献をすぐ探せます。'}</p>
    <details onToggle={event => { if (event.currentTarget.open) trackEvent('pwa_guide_open', { placement: compact ? 'ochoko' : 'home', platform }); }} onKeyDown={event => {
      if (event.key === 'Escape' && event.currentTarget.open) {
        event.preventDefault();
        event.currentTarget.open = false;
        event.currentTarget.querySelector('summary').focus();
      }
    }}>
      <summary><span>{compact ? '追加方法を見る' : 'ホーム画面への追加方法'}</span><ArrowRight className="guide-arrow" size={16} aria-hidden="true" /><ChevronDown className="guide-chevron" size={16} aria-hidden="true" /></summary>
      <div className="home-guide-instructions">
        <h3>{platform === 'ios' ? 'iPhoneの場合' : 'Androidの場合'}</h3>
        {platform === 'ios' ? <ol><li>Safariで宵の一献を開きます。</li><li>Safariの共有ボタンを開き、「ホーム画面に追加」を選びます。</li><li>「追加」を押します。</li></ol> : <ol><li>ブラウザのメニューを開きます。</li><li>「ホーム画面に追加」または「アプリをインストール」を選びます。</li><li>画面の案内に沿って追加します。</li></ol>}
      </div>
    </details>
  </section>;
}
