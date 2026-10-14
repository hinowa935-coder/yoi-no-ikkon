"use client";
import {useEffect,useState} from 'react';
import {OchokoIcon} from './InterfaceIcons.jsx';
import {productMediaFor} from '../../commerce/productMedia.js';
import {emitAffiliateClick} from '../../commerce/entryTracking.js';
import {useCommerceMedia} from './CommerceMediaProvider.jsx';

export default function ProductWindow({item,compact=false}) {
  const image=productMediaFor(item);
  const enabled=useCommerceMedia();
  const [failed,setFailed]=useState(false);
  const [expired,setExpired]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    setReady(true);
    if(!image)return;
    const remaining=Date.parse(image.validUntil)-Date.now();
    if(!Number.isFinite(remaining)||remaining<=0){setExpired(true);return;}
    const timer=setTimeout(()=>setExpired(true),Math.min(remaining,2147483647));
    return ()=>clearTimeout(timer);
  },[image]);
  const visible=enabled && image && ready && !failed && !expired;
  const click=event=>{
    if(!event.target.closest?.('a'))return;
    if(Date.parse(image.validUntil)<=Date.now()){event.preventDefault();setExpired(true);return;}
    emitAffiliateClick({sakeId:item.id,sakeName:item.productName,prefecture:item.prefecture,provider:'rakuten',
      destinationType:'product_page',matchConfidence:'high',isAffiliate:true});
  };
  return <figure className={`product-window ${compact?'is-compact':''}`} aria-label={`${item.productName}の商品画像`}>
    <div className="product-window-stage">{visible ?
      <div className="official-product-creative" onClick={click} onAuxClick={click} onErrorCapture={()=>setFailed(true)}
        dangerouslySetInnerHTML={{__html:compact?image.compactHtml:image.html}} /> : <OchokoIcon />}</div>
    {!compact && (visible ? <figcaption>広告 / 楽天市場の商品画像。{image.capacityMl}ml</figcaption> :
      <figcaption><strong>商品画像は準備中です</strong><span>購入先でラベル・商品情報をご確認いただけます。</span></figcaption>)}
    {compact && <figcaption>{visible?'広告 / 楽天市場':<span aria-hidden="true">&nbsp;</span>}</figcaption>}
  </figure>;
}
