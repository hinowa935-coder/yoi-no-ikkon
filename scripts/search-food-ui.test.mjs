import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {visibleSakePairings} from '../src/data/siteData.js';
import {matchesSearch} from '../src/data/searchFiltering.js';
import {selectedValues,toggleSelection} from '../src/data/searchSelections.js';
import {readSearchLocation,writeSearchLocation} from '../src/app/components/searchLocation.js';
import {foodCatalog} from '../src/data/foodCatalog.js';
import {foodBrowseCategories,foodBrowseIndex,matchesFoodBrowse} from '../src/data/foodBrowsing.js';
import {readFoodLocation,writeFoodLocation} from '../src/app/components/foodLocation.js';
const source=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('multi-value selection toggles without duplicates and roundtrips through legacy-compatible URLs',()=>{
 assert.deepEqual(toggleSelection('甘め','辛め'),['甘め','辛め']);assert.equal(toggleSelection(['甘め','辛め'],'甘め'),'辛め');assert.equal(toggleSelection('辛め','辛め'),'');
 const state=readSearchLocation('?q=鍋島&taste=甘め&taste=旨味しっかり&aroma=華やか&aroma=穏やか&temperature=flower&saved=1&count=48&sort=prefecture');
 assert.deepEqual(state.filters.taste,['甘め','旨味しっかり']);assert.equal(state.filters.temperature,'flower');assert.deepEqual(readSearchLocation(writeSearchLocation('?utm_source=test',state)),state);
 assert(writeSearchLocation('?utm_source=test',state).includes('utm_source=test'));assert.deepEqual(selectedValues(['甘め','甘め','']),['甘め']);
});
test('every multi-select group is OR and groups combine with AND over actual inventory',()=>{
 const groups={taste:['甘め','旨味しっかり'],aroma:['華やか','穏やか'],body:['軽やか','しっかり'],temperature:['group:cold','group:warm'],prefecture:['佐賀県','長野県'],classification:['純米酒','純米吟醸']};
 for(const[key,values]of Object.entries(groups))for(const item of visibleSakePairings)assert.equal(matchesSearch(item,{filters:{[key]:values}}),values.some(value=>matchesSearch(item,{filters:{[key]:value}})),key);
 const filters={taste:groups.taste,aroma:groups.aroma,temperature:groups.temperature};
 for(const item of visibleSakePairings)assert.equal(matchesSearch(item,{filters}),Object.entries(filters).every(([key,value])=>matchesSearch(item,{filters:{[key]:value}})));
 assert(visibleSakePairings.some(item=>matchesSearch(item,{filters})));
});
test('search top has no drinking shortcut and retains accessible single-state filter controls',()=>{
 const s=source('src/app/components/SakeSearch.jsx'),top=s.slice(s.indexOf('return <section'),s.indexOf('<dialog'));
 assert(!top.includes('temperature-shortcuts')&&!top.includes('drinking-style'));assert(s.includes("chips('temperature','飲み方'"));assert(s.includes("chips('body','飲みごたえ'"));
 assert(s.includes('後口すっきり'));assert(s.includes('aria-pressed={active}')&&s.includes('toggleSelection'));
 assert(s.includes('aria-live="polite"')&&s.includes('この条件に合う一献がありません')&&s.includes('disabled={!count&&!filters.sort}'));
 assert(s.includes('toggleSelection(filters[key],value)'));assert(s.includes('yoi-search-v1')&&s.includes('restoreScroll'));
});
test('296 original foods have valid unique UI memberships without changing source objects',()=>{
 assert.equal(foodCatalog.length,296);assert.equal(foodBrowseCategories.length,8);assert.equal(new Set(foodCatalog.map(f=>f.id)).size,foodCatalog.length);
 for(const food of foodCatalog){const ids=foodBrowseIndex.get(food.id);assert(ids.length>0,food.name);assert.equal(new Set(ids).size,ids.length);assert(ids.every(id=>foodBrowseCategories.some(c=>c.id===id)));assert(ids.length<=4,food.name);}
 const ids=name=>foodBrowseIndex.get(foodCatalog.find(f=>f.name===name).id);
 assert(ids('アジフライ').includes('fish')&&ids('アジフライ').includes('fried'));
 assert(ids('焼き魚').includes('fish')&&ids('焼き魚').includes('grill'));
 assert(!ids('いぶりがっこ').includes('fish'));assert(!ids('厚揚げの含め煮').includes('fried'));assert(!ids('もやしナムル').includes('grill'));
 assert(ids('冷奴').includes('vegetables'));assert(!ids('いかそうめん').includes('rice'));assert(!ids('柿の葉寿司').includes('vegetables'));
 assert(ids('筑前煮').includes('meat')&&ids('治部煮').includes('vegetables'));assert(ids('てこね寿司').includes('fish'));
});
test('food keyword/category intersections preserve aliases and legacy category deep links',()=>{
 const before=JSON.stringify(foodCatalog),fish=foodCatalog.filter(f=>matchesFoodBrowse(f,{category:'fish'}));assert(fish.length>0);
 for(const food of foodCatalog)assert.equal(matchesFoodBrowse(food,{category:'fish',query:'焼き'}),matchesFoodBrowse(food,{category:'fish'})&&matchesFoodBrowse(food,{query:'焼き'}));
 assert(foodCatalog.some(f=>matchesFoodBrowse(f,{query:'あじフライ',category:'fish'})));assert(foodCatalog.some(f=>matchesFoodBrowse(f,{category:'刺身'})));
 assert.equal(foodCatalog.filter(f=>matchesFoodBrowse(f,{})).length,296);assert.equal(JSON.stringify(foodCatalog),before);
});
test('food category/state stays in URLs with all-results opt-in and static crawlable detail links',()=>{
 const state=readFoodLocation('?q=焼き&category=fish&all=1&count=48');assert.deepEqual(readFoodLocation(writeFoodLocation('',state)),state);assert.equal(readFoodLocation('').all,false);
 const s=source('src/app/components/FoodBrowser.jsx');assert(!s.includes('<select'));assert(s.includes('すべての料理を見る')&&s.includes('aria-pressed={selected}'));
 assert(s.includes('showResults=!!(query||category||all)')&&s.includes('<noscript>')&&s.includes('yoi-food-v1')&&s.includes('restoreScroll'));
 assert(s.includes('food.region.join')&&s.includes('dish_selected'));assert(source('src/app/food/page.jsx').includes('canonical: "/food"'));
});
