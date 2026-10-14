import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {parseFragment} from 'parse5';
import {visibleSakePairings} from '../src/data/siteData.js';
import {projectFinalCommerce} from '../src/commerce/finalCommerce.js';
import {productMediaFor} from '../src/commerce/productMedia.js';
import {visiblePurchaseLinks,purchaseLabel} from '../src/commerce/purchasePresentation.js';
import {emitAffiliateClick} from '../src/commerce/entryTracking.js';
import {observeAffiliate} from '../src/commerce/tracking.js';
import {sha256} from '../src/commerce/validation.js';
const media=JSON.parse(fs.readFileSync('src/commerce/generated/product-media.json')).records;
const matches=JSON.parse(fs.readFileSync('src/commerce/generated/purchase-matches.json'));
const config={enabled:true,registeredSite:'https://yoi-no-ikkon.vercel.app/',enabledProviders:['rakuten'],routes:{rakuten:'rakuten'}};
test('all approved images retain original tool HTML and the same product and capacity',()=>{
  assert(Object.keys(media).length>0);
  assert.equal(Object.keys(media).length,Object.values(matches).filter(m=>m.directLinkAllowed).length);
  for(const [id,image]of Object.entries(media)) {
    const item=visibleSakePairings.find(p=>p.id===id);
    assert(productMediaFor(item));assert.equal(sha256(image.html),image.originalSha256);
    let anchors=[],images=[];
    const visit=n=>{const a=Object.fromEntries((n.attrs||[]).map(p=>[p.name,p.value]));
      if(n.tagName==='a')anchors.push(a);else if(n.tagName==='img')images.push(a);else assert(!n.tagName);
      assert(!Object.keys(a).some(k=>/^on/.test(k)));for(const c of n.childNodes||[])visit(c);};visit(parseFragment(image.html));
    assert.equal(anchors.length,1);assert.equal(images.length,1);
    assert.equal(new URL(anchors[0].href).searchParams.get('pc'),image.productUrl);
    assert.equal(new URL(image.affiliateUrl).searchParams.get('pc'),image.productUrl);
    assert.equal(new URL(images[0].src).searchParams.get('item_id'),image.itemCode.split(':')[1]);
    assert.equal(new URL(images[0].src).searchParams.get('s'),'240x240');
    assert.equal(sha256(image.compactHtml),image.compactOriginalSha256);
    assert.equal(image.capacityMl,image.imageCapacityMl);
    assert.equal(projectFinalCommerce(item,config).offer?.matchConfidence,'high');
    assert.equal(projectFinalCommerce({...item,productName:'different'},config).offer,null);
    assert.deepEqual(projectFinalCommerce({...item,productName:'different'},config).normal,[]);
  }
});
test('medium, unknown, wrong image, wrong capacity and unknown source never supply product media',()=>{
  const id=Object.keys(media)[0], item=visibleSakePairings.find(p=>p.id===id),image=media[id];
  for(const patch of [{matchConfidence:'medium'},{matchConfidence:'low'},{imageCapacityMl:999},{imageProductUrl:'https://item.rakuten.co.jp/other/1/'},
    {src:'https://evil.example/image.jpg'},{originalUnmodified:false},{sourceType:'scraped'}])assert.equal(productMediaFor(item,{[id]:{...image,...patch}}),null);
  assert.equal(productMediaFor({id:'unknown',productName:'unknown'}),null);
});
test('global opt out, wrong site, wrong route and expiry disable formal links with normal fallback retained',()=>{
  const item=visibleSakePairings.find(p=>media[p.id]);
  for(const patch of [{enabled:false},{registeredSite:'https://other.example/'},{routes:{rakuten:'none'}},{enabledProviders:[]}])assert.equal(projectFinalCommerce(item,{...config,...patch}).offer,null);
  assert.equal(projectFinalCommerce(item,config,Date.now()+40*86400000).offer,null);
  assert.equal(projectFinalCommerce(item,{...config,enabled:false}).normal.length,1);
});
test('failed affiliate destinations stay search fallback without images or purchasability assertions',()=>{
  for(const id of Object.keys(matches).filter(id=>!matches[id].directLinkAllowed)) {
    assert.equal(matches[id].directLinkAllowed,false);assert.equal(media[id],undefined);
    assert.deepEqual(projectFinalCommerce(visibleSakePairings.find(p=>p.id===id),config),{normal:[],offer:null});
  }
});
test('Yahoo is hidden without deleting source data, and Rakuten is presented before Amazon and official',()=>{
  const source=[{provider:'merchant'},{provider:'yahoo'},{provider:'amazon'},{provider:'rakuten'}];
  assert.deepEqual(visiblePurchaseLinks(source).map(p=>p.provider),['rakuten','amazon','merchant']);assert.equal(source.length,4);
  assert.equal(purchaseLabel({provider:'rakuten',destinationType:'search_results'}),'楽天でこの銘柄を探す');
  assert.equal(purchaseLabel({provider:'rakuten',destinationType:'product_page'}),'楽天で見る');
});
test('affiliate click emits safe metadata, not URLs, HTML or API credentials; ordinary links do not emit it',()=>{
  const events=[];const emit=(...args)=>events.push(args);
  emitAffiliateClick({sakeId:'test',sakeName:'七田 純米',prefecture:'佐賀県',provider:'rakuten',destinationType:'product_page',isAffiliate:true,matchConfidence:'high',url:'private',html:'private',accessKey:'private'},emit);
  assert.equal(events[0][0],'affiliate_click');assert.equal(events[0][1].match_confidence,'high');assert(!JSON.stringify(events).includes('private'));
  emitAffiliateClick({sakeId:'test',provider:'rakuten',isAffiliate:false},emit);assert.equal(events.length,1);
});
test('expired clicks are prevented and image error fallback does not require modifying official HTML',()=>{
  const listeners={},element={hidden:false,addEventListener:(k,f)=>listeners[k]=f,removeEventListener(){}};
  let prevented=false;const until=new Date(Date.now()+20).toISOString();
  observeAffiliate(element,{sakeId:'test',provider:'rakuten',isAffiliate:true,validUntil:until});
  assert(listeners.click);
  const source=fs.readFileSync('src/app/components/ProductWindow.jsx','utf8');
  assert(source.includes('onErrorCapture'));assert(source.includes('商品画像は準備中です'));
  const expired={hidden:false,addEventListener(){throw Error('expired listener');}};
  observeAffiliate(expired,{validUntil:'2000-01-01'});assert(expired.hidden);
});
test('CSP admits both the official image gateway and its observed image CDN without broadening scripts or connections',()=>{
  const config=JSON.parse(fs.readFileSync('vercel.json'));
  const policy=config.headers[0].headers.find(h=>h.key==='Content-Security-Policy').value;
  const img=policy.split(';').find(d=>d.trim().startsWith('img-src'));
  assert(img.includes('https://hbb.afl.rakuten.co.jp'));assert(img.includes('https://thumbnail.image.rakuten.co.jp'));
  assert(!img.includes('*'));assert(policy.includes("connect-src 'self'"));assert(policy.includes("script-src-attr 'none'"));
});
