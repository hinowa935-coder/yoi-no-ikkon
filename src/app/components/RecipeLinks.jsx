import FoodExternalLink from './FoodExternalLink.jsx';
import { buildRecipeLinks } from "../../data/siteData.js";
import { getCanonicalFood,foodLinkIsCurrent } from '../../data/foodCatalog.js';
export default function RecipeLinks({ dish }) {
  const food=getCanonicalFood(dish);
  if(!food)return null;
  const links = buildRecipeLinks(dish).map(link=>({...link,label:link.variant?`${link.variant}の作り方を見る`:link.label}));
  const references=food.referenceLinks.filter(link=>foodLinkIsCurrent(link));
  if(!links.length&&!references.length)return null;
  return <section className="recipe-links detail-band">{links.length>0&&<><h2>作ってみる</h2><div className="food-link-list">{links.map(link=><FoodExternalLink key={link.url} link={link} food={food}>{link.label}（{link.provider}）</FoodExternalLink>)}</div></>}{references.length>0&&<div className="food-references"><h3>料理について知る</h3><div className="food-link-list">{references.map(link=><FoodExternalLink key={link.url} link={link} food={food} kind="reference">{link.label}（{link.provider}）</FoodExternalLink>)}</div></div>}</section>;
}
