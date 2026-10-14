export const PURCHASE_PROVIDER_VISIBILITY = {rakuten:true,amazon:true,yahoo:false,merchant:true};
const order = ['rakuten','amazon','merchant'];
export function purchaseProvider(link) { return link.marketplace || link.provider || 'merchant'; }
export function visiblePurchaseLinks(links) {
  return links.filter(link=>PURCHASE_PROVIDER_VISIBILITY[purchaseProvider(link)]!==false)
    .sort((a,b)=>order.indexOf(purchaseProvider(a))-order.indexOf(purchaseProvider(b)));
}
export function purchaseLabel(link) {
  const provider=purchaseProvider(link);
  if(provider==='rakuten')return link.destinationType==='search_results'?'楽天でこの銘柄を探す':'楽天で見る';
  if(provider==='amazon')return link.destinationType==='search_results'?'Amazonで探す':'Amazonで見る';
  if(provider==='merchant'&&link.destinationType==='dealer_list')return '取扱店を確認する';
  return '蔵元・取扱店を見る';
}
