import { notFound } from "next/navigation";
import Link from "next/link";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import { FavoriteButton } from "../../components/Ochoko.jsx";
import TrackedExternalLink from "../../components/TrackedExternalLink.jsx";
import ShareButton from "../../components/ShareButton.jsx";
import PairingPending from "../../components/PairingPending.jsx";
import { SITE_NAME, SITE_URL, visibleSakePairings, legacyReferences, resolveSakeReference, getSakeById, buildSakeListSummary, buildSakeLocation, buildSakeFeatureTags, buildSakeEditorialTags, buildResourceLinks, buildPurchaseLinks, toPathSegment } from "../../../data/siteData.js";
import { displaySpec } from "../../../data/specDisplay.js";
import { dishesForSake, nightsForSake } from "../../../data/discovery.js";

export function generateStaticParams() {
  return [...new Set([...visibleSakePairings.map(i => i.id), ...legacyReferences.map(e => e.legacyId)])].map(slug => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getSakeById(slug);
  const ref = resolveSakeReference(slug);
  if (item) return { title: `${item.productName}に合う料理と飲み方`, description: buildSakeListSummary(item), alternates: { canonical: `/sake/${item.id}` }, openGraph: { title: item.productName, url: `${SITE_URL}/sake/${item.id}` } };
  if (ref.status !== "unknown") return { title: ref.archivedName, robots: { index: false }, alternates: { canonical: `/sake/${slug}` } };
  return {};
}
export default async function SakePage({ params }) {
  const { slug } = await params;
  const ref = resolveSakeReference(slug);
  if (ref.status === "same_product_alias") {
    const href = `/sake/${ref.canonicalId}`;
    return <DiscoveryShell><meta httpEquiv="refresh" content={`0;url=${href}`} /><section className="archived-product"><h1>{getSakeById(ref.canonicalId).productName}</h1><p>この商品のページへ移動します。</p><Link className="yoi-button" href={href}>商品ページを開く →</Link></section></DiscoveryShell>;
  }
  const item = getSakeById(slug);
  if (!item) {
    if (ref.status === "unknown") notFound();
    const alternative = ref.suggestedReplacementId ? getSakeById(ref.suggestedReplacementId) : null;
    return <DiscoveryShell><section className="archived-product"><p className="section-kicker">以前の掲載商品</p><h1>{ref.archivedName}</h1><p className="muted-copy">{ref.prefecture} / {ref.brewery}</p><p>この掲載は、現在の日本酒一覧には含まれていません。保存していたおちょこは、そのまま残しています。</p>{alternative && <div className="archive-alternative"><h2>別のお酒の候補</h2><p>以前の掲載商品とは別商品です。</p><Link className="text-link" href={`/sake/${alternative.id}`}>{alternative.productName} →</Link></div>}<FavoriteButton id={slug} /><Link className="text-link" href="/search">いまの日本酒一覧を見る →</Link></section></DiscoveryShell>;
  }
  const dishes = dishesForSake(item);
  const nights = nightsForSake(item);
  const r = item.sakeResearch;
  const fields = [["原材料", r.specs.ingredients], ["原料米", r.specs.riceVariety], ["原料米産地", r.specs.riceOrigin], ["麹米・掛米", r.specs.riceByRole], ["精米歩合", r.specs.polishingRatio], ["麹米・掛米の精米歩合", r.specs.polishingByRole], ["アルコール度数", r.specs.alcoholPercentage], ["日本酒度", r.specs.nihonshudo], ["酸度", r.specs.acidity], ["アミノ酸度", r.specs.aminoAcidValue], ["酵母", r.specs.yeast], ["仕込水", r.specs.waterSource], ["熟成期間", r.specs.agingPeriod], ["飲用温度", r.servingTemperatures], ["飲用温度範囲", r.recommendedTemperatureRange], ["年度・版", r.vintage]].filter(([, v]) => v !== null && v !== undefined && (!Array.isArray(v) || v.length > 0));
  const links = buildResourceLinks(item);
  const purchases = buildPurchaseLinks(item);
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: item.productName, brand: { "@type": "Brand", name: item.brandName }, description: buildSakeListSummary(item), url: `${SITE_URL}/sake/${item.id}` };
  return <DiscoveryShell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }} /><section className="sake-detail-hero"><p className="section-kicker">{buildSakeLocation(item)}</p><h1>{item.productName}</h1><p className="sake-detail-intro">{buildSakeListSummary(item)}</p><div className="detail-actions"><FavoriteButton id={item.id} /><ShareButton title={`${item.productName}｜${SITE_NAME}`} text="今夜の料理に合わせたい一献。" path={`/sake/${item.id}`} eventName="share_sake" /></div></section><section className="detail-band"><p className="section-kicker">この酒なら、なに食べよう。</p><h2>{dishes[0] ? `今夜なら、${dishes[0].name}と。` : "料理から、もうひとつの出会いを。"}</h2><div className="reverse-dish-grid">{dishes.map(d => <article key={d.name}><h3><Link href={`/food/${toPathSegment(d.name)}`}>{d.name} →</Link></h3><p>{d.reason}</p><small>宵の一献の提案</small></article>)}</div>{!dishes.length && <PairingPending />}{r.officialPairings.length > 0 && <div className="official-pairings"><h3>蔵元が紹介する組み合わせ</h3><p>{r.officialPairings.join("、")}</p></div>}</section><section className="detail-band"><h2>こんな夜に。</h2><p className="muted-copy">食卓へ戻る、今夜の入口。</p><div className="night-inline">{nights.map(n => <Link key={n.id} className="yoi-button" href={`/nights/${n.id}`}>{n.name} →</Link>)}</div></section><section className="detail-band"><h2>このお酒について</h2><p className="muted-copy">{item.style.join(" / ")}</p><ul className="feature-tags">{r.verifiedFeatureTags.map(tag => <li key={tag}>{tag}</li>)}</ul>{buildSakeEditorialTags(item).length > 0 && <p className="muted-copy">宵の一献の見立て：{buildSakeEditorialTags(item).join("、")}</p>}{fields.length > 0 && <details className="specs-details"><summary>詳しい商品情報</summary><dl className="spec-table">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{displaySpec(value, label.includes("精米歩合") ? "%" : label === "アルコール度数" ? "度" : "")}</dd></div>)}</dl></details>}<h3 className="brewery-title">{item.brewery}</h3><p className="muted-copy">{item.prefecture}{item.region ? ` / ${item.region}` : ""}</p></section><section className="detail-band"><h2>このお酒を探す</h2><div className="resource-links">{purchases.concat(links).map(link => <TrackedExternalLink key={link.href} href={link.href} className="yoi-button" event="official_link_click" parameters={{ sake_id: item.id }}>{link.label} ↗</TrackedExternalLink>)}</div><details className="source-details"><summary>商品情報の出典</summary><ul>{r.sources.map((source, i) => <li key={`${source.url}:${i}`}><TrackedExternalLink href={source.url} event="source_opened" className="text-link">{source.type === "breweryOfficial" ? "蔵元公式" : "専門資料"}：{source.name || item.productName} ↗</TrackedExternalLink></li>)}</ul></details></section></DiscoveryShell>;
}
