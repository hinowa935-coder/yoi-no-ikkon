"use client";
import { useSearchParams } from "next/navigation";
import useCurrentTokyoDay from './useCurrentTokyoDay.js';
import DiscoveryFlow from "./DiscoveryFlow.jsx";
import { discoveryNights, discoveryDishes, foodDirections } from "../../data/discovery.js";
import {canonicalFoodName} from '../../data/foodCatalog.js';
export default function DiscoveryQueryFlow({ seed, initialNight = "" }) {
  const query = useSearchParams();
  const today=useCurrentTokyoDay() || seed;
  const night = discoveryNights.find(n => n.id === query.get("night"))?.id || initialNight;
  const direction = night ? foodDirections.find(d => d.id === query.get("direction"))?.id || "" : "";
  const dish = direction ? discoveryDishes.find(d => d.directions.includes(direction) && d.name === canonicalFoodName(query.get("dish")))?.name || "" : "";
  const day=/^\d{4}-\d{2}-\d{2}$/.test(query.get('day') || '')?query.get('day'):today;
  const count=Number(query.get('dishes'));
  return <DiscoveryFlow seed={day} seasonSeed={today} initialNight={night} initialDirection={direction} initialDish={dish} initialDishLimit={Number.isInteger(count)?Math.max(6,Math.min(24,count)):6} />;
}
