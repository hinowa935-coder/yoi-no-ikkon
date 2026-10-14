import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {visibleSakePairings} from '../src/data/siteData.js';
import {discoveryDishes,discoveryNights,foodDirections,recommendSake,scorePairing} from '../src/data/discovery.js';
import {sakeDiscoveryHref,sakeDiscoveryContext} from '../src/data/discoveryContext.js';
import {recordSakeEntry,emitAffiliateClick} from '../src/commerce/entryTracking.js';
import {matchesSearch} from '../src/data/searchFiltering.js';
import {migrateFavorites,resolveFavorite} from '../src/data/favoriteReferences.js';
const read=p=>JSON.parse(fs.readFileSync(p));
test('every active product can be found by its own name and brewery',()=>{
 for(const item of visibleSakePairings){assert(matchesSearch(item,{keyword:item.productName}),item.id);assert(matchesSearch(item,{keyword:item.brewery}),item.id);}
});
test('Ichinokura official temperature and dishes are also synchronized to search and recommendation fields',()=>{
 const i=visibleSakePairings.find(i=>i.id==='ichinokura-tokubetsu-junmai-karakuchi');
 assert.deepEqual(i.temperature,i.sakeResearch.servingTemperatures);
 assert.deepEqual(i.officialPairings,i.sakeResearch.officialPairings);
 assert(matchesSearch(i,{filters:{temperature:'group:warm'}}));
});
test('all 45 retired favorites retain their own identity and never silently become another SKU',()=>{
 const ids=read('src/commerce/generated/replacement-ids.json'),refs=read('src/data/discoveryCatalog.json').references.filter(r=>ids.includes(r.suggestedReplacementId));
 assert(refs.length>=45); // Historical aliases also remain attached to their archived identity.
 assert(ids.every(id=>refs.some(r=>r.suggestedReplacementId===id)));
 for(const r of refs){assert.equal(r.status,'replaced_archive');assert.equal(r.automaticFavoriteMigration,false);assert.deepEqual(migrateFavorites([r.legacyId]),[r.legacyId]);assert.notEqual(resolveFavorite(r.legacyId).status,'same_product_alias');}
});
test('new 45 identities are unique, sourced and have independent Amazon search destinations',()=>{
 const ids=read('src/commerce/generated/replacement-ids.json'),links=read('src/commerce/generated/discovery-links.json');
 assert.equal(ids.length,45);assert.equal(new Set(ids).size,45);
 for(const id of ids){const item=visibleSakePairings.find(i=>i.id===id);assert(item);assert(item.sakeResearch.sources.length);
  assert.deepEqual(item.temperature,item.sakeResearch.servingTemperatures);
  assert.deepEqual(item.officialPairings,item.sakeResearch.officialPairings);
  const link=links[id].links.find(l=>l.provider==='amazon');assert.equal(new URL(link.url).pathname,'/s');assert.equal(new URL(link.url).searchParams.get('k'),item.productName);assert.equal(link.isAffiliate,false);}
});
test('merchant evidence is separate from purchase destinations and capacity is nullable',()=>{
 const records=read('src/commerce/generated/merchant-links.json').records;assert.equal(Object.keys(records).length,492);
 assert.equal(records['nogomi-tokubetsu-junmai'].type,'E');
 for(const r of Object.values(records)){if(r.type==='E')assert.equal(r.url,null);else assert(r.url?.startsWith('https://'));assert(r.capacityMl===null||r.capacityMl>0);}
});
test('selected dish, night, direction, day and expansion survive the detail and return URL',()=>{
 let found=false;
 for(const night of discoveryNights){for(const dish of discoveryDishes){
  const picks=recommendSake(dish.name,night.id,'2026-10-14',3);if(!picks.length)continue;
  const item=picks[0].item,href=sakeDiscoveryHref(item.id,{nightId:night.id,directionId:dish.directions[0],dishName:dish.name,seed:'2026-10-14',dishLimit:12});
  const query=new URL(href,'https://yoi-no-ikkon.vercel.app').searchParams,context=sakeDiscoveryContext(query,item);if(!context)continue;
  assert.equal(context.dishName,dish.name);assert.equal(context.nightId,night.id);
  const back=new URL(context.returnHref,'https://yoi-no-ikkon.vercel.app');assert.equal(back.pathname,'/discover');assert.equal(back.searchParams.get('dish'),dish.name);assert.equal(back.searchParams.get('dishes'),'12');
  assert.deepEqual(recommendSake(back.searchParams.get('dish'),back.searchParams.get('night'),back.searchParams.get('day'),3).map(p=>p.item.id),picks.map(p=>p.item.id));found=true;break;
 }if(found)break;}assert(found);
 assert.equal(sakeDiscoveryContext(new URLSearchParams(),visibleSakePairings[0]),null);
 assert.equal(sakeDiscoveryContext(new URLSearchParams('from=discover&dish=unknown&night=ordinary&direction=unknown&day=2026-10-14'),visibleSakePairings[0]),null);
});
test('a specific root-vegetable pairing is not expanded to fish in miso',()=>{
 const item={...visibleSakePairings[0],officialPairings:['根菜の煮物'],yoiPairings:[],editorialPairingEvidence:[]};
 const result=scorePairing(item,'鯖の味噌煮');assert(!result.reason.includes('根菜の煮物'));
});
test('analytics preserves the new identity through contextual URLs without recording URLs or credentials',()=>{
 const oldWindow=global.window,oldStorage=global.sessionStorage;let saved;
 global.window={location:{origin:'https://yoi-no-ikkon.vercel.app',pathname:'/discover',search:'?night=ordinary&dish='+encodeURIComponent('湯豆腐')}};
 global.sessionStorage={setItem:(k,v)=>saved=v,getItem:()=>saved};
 try{const id=read('src/commerce/generated/replacement-ids.json')[0];recordSakeEntry(`/sake/${id}?from=discover`);assert.equal(JSON.parse(saved).sake_id,id);
 let event;emitAffiliateClick({sakeId:id,provider:'rakuten',isAffiliate:true,destinationType:'product_page',matchConfidence:'high'},(name,data)=>event=data);
 assert.equal(event.sake_id,id);assert.equal(event.source_page,'/discover');assert.equal(event.night_id,'ordinary');assert(!JSON.stringify(event).includes('https://'));
 }finally{global.window=oldWindow;global.sessionStorage=oldStorage;}
});
