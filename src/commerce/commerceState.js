import { COMMERCE_SITE } from '../data/siteIdentity.js';
import { commerceAvailabilityHold, unavailableSearchLink } from './availability.js';
import { ordinarySakeOffer, projectAttestedProof, projectRecoveredAffiliate, projectRecoveredImage } from './netlifyCommerce.js';
import { productFingerprint } from './validation.js';
import { chooseRakutenRoute } from './routeSelection.js';
import inventory from './generated/netlify-purchase.json' with {type:'json'};
import official from './generated/netlify-creatives.json' with {type:'json'};
import ledger from './generated/netlify-release-approvals.json' with {type:'json'};
import recovered from './generated/netlify-image-recovery.json' with {type:'json'};
import links from './generated/netlify-affiliate-recovery.json' with {type:'json'};

const expiry = x => Date.parse(x?.validUntil);
const present = (x, now) => x?.approved === true && x?.registeredSite === COMMERCE_SITE &&
  Date.parse(x.verifiedAt) <= now && expiry(x) > now;
const latest = rows => rows.filter(Boolean).sort((a,b)=>Date.parse(b.checkedAt)-Date.parse(a.checkedAt))[0];

export function createCommerceContext(config, inputs={}) {
  const {purchase=inventory.records, assets=official.records, approvals=ledger, media=recovered.records,
    affiliate=links.schemaVersion===1?links.records:{}, holdFor=commerceAvailabilityHold}=inputs;
  const reviews=new Map();
  for(const row of approvals.schemaVersion===1?approvals.links??[]:[]){
    const list=reviews.get(row.sakeId)??[];
    list.push(row);
    reviews.set(row.sakeId,list);
  }
  return {config,purchase,assets,reviews,media,affiliate,holdFor};
}

export function resolveCommerceState(item, ctx, now=Date.now()) {
  const {id}=item;
  const hold=ctx.holdFor(id)??{};
  const record=ctx.purchase[id], creative=ctx.assets[id], photo=ctx.media[id], direct=ctx.affiliate[id];
  const reviews=ctx.reviews.get(id)??[];
  const proofs=projectAttestedProof(item,ctx.config,now,record,creative,reviews);
  const recoveredImage=photo?projectRecoveredImage(item,ctx.config,now,photo):null;
  const recoveredAffiliate=photo&&direct?projectRecoveredAffiliate(item,ctx.config,now,direct,photo,false):null;
  const sameKind=reviews.filter(r=>present(r,now)&&r.scope==='production'&&r.provider==='rakuten');
  const imageClaims=sameKind.filter(r=>r.imageSha256).length+Number(!!recoveredImage);
  const directClaims=sameKind.filter(r=>r.creativeSha256).length+Number(!!recoveredAffiliate);
  const imageConflict=imageClaims>1, affiliateConflict=directClaims>1;
  const stored=proofs[0];
  const imageCandidate=recoveredImage?{media:recoveredImage,proof:photo,source:'recovered'}:
    stored?.image?{media:stored.image,proof:stored.review,source:'registry'}:null;
  const offerCandidate=recoveredAffiliate?{offer:recoveredAffiliate,proof:direct,url:direct.productUrl}:
    stored?.offer?{offer:stored.offer,proof:stored.review,url:stored.review.finalUrl}:null;
  const sameDestinationStock = url => latest([record,direct,photo].filter(r=>url&&r?.productUrl===url&&
    r.productFingerprint===productFingerprint(item)&&Date.parse(r.checkedAt)<=now));
  const stock = sameDestinationStock(offerCandidate?.url??record?.productUrl??photo?.productUrl);
  const gone = ['PAGE_GONE','PAGE_UNAVAILABLE'].includes(hold.status);
  const blocked=gone||hold.purchaseBlocked===true;
  const availabilityStatus=gone?'PAGE_GONE':blocked?
    (hold.status==='TEMPORARILY_UNAVAILABLE'?'SOLD_OUT':'BLOCKED'):stock?.stockStatus??'UNKNOWN';
  const normal = blocked||(['SOLD_OUT','PAGE_GONE'].includes(sameDestinationStock(record?.productUrl)?.stockStatus))
    ? null : ordinarySakeOffer(item,record,now);
  const offer=availabilityStatus==='IN_STOCK'&&!affiliateConflict?offerCandidate?.offer??null:null;
  const image=hold.hideImage===true||imageConflict?null:imageCandidate;
  const search=unavailableSearchLink(item);
  const searchEnabled=!!item.productName?.trim();
  const purchase={affiliate:offer,normal,search:searchEnabled?search:null};
  const purchaseRoute=chooseRakutenRoute(purchase,now).type;
  const reason=[];
  if(imageConflict)reason.push('DUPLICATE_CURRENT_IMAGE');
  if(affiliateConflict)reason.push('DUPLICATE_CURRENT_AFFILIATE');
  if(blocked)reason.push(availabilityStatus);
  if(availabilityStatus==='SOLD_OUT'&&!blocked)reason.push('SOLD_OUT');
  if(hold.hideImage===true)reason.push('IMAGE_HOLD');
  const expiredImage=!!(photo?.html&&expiry(photo)<=now || creative?.html&&expiry(creative)<=now);
  const expiredLink=!!(direct&&expiry(direct)<=now || creative?.affiliateUrl&&expiry(creative)<=now);
  if(!image&&expiredImage)reason.push('IMAGE_EXPIRED');
  if(!offer&&expiredLink)reason.push('AFFILIATE_EXPIRED');
  const chosenProof=(offer&&offerCandidate.proof)||image?.proof||(normal&&record)||null;
  return {
    identityStatus:imageConflict||affiliateConflict?'CONFLICT':image||offer||normal?'CONFIRMED':'UNCONFIRMED',
    imageStatus:imageConflict?'CONFLICT':image?'APPROVED':hold.hideImage===true?'HIDDEN':expiredImage?'EXPIRED':'UNAPPROVED',
    affiliateStatus:affiliateConflict?'CONFLICT':offer?'APPROVED':blocked||availabilityStatus==='SOLD_OUT'?'UNAVAILABLE':expiredLink?'EXPIRED':'UNAPPROVED',
    availabilityStatus, imageVisible:!!image, purchaseRoute,
    registeredSite:image||offer?COMMERCE_SITE:null,
    verifiedAt:chosenProof?.verifiedAt??chosenProof?.checkedAt??null,
    validUntil:offer?.validUntil??image?.media.validUntil??normal?.validUntil??null,
    imageValidUntil:image?.media.validUntil??null,
    affiliateValidUntil:offer?.validUntil??null,
    purchaseStore:offer?.productId?.split(':')[0]??(normal&&record.itemCode.split(':')[0])??null,
    imageStore:image&&(image.source==='recovered'?photo.itemCode:record.itemCode).split(':')[0],
    reason,
    media:image?{...image.media,stockStatus:image.source==='recovered'?photo.stockStatus:undefined}:null,
    mediaSource:image?.source??null,
    purchase
  };
}
