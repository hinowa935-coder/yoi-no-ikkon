import AffiliateTracker from "./AffiliateTracker.jsx";
import { AMAZON_DISCLOSURE } from "../../commerce/providers.js";
import {visiblePurchaseLinks,purchaseProvider,purchaseLabel} from '../../commerce/purchasePresentation.js';

export function AffiliateDisclosure({ amazon = false }) {
  return <div className="affiliate-disclosure"><p>広告：購入先のリンクにはアフィリエイトリンクが含まれます。購入により運営者に紹介料が入る場合があります。</p>{amazon && <p>{AMAZON_DISCLOSURE}</p>}</div>;
}
function Creative({ offer }) {
  if (offer.mode === "html") return <div className="affiliate-creative" dangerouslySetInnerHTML={{ __html: offer.html }} />;
  return <a href={offer.url} target="_blank" rel="sponsored noopener" className="text-link">{purchaseLabel(offer)} ↗</a>;
}
export function ProductLabelImage({ image }) {
  if (!image) return null;
  return <figure className="product-label-image">
    {image.isAdvertisement && <AffiliateDisclosure amazon={image.marketplace === "amazon"} />}
    {image.isLinkedCreative ? <AffiliateTracker offer={image}><Creative offer={image} /></AffiliateTracker> :
      <img src={image.src} alt={image.alt} width={image.width} height={image.height} className={image.resizeAllowed ? "label-resizable" : "label-original-size"} />}
      {image.isLinkedCreative && <figcaption className="muted-copy">{image.alt}。{image.marketplace === "rakuten" ? "楽天市場" : "外部サイト"}の商品ページへ移動します。</figcaption>}
    {image.notice && <p className="muted-copy">{image.notice}</p>}
  </figure>;
}
export function AffiliateOffers({ offers }) {
  if (!offers.length) return null;
  return <section className="affiliate-offers" aria-label="購入先">
    <AffiliateDisclosure amazon={offers.some(o => o.marketplace === "amazon")} />
    <div className="affiliate-offer-list">{offers.map(o => <div key={`${o.provider}:${o.productId || "search"}:${o.capacityMl || "search"}`}><AffiliateTracker offer={{ sakeId: o.sakeId, provider: o.provider, productId: o.productId, validUntil: o.validUntil, matchType: o.matchType || (o.capacityVariant ? "variant" : "exact"), destinationType: o.destinationType || "product_page", isAffiliate: true, matchConfidence:o.matchConfidence,sakeName:o.sakeName,prefecture:o.prefecture }}>
      <p className="offer-store">広告 / {o.storeName}</p>{o.capacityMl && <p className="offer-capacity">{o.capacityMl}ml{o.capacityVariant ? " / 容量違い" : ""}</p>}<Creative offer={o} />
    </AffiliateTracker>{o.normalFallback && <a className="text-link" href={o.normalFallback.url} target="_blank" rel="noopener">{o.normalFallback.destinationType === "product_page" ? "通常の商品ページを見る" : "通常の検索で探す"} ↗</a>}</div>)}</div>
    <p className="muted-copy">価格・在庫・年度・容量は、購入先でご確認ください。リンク先は外部サイトです。</p>
  </section>;
}

export function PurchaseDiscoveryLinks({ links, showNote = true }) {
  links=visiblePurchaseLinks(links);
  if (!links.length) return <p className="muted-copy">現在、ご案内できる購入先がありません。</p>;
  return <div className="purchase-discovery-links">
    <div className="purchase-search-list">{links.map(link => <AffiliateTracker key={`${link.provider}:${link.url}`} offer={link}>
      <a href={link.url} target="_blank" rel="noopener" className={link.destinationType === "product_page" ? "yoi-button" : "text-link"}>{purchaseLabel(link)} ↗</a>
      {link.matchType === "variant" && <p className="offer-capacity">容量違い{link.capacityMl ? ` / ${link.capacityMl}ml` : ""}</p>}
    </AffiliateTracker>)}</div>
    {showNote && <p className="muted-copy purchase-discovery-note">外部サイトへ移動します。{links.some(l => l.destinationType === "search_results") && "検索結果には別の仕様のお酒も含まれます。"}商品名・年度・容量・価格・在庫はリンク先でご確認ください。</p>}
  </div>;
}

export function PurchaseOptions({ offers, links, item }) {
  const visibleOffers=visiblePurchaseLinks(offers).map(o=>({...o,sakeName:item?.productName,prefecture:item?.prefecture}));
  const visibleLinks=visiblePurchaseLinks(links);
  if(!visibleOffers.length&&!visibleLinks.length)return <PurchaseDiscoveryLinks links={[]} />;
  return <>{['rakuten','amazon','merchant'].map(provider=>{
    const selectedOffers=visibleOffers.filter(o=>purchaseProvider(o)===provider);
    const selectedLinks=visibleLinks.filter(l=>purchaseProvider(l)===provider);
    return selectedOffers.length||selectedLinks.length ? <div key={provider} className={`purchase-provider ${provider==='rakuten'?'is-rakuten':''}`}>
      <AffiliateOffers offers={selectedOffers} />
      {selectedLinks.length>0 && <PurchaseDiscoveryLinks links={selectedLinks} />}
    </div> : null;
  })}</>;
}
