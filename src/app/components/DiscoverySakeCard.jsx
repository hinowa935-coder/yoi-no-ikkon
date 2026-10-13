import Link from "next/link";
import { FavoriteButton } from "./Ochoko.jsx";
import TrackedLink from "./TrackedLink.jsx";
import { buildSakeFeatureTags, buildSakeListSummary, buildSakeLocation } from "../../data/siteData.js";
import {temperatureLabels} from '../../data/temperatureUX.js';
import { editorialNightAssignments, editorialNightNote } from '../../data/editorialNightAssignments.js';

export default function DiscoverySakeCard({ item, reason, dishes = [] }) {
  const temperature=temperatureLabels(item.temperature).slice(0,2).join('、');
  return <article className="discovery-sake">
    <div className="sake-card-top"><p>{buildSakeLocation(item)}</p><FavoriteButton id={item.id} compact /></div>
    <h3><TrackedLink href={`/sake/${item.id}`} event="sake_opened" parameters={{sake_id:item.id}}>{item.productName}</TrackedLink></h3>
    <p className="sake-intro">{buildSakeListSummary(item)}</p><ul className="feature-tags">{buildSakeFeatureTags(item,3).map(tag=><li key={tag}>{tag}</li>)}</ul>
    {reason && <div className="pairing-reason"><span>宵の一献の提案</span><p>{reason}</p></div>}
    {editorialNightAssignments[item.id] && <p className="muted-copy">夜の提案：{editorialNightNote}</p>}
    {temperature && <p className="card-temperature">飲み方：{temperature}</p>}
    {dishes.length>0 && <ul className="dish-links">{dishes.slice(0,3).map(dish=><li key={dish.slug}><Link href={`/food/${dish.slug}`}>{dish.name}</Link></li>)}</ul>}
    <TrackedLink href={`/sake/${item.id}`} className="text-link" event="sake_opened" parameters={{sake_id:item.id}}>このお酒を知る <span aria-hidden="true">→</span></TrackedLink>
  </article>;
}
