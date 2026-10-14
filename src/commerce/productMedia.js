import media from './generated/product-media.json' with {type:'json'};
const httpsHost=(value,hosts)=>{try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password&&!u.port&&hosts.includes(u.hostname);}catch{return false;}};
export function productMediaFor(item,records=media.records) {
  const image=records[item.id];
  return image?.matchConfidence==='high' && image.sakeName===item.productName && image.brewery===item.brewery && image.brandName===item.brandName &&
    image.sourceType==='rakutenOfficialTool' && image.permissionConfirmed===true &&
    image.productUrl===image.imageProductUrl && Number.isInteger(image.capacityMl)&&image.capacityMl>0&&image.capacityMl===image.imageCapacityMl &&
    httpsHost(image.src,['hbb.afl.rakuten.co.jp']) && httpsHost(image.affiliateUrl,['hb.afl.rakuten.co.jp','a.r10.to']) &&
    httpsHost(image.productUrl,['item.rakuten.co.jp']) && image.width===240&&image.height===240 && image.compactWidth===80&&image.compactHeight===80 &&
    httpsHost(image.compactSrc,['hbb.afl.rakuten.co.jp']) && typeof image.compactHtml==='string' &&
    typeof image.html==='string' && image.originalUnmodified===true &&
    Number.isFinite(Date.parse(image.validUntil)) ? image : null;
}
