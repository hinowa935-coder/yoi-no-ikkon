"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { emptySearchFilters, readSearchLocation, writeSearchLocation } from "./searchLocation.js";
import Link from "next/link";
import { visibleSakePairings, prefectureOrder, dishOptions, tasteOptions, buildSakeListSummary, buildSakeLocation, buildSakeFeatureTags, buildSakeVerifiedTags, toPathSegment, buildResourceLinks, buildPurchaseLinks } from "../../data/siteData.js";
import { discoveryNights, dishesForSake, nightsForSake } from "../../data/discovery.js";
import { useFavorites, FavoriteButton, OchokoIcon } from "./Ochoko.jsx";
import { trackEvent } from "../../data/telemetry.js";
import TrackedLink from "./TrackedLink.jsx";
import PairingPending from "./PairingPending.jsx";
import {temperatureLabels,temperatureOptions,temperatureGroups} from '../../data/temperatureUX.js';
import {matchesSearch,sortSearch} from '../../data/searchFiltering.js';
import { editorialNightAssignments, editorialNightNote } from '../../data/editorialNightAssignments.js';

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
      <dt>こんな夜に</dt><dd>{nightsForSake(item).map(n => <Link key={n.id} href={`/discover?night=${n.id}`}>{n.name} </Link>)}</dd>
      {editorialNightAssignments[item.id] && <><dt>夜の提案について</dt><dd>{editorialNightNote}</dd></>}
      {item.temperature.length > 0 && <><dt>おすすめ温度</dt><dd>{temperatureLabels(item.temperature).join("、")}</dd></>}
      {buildSakeVerifiedTags(item).length > 0 && <><dt>特徴</dt><dd>{buildSakeVerifiedTags(item).join("、")}</dd></>}
    </dl>{links.concat(purchase).map(link => <a key={link.href} className="text-link" href={link.href} target="_blank" rel="noreferrer" onClick={() => trackEvent("official_link_click", { sake_id: item.id })}>{link.label} ↗</a>)}<Link className="text-link" href={`/sake/${item.id}`}>このお酒を知る →</Link></details>
  </article>;
}
export default function SakeSearch() {
  const [keyword, setKeyword] = useState("");
  const [filters, setFilters] = useState(emptySearchFilters);
  const [onlySaved, setOnlySaved] = useState(false);
  const [limit, setLimit] = useState(24);
  const { ids, ready } = useFavorites();
  const [restored, setRestored] = useState(false);
  const restoreScroll = useRef(null);
  useEffect(() => {
    const restore = () => {
      let saved = null;
      try { saved = JSON.parse(sessionStorage.getItem("yoi-search-v1")); } catch {}
      const explicit = window.location.search.length > 1;
      const search = explicit ? window.location.search : saved?.search || "";
      const state = readSearchLocation(search);
      setKeyword(state.keyword); setFilters(state.filters); setOnlySaved(state.onlySaved); setLimit(state.limit);
      restoreScroll.current = saved?.search === search && Number.isFinite(saved?.scroll) ? Math.max(0, saved.scroll) : null;
      setRestored(true);
    };
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  useEffect(() => {
    if (!restored) return;
    const search = writeSearchLocation(window.location.search, { keyword, filters, onlySaved, limit });
    window.history.replaceState(window.history.state, "", window.location.pathname + search + window.location.hash);
    const save = () => {
      try { sessionStorage.setItem("yoi-search-v1", JSON.stringify({ search, scroll: window.scrollY })); } catch {}
    };
    // Save before navigation; do not overwrite the position while favorites are still loading.
    const capture = () => { if (restoreScroll.current === null) save(); };
    if (restoreScroll.current === null) save();
    window.addEventListener("scroll", capture, { passive: true });
    window.addEventListener("pagehide", capture);
    document.addEventListener("click", capture, true);
    return () => {
      window.removeEventListener("scroll", capture);
      window.removeEventListener("pagehide", capture);
      document.removeEventListener("click", capture, true);
    };
  }, [restored, keyword, filters, onlySaved, limit]);
  useEffect(() => {
    if (!restored || !ready || restoreScroll.current === null) return;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({ top: restoreScroll.current, behavior: "instant" });
      restoreScroll.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [restored, ready, keyword, filters, onlySaved, limit]);
  const classifications = [...new Set(visibleSakePairings.flatMap(i => i.style))].sort();
  const temperatures = temperatureOptions(visibleSakePairings);
  const filtered = useMemo(() => sortSearch(visibleSakePairings.filter(item=>matchesSearch(item,{keyword,filters,onlySaved,ids})),filters.sort,prefectureOrder), [keyword, filters, onlySaved, ids]);
  const change = (key, value) => { setFilters(current => ({ ...current, [key]: value })); setLimit(24); };
  const fields = [
    ["prefecture", "産地", prefectureOrder], ["dish", "料理", dishOptions], ["taste", "味わい", tasteOptions],
    ["classification", "種類", classifications], ["temperature", "飲み方・温度", [...temperatureGroups.map(([id,label])=>[`group:${id}`,label]),...temperatures]], ["night", "夜の気分", discoveryNights.map(n => [n.id, n.name])],
  ];
  const fieldValue=(key,options)=>{const option=options.find(o=>(Array.isArray(o)?o[0]:o)===filters[key]);return option?(Array.isArray(option)?option[1]:option):filters[key] || 'すべて';};
  const selected=fields.filter(([key])=>filters[key]).map(([key,name,options])=>({key,label:`${name}：${fieldValue(key,options)}`}));
  const reset=()=>{setFilters(emptySearchFilters());setKeyword('');setOnlySaved(false);setLimit(24);};
  return <section id="search" className="search-page"><p className="section-kicker">日本酒から探す</p><h1 className="phrase-heading"><span>気になる一本から、</span><span>食卓の料理を。</span></h1>
    <label className="search-keyword"><span>商品名・蔵元・料理など</span><input type="search" value={keyword} onChange={e=>{setKeyword(e.target.value);setLimit(24);}} placeholder="例：鍋島、肉じゃが、冷酒" /></label>
    <div className="temperature-shortcuts" role="group" aria-label="温度から絞り込む">{temperatureGroups.map(([id,label])=><button key={id} className="filter-chip" aria-pressed={filters.temperature===`group:${id}`} onClick={()=>change('temperature',filters.temperature===`group:${id}`?'':`group:${id}`)}>{label}</button>)}</div>
    <details className="search-filters"><summary><span>検索条件を選ぶ</span><span className="filter-overview">{fields.map(([key,name,options])=><span key={key}>{name}<small>{fieldValue(key,options)}</small></span>)}</span></summary><div className="filter-grid">{fields.map(([key,name,options])=><label key={key}><span>{name}</span><select aria-label={name} value={filters[key]} onChange={e=>change(key,e.target.value)}><option value="">すべて</option>{filters[key]&&!options.some(o=>(Array.isArray(o)?o[0]:o)===filters[key])&&<option value={filters[key]}>{filters[key]}</option>}{options.map(option=><option key={Array.isArray(option)?option[0]:option} value={Array.isArray(option)?option[0]:option}>{Array.isArray(option)?option[1]:option}</option>)}</select></label>)}</div></details>
    {(selected.length>0||keyword||onlySaved) && <div className="active-search-conditions" aria-label="選択中の条件">{keyword&&<button className="filter-chip" onClick={()=>{setKeyword('');setLimit(24);}} aria-label={`検索語 ${keyword}を解除`}>{keyword} ×</button>}{selected.map(({key,label})=><button key={key} className="filter-chip" onClick={()=>change(key,'')} aria-label={`${label}を解除`}>{label} ×</button>)}{onlySaved&&<button className="filter-chip" onClick={()=>setOnlySaved(false)}>おちょこの中だけ ×</button>}<button className="text-link" onClick={reset}>すべて解除</button></div>}
    <div className="search-sort"><label>並び順<select aria-label="並び順" value={filters.sort} onChange={e=>change('sort',e.target.value)}><option value="">掲載順</option><option value="prefecture">都道府県順</option><option value="region">産地・蔵元順</option></select></label></div>
    <div className="search-toolbar"><p aria-live="polite">{filtered.length}商品 <small>/ 全{visibleSakePairings.length}商品</small></p><label className="saved-toggle"><OchokoIcon filled={onlySaved} /><input type="checkbox" checked={onlySaved} disabled={!ready} onChange={e=>{setOnlySaved(e.target.checked);setLimit(24);}} /><span>おちょこの中だけ</span></label></div>
    <div className="search-result-grid">{filtered.slice(0,limit).map(item=><SearchCard key={item.id} item={item} />)}</div>{filtered.length===0&&<p className="empty-state">{onlySaved?'気になるお酒をおちょこに入れると、ここで見返せます。':'この組み合わせは見つかりませんでした。条件をひとつ外してみてください。'}</p>}{filtered.length>limit&&<button className="yoi-button load-more" onClick={()=>setLimit(current=>current+24)}>続きを見る</button>}
  </section>;
}
