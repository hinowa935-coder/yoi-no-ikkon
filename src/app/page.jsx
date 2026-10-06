import DiscoveryShell from "./components/DiscoveryShell.jsx";
import LegacySearchRedirect from "./components/LegacySearchRedirect.jsx";
import TrackedLink from "./components/TrackedLink.jsx";
import { daySeed } from "../data/discovery.js";
import DailyPick from "./components/DailyPick.jsx";

export default function Page() {
  return <DiscoveryShell><LegacySearchRedirect /><section className="discovery-hero"><p className="section-kicker">日本酒と家庭料理のペアリング</p><p className="hero-brand">宵の一献</p><h1><span>こんな夜なら、</span><span>なに食べよう。</span><span>なに飲もう。</span></h1><p className="hero-sub">料理と気分から、偶然いい酒に出会える場所。</p></section><section className="entrance-section"><h2>今夜、どう探す？</h2><div className="entrance-layout"><TrackedLink href="/discover" className="entrance-primary" event="discovery_start" parameters={{ source: "home" }}><span className="entrance-number">01</span><span><strong>今夜の気分から</strong><small>今夜の過ごし方から、料理と一杯を。</small></span><span aria-hidden="true">→</span></TrackedLink><div className="entrance-secondary"><TrackedLink href="/food" event="discovery_start" parameters={{ source: "food" }}><span><strong>料理から</strong><small>今夜の献立に合う一本を。</small></span><span aria-hidden="true">→</span></TrackedLink><TrackedLink href="/search" event="search_opened"><span><strong>日本酒から</strong><small>気になる一本から、今夜の料理を。</small></span><span aria-hidden="true">→</span></TrackedLink></div></div></section><DailyPick initialSeed={daySeed()} /></DiscoveryShell>;
}
