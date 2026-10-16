"use client";
import { trackEvent } from '../../data/telemetry.js';
import { foodLinkIsCurrent } from '../../data/foodCatalog.js';
export default function FoodExternalLink({ link, food, kind='recipe', productName='', region=[], affiliate=false, children }) {
  if (!foodLinkIsCurrent(link)) return null;
  const event=kind==='specialty'?'specialty_affiliate_click':kind==='recipe'?'recipe_link_click':'food_reference_click';
  return <a className="text-link food-external-link" href={link.url} target="_blank" rel={affiliate?'nofollow sponsored noopener noreferrer':'noopener noreferrer'} onClick={()=>trackEvent(event,{
    dish_id:food.id,dish_name:food.name,provider:link.provider,
    ...(kind==='specialty'?{product_name:productName,region:region.join('・'),affiliate}:{source_page:`/food/${food.slug}`}),
  })}>{children}<span aria-label="外部サイト"> ↗</span></a>;
}
