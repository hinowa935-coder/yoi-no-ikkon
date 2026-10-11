import Link from "next/link";
import { commerceDisclosureState } from "../../commerce/server.js";
import { AMAZON_DISCLOSURE } from "../../commerce/providers.js";
import { PURCHASE_INFORMATION_NOTICE } from "../../commerce/purchaseNotice.js";
import PrimaryNavigation from "./PrimaryNavigation.jsx";
import { AFFILIATE_FOOTER_ACTIVE, AFFILIATE_FOOTER_INACTIVE } from "../../commerce/purchaseRouting.js";

export default function DiscoveryShell({ children }) {
  const disclosure = commerceDisclosureState();
  return <main className="yoi-bg min-h-screen text-[#fff8e9]"><div className="discovery-shell"><header className="discovery-header"><Link href="/" className="brand"><span className="brand-roman">YOI NO IKKON</span><span>宵の一献</span></Link><PrimaryNavigation placement="header" /></header>{disclosure.active && <p className="site-advertising-note">当サイトにはアフィリエイトリンクが含まれます。</p>}{children}<footer className="discovery-footer"><p>今日という日の終わりに。</p><Link href="/">宵の一献</Link><Link href="/about/advertising">運営・広告について</Link><span>お酒は20歳になってから。</span><p className="footer-disclosure">{disclosure.active ? AFFILIATE_FOOTER_ACTIVE : AFFILIATE_FOOTER_INACTIVE}</p><p className="footer-disclosure">{PURCHASE_INFORMATION_NOTICE}</p>{disclosure.amazon && <p className="footer-disclosure">{AMAZON_DISCLOSURE}</p>}</footer></div><PrimaryNavigation placement="bottom" /></main>;
}
