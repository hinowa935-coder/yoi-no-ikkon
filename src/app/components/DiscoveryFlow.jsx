"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { daySeed, discoveryNights, discoveryDishes, foodDirections, suggestDishes, recommendSake } from "../../data/discovery.js";
import { trackEvent } from "../../data/telemetry.js";
import DiscoverySakeCard from "./DiscoverySakeCard.jsx";
import TrackedLink from "./TrackedLink.jsx";

export default function DiscoveryFlow({ seed: initialSeed, initialNight = "", initialDirection = "", initialDish = "" }) {
  const [seed, setSeed] = useState(initialSeed);
  useEffect(() => { setSeed(daySeed()); }, []);
  const [nightId, setNightId] = useState(initialNight);
  const [directionId, setDirectionId] = useState(initialDirection);
  const [dishName, setDishName] = useState(initialDish);
  const reduced = useReducedMotion();
  const night = discoveryNights.find(n => n.id === nightId);
  let dishes = night && directionId ? suggestDishes(nightId, directionId, seed) : [];
  const selectedDish = discoveryDishes.find(d => d.name === dishName && d.directions.includes(directionId));
  if (selectedDish && !dishes.some(d => d.name === dishName)) dishes = [selectedDish, ...dishes].slice(0, 6);
  const recommendations = dishName && night ? recommendSake(dishName, nightId, seed) : [];
  const moveTo = id => requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "instant" : "smooth", block: "start" }));
  const chooseNight = id => {
    setNightId(id); setDirectionId(""); setDishName("");
    trackEvent("discovery_start", { source: "night" }); trackEvent("night_selected", { night_id: id }); moveTo("food-direction");
  };
  const chooseDirection = id => {
    setDirectionId(id); setDishName(""); trackEvent("food_direction_selected", { night_id: nightId, direction_id: id }); moveTo("dish-choices");
  };
  const chooseDish = name => {
    setDishName(name); trackEvent("dish_selected", { dish: name, night_id: nightId });
    trackEvent("sake_recommended", { dish: name, night_id: nightId, sake_ids: recommendSake(name, nightId, seed).map(r => r.item.id) }); moveTo("sake-recommendations");
  };
  return <div className="discovery-flow"><section><p className="section-kicker">01 / 今夜の気分</p><h1>今夜は、どんな夜？</h1><div className="night-grid">{discoveryNights.map(n => <button className={`night-choice ${nightId === n.id ? "is-selected" : ""}`} key={n.id} aria-pressed={nightId === n.id} onClick={() => chooseNight(n.id)}><span>{n.name}</span><small>{n.description}</small><span className="choice-arrow" aria-hidden="true">→</span></button>)}</div></section>{night && <section id="food-direction" className="flow-step"><p className="section-kicker">02 / {night.name}</p><h2>今夜、どんなものが食べたい？</h2><p className="muted-copy">{night.description}</p><div className="direction-grid">{foodDirections.map(d => <button className={`yoi-button ${directionId === d.id ? "is-selected" : ""}`} key={d.id} aria-pressed={directionId === d.id} onClick={() => chooseDirection(d.id)}>{d.name}</button>)}</div></section>}{dishes.length > 0 && <section id="dish-choices" className="flow-step"><p className="section-kicker">03 / 今夜のひと皿</p><h2>このあたりは、どうでしょう。</h2><div className="dish-choice-grid">{dishes.map(d => <button className={`dish-choice ${dishName === d.name ? "is-selected" : ""}`} key={d.name} aria-pressed={dishName === d.name} onClick={() => chooseDish(d.name)}><span>{d.name}</span><small>{d.flavor}</small><span aria-hidden="true">→</span></button>)}</div><TrackedLink href="/food" className="text-link" event="discovery_start" parameters={{ source: "other_foods" }}>ほかの料理を見る →</TrackedLink></section>}{recommendations.length > 0 && <section id="sake-recommendations" className="flow-step" aria-live="polite"><p className="section-kicker">04 / ひと皿から、一献へ</p><h2>{dishName}なら、今夜はこの三本。</h2><p className="muted-copy">料理と味わいを手がかりに、宵の一献が選びました。</p><motion.div key={`${nightId}:${dishName}`} initial={reduced ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="recommendation-grid">{recommendations.map(r => <DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} />)}</motion.div></section>}</div>;
}
