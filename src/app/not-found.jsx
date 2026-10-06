import Link from "next/link";
import DiscoveryShell from "./components/DiscoveryShell.jsx";

export default function NotFound() {
  return <DiscoveryShell><section className="archived-product">
    <p className="section-kicker">404</p>
    <h1>ページが見つかりませんでした。</h1>
    <p className="muted-copy">アドレスが変わったか、掲載が終了しているかもしれません。</p>
    <div className="detail-actions"><Link className="yoi-button" href="/">トップへ戻る</Link><Link className="yoi-button" href="/food">料理から探す</Link></div>
  </section></DiscoveryShell>;
}
