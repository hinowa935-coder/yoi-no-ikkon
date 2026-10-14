"use client";
import { ChevronRight } from "./InterfaceIcons.jsx";

import { dailyRecommendation } from "../../data/discovery.js";
import useCurrentTokyoDay from './useCurrentTokyoDay.js';
import { buildSakeListSummary } from "../../data/siteData.js";
import TrackedLink from "./TrackedLink.jsx";
export default function DailyPick() {
  const seed=useCurrentTokyoDay();
  if(!seed)return <section className="daily-pick" aria-busy="true"><p className="section-kicker">今宵のおすすめ</p></section>;
  const pick = dailyRecommendation(seed);
  return <section className="daily-pick"><p className="section-kicker">今宵のおすすめ</p><h2>{pick.night.name}に。</h2><p className="daily-dish">{pick.dish.name}<span aria-hidden="true">×</span>{pick.recommendation.item.productName}</p><p className="muted-copy">{pick.recommendation.reason}</p><p className="daily-sake-note">{buildSakeListSummary(pick.recommendation.item)}</p><TrackedLink href={`/discover?night=${pick.night.id}&direction=${pick.direction.id}&dish=${encodeURIComponent(pick.dish.name)}&day=${seed}#sake-recommendations`} className="yoi-button" event="discovery_start" parameters={{ source: "daily", night_id: pick.night.id }}>この組み合わせを見る <ChevronRight /></TrackedLink></section>;
}
