"use client";
import { useSearchParams } from "next/navigation";
import DiscoveryFlow from "./DiscoveryFlow.jsx";
import { discoveryNights, discoveryDishes, foodDirections } from "../../data/discovery.js";
export default function DiscoveryQueryFlow({ seed }) {
  const query = useSearchParams();
  const night = discoveryNights.find(n => n.id === query.get("night"))?.id || "";
  const direction = night ? foodDirections.find(d => d.id === query.get("direction"))?.id || "" : "";
  const dish = direction ? discoveryDishes.find(d => d.directions.includes(direction) && d.name === query.get("dish"))?.name || "" : "";
  return <DiscoveryFlow key={query.toString()} seed={seed} initialNight={night} initialDirection={direction} initialDish={dish} />;
}
