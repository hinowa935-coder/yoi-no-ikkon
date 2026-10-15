import {FavoriteButton} from './Ochoko.jsx';
import TrackedLink from './TrackedLink.jsx';
import ProductWindow from './ProductWindow.jsx';
import {buildCardPresentation,cardPairingExcerpt} from '../../data/cardPresentation.js';
import {toPathSegment} from '../../data/siteData.js';
export default function SakeCardPreview({item,reason='',contextHref,context={},children}){
  const {cardCatchphrase,tags}=buildCardPresentation(item);
  const href=contextHref||`/sake/${item.id}`;
  const parameters={sake_id:item.id,...context};
  return <article className="discovery-sake compact-sake-card">
    <div className="compact-card-main"><ProductWindow item={item} compact context={{...context,foodId:context.foodId?toPathSegment(context.foodId):undefined}} />
      <div className="compact-card-copy"><p className="card-catchphrase">{cardCatchphrase}</p><h3><TrackedLink href={href} event="sake_opened" parameters={parameters}>{item.productName}</TrackedLink></h3>{tags.length>0&&<ul className="feature-tags card-taste-tags" aria-label="このお酒の特徴">{tags.map(t=><li key={t}>{t}</li>)}</ul>}</div>
    </div>
    {reason&&<p className="card-pairing-excerpt">{cardPairingExcerpt(reason)}</p>}
    <div className="compact-card-footer"><p className="card-location" title={`${item.prefecture}・${item.brewery}`}>{item.prefecture}・{item.brewery}</p><FavoriteButton id={item.id} compact productName={item.productName} /><TrackedLink href={href} className="text-link sake-detail-link" event="sake_opened" parameters={parameters}>詳しく見る <span aria-hidden="true">→</span></TrackedLink></div>
    {children}
  </article>;
}
