import catalog from './foodCatalog.json' with {type:'json'};
export const foodCatalog=catalog.foods;
export const foodMigrations=catalog.migrations;
export const normalizeFoodQuery=value=>String(value||'').normalize('NFKC').toLocaleLowerCase().replace(/[ァ-ヶ]/g,c=>String.fromCharCode(c.charCodeAt(0)-96)).replace(/[\s・]/g,'');
const byName=new Map(),bySlug=new Map();
for(const food of foodCatalog){bySlug.set(food.slug,food);for(const name of [food.name,...food.aliases])byName.set(normalizeFoodQuery(name),food);}
for(const m of foodMigrations)for(const id of m.mergedIds)bySlug.set(id,bySlug.get(m.canonicalSlug));
export function getCanonicalFood(value){return bySlug.get(value)||byName.get(normalizeFoodQuery(value))||null;}
export const canonicalFoodName=value=>getCanonicalFood(value)?.name||value;
export const foodNameMatches=(value,query)=>{const food=getCanonicalFood(value),q=normalizeFoodQuery(query);return[food?.name||value,...food?.aliases||[]].some(n=>normalizeFoodQuery(n).includes(q));};
export function canonicalFoodNames(names){return[...new Set(names.map(canonicalFoodName))];}
export function foodSearchTerms(names){return [...new Set(names.flatMap(name=>{const food=getCanonicalFood(name);return food?[food.name,...food.aliases]:[name];}))];}
export function canonicalizeFoodText(text){let result=text;for(const m of foodMigrations)for(const alias of [...m.mergedNames].sort((a,b)=>b.length-a.length))result=result.replaceAll(alias,m.canonicalName);return result;}
export function foodRouteSlugs(){return [...bySlug.keys()];}
export function foodLinkIsCurrent(link,now=Date.now()){return link?.status==='checked'&&link.httpStatus===200&&link.url?.startsWith('https://')&&Date.parse(link.validUntil)>now;}
