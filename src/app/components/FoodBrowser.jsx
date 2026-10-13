"use client";
import { ChevronRight } from "./InterfaceIcons.jsx";

import { useState } from "react";
import Link from "next/link";
import { getFoodOptions, toPathSegment } from "../../data/siteData.js";
import { discoveryDishes } from "../../data/discovery.js";
import { trackEvent } from "../../data/telemetry.js";
export default function FoodBrowser() {
  const [query, setQuery] = useState("");
  const [category,setCategory]=useState('');
  const [limit,setLimit]=useState(24);
  const categories=[...new Set(discoveryDishes.map(d=>d.method))];
  const names=getFoodOptions().filter(name=>(!query||name.includes(query))&&(!category||discoveryDishes.some(d=>d.name===name&&d.method===category)));
  return <section className="food-browser"><p className="section-kicker">料理から探す</p><h1>食卓の献立を探す。</h1>
    <label className="search-keyword"><span>料理名</span><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}} placeholder="例：肉じゃが、冷奴、鶏" /></label>
    <label className="food-category">料理の種類<select aria-label="料理の種類" value={category} onChange={e=>{setCategory(e.target.value);setLimit(24);}}><option value="">すべての料理</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
    <p aria-live="polite">{names.length}品</p><div className="dish-choice-grid">{names.slice(0,limit).map(name=><Link className="dish-choice" href={`/food/${toPathSegment(name)}`} key={name} onClick={()=>trackEvent('dish_selected',{dish:name,source:'food_list'})}><span>{name}</span><ChevronRight /></Link>)}</div>
    {names.length>limit&&<button className="yoi-button load-more" onClick={()=>setLimit(limit+24)}>続きを見る</button>}{names.length===0&&<p className="empty-state">料理名を少し短くして探してみてください。</p>}
  </section>;
}
