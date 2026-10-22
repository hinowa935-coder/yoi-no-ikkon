import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {allSakePairings,visibleSakePairings,getSakeById,buildResourceLinks} from '../src/data/siteData.js';
import {dishesForSake,nightsForSake} from '../src/data/discovery.js';
import {resolveFavorite} from '../src/data/favoriteReferences.js';
import {eligibleSensoryEvidence} from '../src/catalog/operations.js';
import {retailAvailability} from './lib/catalog-retail-availability.mjs';
import {reviewedCommerceUpdate,digest} from './lib/reviewed-commerce-update.mjs';
import {originalReviewedPrefecture} from './lib/reviewed-local-sakana.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../'+p,import.meta.url)));
const additions=read('src/data/catalogAdditions.json'),id=additions.items[0].id,item=getSakeById(id);
test('catalog expansion preserves every prior identity, link, image and approval',()=>{
 const baseline=p=>JSON.parse(execFileSync('git',['show',additions.sourceCommit+':'+p],{maxBuffer:64*1024*1024}).toString());
 const currentCatalog=read('src/data/discoveryCatalog.json');assert.deepEqual({...currentCatalog,items:currentCatalog.items.map(originalReviewedPrefecture)},baseline('src/data/discoveryCatalog.json'));
 for(const file of ['purchase-matches.json','discovery-links.json']){const old=baseline('src/commerce/generated/'+file),current=read('src/commerce/generated/'+file);for(const[k,v]of Object.entries(old))assert(digest(current[k])===digest(v)||reviewedCommerceUpdate('src/commerce/generated/'+file,k,digest(v),current[k]));}
 const media=read('src/commerce/generated/product-media.json').records;for(const[k,v]of Object.entries(baseline('src/commerce/generated/product-media.json').records))assert(digest(media[k])===digest(v)||reviewedCommerceUpdate('src/commerce/generated/product-media.json',k,digest(v),media[k]));
 const oldApproval=baseline('src/commerce/generated/commerce-final-approvals.json').links;assert.deepEqual(read('src/commerce/generated/commerce-final-approvals.json').links.slice(0,oldApproval.length),oldApproval);
 assert.equal(new Set(allSakePairings.map(i=>i.id)).size,allSakePairings.length);assert(visibleSakePairings.some(i=>i.id===id));
});
test('new product facts, subjective evidence and editorial dishes retain separate provenance',()=>{
 assert.equal(item.dataConfidence,'medium');assert.equal(item.sakeResearch.identity.officialProductUrl,null);assert.equal(item.capacityMl,720);
 assert(item.sakeResearch.fieldEvidence.every(e=>!['review','community','editorial','rakuten_review'].includes(e.sourceType)));
 assert.equal(eligibleSensoryEvidence(item.communityEvidence,{skuId:id}).accepted.length,1);assert(Object.values(item.sensoryConsensus.fields).every(f=>f.confidence==='low'&&f.value===null));
 assert.equal(item.sakeResearch.officialPairings.length,0);assert.equal(item.communityPairings.length,0);assert.equal(item.editorialPairingEvidence.length,3);
 const dishes=dishesForSake(item);assert(item.editorialPairingEvidence.every(e=>dishes.some(d=>d.name===e.dish)));assert(dishes.length<=6);assert(nightsForSake(item,Infinity).length>0);assert.equal(resolveFavorite(id).canonicalId,id);
 assert(buildResourceLinks(item).some(l=>l.label.includes('酒造組合')));
});
test('live stock is tied to the internal item ID and canonical page, not unrelated page text',()=>{
 const info={itemId:123,features:{displayNormalCartButton:true},purchaseInfo:{purchaseBySellType:{purchaseCondition:'enabled'}}};
 const html='<title>単品</title><script id="item-page-app-data">'+JSON.stringify({newApi:{itemInfoSku:info}})+'</script>';
 const options={expectedItemId:'123',status:200,normalUrl:'https://item.rakuten.co.jp/shop/name/',finalUrl:'https://item.rakuten.co.jp/shop/name/'};
 assert(retailAvailability(html,options).purchasable);assert(!retailAvailability(html,{...options,expectedItemId:'456'}).purchasable);
 assert(!retailAvailability(html,{...options,finalUrl:'https://item.rakuten.co.jp/shop/other/'}).purchasable);
 assert.equal(retailAvailability('<title>包装・配送が良かった</title>',options).state,'item_identity_unconfirmed');
});
