"use client";

import { useEffect, useState } from 'react';
import { chooseRakutenRoute } from '../../commerce/routeSelection.js';
import { affiliateEvent } from '../../commerce/tracking.js';
import { emitAffiliateClick } from '../../commerce/entryTracking.js';
import { purchaseLabel } from '../../commerce/purchasePresentation.js';

export default function RakutenPurchase({ plan, sakeName, prefecture }) {
  const [now,setNow]=useState(null);
  useEffect(()=>{
    let timer;
    const check=()=>{
      clearTimeout(timer);
      const t=Date.now();
      setNow(t);
      const next=[plan.affiliate,plan.normal].map(l=>Date.parse(l?.validUntil)-t)
        .filter(n=>n>0).sort((a,b)=>a-b)[0];
      if(next)timer=setTimeout(check,Math.min(next+1,2147483647));
    };
    check();
    window.addEventListener('focus',check);
    window.addEventListener('pageshow',check);
    document.addEventListener('visibilitychange',check);
    return ()=>{
      clearTimeout(timer);
      window.removeEventListener('focus',check);
      window.removeEventListener('pageshow',check);
      document.removeEventListener('visibilitychange',check);
    };
  },[plan]);
  const {type,link}=chooseRakutenRoute(plan,now);
  if(!link)return null;
  const onClick=event=>{
    if(event.type==='auxclick'&&event.button!==1)return;
    const t=Date.now(), live=chooseRakutenRoute(plan,t);
    if(!live.link){event.preventDefault();setNow(t);return;}
    if(live.link.url!==link.url){
      event.currentTarget.href=live.link.url;
      event.currentTarget.rel=live.link.isAffiliate?'sponsored noopener':'noopener';
      setNow(t);
    }
    const fields={...live.link,sakeName,prefecture};
    affiliateEvent('affiliate_offer_clicked',fields);
    emitAffiliateClick(fields);
  };
  return <div className="purchase-provider is-rakuten" data-ga-rakuten-placement="sake_purchase" data-rakuten-route={type}>
    {link.isAffiliate&&<p className="affiliate-disclosure">広告：リンクを通じた購入により、運営者に紹介料が入る場合があります。</p>}
    <a className="yoi-button" href={link.url} target="_blank" rel={link.isAffiliate?'sponsored noopener':'noopener'}
      onClick={onClick} onAuxClick={onClick}>{purchaseLabel(link)} ↗</a>
    {link.capacityMl&&<p className="offer-capacity">{link.capacityMl}ml</p>}
    <p className="muted-copy">外部サイトへ移動します。{type==='SEARCH'&&'検索結果には別の仕様のお酒も含まれます。'}商品名・容量・在庫は購入先でご確認ください。</p>
  </div>;
}
