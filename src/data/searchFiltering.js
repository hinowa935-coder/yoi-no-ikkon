import {dishesForSake,nightAffinity} from './discovery.js';
import {matchesTemperature} from './temperatureUX.js';
import {foodSearchTerms} from './foodCatalog.js';
import {matchesSensoryFacets} from './searchFacets.js';
export const normalizeSearchText=value=>String(value).normalize('NFKC').toLocaleLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
export function matchesSearch(item,{keyword='',filters={},onlySaved=false,ids=[]}) {
  if(onlySaved&&!ids.includes(item.id))return false;
  if(filters.prefecture && item.prefecture!==filters.prefecture)return false;
  if(filters.classification && !item.style.includes(filters.classification))return false;
  if(!matchesTemperature(item.temperature,filters.temperature))return false;
  if(!matchesSensoryFacets(item,filters))return false;
  const taste=[...item.taste,...Object.values(item.sakeResearch.flavorProfile || {}).filter(Boolean)].join(' ');
  const aliases={'すっきり':/すっきり|スッキリ|キレ|爽快/,'米の旨味':/米.*旨|旨味|旨み/,'甘み':/甘み|甘味/,'フルーティ':/果実|フルーティ/,'華やか':/華やか/,'やわらか':/やわらか|柔らか|柔和/,'食中酒':/食中|料理/,'燗向き':/燗/};
  const simpleAliases={'まろやか':/まろやか|なめらか|丸み|柔らか|やわらか/,'旨味しっかり':/旨(?:味|み).*(?:豊か|しっかり|力強|濃)|濃厚.*旨|旨口/,'甘め':/甘口|甘味|甘み/,'辛め':/辛口|ドライ/};
  if(filters.taste){const text=taste+(filters.taste==='燗向き'?item.temperature.join(' '):'');const pattern=simpleAliases[filters.taste]||aliases[filters.taste];if(pattern?!pattern.test(text):!text.includes(filters.taste))return false;}
  if(filters.night && nightAffinity(item,filters.night).score<=0)return false;
  const dishes=filters.dish||keyword?dishesForSake(item):[];
  if(filters.dish && !item.dishCategories.includes(filters.dish) && !dishes.some(d=>d.method.includes(filters.dish)||d.name.includes(filters.dish)||filters.dish==='家庭料理'))return false;
  const text=normalizeSearchText([item.productName,item.sake,item.brewery,item.prefecture,item.region,...item.style,...item.taste,...item.temperature,...foodSearchTerms([...item.dishes,...item.officialPairings,...dishes.map(d=>d.name)])].join(' '));
  return normalizeSearchText(keyword).trim().split(/\s+/).filter(Boolean).every(word=>text.includes(word));
}
export function sortSearch(items,sort,prefectures) {
  if(!sort)return items;
  return [...items].sort((a,b)=>sort==='prefecture'?prefectures.indexOf(a.prefecture)-prefectures.indexOf(b.prefecture)||a.productName.localeCompare(b.productName,'ja'):
    [a.prefecture,a.region,a.brewery,a.productName].join(' ').localeCompare([b.prefecture,b.region,b.brewery,b.productName].join(' '),'ja'));
}
