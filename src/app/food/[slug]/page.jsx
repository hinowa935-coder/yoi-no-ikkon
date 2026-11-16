import { notFound } from "next/navigation";
import Link from "next/link";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import {Suspense} from 'react';
import FoodRecommendations, {FoodRecommendationsPending} from '../../components/FoodRecommendations.jsx';
import RecipeLinks from "../../components/RecipeLinks.jsx";
import SpecialtyLinks from '../../components/SpecialtyLinks.jsx';
import ShareButton from "../../components/ShareButton.jsx";
import { getFoodBySlug } from "../../../data/siteData.js";
import {foodRouteSlugs} from '../../../data/foodCatalog.js';
import { dishProfile } from "../../../data/discovery.js";
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
  return <DiscoveryShell>
    <section className="food-detail-hero"><p className="section-kicker">料理から、日本酒へ</p><h1>{food.name}</h1>{food.regionalNames.length>0&&<p className="muted-copy">{food.regionalNames.map(n=>n.name).join('・')}</p>}{food.description&&<p className="sake-detail-intro food-description">{food.description}</p>}{food.region.length>0&&<p className="food-region">{food.region.join('・')}{food.area?` / ${food.area}`:''}</p>}<p className="muted-copy">{profile.method}</p><ShareButton title={`${food.name}に合う日本酒｜宵の一献`} text="料理と日本酒の組み合わせ。" path={`/food/${food.slug}`} eventName="share_food" /></section>
    <Suspense fallback={<FoodRecommendationsPending />}><FoodRecommendations dish={food.name} /></Suspense>
    <RecipeLinks dish={food.name} /><SpecialtyLinks dish={food.name} /><Link className="text-link" href="/food?all=1">料理をすべて見る →</Link>
  </DiscoveryShell>;
}
