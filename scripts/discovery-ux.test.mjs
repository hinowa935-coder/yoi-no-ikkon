import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {discoveryProducts,discoveryNights,discoveryDishes,foodDirections,recommendSake,recommendationPool,suggestDishes,nightsForSake,nightAffinity} from '../src/data/discovery.js';
import {orderedNights} from '../src/data/discoveryNights.js';
import {normalizeTemperature,temperatureLabels,matchesTemperature,temperatureOptions} from '../src/data/temperatureUX.js';
import {matchesSearch,normalizeSearchText,sortSearch} from '../src/data/searchFiltering.js';
import {readSearchLocation,writeSearchLocation,emptySearchFilters} from '../src/app/components/searchLocation.js';
import {discoveryLocation} from '../src/app/components/discoveryLocation.js';
import {expectedActiveItems} from './lib/catalog-fixture.mjs';

test('all active products are unique; no source data is mutated by normalization or affinity',()=>{
  assert.equal(discoveryProducts.length,expectedActiveItems.length);assert.equal(new Set(discoveryProducts.map(p=>p.id)).size,expectedActiveItems.length);
  const before=JSON.stringify(discoveryProducts);
  for(const p of discoveryProducts){temperatureLabels(p.temperature);for(const n of discoveryNights)nightAffinity(p,n.id);}
  assert.equal(JSON.stringify(discoveryProducts),before);
});
test('temperature precision, broad categories, raw aliases and cautions survive',()=>{
  assert.equal(normalizeTemperature('ぬる燗')[0].label,'ぬる燗（約40℃）');
  assert(matchesTemperature(['冷酒'],'group:cold'));assert(!matchesTemperature(['冷酒'],'flower'));
  assert(matchesTemperature(['冷や'],'room'));assert(!matchesTemperature(['冷や'],'group:cold'));
  assert(matchesTemperature(['花冷え（10℃前後）'],'flower'));
  assert(temperatureLabels(['ぬるめのお燗（約40℃、温度管理に注意）'])[0].includes('注意'));
  assert(temperatureLabels(['冷や（△）'])[0].includes('△'));
  assert(!matchesTemperature([],'group:warm'));
  assert(temperatureLabels(['15〜45℃']).includes('15〜45℃'));
  assert(!temperatureOptions(discoveryProducts).some(([id])=>id==='sun'));
});
test('all 19 nights are selectable and season priority is deterministic',()=>{
  assert.equal(discoveryNights.length,19);assert.equal(new Set(discoveryNights.map(n=>n.id)).size,19);
  assert.equal(discoveryNights.filter(n=>n.group==='mood').length,10);
  assert.equal(discoveryNights.filter(n=>n.group==='season').length,9);
  assert(['moon','autumn'].includes(orderedNights('season','2026-10-14')[0].id));
  assert.equal(orderedNights('season','2026-06-10')[0].id,'rain');
});
test('sourced affinity does not infer taste from names or unsourced tags; temperature alone is insufficient',()=>{
  const unknown={id:'fixture',productName:'雨 雪 月 大吟醸',sakeResearch:{verifiedFeatureTags:['旨味'],featureEvidence:[],flavorProfile:{},fieldEvidence:[],servingTemperatures:['ぬる燗']}};
  for(const n of discoveryNights)assert.equal(nightAffinity(unknown,n.id).score,0);
  const p=discoveryProducts.find(p=>nightAffinity(p,'dinner').score>0);
  assert.deepEqual(nightAffinity({...p,productName:'別名',brewery:'別表示'},'dinner'),nightAffinity(p,'dinner'));
  assert.equal(nightAffinity(p,'dinner',{[p.id]:{dinner:{exclude:true}}}).score,0);
  for(const n of nightsForSake(p)){assert(n.affinity.signals.length>0);assert(n.affinity.signals.every(s=>s.sourceUrl));}
});
test('every night/direction preserves grounded pairing, three distinct breweries and additional dish context',()=>{
  for(const n of discoveryNights)for(const d of foodDirections){
    const initial=suggestDishes(n.id,d.id,'2026-10-14');
    const all=suggestDishes(n.id,d.id,'2026-10-14',Infinity);
    assert(initial.length>=3&&initial.length<=6);assert.deepEqual(all.slice(0,6),initial);
    assert(all.every(p=>p.directions.includes(d.id)));
    for(const dish of all){const picks=recommendSake(dish.name,n.id,'2026-10-14');assert.equal(picks.length,3);assert.equal(new Set(picks.map(p=>p.item.brewery)).size,3);
      for(const p of picks){assert(p.strength>=6);assert(p.nightAffinity.score>0);if(p.basis==='taste')assert(p.sourceUrls.length>0);}}
  }
});
test('search filters, legacy Japanese query, literal metacharacters, sorts, zero results and favorites',()=>{
  const p=discoveryProducts[0];
  assert(matchesSearch(p,{keyword:p.productName}));assert(matchesSearch(p,{keyword:p.brewery}));
  assert.equal(normalizeSearchText('フルーティ'),normalizeSearchText('ふるーてぃ'));
  assert(!matchesSearch(p,{keyword:'zzzz-no-product'}));assert(!matchesSearch(p,{filters:{taste:'['}}));
  assert(matchesSearch(p,{onlySaved:true,ids:[p.id]}));assert(!matchesSearch(p,{onlySaved:true,ids:[]}));
  for(const group of ['cold','room','warm'])assert(discoveryProducts.filter(p=>matchesSearch(p,{filters:{temperature:`group:${group}`}})).length>0);
  const sorted=sortSearch(discoveryProducts,'prefecture',['北海道','青森県']);assert.equal(sorted.length,expectedActiveItems.length);
  const filters={...emptySearchFilters(),prefecture:'佐賀県',temperature:'group:warm',sort:'prefecture'};
  const state={keyword:'鍋島',filters,onlySaved:true,limit:48};assert.deepEqual(readSearchLocation(writeSearchLocation('',state)),state);
});
test('Discover URL retains night, direction, dish, deterministic day, expansion and unrelated query',()=>{
  const state={nightId:'rain',directionId:'warm',dishName:'肉じゃが',seed:'2026-10-14',dishLimit:12};
  const href=discoveryLocation('https://yoi-no-ikkon.vercel.app/discover?utm_source=test',state);
  const p=new URL(href,'https://yoi-no-ikkon.vercel.app').searchParams;
  assert.equal(p.get('night'),'rain');assert.equal(p.get('dish'),'肉じゃが');assert.equal(p.get('day'),state.seed);assert.equal(p.get('dishes'),'12');assert.equal(p.get('utm_source'),'test');
  assert(!discoveryLocation('https://yoi-no-ikkon.vercel.app/discover',{...state,dishLimit:6}).includes('dishes='));
});
test('generated sitemap source lists only active canonical products; legacy aliases remain separate',()=>{
  const catalog=JSON.parse(fs.readFileSync(new URL('../src/data/discoveryCatalog.json',import.meta.url)));
  assert.deepEqual(discoveryProducts.map(p=>p.id),expectedActiveItems.map(p=>p.id));
  const text=fs.readFileSync(new URL('../src/app/sitemap.js',import.meta.url),'utf8');assert(text.includes('visibleSakePairings.map'));
});
