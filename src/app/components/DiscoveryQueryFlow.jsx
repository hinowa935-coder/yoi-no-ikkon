"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import DiscoveryFlow from "./DiscoveryFlow.jsx";
import { discoveryNights, discoveryDishes, foodDirections } from "../../data/discovery.js";
export default function DiscoveryQueryFlow({ seed, initialNight = "" }) {
  const query = useSearchParams();
  const [today,setToday]=useState(seed);
  useEffect(()=>{setToday(new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()));},[]);
  const night = discoveryNights.find(n => n.id === query.get("night"))?.id || initialNight;
  const direction = night ? foodDirections.find(d => d.id === query.get("direction"))?.id || "" : "";
  const dish = direction ? discoveryDishes.find(d => d.directions.includes(direction) && d.name === query.get("dish"))?.name || "" : "";
  const day=/^\d{4}-\d{2}-\d{2}$/.test(query.get('day') || '')?query.get('day'):today;
  const count=Number(query.get('dishes'));
  return <DiscoveryFlow seed={day} initialNight={night} initialDirection={direction} initialDish={dish} initialDishLimit={Number.isInteger(count)?Math.max(6,Math.min(24,count)):6} />;
}
