import 'server-only';
import {cache} from 'react';
import {visibleSakePairings,buildPurchaseLinks} from '../data/siteData.js';
import {readCommerceConfig} from './providers.js';
import {createCommerceContext,resolveCommerceState} from './commerceState.js';
import {productFingerprint} from './validation.js';
import {selectPurchaseLinks} from './purchaseRouting.js';
import discovery from './generated/discovery-links.json';
import merchantAudit from './generated/merchant-links.json';
import replacementIds from './generated/replacement-ids.json';

const context=cache(()=>({now:Date.now(),commerce:createCommerceContext(readCommerceConfig(process.env))}));
const projection=cache(item=>{
 const {commerce,now}=context();
 return resolveCommerceState(item,commerce,now);
});

export function commerceForSake(item){
 const {now}=context();
 const state=projection(item);
 const found=discovery[item.id];
 const ignored=(process.env.PURCHASE_DISCOVERY_DISABLED_PROVIDERS||'').split(',').map(s=>s.trim());
 const discoverAmazon=process.env.PURCHASE_DISCOVERY_ENABLED==='false'||found?.productFingerprint!==productFingerprint(item)?[]:found.links.filter(l=>l.provider==='amazon'&&Date.parse(l.validUntil)>now&&!ignored.includes(l.provider));
 const normalAmazon=replacementIds.includes(item.id)?[]:buildPurchaseLinks(item).filter(l=>{try{return ['amazon.co.jp','www.amazon.co.jp'].includes(new URL(l.href).hostname);}catch{return false;}});
 const row=merchantAudit.records[item.id];
 const official=row&&['A','B','C','D'].includes(row.type)&&row.url?[{...row,sakeId:item.id,matchType:'audited_purchase_destination'}]:[];
 const result=selectPurchaseLinks(item,{normalProducts:normalAmazon,discoveryLinks:discoverAmazon},now);
 result.normalLinks=[...result.normalLinks,...official];
 return {...result,discoveryLinks:result.normalLinks,rakuten:state.purchase,availability:state.availabilityStatus};
}

export const approvedSakeMedia=cache(()=>Object.fromEntries(visibleSakePairings.flatMap(item=>{
 const {media,mediaSource}=projection(item);return mediaSource==='registry'?[[item.id,media]]:[];
})));

const recoveredMedia=cache(()=>Object.fromEntries(visibleSakePairings.flatMap(item=>{
 const {media,mediaSource}=projection(item);
 return mediaSource==='recovered'?[[item.id,media]]:[];
})));
export const recoveredImageIds=()=>Object.keys(recoveredMedia());
export const recoveredImageFor=id=>recoveredMedia()[id];

export function commerceDisclosureState(){
 const active=recoveredImageIds().length>0||visibleSakePairings.some(item=>{
   const {affiliateStatus,imageVisible}=projection(item);
   return affiliateStatus==='APPROVED'||imageVisible;
 });
 return {active,amazon:false,rakuten:active};
}
