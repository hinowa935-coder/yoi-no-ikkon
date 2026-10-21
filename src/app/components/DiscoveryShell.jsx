import Link from "next/link";
import { commerceDisclosureState } from "../../commerce/server.js";
import PrimaryNavigation from "./PrimaryNavigation.jsx";
import SiteFooter from './SiteFooter.jsx';

export default function DiscoveryShell({ children }) {
  const disclosure = commerceDisclosureState();
  return <main className="yoi-bg min-h-screen text-[#fff8e9]"><div className="discovery-shell"><header className="discovery-header"><Link href="/" className="brand"><span className="brand-roman">YOI NO IKKON</span><span>宵の一献</span></Link><PrimaryNavigation placement="header" /></header>{disclosure.active && <p className="site-advertising-note">当サイトにはアフィリエイトリンクが含まれます。</p>}{children}<SiteFooter disclosure={disclosure} /></div><PrimaryNavigation placement="bottom" /></main>;
}
