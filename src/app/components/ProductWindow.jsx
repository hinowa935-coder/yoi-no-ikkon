"use client";
import {useEffect,useRef,useState} from 'react';
import {OchokoIcon} from './InterfaceIcons.jsx';
import {emitAffiliateClick} from '../../commerce/entryTracking.js';
import {useCommerceMedia} from './CommerceMediaProvider.jsx';

export default function ProductWindow({item,compact=false,context={}}) {
  const region=useRef(null);
  const [nearViewport,setNearViewport]=useState(!compact);
  const {media:image,expected}=useCommerceMedia(item.id,nearViewport);
  const [failed,setFailed]=useState(false);
  const [expired,setExpired]=useState(false);
  const [ready,setReady]=useState(false);
  useEffect(()=>{
    if(!compact||!expected||nearViewport)return;
    if(!('IntersectionObserver' in window)){setNearViewport(true);return;}
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting)){setNearViewport(true);observer.disconnect();}
    },{rootMargin:'160px'});
    if(region.current)observer.observe(region.current);
    return ()=>observer.disconnect();
  },[compact,expected,nearViewport]);
  useEffect(()=>{
    setReady(true);
    if(!image)return;
    let timer;
    const check=()=>{
      clearTimeout(timer);
      const remaining=Date.parse(image.validUntil)-Date.now();
      setExpired(!(remaining>0));
      if(remaining>0)timer=setTimeout(check,Math.min(remaining,2147483647));
    };
    check();window.addEventListener('focus',check);
    return ()=>{clearTimeout(timer);window.removeEventListener('focus',check);};
  },[image]);
  const visible=image && nearViewport && ready && !failed && !expired;
  const click=event=>{
    if(!event.target.closest?.('a'))return;
    if(Date.parse(image.validUntil)<=Date.now()){event.preventDefault();setExpired(true);return;}
    emitAffiliateClick({sakeId:item.id,sakeName:item.productName,prefecture:item.prefecture,provider:'rakuten',
      destinationType:'product_page',matchConfidence:'high',isAffiliate:true,...context});
  };
  return <figure ref={region} className={`product-window ${compact?'is-compact':''} ${visible?'has-image':'is-placeholder'} ${expected?'reserves-image':''}`} aria-label={`${item.productName}の商品画像`} data-ga-rakuten-placement="sake_purchase" data-ga-sake-id={item.id} data-ga-sake-name={item.productName}>
    <div className="product-window-stage">{visible ?
      <div className="official-product-creative" role="group" aria-label={`${item.productName}を楽天市場で見る（外部サイト・広告）`} onClick={click} onAuxClick={click} onErrorCapture={()=>setFailed(true)}
        dangerouslySetInnerHTML={{__html:compact?image.compactHtml:image.html}} /> : <OchokoIcon />}</div>
    {!compact && (visible ? <figcaption><span>広告 / 楽天市場の商品画像。{image.capacityMl}ml{image.stockStatus==='SOLD_OUT'?'・確認時は在庫切れ':''}</span>{image.affiliateUrl && <a href={image.affiliateUrl} target="_blank" rel="sponsored noopener" aria-label={`${item.productName}の楽天商品を見る（外部サイト）`} onClick={click}>楽天の商品を見る ↗</a>}</figcaption> :
      <figcaption><strong>商品画像は準備中です</strong><span>購入先でラベル・商品情報をご確認いただけます。</span></figcaption>)}
    {compact && <figcaption>{visible?<><span>広告 / 楽天市場</span>{image.affiliateUrl && <a href={image.affiliateUrl} target="_blank" rel="sponsored noopener" aria-label={`${item.productName}の楽天商品を見る（外部サイト）`} onClick={click}>楽天の商品を見る ↗</a>}</>:<span aria-hidden="true">&nbsp;</span>}</figcaption>}
  </figure>;
}
