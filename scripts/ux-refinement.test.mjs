import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {visibleSakePairings} from '../src/data/siteData.js';
import {matchesSearch} from '../src/data/searchFiltering.js';
import {matchesSensoryFacets,simpleTasteOptions,aromaOptions,bodyOptions} from '../src/data/searchFacets.js';
import {temperatureGroups,matchesTemperature} from '../src/data/temperatureUX.js';
import {readSearchLocation,writeSearchLocation,isCurrentSearchLocation} from '../src/app/components/searchLocation.js';
import {tastePresentationRows} from '../src/data/tastePresentation.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('detail sensory labels never turn a legacy umami value into sweetness',()=>{
 const profile={sweetness:'米の旨味',acidity:'爽やかな酸味',umami:'米の旨味',aroma:'穏やかな香り',body:'軽やか'};
 const before=JSON.stringify(profile);const rows=tastePresentationRows(profile);
 assert(!rows.some(([label])=>label==='甘味'));
 assert(rows.some(([label,value])=>label==='旨味'&&value==='米の旨味'));
 assert.equal(JSON.stringify(profile),before);
 assert.deepEqual(tastePresentationRows({sweetness:'やさしい甘味',acidity:'華やかな香り'}),[['甘味','やさしい甘味']]);
 assert.deepEqual(tastePresentationRows(),[]);
});
test('search offers three temperature groups while retaining every detailed legacy match',()=>{
 assert.deepEqual(temperatureGroups.map(([,label])=>label),['冷酒','常温','熱燗']);
 for(const id of ['cold','room','warm'])assert(visibleSakePairings.some(i=>matchesSearch(i,{filters:{temperature:'group:'+id}})));
 assert(matchesTemperature(['ぬる燗'],'group:warm'));assert(matchesTemperature(['花冷え'],'group:cold'));assert(!matchesTemperature(['冷酒'],'group:room'));
 assert(matchesTemperature(['花冷え'],'flower'));
});
test('new sensory filters use stated fields, never unknown or unrelated characteristics',()=>{
 const item={taste:[],sakeResearch:{verifiedFeatureTags:[],flavorProfile:{}}};
 assert(!matchesSensoryFacets(item,{aroma:'華やか'}));assert(!matchesSensoryFacets(item,{body:'軽やか'}));
 assert(!matchesSensoryFacets({...item,taste:['穏やかな酸味']},{aroma:'穏やか'}));
 assert(matchesSensoryFacets({...item,sakeResearch:{flavorProfile:{aroma:'穏やかな香り'}}},{aroma:'穏やか'}));
 assert(!matchesSensoryFacets({...item,sakeResearch:{flavorProfile:{aroma:'ほのかな吟醸香'}}},{aroma:'華やか'}));
 assert(simpleTasteOptions.length===5&&aromaOptions.length===3&&bodyOptions.length===2);
});
test('combined filters are intersections and absent facets preserve old searches',()=>{
 const combined={taste:'辛め',aroma:'華やか',temperature:'group:cold'};
 const results=visibleSakePairings.filter(i=>matchesSearch(i,{filters:combined}));assert(results.length>0);
 for(const i of results)for(const[key,value]of Object.entries(combined))assert(matchesSearch(i,{filters:{[key]:value}}));
 assert.equal(visibleSakePairings.filter(i=>matchesSearch(i,{filters:{}})).length,visibleSakePairings.length);
});
test('URL roundtrip keeps old precision, new facets, sort, favorites and loaded count',()=>{
 const state=readSearchLocation('?q=鍋島&temperature=flower&aroma=華やか&body=軽やか&prefecture=佐賀県&sort=prefecture&saved=1&count=72');
 const url=writeSearchLocation('',state);assert.deepEqual(readSearchLocation(url),state);assert.equal(state.filters.temperature,'flower');
});
test('leaving search cannot overwrite its saved scroll with the detail page scroll reset',()=>{
 const search='?temperature=group%3Acold&count=48';
 assert(isCurrentSearchLocation({pathname:'/search',search},search));
 assert(isCurrentSearchLocation({pathname:'/search/',search},search));
 assert(!isCurrentSearchLocation({pathname:'/sake/ichinokura-himezen-lineup-v1',search:''},search));
 assert(!isCurrentSearchLocation({pathname:'/search',search:'?q=changed'},search));
});
test('filter sheet is a native modal with one live source of search state',()=>{
 const s=read('src/app/components/SakeSearch.jsx');
 assert(s.includes('<dialog')&&s.includes('showModal()')&&s.includes('aria-labelledby="filter-sheet-title"'));
 assert(s.includes('本を見る')&&s.includes('さらに細かく選ぶ')&&s.includes('aria-pressed={active}'));
 assert(!s.includes("select('temperature'"));assert(s.includes("document.body.style.overflow='hidden'"));
});
test('full-card link does not nest the favorite or merchant links inside another anchor',()=>{
 const s=read('src/app/components/SakeCardPreview.jsx');
 assert(s.includes('className="card-primary-link"'));assert(s.includes('<FavoriteButton'));
 assert(!s.includes('onClick='));const css=read('src/app/globals.css');assert(css.includes('.card-primary-link::after'));assert(css.includes('z-index: 2'));
});
test('detail retains data and sources after pairings, with share at the end',()=>{
 const s=read('src/app/sake/[slug]/page.jsx');
 assert(s.indexOf('className="detail-band sake-further"')>s.indexOf('className="detail-band sake-pairings"'));
 assert(s.indexOf('<RecommendShare')>s.indexOf('className="detail-band sake-further"'));
 assert(s.includes('[...essentials,...fields]')&&s.includes('r.sources.map')&&s.includes('buildSakeVerifiedTags(item)'));
 assert(s.includes('dishes.slice(0,6)')&&s.includes('dishes.slice(6)')&&s.includes('<ServingGuide'));
});

test('serving information appears only inside the late detailed sake information',()=>{
 const s=read('src/app/sake/[slug]/page.jsx');
 const overview=s.slice(s.indexOf('className="detail-band sake-overview"'),s.indexOf('className="detail-band purchase-discovery"'));
 assert(!overview.includes('ServingGuide')&&!overview.includes('飲み方'));
 assert.equal(s.split('<ServingGuide ').length-1,1);
 assert(s.indexOf('<ServingGuide ')>s.indexOf('<summary>詳しい酒情報を見る</summary>'));
 assert(!s.includes('["飲用温度",')&&!s.includes('["飲用温度範囲",'));
 const guide=read('src/app/components/ServingGuide.jsx');
 assert(guide.includes('おすすめ温度：')&&guide.includes('rangeText')&&guide.includes('temperatureLabels(values)'));
});
