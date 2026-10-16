"use client";
import { ChevronRight } from "./InterfaceIcons.jsx";

import { useState } from "react";
import Link from "next/link";
import { foodCatalog, foodNameMatches } from '../../data/foodCatalog.js';
import { trackEvent } from "../../data/telemetry.js";
import {DishIcon} from './ChoiceIcon.jsx';
export default function FoodBrowser() {
  const [query, setQuery] = useState("");
  const [category,setCategory]=useState('');
  const [limit,setLimit]=useState(24);
  const categories=[...new Set(foodCatalog.map(d=>d.category))];
  const foods=foodCatalog.filter(food=>(!query||foodNameMatches(food.name,query))&&(!category||food.category===category));
  return <section className="food-browser"><p className="section-kicker">料理から探す</p><h1>食卓の献立を探す。</h1>
    <label className="search-keyword"><span>料理名</span><input type="search" value={query} onChange={e=>{setQuery(e.target.value);setLimit(24);}} placeholder="例：肉じゃが、冷奴、鶏" /></label>
    <label className="food-category">料理の種類<select aria-label="料理の種類" value={category} onChange={e=>{setCategory(e.target.value);setLimit(24);}}><option value="">すべての料理</option>{categories.map(c=><option key={c}>{c}</option>)}</select></label>
    <p aria-live="polite">{foods.length}品</p><div className="dish-choice-grid food-choice-grid">{foods.slice(0,limit).map(food=><Link className="dish-choice visual-dish" href={`/food/${food.slug}`} key={food.id} onClick={()=>trackEvent('dish_selected',{dish:food.name,source:'food_list'})}><DishIcon method={food.category} /><span className="dish-choice-name">{food.name}{food.description&&<small className="food-card-description">{food.description}</small>}{food.region.length>0&&<small className="food-region">{food.region.join('・')}</small>}</span><ChevronRight /></Link>)}</div>
    {foods.length>limit&&<button className="yoi-button load-more" onClick={()=>setLimit(limit+24)}>続きを見る</button>}{foods.length===0&&<p className="empty-state">料理名を少し短くして探してみてください。</p>}
  </section>;
}
