import {trackEvent} from '../data/telemetry.js';
import {toPathSegment} from '../data/siteData.js';
import {discoveryDishes} from '../data/discoveryNights.js';
export function recordSakeEntry(href) {
  if(typeof window==='undefined'||typeof href!=='string')return;
  let destination;try{destination=new URL(href,window.location.origin);}catch{return;}
  if(destination.origin!==window.location.origin||!/^\/sake\/[a-z0-9-]+$/.test(destination.pathname))return;
  const page=window.location.pathname;
  const query=new URLSearchParams(window.location.search);
  const night=query.get('night')||(/^\/nights\//.test(page)?page.split('/')[2]:null);
  const dish=discoveryDishes.find(d=>d.name===query.get('dish'));
  const food=/^\/food\/[a-z0-9-]+$/.test(page)?page.split('/')[2]:page==='/discover'&&dish?toPathSegment(dish.name):null;
  try{sessionStorage.setItem('yoi-commerce-entry',JSON.stringify({sake_id:destination.pathname.split('/')[2],source_page:page,
    night_id:/^[a-z-]{1,40}$/.test(night||'')?night:null,food_id:food,at:Date.now()}));}catch{}
}
export function emitAffiliateClick(offer,emit=trackEvent) {
  if(offer.provider!=='rakuten'||offer.isAffiliate!==true)return;
  let entry={};
  if(typeof window!=='undefined')try{
    const saved=JSON.parse(sessionStorage.getItem('yoi-commerce-entry')||'null');
    if(saved?.sake_id===offer.sakeId&&Date.now()-saved.at<30*60*1000)entry=saved;
  }catch{}
  const properties={sake_id:offer.sakeId,provider:'rakuten',link_type:offer.destinationType==='search_results'?'search':'product',
    match_confidence:['high','medium','low'].includes(offer.matchConfidence)?offer.matchConfidence:'medium',
    source_page:['/discover','/search','/ochoko'].includes(offer.sourcePage)?offer.sourcePage:entry.source_page||(typeof window==='undefined'?'sake_detail':window.location.pathname)};
  if(offer.sakeName)properties.sake_name=offer.sakeName;
  if(offer.prefecture)properties.prefecture=offer.prefecture;
  if(/^[a-z-]{1,40}$/.test(offer.nightId||''))properties.night_id=offer.nightId;
  else if(entry.night_id)properties.night_id=entry.night_id;
  if(/^item-[a-z0-9]+$/.test(offer.foodId||''))properties.food_id=offer.foodId;
  else if(entry.food_id)properties.food_id=entry.food_id;
  emit('affiliate_click',properties);
}
