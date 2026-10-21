import { notFound } from "next/navigation";
import Link from "next/link";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import DiscoverySakeCard from "../../components/DiscoverySakeCard.jsx";
import RecipeLinks from "../../components/RecipeLinks.jsx";
import SpecialtyLinks from '../../components/SpecialtyLinks.jsx';
import ShareButton from "../../components/ShareButton.jsx";
import SeasonalNightLinks from '../../components/SeasonalNightLinks.jsx';
import { getFoodBySlug } from "../../../data/siteData.js";
import {foodRouteSlugs} from '../../../data/foodCatalog.js';
import { daySeed, dishProfile, recommendSake, recommendationPool, nightsForSake } from "../../../data/discovery.js";
export function generateStaticParams() { return foodRouteSlugs().map(slug => ({ slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  return food ? { title: `${food.name}に合う日本酒｜家庭料理のペアリング`, description: food.description || `${food.name}と日本酒の組み合わせを、理由とともに紹介します。`, alternates: { canonical: `/food/${food.slug}` }, ...(slug!==food.slug?{robots:{index:false,follow:true}}:{}) } : {};
}
export default async function FoodPage({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) notFound();
  if(slug!==food.slug)return <DiscoveryShell><meta httpEquiv="refresh" content={`0;url=/food/${food.slug}`} /><h1>{food.name}</h1><Link href={`/food/${food.slug}`}>料理のページへ進む →</Link></DiscoveryShell>;
  const profile = dishProfile(food.name);
  const picks = recommendSake(food.name, "ordinary", daySeed());
  const others = recommendationPool(food.name).filter(r => !picks.some(p => p.item.id === r.item.id)).slice(0, 6);
  const nights=[...new Map(picks.flatMap(p=>nightsForSake(p.item,Infinity)).map(({id,name})=>[id,{id,name}])).values()];
  return <DiscoveryShell>
    <section className="food-detail-hero"><p className="section-kicker">料理から、日本酒へ</p><h1>{food.name}</h1>{food.regionalNames.length>0&&<p className="muted-copy">{food.regionalNames.map(n=>n.name).join('・')}</p>}{food.description&&<p className="sake-detail-intro food-description">{food.description}</p>}{food.region.length>0&&<p className="food-region">{food.region.join('・')}{food.area?` / ${food.area}`:''}</p>}<p className="muted-copy">{profile.method}</p><ShareButton title={`${food.name}に合う日本酒｜宵の一献`} text="料理と日本酒の組み合わせ。" path={`/food/${food.slug}`} eventName="share_food" /></section>
    <section className="detail-band"><h2>この料理に合わせる、この三本。</h2><p className="muted-copy">料理と味わいを手がかりに選びました。</p><div className="recommendation-grid">{picks.map(r=><DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} />)}</div>{!picks.length&&<p className="empty-state">味付けやお好みに合わせて、<Link href="/search">日本酒一覧から探す</Link>。</p>}</section>
    {nights.length>0&&<section className="detail-band"><h2>こんな夜に</h2><SeasonalNightLinks nights={nights} /></section>}
    {others.length>0&&<details className="other-sake"><summary>ほかの候補を見る（{others.length}商品）</summary><div className="recommendation-grid">{others.map(r=><DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} />)}</div></details>}
    <RecipeLinks dish={food.name} /><SpecialtyLinks dish={food.name} /><Link className="text-link" href="/food?all=1">料理をすべて見る →</Link>
  </DiscoveryShell>;
}
