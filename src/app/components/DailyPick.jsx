"use client";
import { useEffect, useState } from "react";
import { dailyRecommendation, daySeed } from "../../data/discovery.js";
import { buildSakeListSummary } from "../../data/siteData.js";
import TrackedLink from "./TrackedLink.jsx";
export default function DailyPick({ initialSeed }) {
  const [seed, setSeed] = useState(initialSeed);
  useEffect(() => {
    const update = () => setSeed(daySeed());
    update();
    const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, []);
  const pick = dailyRecommendation(seed);
  return <section className="daily-pick"><p className="section-kicker">今宵のおすすめ</p><h2>{pick.night.name}に。</h2><p className="daily-dish">{pick.dish.name}<span aria-hidden="true">×</span>{pick.recommendation.item.productName}</p><p className="muted-copy">{pick.recommendation.reason}</p><p className="daily-sake-note">{buildSakeListSummary(pick.recommendation.item)}</p><TrackedLink href={`/discover?night=${pick.night.id}&direction=${pick.direction.id}&dish=${encodeURIComponent(pick.dish.name)}`} className="yoi-button" event="discovery_start" parameters={{ source: "daily", night_id: pick.night.id }}>この夜をのぞく <span aria-hidden="true">→</span></TrackedLink></section>;
}
