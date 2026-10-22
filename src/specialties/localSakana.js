import master from './master.json' with {type:'json'};
import pairingData from './pairings.json' with {type:'json'};
import commerceData from '../commerce/localSakana.json' with {type:'json'};
import {isHttps,sha256,staticCreativeIsSafe} from '../commerce/validation.js';
import {getCanonicalFood} from '../data/foodCatalog.js';
import {parseFragment} from 'parse5';

const site='https://yoi-no-ikkon.vercel.app/';
const hosts=['hb.afl.rakuten.co.jp','hbb.afl.rakuten.co.jp'];
export const localSpecialties=master.specialties;
export const localSakanaPairings=pairingData.pairings;
export function verifiedSpecialtyCreative(offer){
 if(!offer?.operatorApproved||offer.registeredSite!==site||!isHttps(offer.rakutenUrl,['item.rakuten.co.jp']))return false;
 const image=offer.image;
 if(!image||image.sourceType!=='rakutenOfficialTool'||image.permissionConfirmed!==true||image.originalUnmodified!==true||image.productUrl!==offer.rakutenUrl||image.width!==240||image.height!==240||sha256(image.html||'')!==image.originalSha256||!staticCreativeIsSafe(image.html,hosts))return false;
 if(!isHttps(offer.affiliate?.url,['hb.afl.rakuten.co.jp'])||new URL(offer.affiliate.url).searchParams.get('pc')!==offer.rakutenUrl)return false;
 let valid=true,images=0,anchors=0;
 function visit(n){const a=Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));
  if(n.tagName==='a'){anchors++;valid&&=new URL(a.href).hostname==='hb.afl.rakuten.co.jp'&&new URL(a.href).searchParams.get('pc')===offer.rakutenUrl;}
  if(n.tagName==='img'){images++;valid&&=a.src===image.src&&isHttps(a.src,['hbb.afl.rakuten.co.jp'])&&new URL(a.src).searchParams.get('s')==='240x240';}
  for(const c of n.childNodes||[])visit(c);
 }visit(parseFragment(image.html));
 return valid&&images===1&&anchors===1;
}

export function specialtyCommerce(offer,config={},now=Date.now()){
 if(!offer||offer.operatorApproved!==true||offer.registeredSite!==site||!isHttps(offer.rakutenUrl,['item.rakuten.co.jp'])||Date.parse(offer.lastCheckedAt)>now||!Number.isFinite(Date.parse(offer.lastCheckedAt))||!(Date.parse(offer.validUntil)>now)||offer.availabilityStatus!=='AVAILABLE')return null;
 const affiliate=config.enabled===true&&config.registeredSite===site&&config.enabledProviders?.includes('rakuten')&&config.routes?.rakuten==='rakuten'&&verifiedSpecialtyCreative(offer);
 return {url:affiliate?offer.affiliate.url:offer.rakutenUrl,isAffiliate:!!affiliate,merchant:offer.merchant,quantity:offer.quantity,validUntil:offer.validUntil,imageHtml:affiliate?offer.image.html:null};
}

export function localSakanaForSake(item,{config={},now=Date.now(),dishes=[],specialties=localSpecialties,pairings=localSakanaPairings,offers=commerceData.offers}={}){
 const foodIds=new Set(dishes.map(d=>getCanonicalFood(d.name||d)?.id).filter(Boolean));
 return pairings.filter(p=>p.sakeId===item.id&&p.prefecture===item.prefecture&&['high','medium'].includes(p.confidence)&&p.evidenceType==='editorialPairing'&&p.pairingReason&&p.sakeEvidence?.sourceUrl)
  .sort((a,b)=>a.displayOrder-b.displayOrder).map(p=>({pairing:p,specialty:specialties.find(s=>s.id===p.specialtyId)}))
  .filter(({specialty:s})=>s?.status==='ACTIVE'&&s.prefecture===item.prefecture&&!s.relatedFoodIds.some(id=>foodIds.has(id)))
  .filter((row,index,rows)=>rows.findIndex(r=>r.specialty.id===row.specialty.id)===index).slice(0,3)
  .map(({pairing:p,specialty:s})=>({id:s.id,name:s.name,prefecture:s.prefecture,region:s.region,description:s.description,reason:p.pairingReason,sourceUrl:s.sources[0]?.url,commerce:specialtyCommerce(offers.find(o=>o.specialtyId===s.id),config,now)}));
}
