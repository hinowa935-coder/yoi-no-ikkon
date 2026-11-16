'use client';

import {useEffect,useState} from 'react';

export default function ReviewedRakutenLink({link,className,children,affiliate=false,fallbackLabel='楽天でこの銘柄を探す ↗'}){
 const [expired,setExpired]=useState(false);
 useEffect(()=>{
   let timer;
   const check=()=>{clearTimeout(timer);const left=Date.parse(link.validUntil)-Date.now();setExpired(!(left>0));if(left>0)timer=setTimeout(check,Math.min(left,2147483647));};
   check();window.addEventListener('focus',check);
   return ()=>{clearTimeout(timer);window.removeEventListener('focus',check);};
 },[link.validUntil]);
 const onClick=(event)=>{
   if(!expired&&Date.parse(link.validUntil)<=Date.now()){
     event.currentTarget.href=link.normalFallbackUrl;
     setExpired(true);
   }
 };
 return <a href={expired?link.normalFallbackUrl:link.url} target="_blank" rel={affiliate&&!expired?'sponsored noopener':'noopener'} className={className} onClick={onClick} onAuxClick={onClick}>{expired?fallbackLabel:children}</a>;
}
