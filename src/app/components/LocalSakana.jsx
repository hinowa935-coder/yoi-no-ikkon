'use client';

import {useEffect,useRef,useState} from 'react';
import {trackEvent} from '../../data/telemetry.js';
import {OchokoIcon} from './InterfaceIcons.jsx';
import DetailAccordion from './DetailAccordion.jsx';
import {namesSummary} from '../../data/detailDisclosure.js';

function SakanaCard({card,sakeId}){
 const ref=useRef(null),seen=useRef(false);
 const [near,setNear]=useState(false),[failed,setFailed]=useState(false),[expired,setExpired]=useState(false);
 const sale=card.commerce;
 const parameters={sakeId,specialtyId:card.id,prefecture:card.prefecture,store:'rakuten',entrySource:'sake_detail_local_sakana'};
 useEffect(()=>{
  const element=ref.current;if(!element)return;
  const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){setNear(true);observer.disconnect();}},{rootMargin:'300px'});
  const impression=new IntersectionObserver(entries=>{if(!seen.current&&entries.some(e=>e.isIntersecting)){seen.current=true;trackEvent('specialty_impression',{sakeId,specialtyId:card.id,prefecture:card.prefecture,store:'rakuten',entrySource:'sake_detail_local_sakana'});impression.disconnect();}},{threshold:0.4});
  observer.observe(element);impression.observe(element);
  return()=>{observer.disconnect();impression.disconnect();};
 },[sakeId,card.id,card.prefecture]);
 useEffect(()=>{
  if(!sale)return;
  const check=()=>setExpired(!(Date.parse(sale.validUntil)>Date.now()));check();
  const timer=setInterval(check,60000);return()=>clearInterval(timer);
 },[sale]);
 const click=event=>{
  if(!event.target.closest?.('a'))return;
  if(expired||!sale||!(Date.parse(sale.validUntil)>Date.now())){event.preventDefault();setExpired(true);return;}
  trackEvent('specialty_click',parameters);trackEvent('specialty_rakuten_click',parameters);
 };
 return <article className="local-sakana-card" ref={ref}>
  <div className="local-sakana-image" role="group" aria-label={`${card.name}の商品画像。楽天市場へのリンク・広告`}>
   {near&&sale?.imageHtml&&!failed&&!expired?<div className="local-sakana-original" onClick={click} onAuxClick={click} onErrorCapture={()=>setFailed(true)} dangerouslySetInnerHTML={{__html:sale.imageHtml}}/>:<div className="local-sakana-placeholder"><OchokoIcon/><span>購入先で写真をご覧いただけます</span></div>}
  </div>
  <p className="local-sakana-region">{card.prefecture} / {card.region}</p>
  <h3>{card.name}</h3><p className="local-sakana-description">{card.description}</p>
  <p className="local-sakana-reason">{card.reason}</p>
  {sale&&!expired?<div className="local-sakana-purchase" onClick={click} onAuxClick={click}><a href={sale.url} target="_blank" rel={sale.isAffiliate?'nofollow sponsored noopener':'noopener'}>楽天で見てみる ↗</a><small>{sale.quantity} / {sale.merchant}{sale.isAffiliate?' / 広告':''}</small></div>:<p className="muted-copy">現在、購入先を確認しています。</p>}
  {card.sourceUrl&&<a href={card.sourceUrl} target="_blank" rel="noopener" className="local-sakana-source">この肴について ↗</a>}
 </article>;
}

export default function LocalSakana({cards,sakeId}){
 if(!cards.length)return null;
 return <section className="detail-band local-sakana" aria-labelledby="sake-local-sakana-toggle">
  <DetailAccordion id="sake-local-sakana" title="この土地の肴" summary={namesSummary(cards)} sakeId={sakeId} section="local_sakana">
  <p className="local-sakana-lead">同じ土地から、もう一品。</p>
  <p className="local-sakana-note">土地の食文化と、お酒の味わいから考えた宵の一献の提案です。購入リンクには広告が含まれます。</p>
  <div className="local-sakana-grid">{cards.map(card=><SakanaCard key={card.id} card={card} sakeId={sakeId}/>)}</div>
  </DetailAccordion>
 </section>;
}
