"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { visibleSakePairings, prefectureOrder, dishOptions, tasteOptions, buildSakeListSummary, buildSakeLocation, buildSakeFeatureTags, buildSakeVerifiedTags, toPathSegment, buildResourceLinks, buildPurchaseLinks } from "../../data/siteData.js";
import { discoveryNights, dishesForSake, nightsForSake, scorePairing } from "../../data/discovery.js";
import { useFavorites, FavoriteButton, OchokoIcon } from "./Ochoko.jsx";
import { trackEvent } from "../../data/telemetry.js";
import TrackedLink from "./TrackedLink.jsx";
import PairingPending from "./PairingPending.jsx";

export function SearchCard({ item }) {
  const dishes = dishesForSake(item);
  const links = buildResourceLinks(item);
  const purchase = buildPurchaseLinks(item);
  return <article className="discovery-sake">
    <div className="sake-card-top"><p>{buildSakeLocation(item)}</p><FavoriteButton id={item.id} compact /></div>
    <h3><TrackedLink href={`/sake/${item.id}`} event="sake_opened" parameters={{ sake_id: item.id }}>{item.productName}</TrackedLink></h3>
    <p className="sake-intro">{buildSakeListSummary(item)}</p>
    <ul className="feature-tags">{buildSakeFeatureTags(item, 3).map(tag => <li key={tag}>{tag}</li>)}</ul>
    {dishes.length ? <ul className="dish-links">{dishes.slice(0, 3).map(d => <li key={d.name}><Link href={`/food/${toPathSegment(d.name)}`}>{d.name}</Link></li>)}</ul> : <PairingPending />}
    <details className="card-details"><summary>料理・温度などを見る</summary><dl>
      {dishes.length > 0 && <><dt>このお酒に合う料理</dt><dd>{dishes.map(d => <Link key={d.name} href={`/food/${toPathSegment(d.name)}`}>{d.name} </Link>)}</dd></>}
      <dt>今夜の気分</dt><dd>{nightsForSake(item).map(n => <Link key={n.id} href={`/discover?night=${n.id}`}>{n.name} </Link>)}</dd>
      {item.temperature.length > 0 && <><dt>おすすめ温度</dt><dd>{item.temperature.join("、")}</dd></>}
      {buildSakeVerifiedTags(item).length > 0 && <><dt>特徴</dt><dd>{buildSakeVerifiedTags(item).join("、")}</dd></>}
    </dl>{links.concat(purchase).map(link => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer" onClick={() => trackEvent("official_link_click", { sake_id: item.id })}>{link.label} ↗</a>)}<Link className="text-link" href={`/sake/${item.id}`}>このお酒を知る →</Link></details>
  </article>;
}
export default function SakeSearch() {
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState({ prefecture: "", dish: "", taste: "", classification: "", temperature: "", night: "" });
  const [onlySaved, setOnlySaved] = useState(false);
  const [limit, setLimit] = useState(24);
  const { ids, ready } = useFavorites();
  const classifications = [...new Set(visibleSakePairings.flatMap(i => i.style))].sort();
  const temperatures = [...new Set(visibleSakePairings.flatMap(i => i.temperature))];
  const filtered = useMemo(() => visibleSakePairings.filter(item => {
    if (onlySaved && !ids.includes(item.id)) return false;
    if (filters.prefecture && filters.prefecture !== item.prefecture) return false;
    if (filters.classification && !item.style.includes(filters.classification)) return false;
    if (filters.temperature && !item.temperature.includes(filters.temperature)) return false;
    const taste = [...item.taste, ...Object.values(item.sakeResearch.flavorProfile || {}).filter(Boolean)].join(" ");
    const aliases = { "すっきり": /すっきり|スッキリ|キレ|爽快/, "米の旨味": /米.*旨|旨味|旨み/, "甘み": /甘み|甘味/, "フルーティ": /果実|フルーティ/, "華やか": /華やか/, "やわらか": /やわらか|柔らか|柔和/, "食中酒": /食中|料理/, "燗向き": /燗/ };
    if (filters.taste && !(aliases[filters.taste] || new RegExp(filters.taste)).test(taste + (filters.taste === "燗向き" ? item.temperature.join(" ") : ""))) return false;
    if (filters.night && !nightsForSake(item).some(n => n.id === filters.night)) return false;
    const dishes = filters.dish || keyword ? dishesForSake(item) : [];
    if (filters.dish && !item.dishCategories.includes(filters.dish) && !dishes.some(d => d.method.includes(filters.dish) || d.name.includes(filters.dish) || filters.dish === "家庭料理")) return false;
    const words = keyword.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    const text = [item.productName, item.sake, item.brewery, item.prefecture, item.region, ...item.style, ...item.taste, ...item.temperature, ...item.dishes, ...item.officialPairings, ...dishes.map(d => d.name)].join(" ").toLocaleLowerCase();
    return words.every(word => text.includes(word));
  }), [keyword, filters, onlySaved, ids]);
  const change = (key, value) => { setFilters(current => ({ ...current, [key]: value })); setLimit(24); };
  const fields = [
    ["prefecture", "産地", prefectureOrder], ["dish", "料理", dishOptions], ["taste", "味わい", tasteOptions],
    ["classification", "種類", classifications], ["temperature", "飲用温度", temperatures], ["night", "今夜の気分", discoveryNights.map(n => [n.id, n.name])],
  ];
  return <section id="search" className="search-page"><p className="section-kicker">日本酒から探す</p><h1 className="phrase-heading"><span>気になる一本から、</span><span>今夜の料理を。</span></h1><label className="search-keyword"><span>商品名・蔵元・料理など</span><input type="search" value={keyword} onChange={e => { setKeyword(e.target.value); setLimit(24); }} placeholder="例：鍋島、肉じゃが、冷酒" /></label><details className="search-filters"><summary>検索条件を選ぶ{Object.values(filters).filter(Boolean).length > 0 ? `（${Object.values(filters).filter(Boolean).length}）` : ""}</summary><div className="filter-grid">{fields.map(([key, name, options]) => <label key={key}><span>{name}</span><select aria-label={name} value={filters[key]} onChange={e => change(key, e.target.value)}><option value="">すべて</option>{options.map(option => <option key={Array.isArray(option) ? option[0] : option} value={Array.isArray(option) ? option[0] : option}>{Array.isArray(option) ? option[1] : option}</option>)}</select></label>)}</div><button className="text-link" onClick={() => { setFilters({ prefecture: "", dish: "", taste: "", classification: "", temperature: "", night: "" }); setKeyword(""); setLimit(24); }}>条件をリセット</button></details><div className="search-toolbar"><p aria-live="polite">{filtered.length}商品 <small>/ 全{visibleSakePairings.length}商品</small></p><label className="saved-toggle"><OchokoIcon filled={onlySaved} /><input type="checkbox" checked={onlySaved} disabled={!ready} onChange={e => { setOnlySaved(e.target.checked); setLimit(24); }} /><span>おちょこの中だけ</span></label></div><div className="search-result-grid">{filtered.slice(0, limit).map(item => <SearchCard key={item.id} item={item} />)}</div>{filtered.length === 0 && <p className="empty-state">{onlySaved ? "気になるお酒をおちょこに入れると、ここで見返せます。" : "この組み合わせは見つかりませんでした。条件をひとつ外してみてください。"}</p>}{filtered.length > limit && <button className="yoi-button load-more" onClick={() => setLimit(current => current + 24)}>続きを見る</button>}</section>;
}
