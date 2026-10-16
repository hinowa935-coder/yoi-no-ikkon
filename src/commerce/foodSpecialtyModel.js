import {readCommerceConfig} from './providers.js';
function safeSearchUrl(value) {
 try {const url=new URL(value);return url.protocol==='https:'&&url.hostname==='search.rakuten.co.jp'&&!url.username&&!url.password&&url.pathname.startsWith('/search/mall/');} catch{return false;}
}
function issuedDestinationMatches(record) {
 try {const url=new URL(record.affiliateUrl);return url.protocol==='https:'&&url.hostname==='hb.afl.rakuten.co.jp'&&!url.username&&!url.password&&url.searchParams.get('pc')===record.normalUrl;} catch{return false;}
}
export function foodSpecialtyLinks(foodId,registry,env={},now=Date.now()) {
 const config=readCommerceConfig(env);
 return registry.records.filter(r=>r.dishId===foodId&&r.status==='checked'&&r.httpStatus===200&&r.destinationMatches&&Date.parse(r.validUntil)>now&&safeSearchUrl(r.normalUrl)).map(r=>{
  const affiliate=Boolean(r.operatorApproved&&r.issuedBy==='rakutenOfficialUrlTool'&&issuedDestinationMatches(r)&&config.enabled&&config.enabledProviders.includes('rakuten')&&config.routes.rakuten==='rakuten'&&config.registeredSite===r.registeredSite&&r.registeredSite==='https://yoi-no-ikkon.vercel.app/');
  return {productName:r.productName,region:r.region,relation:r.relation,affiliate,link:{url:affiliate?r.affiliateUrl:r.normalUrl,provider:r.provider,status:r.status,httpStatus:r.httpStatus,validUntil:r.validUntil,checkedAt:r.checkedAt,type:'specialty'}};
 });
}
