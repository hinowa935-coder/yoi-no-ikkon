import {parseFragment} from 'parse5';
import {COMMERCE_SITE} from '../data/siteIdentity.js';
import {currentReview,productFingerprint,sha256,staticCreativeIsSafe} from './validation.js';
import {ordinaryUrlIsSafe,releaseApprovedOffer} from './purchaseRouting.js';
import {imageDisplayUnavailable,purchaseUnavailable,unavailableSearchLink} from './availability.js';
import purchase from './generated/netlify-purchase.json' with {type:'json'};
import creatives from './generated/netlify-creatives.json' with {type:'json'};
import approvals from './generated/netlify-release-approvals.json' with {type:'json'};
import recoveredImages from './generated/netlify-image-recovery.json' with {type:'json'};
import {approvalIsCurrent} from './currentApproval.js';

const imageHost='hbb.afl.rakuten.co.jp';
const affiliateHost='hb.afl.rakuten.co.jp';
const guideline='https://affiliate.rakuten.co.jp/guideline/rule/';
const day=86400000;
const valid=(proof,now)=>Date.parse(proof?.checkedAt)<=now&&Date.parse(proof?.validUntil)>now&&Date.parse(proof.validUntil)-Date.parse(proof.checkedAt)<=30*day;
const on=(value,host)=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&u.hostname===host?u:null;}catch{return null;}};
const originalReference=(value)=>{const u=on(value,'affiliate.rakuten.co.jp');return !!(u&&u.pathname==='/link/pc/item');};
const destinationMatches=(value,destination)=>{const u=on(value,affiliateHost);return u?.searchParams.getAll('pc').length===1&&u.searchParams.get('pc')===destination;};
const proofFor=(value,record)=>{const u=on(value,'affiliate.rakuten.co.jp');return !!(originalReference(value)&&
  u.searchParams.get('item_id')===record.retailItemId&&/^\d+$/.test(u.searchParams.get('me_id')||''));};

function sameRetailIdentity(item, record) {
 const url=on(record?.productUrl,'item.rakuten.co.jp');
 const path=url?.pathname.match(/^\/([a-z0-9_-]+)\/[a-z0-9_.-]+\/$/i);
 return !!(path&&!url.search&&!url.hash&&ordinaryUrlIsSafe(record.productUrl)&&record.productFingerprint===productFingerprint(item)&&
   record.sakeId===item.id&&record.skuMatch==='SAME_SKU'&&/^\d+$/.test(record.retailItemId)&&record.itemCode===`${path[1]}:${record.retailItemId}`&&
   Number.isInteger(record.capacityMl)&&record.capacityMl>0&&(!item.capacityMl||record.capacityMl===item.capacityMl)&&
   !['UNKNOWN','CONFLICT','UNCONFIRMED'].includes(record.editionStatus)&&/^[a-f0-9]{64}$/.test(record.sourceSha256||''));
}

export function ordinarySakeOffer(item, record, now=Date.now()) {
 if(!sameRetailIdentity(item,record)||record.stockStatus!=='IN_STOCK'||!valid(record,now))return null;
 return {...unavailableSearchLink(item),url:record.productUrl,normalFallbackUrl:unavailableSearchLink(item).url,destinationType:'product_page',matchType:'commercial',capacityMl:record.capacityMl,validUntil:record.validUntil};
}

export function imageCreativeProof(html) {
 if(!staticCreativeIsSafe(html,[imageHost,affiliateHost]))return null;
 const anchors=[],images=[];
 function visit(n){if(n.tagName==='a')anchors.push(n.attrs.find(x=>x.name==='href')?.value);
   if(n.tagName==='img')images.push(n.attrs.find(x=>x.name==='src')?.value);n.childNodes?.forEach(visit);}
 visit(parseFragment(html));
 if(anchors.length!==1||images.length!==1||!anchors[0]||!images[0])return null;
 return {anchor:anchors[0],image:images[0]};
}

export function unchangedImage(html, src, size, row, sourceUrl) {
 if(!staticCreativeIsSafe(html,[imageHost,affiliateHost]))return false;
 const nodes=[];
 function visit(n){if(n.tagName==='img'||n.tagName==='a')nodes.push([n.tagName,Object.fromEntries(n.attrs.map(x=>[x.name,x.value]))]);n.childNodes?.forEach(visit);}
 visit(parseFragment(html));
 const a=nodes.filter(n=>n[0]==='a'),i=nodes.filter(n=>n[0]==='img');
 const image=on(src,imageHost);
 const file=on(image?.searchParams.get('pc'),'thumbnail.image.rakuten.co.jp')||on(image?.searchParams.get('pc'),'image.rakuten.co.jp');
 return !!(a.length===1&&i.length===1&&destinationMatches(a[0][1].href,row.productUrl)&&i[0][1].src===src&&
   image?.searchParams.get('item_id')===row.retailItemId&&image.searchParams.get('s')===size&&file&&
   (!sourceUrl||proofFor(sourceUrl,row)&&image.searchParams.get('me_id')===new URL(sourceUrl).searchParams.get('me_id'))&&
   file.pathname.match(/^\/(?:@[^/]+\/)?([^/]+)\/cabinet\//)?.[1]===row.itemCode.split(':')[0]);
}

const imagePathHash=src=>{
 const image=on(src,imageHost);
 const file=on(image?.searchParams.get('pc'),'thumbnail.image.rakuten.co.jp')||on(image?.searchParams.get('pc'),'image.rakuten.co.jp');
 return file&&sha256(file.pathname.replace(/^\/(?:@[^/]+\/)?[^/]+\/cabinet\//,'/cabinet/'));
};
const mediaEnabled=config=>config.enabled&&config.registeredSite===COMMERCE_SITE&&
  config.enabledProviders?.includes('rakuten')&&config.routes?.rakuten==='rakuten';

export function projectRecoveredImage(item,config,now=Date.now(),asset=recoveredImages.records[item.id]) {
 const shop=on(asset?.productUrl,'item.rakuten.co.jp');
 const path=shop?.pathname.match(/^\/([a-z0-9_-]+)\/[a-z0-9_.-]+\/$/i);
 if(!mediaEnabled(config)||!asset||!path||shop.search||shop.hash||asset.sakeId!==item.id||asset.sakeName!==item.productName||
   asset.productFingerprint!==productFingerprint(item)||asset.registeredSite!==COMMERCE_SITE||asset.sourceType!=='rakutenOfficialTool'||
   asset.scope!=='image-with-approved-embedded-destination'||asset.originalUnmodified!==true||asset.permissionConfirmed!==true||
   asset.permissionSource!==guideline||asset.matchConfidence!=='high'||asset.identityReviewed!==true||
   !['IN_STOCK','SOLD_OUT'].includes(asset.stockStatus)||!Number.isInteger(asset.capacityMl)||asset.capacityMl<=0||
   asset.capacityMl!==asset.imageCapacityMl||(item.capacityMl&&item.capacityMl!==asset.capacityMl)||
   !/^\d+$/.test(asset.retailItemId||'')||asset.itemCode!==`${path[1]}:${asset.retailItemId}`||
   !/^[a-f0-9]{64}$/.test(asset.retailSha256||'')||!proofFor(asset.sourceUrl,asset)||
   Date.parse(asset.checkedAt)>Date.parse(asset.verifiedAt)||!valid(asset,now)||
   !approvalIsCurrent({...asset,approved:asset.approved??true},item,now))return null;
 const detail=imageCreativeProof(asset.html), compact=imageCreativeProof(asset.compactHtml);
 if(!detail||!compact||asset.imageUrl!==detail.image||asset.compactImageUrl!==compact.image||
   asset.originalSha256!==sha256(asset.html)||asset.compactOriginalSha256!==sha256(asset.compactHtml)||
   asset.embeddedAnchorSha256!==sha256(detail.anchor)||asset.compactEmbeddedAnchorSha256!==sha256(compact.anchor)||
   !asset.attachmentSha256||imagePathHash(detail.image)!==asset.attachmentSha256||imagePathHash(compact.image)!==asset.attachmentSha256||
   !unchangedImage(asset.html,detail.image,'240x240',asset,asset.sourceUrl)||
   !unchangedImage(asset.compactHtml,compact.image,'80x80',asset,asset.sourceUrl))return null;
 return {html:asset.html,compactHtml:asset.compactHtml,affiliateUrl:null,
   validUntil:asset.validUntil,capacityMl:asset.capacityMl,stockStatus:asset.stockStatus};
}

export function isRakutenLinkOnly(url, productUrl) {
 const parsed=on(url,affiliateHost);
 return destinationMatches(url,productUrl)&&url===url.trim()&&!parsed.hash&&
   /^\/ichiba\/[a-z0-9.]+\/$/i.test(parsed.pathname)&&
   parsed.searchParams.getAll('link_type').length===1&&parsed.searchParams.get('link_type')==='hybrid_url'&&
   parsed.searchParams.getAll('ut').length===1&&!!parsed.searchParams.get('ut')&&
   [...parsed.searchParams.keys()].every(key=>['pc','link_type','ut'].includes(key));
}

export function projectRecoveredAffiliate(item,config,now,approval,image=recoveredImages.records[item.id],respectHold=true) {
 if(!mediaEnabled(config)||(respectHold&&purchaseUnavailable(item.id))||!approval||!image||
   approval.scope!=='netlify-affiliate-recovery'||approval.registeredSite!==COMMERCE_SITE||
   approval.sourceType!=='rakutenOfficialLinkOnly'||approval.permissionSource!==guideline||
   approval.mediaRegistrationConfirmed!==true||approval.originalUnmodified!==true||
   approval.stockStatus!=='IN_STOCK'||approval.identityReviewed!==true||approval.sakeId!==item.id||
   approval.productFingerprint!==productFingerprint(item)||approval.productFingerprint!==image.productFingerprint||
   approval.productUrl!==image.productUrl||approval.itemCode!==image.itemCode||
   approval.retailItemId!==image.retailItemId||approval.capacityMl!==image.capacityMl||
   approval.imageSha256!==image.originalSha256||!proofFor(approval.sourceUrl,approval)||
   on(approval.sourceUrl,'affiliate.rakuten.co.jp')?.searchParams.get('me_id')!==
     on(image.sourceUrl,'affiliate.rakuten.co.jp')?.searchParams.get('me_id')||
   !isRakutenLinkOnly(approval.affiliateUrl,approval.productUrl)||
   sha256(approval.affiliateUrl)!==approval.affiliateSha256||
   !['retailSha256','descriptorSha256'].every(key=>/^[a-f0-9]{64}$/.test(approval[key]||''))||
   !valid(approval,now)||!approvalIsCurrent({...approval,approved:approval.approved??true,permissionConfirmed:true},item,now)||
   Date.parse(approval.checkedAt)>Date.parse(approval.verifiedAt)||
   !projectRecoveredImage(item,config,Date.parse(approval.verifiedAt),image))return null;
 return {sakeId:item.id,provider:'rakuten',marketplace:'rakuten',productId:approval.itemCode,
   capacityMl:approval.capacityMl,storeName:'楽天市場',mode:'url',url:approval.affiliateUrl,label:'楽天で見る',
   matchType:'commercial',matchConfidence:'high',destinationType:'product_page',isAffiliate:true,recoveredAffiliate:true,
   validUntil:approval.validUntil};
}

function attestedNetlifyRelease(item,raw,asset,record,review,now) {
 const proof=review?.destinationEvidence;
 return currentReview(review,now)&&review.scope==='production'&&review.registeredSite===COMMERCE_SITE&&
   review.sakeId===item.id&&review.productFingerprint===record.productFingerprint&&review.productId===record.itemCode&&
   review.capacityMl===record.capacityMl&&review.provider==='rakuten'&&review.marketplace==='rakuten'&&
   review.destinationType==='product_page'&&review.finalUrl===record.productUrl&&review.sourceUrl===asset.sourceUrl&&
   proofFor(review.sourceUrl,record)&&review.permissionSource===guideline&&review.identityReviewed===true&&
   review.generatedByOfficialTool===true&&review.originalUnmodified===true&&review.programEligibilityConfirmed===true&&
   review.mediaRegistrationConfirmed===true&&review.displayMethodAllowed===true&&
   proof?.method==='issued-destination-and-live-item'&&proof.retailSha256===record.sourceSha256&&
   proof.productUrl===record.productUrl&&proof.itemCode===record.itemCode&&proof.checkedAt===record.checkedAt&&
   approvalIsCurrent({...review,permissionConfirmed:true},item,now)&&
   (raw==null||destinationMatches(raw.url,record.productUrl)&&sha256(raw.url)===review.creativeSha256);
}

// This source of proof is intentionally independent of the stock gates used for the buy button.
export function projectAttestedProof(item,config,now,record,im,reviews) {
 if(!mediaEnabled(config)||!record||!im||im.sourceType!=='rakutenOfficialTool'||im.originalUnmodified!==true||
   !sameRetailIdentity(item,record)||
   im.productFingerprint!==record.productFingerprint||im.productUrl!==record.productUrl||im.itemCode!==record.itemCode||
   im.capacityMl!==record.capacityMl||
   !approvalIsCurrent({...im,approved:im.approved??true,sakeId:item.id,permissionConfirmed:true,identityReviewed:true},item,now))return [];
 const raw={sakeId:item.id,provider:'rakuten',marketplace:'rakuten',productId:record.itemCode,capacityMl:record.capacityMl,
   storeName:'楽天市場',mode:'url',url:im.affiliateUrl,label:'楽天で見る',matchType:'commercial',matchConfidence:'high',
   destinationType:'product_page',isAffiliate:true,validUntil:im.validUntil};
 return reviews.filter(review=>attestedNetlifyRelease(item,null,im,record,review,now)).map(review=>{
   const imageExpiry=new Date(Math.min(Date.parse(review.validUntil),Date.parse(im.validUntil))).toISOString();
   const offer=valid(record,now)&&typeof im.affiliateUrl==='string'&&attestedNetlifyRelease(item,raw,im,record,review,now)
     ? {...raw,validUntil:new Date(Math.min(Date.parse(imageExpiry),Date.parse(record.validUntil))).toISOString()} : null;
   const images=im.imageIdentityReviewed===true&&im.permissionConfirmed===true&&im.permissionSource===guideline&&
     im.imageProductUrl===record.productUrl&&im.imageCapacityMl===record.capacityMl&&
     typeof im.html==='string'&&typeof im.compactHtml==='string'&&
     sha256(im.html)===im.originalSha256&&sha256(im.compactHtml)===im.compactOriginalSha256&&
     im.originalSha256===review.imageSha256&&im.compactOriginalSha256===review.compactImageSha256&&
     unchangedImage(im.html,im.src,'240x240',record,im.sourceUrl)&&unchangedImage(im.compactHtml,im.compactSrc,'80x80',record,im.sourceUrl);
   return {offer,image:images?{html:im.html,compactHtml:im.compactHtml,affiliateUrl:null,
     capacityMl:im.capacityMl,validUntil:imageExpiry}:null,review};
 });
}

export function projectNetlifyCommerce(item,config,now=Date.now(),{inventory=purchase.records,assets=creatives.records,ledger=approvals}={}) {
 const record=inventory[item.id],regular=purchaseUnavailable(item.id)?null:ordinarySakeOffer(item,record,now);
 const fallback=regular||unavailableSearchLink(item);
 const im=assets[item.id];
 const deny={regular:fallback,offer:null,media:null};
 if(!regular||!im||!config.enabled||config.registeredSite!==COMMERCE_SITE||!config.enabledProviders?.includes('rakuten')||config.routes?.rakuten!=='rakuten')return deny;
 const reviews=ledger.schemaVersion===1&&Array.isArray(ledger.links)?ledger.links:[];
 const raw={sakeId:item.id,provider:'rakuten',marketplace:'rakuten',productId:record.itemCode,capacityMl:record.capacityMl,storeName:'楽天市場',mode:'url',url:im.affiliateUrl,label:'楽天で見る',matchType:'commercial',matchConfidence:'high',destinationType:'product_page',isAffiliate:true,validUntil:im.validUntil};
 const attested=projectAttestedProof(item,config,now,record,im,reviews);
 if(attested.length){
   if(attested.length!==1)return deny;
   const {offer,image}=attested[0];
   return {regular:fallback,offer,media:image&&!imageDisplayUnavailable(item.id)?{...image,affiliateUrl:offer?.url??null}:null};
 }
 if(imageDisplayUnavailable(item.id))return deny;
 if(im.registeredSite!==COMMERCE_SITE||im.sourceType!=='rakutenOfficialTool'||!originalReference(im.sourceUrl)||im.permissionSource!==guideline||im.permissionConfirmed!==true||im.originalUnmodified!==true||im.imageIdentityReviewed!==true||
   im.productFingerprint!==record.productFingerprint||im.productUrl!==record.productUrl||im.imageProductUrl!==record.productUrl||im.itemCode!==record.itemCode||im.capacityMl!==record.capacityMl||im.imageCapacityMl!==record.capacityMl||
   !valid({checkedAt:im.verifiedAt,validUntil:im.validUntil},now)||!destinationMatches(im.affiliateUrl,record.productUrl)||
   typeof im.html!=='string'||typeof im.compactHtml!=='string'||sha256(im.html)!==im.originalSha256||sha256(im.compactHtml)!==im.compactOriginalSha256||
   !unchangedImage(im.html,im.src,'240x240',record)||!unchangedImage(im.compactHtml,im.compactSrc,'80x80',record))return deny;
 // Bind both original images to the same permission and affiliate link approval.
 const scoped=reviews.filter(a=>a.imageSha256===im.originalSha256&&a.compactImageSha256===im.compactOriginalSha256&&
   a.finalUrl===record.productUrl&&a.permissionSource===guideline&&originalReference(a.sourceUrl)&&valid({checkedAt:a.verifiedAt,validUntil:a.validUntil},now));
 const offer=releaseApprovedOffer(item,raw,{schemaVersion:1,links:scoped},COMMERCE_SITE,now);
 if(!offer)return deny;
 const end=new Date(Math.min(Date.parse(offer.validUntil),Date.parse(regular.validUntil))).toISOString();
 return {regular:fallback,offer:{...offer,validUntil:end},media:{html:im.html,compactHtml:im.compactHtml,affiliateUrl:im.affiliateUrl,validUntil:end,capacityMl:im.capacityMl}};
}
