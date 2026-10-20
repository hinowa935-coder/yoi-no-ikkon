"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X, Check } from 'lucide-react';
import { emptySearchFilters, readSearchLocation, writeSearchLocation, isCurrentSearchLocation } from "./searchLocation.js";
import { visibleSakePairings, prefectureOrder, dishOptions, tasteOptions } from "../../data/siteData.js";
import { discoveryNights } from "../../data/discovery.js";
import { useFavorites, OchokoIcon } from "./Ochoko.jsx";
import { temperatureOptions, temperatureGroups } from '../../data/temperatureUX.js';
import { matchesSearch, sortSearch } from '../../data/searchFiltering.js';
import { simpleTasteOptions, aromaOptions, bodyOptions } from '../../data/searchFacets.js';
import SakeCardPreview from './SakeCardPreview.jsx';

export function SearchCard({item,savedHistory=false}){
  return <SakeCardPreview item={item}>{savedHistory&&<p className="muted-copy">以前の掲載商品です。おちょこにはそのまま残しています。</p>}</SakeCardPreview>;
}
export default function SakeSearch(){
  const [keyword,setKeyword]=useState(''),[filters,setFilters]=useState(emptySearchFilters),[onlySaved,setOnlySaved]=useState(false),[limit,setLimit]=useState(24);
  const {ids,ready}=useFavorites();
  const [restored,setRestored]=useState(false),[sheetOpen,setSheetOpen]=useState(false);
  const restoreScroll=useRef(null),dialog=useRef(null),filterButton=useRef(null),searchInput=useRef(null);
  useEffect(()=>{
    const restore=()=>{
      let saved=null;try{saved=JSON.parse(sessionStorage.getItem('yoi-search-v1'));}catch{}
      const explicit=window.location.search.length>1,search=explicit?window.location.search:saved?.search||'',state=readSearchLocation(search);
      setKeyword(state.keyword);setFilters(state.filters);setOnlySaved(state.onlySaved);setLimit(state.limit);
      restoreScroll.current=saved?.search===search&&Number.isFinite(saved?.scroll)?Math.max(0,saved.scroll):null;setRestored(true);
    };restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);
  },[]);
  useEffect(()=>{
    if(!restored)return;
    const search=writeSearchLocation(window.location.search,{keyword,filters,onlySaved,limit});
    window.history.replaceState(window.history.state,'',window.location.pathname+search+window.location.hash);
    const save=()=>{
      // Next may reset scroll before unmounting this page during client navigation.
      if(!isCurrentSearchLocation(window.location,search))return;
      try{sessionStorage.setItem('yoi-search-v1',JSON.stringify({search,scroll:window.scrollY}));}catch{}
    };
    const capture=()=>{if(restoreScroll.current===null)save();};
    if(restoreScroll.current===null)save();
    window.addEventListener('scroll',capture,{passive:true});window.addEventListener('pagehide',capture);document.addEventListener('click',capture,true);
    return()=>{window.removeEventListener('scroll',capture);window.removeEventListener('pagehide',capture);document.removeEventListener('click',capture,true);};
  },[restored,keyword,filters,onlySaved,limit]);
  useEffect(()=>{
    if(!restored||!ready||restoreScroll.current===null)return;
    const frame=requestAnimationFrame(()=>{window.scrollTo({top:restoreScroll.current,behavior:'instant'});restoreScroll.current=null;});return()=>cancelAnimationFrame(frame);
  },[restored,ready,keyword,filters,onlySaved,limit]);
  useEffect(()=>{
    if(!sheetOpen)return;
    const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
    return()=>{document.body.style.overflow=overflow;};
  },[sheetOpen]);
  const classifications=useMemo(()=>[...new Set(visibleSakePairings.flatMap(i=>i.style))].sort(),[]);
  const temperatures=useMemo(()=>temperatureOptions(visibleSakePairings),[]);
  const filtered=useMemo(()=>sortSearch(visibleSakePairings.filter(item=>matchesSearch(item,{keyword,filters,onlySaved,ids})),filters.sort,prefectureOrder),[keyword,filters,onlySaved,ids]);
  const change=(key,value)=>{setFilters(current=>({...current,[key]:value}));setLimit(24);};
  const fields=[['taste','味わい',[...new Set([...simpleTasteOptions,...tasteOptions])]],['aroma','香り',aromaOptions],['body','飲み口',bodyOptions],['temperature','飲み方',[...temperatureGroups.map(([id,label])=>['group:'+id,label]),...temperatures]],['prefecture','都道府県',prefectureOrder],['classification','種類',classifications],['dish','料理',dishOptions],['night','夜の気分',discoveryNights.map(n=>[n.id,n.name])]];
  const valueLabel=(value,options)=>{const option=options.find(o=>(Array.isArray(o)?o[0]:o)===value);return option?(Array.isArray(option)?option[1]:option):value;};
  const selected=fields.filter(([key])=>filters[key]).map(([key,name,options])=>({key,label:valueLabel(filters[key],options),name}));
  const count=selected.length+Number(!!keyword)+Number(onlySaved);
  const reset=()=>{setFilters(emptySearchFilters());setKeyword('');setOnlySaved(false);setLimit(24);};
  const relaxations=useMemo(()=>{
    if(filtered.length)return[];
    return fields.filter(([key])=>filters[key]).map(([key,name])=>({key,name,count:visibleSakePairings.filter(item=>matchesSearch(item,{keyword,filters:{...filters,[key]:''},onlySaved,ids})).length})).filter(r=>r.count>0).slice(0,3);
  },[filtered.length,keyword,filters,onlySaved,ids]);
  const chips=(key,label,options)=><fieldset className="facet-group"><legend>{label}</legend><div className="facet-options">{options.map(option=>{const[value,text]=Array.isArray(option)?option:[option,option],active=filters[key]===value;return <button type="button" key={value} className="filter-chip" aria-pressed={active} onClick={()=>change(key,active?'':value)}>{active&&<Check size={15} aria-hidden="true"/>}{text}</button>;})}</div></fieldset>;
  const select=(key,label,options)=><label className="facet-select" key={key}><span>{label}</span><select aria-label={label} value={filters[key]} onChange={e=>change(key,e.target.value)}><option value="">すべて</option>{filters[key]&&!options.some(o=>(Array.isArray(o)?o[0]:o)===filters[key])&&<option value={filters[key]}>{filters[key]}</option>}{options.map(option=>{const[v,t]=Array.isArray(option)?option:[option,option];return <option key={v} value={v}>{t}</option>;})}</select></label>;
  const close=()=>dialog.current?.close();
  const keepFocus=event=>{
    if(event.key!=='Tab')return;
    const controls=[...event.currentTarget.querySelectorAll('button, input, select, summary, a[href], [tabindex="0"]')].filter(el=>!el.disabled&&el.getClientRects().length>0);
    const first=controls[0],last=controls.at(-1);
    if((event.shiftKey&&document.activeElement===first)||(!event.shiftKey&&document.activeElement===last)){
      event.preventDefault();(event.shiftKey?last:first)?.focus();
    }
  };
  return <section id="search" className="search-page">
    <p className="section-kicker">日本酒から探す</p><h1 className="phrase-heading"><span>気になる一本から、</span><span>食卓の料理を。</span></h1>
    <label className="search-keyword"><span>商品名・蔵元・料理など</span><span className="keyword-control"><input ref={searchInput} type="text" role="searchbox" inputMode="search" enterKeyHint="search" aria-label="商品名・蔵元・料理など" value={keyword} onChange={e=>{setKeyword(e.target.value);setLimit(24);}} placeholder="例：鍋島、肉じゃが"/>{keyword&&<button type="button" aria-label="検索語を消す" onClick={()=>{setKeyword('');setLimit(24);searchInput.current.focus();}}><X size={18} aria-hidden="true"/></button>}</span></label>
    <div className="drinking-style"><span>飲み方</span><div className="temperature-shortcuts" role="group" aria-label="飲み方">{temperatureGroups.map(([id,label])=><button type="button" key={id} className="filter-chip" aria-pressed={filters.temperature==='group:'+id} onClick={()=>change('temperature',filters.temperature==='group:'+id?'':'group:'+id)}>{filters.temperature==='group:'+id&&<Check size={15} aria-hidden="true"/>}{label}</button>)}</div></div>
    <div className="search-controls"><button ref={filterButton} type="button" className="filter-open" aria-haspopup="dialog" aria-controls="search-filter-sheet" onClick={()=>{dialog.current.showModal();setSheetOpen(true);}}><SlidersHorizontal size={18} aria-hidden="true"/>絞り込む{count>0&&<span className="filter-count">{count}</span>}</button><label className="search-order">並び順<select aria-label="並び順" value={filters.sort} onChange={e=>change('sort',e.target.value)}><option value="">掲載順</option><option value="prefecture">都道府県順</option><option value="region">産地・蔵元順</option></select></label></div>
    {count>0&&<div className="active-search-conditions" aria-label="選択中の条件">{keyword&&<button type="button" className="filter-chip" onClick={()=>{setKeyword('');setLimit(24);}} aria-label={`検索語 ${keyword}を解除`}>{keyword}<X size={14} aria-hidden="true"/></button>}{selected.map(({key,label,name})=><button type="button" key={key} className="filter-chip" onClick={()=>change(key,'')} aria-label={`${name} ${label}を解除`}>{label}<X size={14} aria-hidden="true"/></button>)}{onlySaved&&<button type="button" className="filter-chip" onClick={()=>setOnlySaved(false)}>おちょこの中だけ<X size={14} aria-hidden="true"/></button>}<button type="button" className="text-link" onClick={reset}>すべて解除</button></div>}
    <div className="search-toolbar"><p aria-live="polite">{filtered.length}本の一献 <small>/ 全{visibleSakePairings.length}本</small></p><label className="saved-toggle"><OchokoIcon filled={onlySaved}/><input type="checkbox" checked={onlySaved} disabled={!ready} onChange={e=>{setOnlySaved(e.target.checked);setLimit(24);}}/><span>おちょこの中だけ</span></label></div>
    <div className="search-result-grid">{filtered.slice(0,limit).map(item=><SearchCard key={item.id} item={item}/>)}</div>
    {filtered.length===0&&<div className="empty-state"><h2>該当する一献がありません</h2><p>{onlySaved?'保存したお酒がないか、条件に合うお酒がありません。':'条件を少し減らしてみませんか。'}</p>{relaxations.map(r=><button type="button" className="text-link" key={r.key} onClick={()=>change(r.key,'')}>{r.name}の条件を外すと{r.count}本あります</button>)}<button type="button" className="yoi-button" onClick={reset}>条件をリセット</button></div>}
    {filtered.length>limit&&<button type="button" className="yoi-button load-more" onClick={()=>setLimit(current=>current+24)}>続きを見る</button>}
    <dialog id="search-filter-sheet" ref={dialog} className="filter-sheet" aria-labelledby="filter-sheet-title" onKeyDown={keepFocus} onClose={()=>{setSheetOpen(false);filterButton.current?.focus({preventScroll:true});}} onClick={e=>{if(e.target!==e.currentTarget)return;const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}}>
      <header className="filter-sheet-header"><h2 id="filter-sheet-title">絞り込み</h2><button type="button" className="icon-button" aria-label="絞り込みを閉じる" onClick={close}><X size={22} aria-hidden="true"/></button></header>
      <div className="filter-sheet-scroll">{chips('taste','味わい',simpleTasteOptions)}{chips('aroma','香り',aromaOptions)}{chips('body','飲み口',bodyOptions)}{chips('temperature','飲み方',temperatureGroups.map(([id,label])=>['group:'+id,label]))}{select('prefecture','都道府県',prefectureOrder)}
        <details className="advanced-search"><summary>さらに細かく選ぶ</summary><div className="advanced-search-fields">{select('classification','種類',classifications)}{select('dish','料理',dishOptions)}{select('night','夜の気分',discoveryNights.map(n=>[n.id,n.name]))}{select('taste','味わいの詳細',tasteOptions)}</div>{filters.temperature&&!filters.temperature.startsWith('group:')&&<p className="muted-copy">引き継いだ飲み方：{valueLabel(filters.temperature,temperatures)}</p>}</details>
      </div>
      <footer className="filter-sheet-footer"><button type="button" className="text-link" onClick={reset}>すべて解除</button><button type="button" className="yoi-button" onClick={close}>{filtered.length}本を見る</button></footer>
    </dialog>
  </section>;
}
