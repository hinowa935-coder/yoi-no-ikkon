"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronRight } from "./InterfaceIcons.jsx";
import { discoveryNights, discoveryDishes, foodDirections, suggestDishes, recommendSake } from "../../data/discovery.js";
import { orderedNights } from "../../data/discoveryNights.js";
import { trackEvent } from "../../data/telemetry.js";
import DiscoverySakeCard from "./DiscoverySakeCard.jsx";
import TrackedLink from "./TrackedLink.jsx";
import { discoveryLocation } from "./discoveryLocation.js";
import {sakeDiscoveryHref} from '../../data/discoveryContext.js';
import {nightDesires,nightChoiceLabel,seasonalIcons} from '../../data/visualChoices.js';
import ChoiceIcon,{DishIcon,ChoiceText} from './ChoiceIcon.jsx';

export default function DiscoveryFlow({seed, seasonSeed=seed, initialNight="", initialDirection="", initialDish="", initialDishLimit=6}) {
  const router=useRouter();
  const [nightId,setNightId]=useState(initialNight);
  const [directionId,setDirectionId]=useState(initialDirection);
  const [dishName,setDishName]=useState(initialDish);
  const [dishLimit,setDishLimit]=useState(initialDishLimit);
  const [group,setGroup]=useState(discoveryNights.find(n=>n.id===initialNight)?.group || 'mood');
  const reduced=useReducedMotion();
  const initialResultShown=useRef(false);
  useEffect(()=>{
    setNightId(initialNight);setDirectionId(initialDirection);setDishName(initialDish);setDishLimit(initialDishLimit);
    if(initialNight)setGroup(discoveryNights.find(n=>n.id===initialNight)?.group || 'mood');
  },[initialNight,initialDirection,initialDish,initialDishLimit]);
  const moveTo=id=>requestAnimationFrame(()=>{const target=document.getElementById(id);target?.scrollIntoView({behavior:reduced?'instant':'smooth',block:'start'});target?.focus({preventScroll:true});});
  useEffect(()=>{
    const targetId=initialDish?'sake-recommendations':initialNight&&window.location.hash==='#food-direction'?'food-direction':null;
    if(!targetId || initialResultShown.current)return;
    initialResultShown.current=true;
    const frame=requestAnimationFrame(()=>{const result=document.getElementById(targetId);result?.scrollIntoView({block:'start'});result?.focus({preventScroll:true});});
    return()=>cancelAnimationFrame(frame);
  },[initialDish,initialNight]);
  const commit=(next,replace=false)=>{
    setNightId(next.nightId);setDirectionId(next.directionId);setDishName(next.dishName);setDishLimit(next.dishLimit);
    const href=discoveryLocation(new URL('/discover'+window.location.search,window.location.origin).href,{...next,seed});
    if(window.location.pathname.replace(/\/$/,'')!=='/discover')router.push(href,{scroll:false});
    else window.history[replace?'replaceState':'pushState'](window.history.state,'',href);
  };
  const chooseNight=id=>{commit({nightId:id,directionId:'',dishName:'',dishLimit:6});trackEvent('night_selected',{night_id:id});moveTo('food-direction');};
  const chooseDirection=id=>{commit({nightId,directionId:id,dishName:'',dishLimit:6});trackEvent('food_direction_selected',{night_id:nightId,direction_id:id});moveTo('dish-choices');};
  const chooseDish=name=>{commit({nightId,directionId,dishName:name,dishLimit});trackEvent('dish_selected',{dish:name,night_id:nightId});moveTo('sake-recommendations');};
  const night=discoveryNights.find(n=>n.id===nightId);
  const allDishes=night && directionId?suggestDishes(nightId,directionId,seed,Infinity):[];
  let dishes=allDishes.slice(0,dishLimit);
  const selected=discoveryDishes.find(d=>d.name===dishName && d.directions.includes(directionId));
  if(selected && !dishes.some(d=>d.name===dishName))dishes=[selected,...dishes].slice(0,dishLimit);
  const picks=selected && night?recommendSake(dishName,nightId,seed):[];
  const choices=group==='mood'?nightDesires.map(d=>({id:d.nightId,name:d.label,parts:d.parts,icon:d.icon,selected:d.nightIds.includes(nightId)})):orderedNights(group,seasonSeed).map(n=>({...n,icon:seasonalIcons[n.id],selected:n.id===nightId}));
  const directionIcons={warm:'bowl',fresh:'leaf',hearty:'meal',small:'cup',grilled:'flame',comfort:'pot'};
  return <div className="discovery-flow">
    <section><p className="section-kicker">01 / 夜の気分から</p><h1>どんな夜を過ごす？</h1>
      <div className="night-group-switch" role="group" aria-label="夜の選び方">{[['mood','気分・過ごし方'],['season','季節・天候']].map(([id,label])=><button className="yoi-button" key={id} aria-pressed={group===id} onClick={()=>setGroup(id)}>{label}</button>)}</div>
      <div className="night-grid visual-night-grid">{choices.map(n=><button className={`night-choice desire-choice ${n.selected?'is-selected':''}`} key={n.id} aria-pressed={n.selected} onClick={()=>chooseNight(n.id)}><ChoiceIcon name={n.icon} /><ChoiceText label={n.name} parts={n.parts} /><ChevronRight /></button>)}</div>
    </section>
    {night && <section id="food-direction" className="flow-step" tabIndex={-1}><p className="section-kicker">02 / {nightChoiceLabel(night)}</p><h2>何を食べたい？</h2><div className="direction-grid visual-direction-grid">{foodDirections.map(d=><button className={`yoi-button ${directionId===d.id?'is-selected':''}`} key={d.id} aria-pressed={directionId===d.id} onClick={()=>chooseDirection(d.id)}><ChoiceIcon name={directionIcons[d.id]} /><span>{d.name}</span></button>)}</div></section>}
    {dishes.length>0 && <section id="dish-choices" className="flow-step" tabIndex={-1}><p className="section-kicker">03 / ひと皿を選ぶ</p><h2>このあたりは、どうでしょう。</h2><div className="dish-choice-grid">{dishes.map(d=><button className={`dish-choice visual-dish ${dishName===d.name?'is-selected':''}`} key={d.name} aria-pressed={dishName===d.name} onClick={()=>chooseDish(d.name)}><DishIcon method={d.method} /><span className="dish-choice-name">{d.name}</span><small>{d.flavor}</small><ChevronRight /></button>)}</div>
      <div className="dish-more-actions">{allDishes.length>dishes.length && <button className="yoi-button" onClick={()=>commit({nightId,directionId,dishName,dishLimit:dishLimit+6},true)}>ほかの料理を見る</button>}<TrackedLink href="/food?all=1" className="text-link" event="discovery_start" parameters={{source:'all_foods'}}>料理をすべて見る →</TrackedLink></div>
    </section>}
    {picks.length>0 && <section id="sake-recommendations" className="flow-step" tabIndex={-1} aria-live="polite"><p className="discovery-conditions">{nightChoiceLabel(night)}・{dishName}</p><h2 className="recommendations-title"><span>{dishName}に合わせる、</span><span>この三本。</span></h2><motion.div key={`${nightId}:${dishName}`} initial={reduced?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{duration:0.35}} className="recommendation-grid">{picks.map(r=><DiscoverySakeCard key={r.item.id} item={r.item} reason={r.reason} contextHref={sakeDiscoveryHref(r.item.id,{nightId,directionId,dishName,seed,dishLimit})} context={{nightId,foodId:dishName,sourcePage:'/discover'}} />)}</motion.div></section>}
  </div>;
}
