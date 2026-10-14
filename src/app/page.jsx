import { ChevronRight } from "./components/InterfaceIcons.jsx";
import DiscoveryShell from "./components/DiscoveryShell.jsx";
import LegacySearchRedirect from "./components/LegacySearchRedirect.jsx";
import TrackedLink from "./components/TrackedLink.jsx";
import DailyPick from "./components/DailyPick.jsx";

export default function Page() {
  return <DiscoveryShell>
    <LegacySearchRedirect />
    <section className="discovery-hero">
      <p className="section-kicker">日本酒 × 家庭料理</p>
      <h1><span>今<span className="yoi-accent">宵</span>、ひと<span className="yoi-accent">酔い</span>。</span><span>食卓に、<span className="yoi-accent">良い</span>出逢いを。</span></h1>
      <p className="hero-signature"><span className="yoi-accent">YOI</span> NO IKKON</p>
      <p className="hero-sub">料理や気分から、<br />まだ知らない一献へ。</p>
    </section>
    <section className="entrance-section">
      <h2>一献を探す。</h2>
      <div className="entrance-layout">
        <TrackedLink href="/discover" className="entrance-primary" event="discovery_start" parameters={{ source: "home" }}>
          <span><strong>夜の気分から</strong><small>過ごし方から、料理と一献を。</small></span><ChevronRight />
        </TrackedLink>
        <div className="entrance-secondary">
          <TrackedLink href="/food" event="discovery_start" parameters={{ source: "food" }}>
            <span><strong>料理から</strong><small>献立に合う一本を。</small></span><ChevronRight />
          </TrackedLink>
          <TrackedLink href="/search" event="search_opened">
            <span><strong>日本酒から</strong><small>気になる一本から、料理を。</small></span><ChevronRight />
          </TrackedLink>
        </div>
      </div>
    </section>
    <DailyPick />
  </DiscoveryShell>;
}
