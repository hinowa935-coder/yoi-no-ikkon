import descriptions from './tasteDescriptions.json' with {type:'json'};

export const missingTasteDescription='味わいの詳しい情報は、蔵元や購入先の商品説明もご覧ください。';

export function buildTasteDescription(item,fallback=''){
 const entry=descriptions.records[item?.id];
 const identity=entry?.identity;
 if(!identity||identity.productName!==item.productName||identity.brewery!==item.brewery||identity.prefecture!==item.prefecture)return {text:fallback,sources:[],status:'NO_CURRENT_ENTRY'};
 const sources=entry.sources.filter(s=>{try{return /^https?:$/.test(new URL(s.url).protocol);}catch{return false;}}).map(s=>({url:s.url,type:['BREWERY_OFFICIAL','BREWERY_EC','OFFICIAL_DOCUMENT'].includes(s.type)?'breweryOfficial':'retailer',scope:'product'}));
 return {text:entry.text??missingTasteDescription,sources,status:entry.status};
}
