import ShareButton from './ShareButton.jsx';
import { SITE_NAME } from '../../data/siteIdentity.js';

export default function RecommendShare({ item }) {
  return <section className="return-note recommend-share" aria-label={item ? 'この一献を、誰かにも。' : '宵の一献を、誰かにも。'}>
    <h2>{item ? 'この一献を、誰かにも。' : '宵の一献を、誰かにも。'}</h2>
    {!item && <p>気に入ってもらえたら、友達にも教えてもらえるとうれしいです。</p>}
    <ShareButton
      title={item ? `${item.productName}｜${SITE_NAME}` : '宵の一献｜こんな夜に合う、一献を。'}
      text={item ? `この一献、よさそう。${item.productName}` : '日本酒を、夜や料理から選べる「宵の一献」。'}
      path={item ? `/sake/${item.id}` : '/'}
      eventName={item ? 'sake_share_open' : 'site_share_open'}
      label="友達にすすめる"
      ariaLabel={item ? 'この日本酒を友達にすすめる' : '宵の一献を友達にすすめる'}
    />
  </section>;
}
