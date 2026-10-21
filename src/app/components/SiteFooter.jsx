import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { AMAZON_DISCLOSURE } from '../../commerce/providers.js';
import { PURCHASE_INFORMATION_NOTICE } from '../../commerce/purchaseNotice.js';
import { AFFILIATE_FOOTER_ACTIVE, AFFILIATE_FOOTER_INACTIVE } from '../../commerce/purchaseRouting.js';
import RakutenCredit from './RakutenCredit.jsx';

export default function SiteFooter({ disclosure }) {
  const sentences = PURCHASE_INFORMATION_NOTICE.split('。').filter(Boolean).map(sentence => sentence + '。');
  const paragraphs = [sentences.slice(0, 2).join(''), sentences.slice(2).join('')].filter(Boolean);
  return <footer className="discovery-footer" aria-label="サイトのご案内">
    <p className="footer-closing">今日という日の終わりに。</p>
    <nav className="footer-navigation" aria-label="フッターナビゲーション">
      <Link href="/">宵の一献</Link>
      <Link href="/about">宵の一献について</Link>
      <Link href="/about/advertising">運営・広告について</Link>
    </nav>
    <p className="footer-age">お酒は20歳になってから。</p>
    <section className="footer-affiliations" aria-label="広告・提携について">
      <h2>広告・提携について</h2>
      <p className="footer-disclosure">{disclosure.active ? AFFILIATE_FOOTER_ACTIVE : AFFILIATE_FOOTER_INACTIVE}</p>
      {disclosure.rakuten && <><p className="footer-disclosure">当サイトは楽天アフィリエイトを利用しています。</p><RakutenCredit /></>}
      {disclosure.amazon && <p className="footer-disclosure">{AMAZON_DISCLOSURE}</p>}
    </section>
    <details className="footer-purchase-notice">
      <summary><span>掲載情報・購入時のご注意</span><ChevronDown size={18} strokeWidth={1.5} aria-hidden="true" /></summary>
      <div className="footer-notice-body">{paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </details>
  </footer>;
}
