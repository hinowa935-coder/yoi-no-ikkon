"use client";

import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {recommendSake, recommendationPool, nightsForSake} from '../../data/discovery.js';
import {recommendationViewDay} from '../../data/recommendationDate.js';
import {getCanonicalFood} from '../../data/foodCatalog.js';
import useCurrentTokyoDay from './useCurrentTokyoDay.js';
import DiscoverySakeCard from './DiscoverySakeCard.jsx';
import SeasonalNightLinks from './SeasonalNightLinks.jsx';

export function FoodRecommendationsPending() {
  return <section className="detail-band" aria-busy="true"><h2>この料理に合わせる、この三本。</h2><p className="muted-copy" role="status">おすすめを選んでいます。</p></section>;
}

export default function FoodRecommendations({dish}) {
  const query = useSearchParams();
  const today = useCurrentTokyoDay();
  const day = recommendationViewDay(query.get('day'), today);
  if (!day) return <FoodRecommendationsPending />;
  const picks = recommendSake(dish, 'ordinary', day);
  const others = recommendationPool(dish, 'ordinary', day).filter(r => !picks.some(p => p.item.id === r.item.id)).slice(0, 6);
  const nights = [...new Map(picks.flatMap(p => nightsForSake(p.item, Infinity)).map(({id, name}) => [id, {id, name}])).values()];
  const food = getCanonicalFood(dish);
  const selection = index => ({dish_id: food?.id, dish_name: food?.name, position: index + 1});
  return <>
    <section className="detail-band"><h2>この料理に合わせる、この三本。</h2><p className="muted-copy">料理と味わいを手がかりに選びました。</p><div className="recommendation-grid">{picks.map((r,index) => <DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} recommendationSelection={selection(index)} />)}</div>{!picks.length && <p className="empty-state">味付けやお好みに合わせて、<Link href="/search">日本酒一覧から探す</Link>。</p>}</section>
    {nights.length > 0 && <section className="detail-band"><h2>こんな夜に</h2><SeasonalNightLinks nights={nights} /></section>}
    {others.length > 0 && <details className="other-sake"><summary>ほかの候補を見る（{others.length}商品）</summary><div className="recommendation-grid">{others.map((r,index) => <DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} recommendationSelection={selection(picks.length + index)} />)}</div></details>}
  </>;
}
