import { ChevronRight } from "../../components/InterfaceIcons.jsx";
import { notFound } from "next/navigation";
import Link from "next/link";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import { FavoriteButton } from "../../components/Ochoko.jsx";
import TrackedExternalLink from "../../components/TrackedExternalLink.jsx";
import RecommendShare from "../../components/RecommendShare.jsx";
import PairingPending from "../../components/PairingPending.jsx";
import { SITE_NAME, SITE_URL, allSakePairings, sakeCatalogStatus, legacyReferences, resolveSakeReference, getSakeById, buildSakeListSummary, buildSakeVerifiedTags, buildSakeEditorialTags, buildResourceLinks, toPathSegment } from "../../../data/siteData.js";
import { publicSourceName } from "../../../data/publicDisplay.js";
import { displaySpec } from "../../../data/specDisplay.js";
import { temperatureLabels } from "../../../data/temperatureUX.js";
import { dishesForSake, nightsForSake } from "../../../data/discovery.js";
import { editorialNightAssignments, editorialNightNote } from '../../../data/editorialNightAssignments.js';
import { commerceForSake } from "../../../commerce/server.js";
import { ProductLabelImage, PurchaseOptions } from "../../components/AffiliateCommerce.jsx";
import ProductWindow from '../../components/ProductWindow.jsx';
import SeasonalNightLinks from '../../components/SeasonalNightLinks.jsx';
import {buildCardPresentation} from '../../../data/cardPresentation.js';
import {Suspense} from 'react';
import SakeDiscoveryContext from '../../components/SakeDiscoveryContext.jsx';
import merchantAudit from '../../../commerce/generated/merchant-links.json';
import {eligibleSensoryEvidence} from '../../../catalog/operations.js';
import {purchaseUnavailable} from '../../../commerce/availability.js';
import ServingGuide from '../../components/ServingGuide.jsx';
import {tastePresentationRows} from '../../../data/tastePresentation.js';

export function generateStaticParams() {
  return [...new Set([...allSakePairings.map(i => i.id), ...legacyReferences.map(e => e.legacyId)])].map(slug => ({ slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getSakeById(slug);
  const ref = resolveSakeReference(slug);
  if (item) return { title: `${item.productName}に合う料理と飲み方`, description: buildSakeListSummary(item), alternates: { canonical: `/sake/${item.id}` }, openGraph: { title: item.productName, url: `${SITE_URL}/sake/${item.id}` }, ...(sakeCatalogStatus(item.id)==='ARCHIVED'?{robots:{index:false}}:{}) };
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
  const nights = nightsForSake(item,Infinity).map(({id,name})=>({id,name}));
  const r = item.sakeResearch;
  const community = eligibleSensoryEvidence(item.communityEvidence, {skuId:item.id}).accepted;
  const formatFields = entries => entries.map(([label, value]) => [label, displaySpec(value, label.includes("精米歩合") ? "%" : label === "アルコール度数" ? "度" : "")]).filter(([, text]) => text);
  const essentials = formatFields([["蔵元", item.brewery], ["都道府県", item.prefecture], ["特定名称", r.classification.tokuteiMeishoshu || item.style.join(" / ")], ["原料米", r.specs.riceVariety], ["精米歩合", r.specs.polishingRatio], ["アルコール度数", r.specs.alcoholPercentage], ["飲用温度", temperatureLabels(r.servingTemperatures)], ["飲用温度範囲", r.recommendedTemperatureRange]]);
  const fields = formatFields([["原材料", r.specs.ingredients], ["原料米産地", r.specs.riceOrigin], ["麹米・掛米", r.specs.riceByRole], ["麹米・掛米の精米歩合", r.specs.polishingByRole], ["日本酒度", r.specs.nihonshudo], ["酸度", r.specs.acidity], ["アミノ酸度", r.specs.aminoAcidValue], ["酵母", r.specs.yeast], ["仕込水", r.specs.waterSource], ["熟成期間", r.specs.agingPeriod], ["年度・版", r.vintage]]);
  const commerce = commerceForSake(item);
  const links = buildResourceLinks(item);
  const jsonLd = { "@context": "https://schema.org", "@type": "Product", name: item.productName, brand: { "@type": "Brand", name: item.brandName }, description: buildSakeListSummary(item), url: `${SITE_URL}/sake/${item.id}` };
  return <DiscoveryShell>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replaceAll("<", "\\u003c") }} />
    <section className="sake-detail-hero">
      <h1>{item.productName}</h1>
      <p className="muted-copy">{item.brewery} / {item.prefecture}</p>
      {sakeCatalogStatus(item.id)!=='ACTIVE'&&<p className="muted-copy">以前の掲載商品です。保存していたおちょこは、そのまま残しています。</p>}
      <Suspense fallback={null}><SakeDiscoveryContext item={item} /></Suspense>
      {commerce.image ? <ProductLabelImage image={commerce.image} /> : <ProductWindow item={item} />}
      <p className="detail-catchphrase">{buildCardPresentation(item).cardCatchphrase}</p>
      <div className="detail-actions"><FavoriteButton id={item.id} /></div>
    </section>
    <section className="detail-band sake-overview" aria-labelledby="sake-about">
      <h2 id="sake-about">味わいと飲み方</h2>
      <p className="sake-detail-intro">{buildSakeListSummary(item)}</p>
      <ul className="feature-tags">{buildCardPresentation(item).tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
      <dl className="taste-at-a-glance">{tastePresentationRows(r.flavorProfile).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <ServingGuide values={r.servingTemperatures} range={r.recommendedTemperatureRange}/>
    </section>
    <section className="detail-band purchase-discovery" aria-labelledby="sake-purchase">
      <h2 id="sake-purchase">購入先</h2>
      {purchaseUnavailable(item.id)&&<p className="muted-copy">現在、同じ商品の購入先を確認中です。ほかの販売店を探す場合は、商品名・容量・仕様をご確認ください。</p>}
      <PurchaseOptions offers={commerce.offers} links={commerce.discoveryLinks} item={item} />
    </section>
    <section className="detail-band brewery-information" aria-labelledby="sake-brewery">
      <h2 id="sake-brewery">蔵元について</h2><h3 className="brewery-title">{item.brewery}</h3>
      {item.prefecture && <p className="muted-copy">所在地（都道府県）：{item.prefecture}</p>}
      <div className="resource-links">{links.map(link => <TrackedExternalLink key={link.href} href={link.href} className="text-link" event="official_link_click" parameters={{ sake_id: item.id }}>{merchantAudit.records[item.id]?.type==='E'&&merchantAudit.records[item.id]?.originalUrl===link.href?'出典・参考を見る':link.label === "蔵元公式サイト" ? "公式サイトを見る" : link.label} ↗</TrackedExternalLink>)}</div>
    </section>
    <section className="detail-band sake-pairings" aria-labelledby="sake-pairings">
      <p className="section-kicker">このお酒と食べたいもの</p><Suspense fallback={<h2 id="sake-pairings">{dishes[0] ? `今夜なら、${dishes[0].name}と。` : "料理から、もうひとつの出会いを。"}</h2>}><SakeDiscoveryContext item={item} placement="pairing" fallback={<h2 id="sake-pairings">{dishes[0] ? `今夜なら、${dishes[0].name}と。` : "料理から、もうひとつの出会いを。"}</h2>} /></Suspense>
      <div className="reverse-dish-grid">{dishes.slice(0,6).map(d => <article key={d.name}><h3><Link href={`/food/${toPathSegment(d.name)}`}><span>{d.name}</span><ChevronRight /></Link></h3><p>{d.reason}</p><small>宵の一献の提案</small></article>)}</div>
      {dishes.length>6&&<details className="more-pairings"><summary>ほかの料理を見る（{dishes.length-6}件）</summary><div className="reverse-dish-grid">{dishes.slice(6).map(d=><article key={d.name}><h3><Link href={`/food/${toPathSegment(d.name)}`}><span>{d.name}</span><ChevronRight/></Link></h3><p>{d.reason}</p><small>宵の一献の提案</small></article>)}</div></details>}
      {!dishes.length && <PairingPending />}
      {r.officialPairings.length > 0 && <div className="official-pairings"><h3>蔵元が紹介する組み合わせ</h3><p>{r.officialPairings.join("、")}</p></div>}
      {nights.length>0 && <div className="pairing-nights"><h3>こんな夜に</h3>{editorialNightAssignments[item.id] && <p className="muted-copy">{editorialNightNote}</p>}<SeasonalNightLinks nights={nights} /></div>}
    </section>
    <section className="detail-band sake-further" aria-labelledby="sake-further-title">
      <h2 id="sake-further-title">酒のことをもう少し詳しく</h2>
      <details className="specs-details"><summary>詳しい酒情報を見る</summary><dl className="spec-table sake-essentials">{[...essentials,...fields].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl><ul className="feature-tags">{buildSakeVerifiedTags(item).map(tag=><li key={tag}>{tag}</li>)}</ul>{buildSakeEditorialTags(item).length>0&&<p className="muted-copy">宵の一献の見立て：{buildSakeEditorialTags(item).join('、')}</p>}</details>
      {community.length>0&&<details className="source-details community-evidence"><summary>飲んだ人の感想</summary>{community.map(e=><div key={e.evidenceId}><p>{e.summary}</p><TrackedExternalLink href={e.sourceUrl} className="text-link" event="source_opened">実飲レビューを見る ↗</TrackedExternalLink></div>)}<p className="muted-copy">個人の感想です。製造時期や保存状態、飲み方によって印象は異なります。</p></details>}
      <details className="source-details"><summary>商品情報の出典</summary><ul>{r.sources.map((source,i)=><li key={`${source.url}:${i}`}><TrackedExternalLink href={source.url} event="source_opened" className="text-link">{source.type==='breweryOfficial'?'蔵元公式':'専門資料'}：{publicSourceName(source,item.productName)} ↗</TrackedExternalLink></li>)}</ul></details>
    </section>
    <RecommendShare item={{ id: item.id, productName: item.productName }} />
  </DiscoveryShell>;
}
