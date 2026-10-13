import {dishesForSake,nightAffinity} from './discovery.js';
import {matchesTemperature} from './temperatureUX.js';
export const normalizeSearchText=value=>String(value).normalize('NFKC').toLocaleLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-0x60));
export function matchesSearch(item,{keyword='',filters={},onlySaved=false,ids=[]}) {
  if(onlySaved&&!ids.includes(item.id))return false;
  if(filters.prefecture && item.prefecture!==filters.prefecture)return false;
  if(filters.classification && !item.style.includes(filters.classification))return false;
  if(!matchesTemperature(item.temperature,filters.temperature))return false;
  const taste=[...item.taste,...Object.values(item.sakeResearch.flavorProfile || {}).filter(Boolean)].join(' ');
  const aliases={'すっきり':/すっきり|スッキリ|キレ|爽快/,'米の旨味':/米.*旨|旨味|旨み/,'甘み':/甘み|甘味/,'フルーティ':/果実|フルーティ/,'華やか':/華やか/,'やわらか':/やわらか|柔らか|柔和/,'食中酒':/食中|料理/,'燗向き':/燗/};
  if(filters.taste){const text=taste+(filters.taste==='燗向き'?item.temperature.join(' '):'');if(aliases[filters.taste]?!aliases[filters.taste].test(text):!text.includes(filters.taste))return false;}
  if(filters.night && nightAffinity(item,filters.night).score<=0)return false;
  const dishes=filters.dish||keyword?dishesForSake(item):[];
  if(filters.dish && !item.dishCategories.includes(filters.dish) && !dishes.some(d=>d.method.includes(filters.dish)||d.name.includes(filters.dish)||filters.dish==='家庭料理'))return false;
  const text=normalizeSearchText([item.productName,item.sake,item.brewery,item.prefecture,item.region,...item.style,...item.taste,...item.temperature,...item.dishes,...item.officialPairings,...dishes.map(d=>d.name)].join(' '));
  return normalizeSearchText(keyword).trim().split(/\s+/).filter(Boolean).every(word=>text.includes(word));
}
export function sortSearch(items,sort,prefectures) {
  if(!sort)return items;
  return [...items].sort((a,b)=>sort==='prefecture'?prefectures.indexOf(a.prefecture)-prefectures.indexOf(b.prefecture)||a.productName.localeCompare(b.productName,'ja'):
    [a.prefecture,a.region,a.brewery,a.productName].join(' ').localeCompare([b.prefecture,b.region,b.brewery,b.productName].join(' '),'ja'));
}
