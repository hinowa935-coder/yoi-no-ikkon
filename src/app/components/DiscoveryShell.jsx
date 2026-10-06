import Link from "next/link";

export default function DiscoveryShell({ children }) {
  return <main className="yoi-bg min-h-screen text-[#fff8e9]"><div className="discovery-shell"><header className="discovery-header"><Link href="/" className="brand"><span className="brand-roman">YOI NO IKKON</span><span>宵の一献</span></Link><nav aria-label="メインナビゲーション"><Link href="/search">日本酒を探す</Link><Link href="/ochoko" className="nav-ochoko"><img src="/favicon.svg" alt="" width="22" height="22" />おちょこ</Link></nav></header>{children}<footer className="discovery-footer"><p>今日という日の終わりに。</p><Link href="/">宵の一献</Link><span>お酒は20歳になってから。</span></footer></div></main>;
}
