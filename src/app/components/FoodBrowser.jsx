"use client";
import { useState } from "react";
import Link from "next/link";
import { getFoodOptions, toPathSegment } from "../../data/siteData.js";
import { discoveryDishes } from "../../data/discovery.js";
import { trackEvent } from "../../data/telemetry.js";
export default function FoodBrowser() {
  const [query, setQuery] = useState("");
  const names = query ? getFoodOptions().filter(name => name.includes(query)) : discoveryDishes.map(d => d.name);
  return <section className="food-browser"><p className="section-kicker">料理から探す</p><h1>今夜の献立は、なににしよう。</h1><label className="search-keyword"><span>料理名</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="例：肉じゃが、冷奴、鶏" /></label><div className="dish-choice-grid">{names.map(name => <Link className="dish-choice" href={`/food/${toPathSegment(name)}`} key={name} onClick={() => trackEvent("dish_selected", { dish: name, source: "food_list" })}><span>{name}</span><span aria-hidden="true">→</span></Link>)}</div>{names.length === 0 && <p className="empty-state">料理名を少し短くして探してみてください。</p>}</section>;
}
