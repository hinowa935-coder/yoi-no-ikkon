import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {COMMERCE_SITE,SITE_URL} from '../src/data/siteIdentity.js';
import {getSakeById,visibleSakePairings} from '../src/data/siteData.js';
import {ordinarySakeOffer,projectNetlifyCommerce,projectRecoveredImage} from '../src/commerce/netlifyCommerce.js';
import {readCommerceConfig} from '../src/commerce/providers.js';
import {productFingerprint,sha256} from '../src/commerce/validation.js';
import {validateHostingEnvironment,netlifyRouting} from './netlify-export.mjs';

const day=86400000,now=Date.parse('2026-11-15T07:00:00Z'),at=new Date(now-day).toISOString(),until=new Date(now+day).toISOString();
const sake=getSakeById('nogomi-tokubetsu-junmai'),id=sake.id,fp=productFingerprint(sake);
const legacy='https://legacy.example/';
const guid='https://affiliate.rakuten.co.jp/guideline/rule/';
const source='https://affiliate.rakuten.co.jp/link/pc/item';
const productUrl='https://item.rakuten.co.jp/fakeshop/fixture-720/';
const link='https://hb.afl.rakuten.co.jp/fixture/?pc='+encodeURIComponent(productUrl);
const image=size=>`https://hbb.afl.rakuten.co.jp/fixture/?item_id=481&s=${size}&pc=${encodeURIComponent('https://thumbnail.image.rakuten.co.jp/@0_mall/fakeshop/cabinet/fixture.jpg')}`;
const markup=src=>`<a href="${link.replaceAll('&','&amp;')}"><img src="${src.replaceAll('&','&amp;')}" alt="Fixture"></a>`;
const normal={sakeId:id,productFingerprint:fp,productUrl,itemCode:'fakeshop:481',retailItemId:'481',capacityMl:sake.capacityMl||720,skuMatch:'SAME_SKU',stockStatus:'IN_STOCK',sourceSha256:'0'.repeat(64),checkedAt:at,validUntil:until};
const media={registeredSite:COMMERCE_SITE,sourceType:'rakutenOfficialTool',sourceUrl:source,permissionSource:guid,permissionConfirmed:true,originalUnmodified:true,imageIdentityReviewed:true,productFingerprint:fp,productUrl,imageProductUrl:productUrl,itemCode:normal.itemCode,capacityMl:normal.capacityMl,imageCapacityMl:normal.capacityMl,verifiedAt:at,validUntil:until,affiliateUrl:link,src:image('240x240'),compactSrc:image('80x80')};
media.html=markup(media.src);media.compactHtml=markup(media.compactSrc);media.originalSha256=sha256(media.html);media.compactOriginalSha256=sha256(media.compactHtml);
const approval={sakeId:id,productFingerprint:fp,provider:'rakuten',marketplace:'rakuten',productId:normal.itemCode,capacityMl:normal.capacityMl,destinationType:'product_page',registeredSite:COMMERCE_SITE,creativeSha256:sha256(link),imageSha256:media.originalSha256,compactImageSha256:media.compactOriginalSha256,generatedByOfficialTool:true,originalUnmodified:true,programEligibilityConfirmed:true,mediaRegistrationConfirmed:true,displayMethodAllowed:true,desktopRedirectReviewed:true,mobileRedirectReviewed:true,identityReviewed:true,finalUrl:productUrl,scope:'production',approved:true,reviewedBy:'test fixture',verifiedAt:at,validUntil:until,sourceUrl:source,permissionSource:guid};
const env={AFFILIATE_ENABLED:'true',AFFILIATE_REGISTERED_SITE:COMMERCE_SITE,AFFILIATE_RAKUTEN_ENABLED:'true',AFFILIATE_RAKUTEN_ROUTE:'rakuten'};
const config=readCommerceConfig(env);
const project=({n=normal,m=media,a=approval,c=config,t=now}={})=>projectNetlifyCommerce(sake,c,t,{inventory:{[id]:n},assets:{[id]:m},ledger:{schemaVersion:1,links:[a]}});

test('both official image sizes and the text link activate only with the matching Netlify proof',()=>{
 const result=project();assert.equal(result.offer.url,link);assert.equal(result.media.html,media.html);assert.equal(result.media.validUntil,until);
 for(const override of [
   {a:{...approval,scope:'local'}},{a:{...approval,registeredSite:legacy}},{a:{...approval,imageSha256:'0'.repeat(64)}},{a:{...approval,creativeSha256:'0'.repeat(64)}},
   {m:{...media,registeredSite:legacy}},{m:{...media,imageCapacityMl:999}},{m:{...media,permissionConfirmed:false}},{m:{...media,html:'invalid'}},
   {m:{...media,compactSrc:image('240x240')}},{m:{...media,productFingerprint:'bad'}},{m:{...media,affiliateUrl:'https://malicious.invalid/'}},
   {c:{...config,registeredSite:legacy}},{c:{...config,enabled:false}},{t:Date.parse(until)}
 ]){const r=project(override);assert.equal(r.offer,null);assert.equal(r.media,null);}
});

test('stock, SKU, capacity, store identity and expiry independently control ordinary fallback',()=>{
 assert.equal(project({c:{...config,enabled:false}}).regular.url,productUrl);
 for(const override of [{stockStatus:'SOLD_OUT'},{skuMatch:'UNKNOWN'},{productFingerprint:'different'},{productUrl:'https://item.rakuten.co.jp/other/product/'},{capacityMl:-1},{retailItemId:'different'},{productUrl:productUrl+'?tag=untested'},{checkedAt:new Date(now+1).toISOString()},{validUntil:new Date(now+40*day).toISOString()}]){
   assert.equal(ordinarySakeOffer(sake,{...normal,...override},now),null);
   const result=project({n:{...normal,...override}});assert.equal(result.regular.destinationType,'search_results');assert.equal(result.offer,null);
 }
});

test('Netlify current-item evidence independently gates the official link and both original image sizes',()=>{
 const liveSource=source+'?me_id=123&item_id=481';
 const generatedImage = size => image(size)+'&me_id=123';
 const correct={...media,sourceUrl:liveSource,src:generatedImage('240x240'),compactSrc:generatedImage('80x80')};
 correct.html=markup(correct.src);correct.compactHtml=markup(correct.compactSrc);
 correct.originalSha256=sha256(correct.html);correct.compactOriginalSha256=sha256(correct.compactHtml);
 const approved={...approval,sourceUrl:liveSource,desktopRedirectReviewed:false,mobileRedirectReviewed:false,
   imageSha256:correct.originalSha256,compactImageSha256:correct.compactOriginalSha256,
   destinationEvidence:{method:'issued-destination-and-live-item',retailSha256:normal.sourceSha256,
     checkedAt:normal.checkedAt,itemCode:normal.itemCode,productUrl:normal.productUrl}};
 assert(project({m:correct,a:approved}).offer);
 assert(project({m:correct,a:approved}).media);
 assert.equal(project({m:{...correct,html:null},a:approved}).media,null);
 assert(project({m:{...correct,html:null},a:approved}).offer);
 const imageOnly=project({m:{...correct,affiliateUrl:null},a:{...approved,creativeSha256:null}});
 assert.equal(imageOnly.offer,null);assert.equal(imageOnly.regular.url,productUrl);assert.equal(imageOnly.media.affiliateUrl,null);
 assert.equal(project({m:correct,a:{...approved,registeredSite:legacy}}).offer,null);
 assert.equal(project({m:correct,a:{...approved,destinationEvidence:{...approved.destinationEvidence,retailSha256:'bad'}}}).offer,null);
 const wrongStore=generatedImage('240x240').replace('me_id=123','me_id=124');
 const badImage={...correct,src:wrongStore,html:markup(wrongStore),originalSha256:sha256(markup(wrongStore))};
 const wrongStoreResult=project({m:badImage,a:{...approved,imageSha256:badImage.originalSha256}});
 assert.equal(wrongStoreResult.media,null);assert(wrongStoreResult.offer);
});

test('the candidate allows public search fallbacks but cannot be built in published mode',()=>{
 assert.equal(SITE_URL,'https://yoi-no-ikkon.netlify.app');assert.equal(visibleSakePairings.length,484);
 assert.throws(()=>validateHostingEnvironment({...env,NETLIFY_MIGRATION_STAGE:'production'}));
 assert.throws(()=>validateHostingEnvironment({...env,AFFILIATE_REGISTERED_SITE:legacy}));
 assert.equal(validateHostingEnvironment({...env,AFFILIATE_ENABLED:'false'}).length,4);
 const config=JSON.parse(fs.readFileSync('vercel.json','utf8'));
 const result=netlifyRouting(config,'G-EXAMPLE01');
 assert(result.headers.includes('X-Robots-Tag: noindex'));
 assert(result.headers.includes('https://*.google-analytics.com'));
 assert(!result.redirects.includes('/* /index.html'));
});

test('official recovered artwork does not create a buy offer and requires its own Netlify embedded-link approval',()=>{
 const foot=src=>src+'&me_id=123';
 const full=foot(image('240x240')),small=foot(image('80x80'));
 const a={sakeId:id,sakeName:sake.productName,productUrl,itemCode:normal.itemCode,retailItemId:normal.retailItemId,
   productFingerprint:fp,capacityMl:normal.capacityMl,imageCapacityMl:normal.capacityMl,registeredSite:COMMERCE_SITE,
   sourceType:'rakutenOfficialTool',sourceUrl:source+'?me_id=123&item_id='+normal.retailItemId,verifiedAt:at,checkedAt:at,validUntil:until,
   scope:'image-with-approved-embedded-destination',originalUnmodified:true,permissionConfirmed:true,identityReviewed:true,
   matchConfidence:'high',stockStatus:'SOLD_OUT',retailSha256:'2'.repeat(64),permissionSource:guid,
   imageUrl:full,compactImageUrl:small,html:markup(full),compactHtml:markup(small),
   attachmentSha256:sha256('/cabinet/fixture.jpg'),originalSha256:sha256(markup(full)),compactOriginalSha256:sha256(markup(small)),
   embeddedAnchorSha256:sha256(link),compactEmbeddedAnchorSha256:sha256(link)};
 const recovered=projectRecoveredImage(sake,config,now,a);
 assert.equal(recovered.stockStatus,'SOLD_OUT');assert.equal(recovered.affiliateUrl,null);
 assert.equal(recovered.html,a.html);
 for(const edits of [
   {capacityMl:999},{registeredSite:legacy},{sourceUrl:source},{permissionConfirmed:false},{identityReviewed:false},
   {embeddedAnchorSha256:'0'.repeat(64)},{attachmentSha256:'1'.repeat(64)},{stockStatus:'UNKNOWN'},
   {compactHtml:a.compactHtml+'<!-- edited -->'},{scope:'image-only'},{matchConfidence:'medium'}
 ]) assert.equal(projectRecoveredImage(sake,config,now,{...a,...edits}),null);
 assert.equal(projectRecoveredImage(sake,config,Date.parse(until),a),null);
 assert.equal(projectRecoveredImage(sake,{...config,enabled:false},now,a),null);
});
