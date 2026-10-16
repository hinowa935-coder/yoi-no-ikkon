import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {foodCatalog,foodMigrations,getCanonicalFood,canonicalFoodName,canonicalFoodNames,foodNameMatches,foodSearchTerms,normalizeFoodQuery,foodLinkIsCurrent,foodRouteSlugs} from '../src/data/foodCatalog.js';
import {getFoodOptions,getFoodBySlug,getRelatedByFood,buildRecipeLinks,toPathSegment,visibleSakePairings} from '../src/data/siteData.js';
import {scorePairing,recommendSake,discoveryDishes,dishesForSake,recommendationPool} from '../src/data/discovery.js';
import {matchesSearch} from '../src/data/searchFiltering.js';
import {foodSpecialtyLinks} from '../src/commerce/foodSpecialtyModel.js';
import specialties from '../src/commerce/foodSpecialties.json' with{type:'json'};
const read=p=>fs.readFileSync(new URL(p,import.meta.url),'utf8');
test('310 historical dishes resolve to 296 canonical dishes with 14 reversible alias routes',()=>{
 assert.equal(foodCatalog.length,296);assert.equal(foodRouteSlugs().length,310);assert.equal(foodMigrations.length,13);
 assert.equal(new Set(foodCatalog.map(f=>f.id)).size,296);assert.equal(getFoodOptions().length,296);
 for(const m of foodMigrations)for(const id of m.mergedIds){assert.equal(getFoodBySlug(id).id,m.canonicalId);assert.equal(canonicalFoodName(id),m.canonicalName);}
});
test('kana, kanji, spacing and common aliases reach the same fry without duplicate cards',()=>{
 for(const word of ['アジフライ','あじフライ','鯵フライ','鯵のフライ','　ｱｼﾞﾌﾗｲ '])assert.equal(getCanonicalFood(word).name,'アジフライ');
 for(const q of ['あじ','鯵','あじフライ'])assert.equal(foodCatalog.filter(f=>foodNameMatches(f.name,q)).filter(f=>f.name==='アジフライ').length,1);
 assert.equal(canonicalFoodNames(['アジフライ','あじフライ','鯵フライ']).length,1);
 assert(foodSearchTerms(['アジフライ']).includes('鯵のフライ'));
});
test('aliases never shadow another canonical identity',()=>{
 const seen=new Map();for(const food of foodCatalog)for(const name of [food.name,...food.aliases]){const key=normalizeFoodQuery(name);assert(!seen.has(key)||seen.get(key)===food.id,name);seen.set(key,food.id);}
});
test('different ingredients, preparations and unclear similar dishes remain distinct',()=>{
 for(const [a,b]of [['冷奴','湯豆腐'],['鶏の唐揚げ','鯖の竜田揚げ'],['焼き鳥','鶏の照り焼き'],['しらすご飯','しらす丼'],['焼き鮭','鮭の塩焼き'],['豆腐の薬味のせ','冷奴']])assert.notEqual(getCanonicalFood(a)?.id,getCanonicalFood(b)?.id,[a,b].join('/'));
});
test('regional meanings, same-name regional variants and gameni survive without invented exclusivity',()=>{
 const bean=getCanonicalFood('しょうゆ豆');assert.equal(bean.regionalVariants.length,2);assert.equal(bean.recipeLinks.length,2);assert(bean.description.includes('異なる'));
 assert(getCanonicalFood('がめ煮').regionalNames.some(n=>n.name==='がめ煮'));assert.equal(getCanonicalFood('がめ煮').family,'鶏と根菜の煮物');
 const regional=foodCatalog.filter(f=>f.regionalCuisine);assert.equal(regional.length,32);for(const f of regional){assert(f.description&&f.sources.length&&f.region.length,f.name);assert(f.description.length<=100,f.name);}
});
test('all dish IDs, tags, discovery references and raw sake dish references remain resolvable',()=>{
 for(const d of discoveryDishes)assert.equal(getCanonicalFood(d.name).name,d.name);
 for(const p of visibleSakePairings)for(const name of p.dishes)assert(getCanonicalFood(name),name);
 for(const food of foodCatalog){assert.equal(toPathSegment(food.name),food.slug);assert.equal(new Set(food.pairingTags).size,food.pairingTags.length);}
});
test('merged editorial and official evidence keeps its strength, original source and provenance',()=>{
 const before=JSON.stringify(visibleSakePairings);
 for(const m of foodMigrations)for(const p of visibleSakePairings){
  if(p.yoiPairings.some(n=>m.mergedNames.includes(n)))assert(scorePairing(p,m.canonicalName).strength>=8);
  if(p.officialPairings.some(n=>m.mergedNames.includes(n)))assert(scorePairing(p,m.canonicalName).officialExact);
 }
 assert.equal(JSON.stringify(visibleSakePairings),before);
 assert.deepEqual(getRelatedByFood('あじフライ').map(p=>p.id),getRelatedByFood('アジフライ').map(p=>p.id));
});
test('alias recommendations have the same deterministic identities and displayed canonical dish name',()=>{
 assert.deepEqual(recommendSake('あじフライ','ordinary','food-test').map(r=>r.item.id),recommendSake('アジフライ','ordinary','food-test').map(r=>r.item.id));
 for(const m of foodMigrations)for(const result of recommendationPool(m.canonicalName))for(const alias of m.mergedNames)assert(!result.reason.includes(alias),alias);
});
test('sake search accepts canonical aliases without modifying verified data',()=>{
 const fry=visibleSakePairings.find(p=>p.dishes.some(n=>canonicalFoodName(n)==='アジフライ'));
 for(const keyword of ['アジフライ','あじフライ','鯵フライ'])assert(matchesSearch(fry,{keyword}));
 for(const p of visibleSakePairings){const dishes=dishesForSake(p);assert.equal(dishes.length,new Set(dishes.map(d=>d.name)).size);}
});
test('recipe links are verified HTTPS direct pages with at most two entries, never generic search',()=>{
 for(const food of foodCatalog){assert(food.recipeLinks.length<=2);for(const l of [...food.recipeLinks,...food.referenceLinks]){assert.equal(new URL(l.url).protocol,'https:');assert.equal(l.httpStatus,200);assert(l.checkedAt&&l.validUntil);assert(foodLinkIsCurrent(l,Date.parse('2026-10-16T09:00:00Z')));}for(const l of food.recipeLinks){assert.equal(l.type,'recipe');assert(!l.url.includes('search?'));}}
 assert(buildRecipeLinks('肉じゃが')[0].href.includes('/recipe/nikujaga/'));
 assert.equal(buildRecipeLinks('栃尾の油揚げ').length,0);assert(getCanonicalFood('栃尾の油揚げ').referenceLinks.length>0);
 assert.equal(buildRecipeLinks('存在しない料理').length,0);
});
test('expired or unconfirmed external links are hidden',()=>{
 const valid=buildRecipeLinks('肉じゃが')[0];assert(!foodLinkIsCurrent({...valid,status:'unconfirmed'}));assert(!foodLinkIsCurrent({...valid,validUntil:'2020-01-01'}));assert(!foodLinkIsCurrent({...valid,url:'http://example.com'}));
});
test('all 14 old URLs have permanent platform redirects and only canonical sitemap references',()=>{
 const config=JSON.parse(read('../vercel.json'));for(const m of foodMigrations)for(const id of m.mergedIds)assert(config.redirects.some(r=>r.source===`/food/${id}`&&r.destination===`/food/${m.canonicalSlug}`&&r.permanent));
 assert(read('../src/app/sitemap.js').includes('getFoodOptions()'));
 const page=read('../src/app/food/[slug]/page.jsx');assert(page.includes('robots:{index:false,follow:true}'));assert(page.includes('food.slug'));assert(page.includes('httpEquiv="refresh"'));assert(!page.includes('"@type":"Recipe"'));
});
const config={AFFILIATE_ENABLED:'true',AFFILIATE_RAKUTEN_ENABLED:'true',AFFILIATE_RAKUTEN_ROUTE:'rakuten',AFFILIATE_REGISTERED_SITE:'https://yoi-no-ikkon.vercel.app/'};
test('22 meaningful specialty searches for 21 dishes use the unchanged officially issued destination',()=>{
 assert.equal(specialties.records.length,22);assert.equal(new Set(specialties.records.map(r=>r.dishId)).size,21);
 for(const r of specialties.records){assert(getCanonicalFood(r.dishId));assert(r.sources.length);assert(r.destinationMatches&&r.httpStatus===200);assert.equal(new URL(r.affiliateUrl).hostname,'hb.afl.rakuten.co.jp');assert.equal(new URL(r.affiliateUrl).searchParams.get('pc'),r.normalUrl);assert.equal(new URL(r.normalUrl).hostname,'search.rakuten.co.jp');assert(r.issuanceSha256);}
});
test('global flags, provider, route, registered site and explicit approval gate specialty affiliate URLs',()=>{
 const r=specialties.records[0],project=(env,registry=specialties,now)=>foodSpecialtyLinks(r.dishId,registry,env,now)[0];
 assert(project(config).affiliate);for(const override of [{AFFILIATE_ENABLED:'false'},{AFFILIATE_RAKUTEN_ENABLED:'false'},{AFFILIATE_RAKUTEN_ROUTE:'none'},{AFFILIATE_REGISTERED_SITE:'https://wrong.example/'}]){const l=project({...config,...override});assert(!l.affiliate);assert.equal(l.link.url,r.normalUrl);}
 assert(!project(config,{records:[{...r,operatorApproved:false}]}).affiliate);
 assert(!project(config,{records:[{...r,affiliateUrl:'https://example.com/'}]}).affiliate);
 assert.equal(foodSpecialtyLinks(r.dishId,{records:[{...r,normalUrl:'https://example.com/'}]},config).length,0);
 assert.equal(foodSpecialtyLinks(r.dishId,specialties,config,Date.parse('2030-01-01')).length,0);
});
test('commerce and analytics never become recommendation inputs; external events omit URLs and credentials',()=>{
 const discovery=read('../src/data/discovery.js');assert(!/foodSpecialt|affiliate|commission/i.test(discovery));
 const component=read('../src/app/components/FoodExternalLink.jsx');for(const key of ['recipe_link_click','specialty_affiliate_click','dish_id','dish_name','provider','source_page','product_name','region'])assert(component.includes(key));
 const payload=component.slice(component.indexOf('onClick'));assert(!/url:|href:|secret|credential|RAKUTEN_/i.test(payload));assert(component.includes('nofollow sponsored noopener noreferrer'));
});
