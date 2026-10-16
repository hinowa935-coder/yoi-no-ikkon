import {parse} from 'parse5';
export function retailAvailability(html,{expectedItemId,status,normalUrl,finalUrl}={}){
 const tree=parse(html);let data=null,title='';
 const text=n=>n.nodeName==='#text'?n.value:(n.childNodes||[]).map(text).join('');
 function visit(n){const a=Object.fromEntries((n.attrs||[]).map(a=>[a.name,a.value]));if(n.tagName==='title')title=text(n);if(n.tagName==='script'&&a.id==='item-page-app-data'){try{data=JSON.parse(text(n));}catch{}}for(const c of n.childNodes||[])visit(c);}visit(tree);
 const info=data?.newApi?.itemInfoSku||data?.api?.data?.itemInfoSku;
 const condition=info?.purchaseInfo?.purchaseBySellType?.purchaseCondition??null;
 const stockCondition=info?.purchaseInfo?.newPurchaseSku?.stockCondition??null;
 const itemId=info?.itemId==null?null:String(info.itemId);
 let sameDestination=false;try{const a=new URL(normalUrl),b=new URL(finalUrl);sameDestination=a.origin===b.origin&&a.pathname.replace(/\/$/,'')===b.pathname.replace(/\/$/,'');}catch{}
 const itemMatches=itemId!==null&&itemId===String(expectedItemId);
 const soldOut=condition==='sold-out'||stockCondition==='sold-out';
 const purchaseControls=condition==='enabled'&&info?.features?.displayNormalCartButton===true&&!soldOut;
 return{title,httpStatus:status,sameDestination,itemId,itemMatches,soldOut,purchasable:status===200&&sameDestination&&itemMatches&&purchaseControls,state:status!==200?'http_unconfirmed':!sameDestination?'destination_changed':!itemMatches?'item_identity_unconfirmed':soldOut?'sold_out':purchaseControls?'purchase_enabled':'purchase_unconfirmed'};
}
