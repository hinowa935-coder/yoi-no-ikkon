import 'server-only';
import registry from '../../commerce/foodSpecialties.json';
import {foodSpecialtyLinks} from '../../commerce/foodSpecialtyModel.js';
import {getCanonicalFood} from '../../data/foodCatalog.js';
import FoodExternalLink from './FoodExternalLink.jsx';
export default function SpecialtyLinks({dish}) {
 const food=getCanonicalFood(dish);
 if(!food)return null;
 const links=foodSpecialtyLinks(food.id,registry,process.env);
 if(!links.length)return null;
 const ingredients=links.some(link=>link.relation==='この料理に使いたいもの');
 return <section className="detail-band specialty-links"><h2>{ingredients?'この料理に使いたいもの':'郷土の一品を探す'}</h2>{links.some(link=>link.affiliate)&&<p className="commerce-disclosure">広告：楽天アフィリエイトのリンクを含みます。</p>}<ul>{links.map(({productName,region,affiliate,link})=><li key={productName}><div><strong>{productName}</strong><span className="food-region">{region.join('・')}</span></div><FoodExternalLink link={link} food={food} kind="specialty" productName={productName} region={region} affiliate={affiliate}>楽天で探す（検索）</FoodExternalLink></li>)}</ul><p className="muted-copy specialty-note">検索先で商品・原材料・販売状況をご確認ください。</p></section>;
}
