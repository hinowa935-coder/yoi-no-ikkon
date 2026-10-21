"use client";
import {ChevronRight} from './InterfaceIcons.jsx';
import {useEffect,useRef,useState} from 'react';
import {X,Check,Fish,Beef,Leaf,Flame,CookingPot,Wheat,MapPin,Utensils} from 'lucide-react';
import Link from 'next/link';
import {foodCatalog} from '../../data/foodCatalog.js';
import {foodBrowseCategories,foodBrowseIndex,matchesFoodBrowse} from '../../data/foodBrowsing.js';
import {readFoodLocation,writeFoodLocation} from './foodLocation.js';
import {trackEvent} from '../../data/telemetry.js';
import {DishIcon} from './ChoiceIcon.jsx';
const icons={fish:Fish,meat:Beef,leaf:Leaf,flame:Flame,fried:Utensils,pot:CookingPot,rice:Wheat,map:MapPin};
export default function FoodBrowser(){
  const [query,setQuery]=useState(''),[category,setCategory]=useState(''),[all,setAll]=useState(false),[limit,setLimit]=useState(24),[restored,setRestored]=useState(false);
  const input=useRef(null),restoreScroll=useRef(null),results=useRef(null);
  useEffect(()=>{
    const restore=()=>{let saved=null;try{saved=JSON.parse(sessionStorage.getItem('yoi-food-v1'));}catch{}
      const search=window.location.search||saved?.search||'',state=readFoodLocation(search);
      setQuery(state.query);setCategory(state.category);setAll(state.all);setLimit(state.limit);
      restoreScroll.current=saved?.search===search&&Number.isFinite(saved?.scroll)?Math.max(0,saved.scroll):null;setRestored(true);
    };restore();window.addEventListener('popstate',restore);return()=>window.removeEventListener('popstate',restore);
  },[]);
  useEffect(()=>{
    if(!restored)return;
    const search=writeFoodLocation(window.location.search,{query,category,all,limit});
    window.history.replaceState(window.history.state,'',window.location.pathname+search+window.location.hash);
    const save=()=>{if(restoreScroll.current!==null||window.location.pathname.replace(/\/$/,'')!=='/food'||window.location.search!==search)return;try{sessionStorage.setItem('yoi-food-v1',JSON.stringify({search,scroll:window.scrollY}));}catch{}};
    save();window.addEventListener('scroll',save,{passive:true});window.addEventListener('pagehide',save);document.addEventListener('click',save,true);
    return()=>{window.removeEventListener('scroll',save);window.removeEventListener('pagehide',save);document.removeEventListener('click',save,true);};
  },[restored,query,category,all,limit]);
  useEffect(()=>{if(!restored||restoreScroll.current===null)return;const frame=requestAnimationFrame(()=>{window.scrollTo({top:restoreScroll.current,behavior:'instant'});restoreScroll.current=null;});return()=>cancelAnimationFrame(frame);},[restored,query,category,all,limit]);
  const foods=foodCatalog.filter(food=>matchesFoodBrowse(food,{query,category})),showResults=!!(query||category||all),active=foodBrowseCategories.find(c=>c.id===category);
  const choose=value=>{setCategory(value);setAll(true);setLimit(24);requestAnimationFrame(()=>{results.current?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});results.current?.focus({preventScroll:true});});};
  return <section className="food-browser"><p className="section-kicker">料理から探す</p><h1>食卓の献立を探す。</h1>
    <label className="search-keyword"><span>料理名</span><span className="keyword-control"><input ref={input} type="text" role="searchbox" inputMode="search" enterKeyHint="search" aria-label="料理名" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}} placeholder="例：肉じゃが、冷奴、鶏"/>{query&&<button type="button" aria-label="料理の検索語を消す" onClick={()=>{setQuery('');setLimit(24);input.current.focus();}}><X size={18} aria-hidden="true"/></button>}</span></label>
    <section className="food-category-picker" aria-labelledby="food-category-title"><h2 id="food-category-title">どんな料理を探す？</h2><div className="food-category-grid">{foodBrowseCategories.map(c=>{const Icon=icons[c.icon],selected=category===c.id,count=foodCatalog.filter(f=>foodBrowseIndex.get(f.id).includes(c.id)&&matchesFoodBrowse(f,{query})).length;return <button type="button" key={c.id} className="food-category-choice" aria-pressed={selected} onClick={()=>choose(selected?'':c.id)}><span className="food-category-symbol"><Icon size={22} strokeWidth={1.5} aria-hidden="true"/>{selected&&<Check size={16} aria-hidden="true"/>}</span><span className="food-category-name">{c.name}</span><small>{count}品</small></button>;})}</div><button type="button" className="text-link food-show-all" onClick={()=>choose('')}>すべての料理を見る<ChevronRight/></button></section>
    {showResults&&<section ref={results} tabIndex={-1} className="food-browse-results" aria-label="料理の検索結果"><div className="food-results-heading"><h2>{active?.name||category||'すべての料理'}</h2><p role="status">{foods.length}品{category&&<small> / 全{foodCatalog.length}品</small>}</p>{category&&<button type="button" className="filter-chip" aria-label="料理カテゴリを解除" onClick={()=>choose('')}>{active?.name||category}<X size={14} aria-hidden="true"/></button>}</div><div className="dish-choice-grid food-choice-grid">{foods.slice(0,limit).map(food=><Link className="dish-choice visual-dish" href={`/food/${food.slug}`} key={food.id} onClick={()=>trackEvent('dish_selected',{dish:food.name,source:'food_list'})}><DishIcon method={food.category}/><span className="dish-choice-name">{food.name}{food.description&&<small className="food-card-description">{food.description}</small>}{food.region.length>0&&<small className="food-region">{food.region.join('・')}</small>}</span><ChevronRight/></Link>)}</div>
      {foods.length>limit&&<button type="button" className="yoi-button load-more" onClick={()=>setLimit(current=>current+24)}>続きを見る</button>}{foods.length===0&&<div className="empty-state"><h2>料理が見つかりませんでした</h2><p>料理名を少し短くするか、条件を減らしてみてください。</p><button type="button" className="yoi-button" onClick={()=>{setQuery('');choose('');}}>料理の条件をリセット</button></div>}
    </section>}
    <noscript><ul>{foodCatalog.map(food=><li key={food.id}><a href={`/food/${food.slug}`}>{food.name}</a></li>)}</ul></noscript>
  </section>;
}
