import TrackedExternalLink from "./TrackedExternalLink.jsx";
import { buildRecipeLinks } from "../../data/siteData.js";
export default function RecipeLinks({ dish }) {
  const links = buildRecipeLinks(dish);
  if (!links.length) return null;
  return <section className="recipe-links"><h2>作り方を見る</h2>{links.map(link => <TrackedExternalLink key={link.href} href={link.href} className="text-link" event="recipe_click" parameters={{ food_id: dish, provider: link.provider }}>{link.label} <span aria-label="外部サイト">↗</span></TrackedExternalLink>)}</section>;
}
