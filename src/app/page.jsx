import DiscoveryShell from "./components/DiscoveryShell.jsx";
import LegacySearchRedirect from "./components/LegacySearchRedirect.jsx";
import DailyPick from "./components/DailyPick.jsx";
import HomeNightChoices from './components/HomeNightChoices.jsx';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { homeAbout } from './about/content.js';

export default function Page() {
  return <DiscoveryShell>
    <LegacySearchRedirect />
    <section className="discovery-hero">
      <p className="section-kicker">日本酒 × 家庭料理</p>
      <h1><span>今<span className="yoi-accent">宵</span>、ひと<span className="yoi-accent">酔い</span>。</span><span>食卓に、<span className="yoi-accent">良い</span>出逢いを。</span></h1>
      <p className="hero-signature"><span className="yoi-accent">YOI</span> NO IKKON</p>
      <p className="hero-sub">料理や気分から、<br />まだ知らない一献へ。</p>
    </section>
    <HomeNightChoices />
    <DailyPick />
    <section className="home-about" aria-labelledby="home-about-title">
      <h2 id="home-about-title">{homeAbout.heading}</h2>
      {homeAbout.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <Link href="/about" className="text-link">宵の一献について <ArrowRight size={16} aria-hidden="true" /></Link>
    </section>
  </DiscoveryShell>;
}
