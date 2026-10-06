import { notFound } from "next/navigation";
import Link from "next/link";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import DiscoverySakeCard from "../../components/DiscoverySakeCard.jsx";
import RecipeLinks from "../../components/RecipeLinks.jsx";
import { getFoodBySlug, getFoodOptions, toPathSegment } from "../../../data/siteData.js";
import { daySeed, dishProfile, recommendSake, recommendationPool, discoveryNights } from "../../../data/discovery.js";
export function generateStaticParams() { return getFoodOptions().map(name => ({ slug: toPathSegment(name) })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  return food ? { title: `${food.name}に合う日本酒｜家庭料理のペアリング`, description: `${food.name}と日本酒の組み合わせを、理由とともに紹介します。`, alternates: { canonical: `/food/${slug}` } } : {};
}
export default async function FoodPage({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) notFound();
  const profile = dishProfile(food.name);
  const picks = recommendSake(food.name, "ordinary", daySeed());
  const others = recommendationPool(food.name).filter(r => !picks.some(p => p.item.id === r.item.id)).slice(0, 6);
  return <DiscoveryShell><section className="food-detail-hero"><p className="section-kicker">料理から、日本酒へ</p><h1>{food.name}</h1><p className="sake-detail-intro">{profile.flavor}を楽しむ一皿。</p><p className="muted-copy">{profile.method}</p></section><section className="detail-band"><h2>この料理なら、今夜はこの三本。</h2><p className="muted-copy">料理と味わいを手がかりに、宵の一献が選びました。</p><div className="recommendation-grid">{picks.map(r => <DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} />)}</div>{!picks.length && <p className="empty-state">味付けやお好みに合わせて、<Link href="/search">日本酒一覧から探す</Link>。</p>}</section><RecipeLinks dish={food.name} /><section className="detail-band"><h2>今夜の気分から選び直す</h2><div className="night-inline">{discoveryNights.slice(0, 3).map(n => <Link key={n.id} className="yoi-button" href={`/nights/${n.id}`}>{n.name} →</Link>)}</div></section>{others.length > 0 && <details className="other-sake"><summary>ほかの候補を見る（{others.length}商品）</summary><div className="recommendation-grid">{others.map(r => <DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} />)}</div></details>}<Link className="text-link" href="/food">ほかの料理から探す →</Link></DiscoveryShell>;
}
