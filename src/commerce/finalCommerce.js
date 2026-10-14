import matches from './generated/purchase-matches.json' with {type:'json'};
import media from './generated/product-media.json' with {type:'json'};
import approvals from './generated/commerce-final-approvals.json' with {type:'json'};
import {productFingerprint} from './validation.js';
import {releaseApprovedOffer} from './purchaseRouting.js';
export function projectFinalCommerce(item,config,now=Date.now()) {
  const match=matches[item.id],image=media.records[item.id];
  const normal=match?.sakeName===item.productName&&match.productFingerprint===productFingerprint(item)&&match.matchConfidence==='high'&&match.directLinkAllowed===true&&Date.parse(match.validUntil)>now ?
    [{href:match.normalUrl,label:'楽天で見る',affiliate:false}]:[];
  if(!config.enabled||config.registeredSite!=='https://yoi-no-ikkon.vercel.app/'||!config.enabledProviders?.includes('rakuten')||config.routes?.rakuten!=='rakuten'||
    image?.matchConfidence!=='high'||image.productFingerprint!==productFingerprint(item))return {normal,offer:null};
  const offer=releaseApprovedOffer(item,{sakeId:item.id,provider:'rakuten',marketplace:'rakuten',productId:image.itemCode,capacityMl:image.capacityMl,
    storeName:'楽天市場',mode:'url',url:image.affiliateUrl,label:'楽天で見る',matchType:'commercial_match',matchConfidence:'high',
    destinationType:'product_page',isAffiliate:true,validUntil:image.validUntil},approvals,config.registeredSite,now);
  return {normal,offer};
}
