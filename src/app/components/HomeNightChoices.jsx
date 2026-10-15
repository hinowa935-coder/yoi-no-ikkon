import Link from 'next/link';
import {nightDesires} from '../../data/visualChoices.js';
import ChoiceIcon,{ChoiceText} from './ChoiceIcon.jsx';
import {ChevronRight,NavigationSearchIcon} from './InterfaceIcons.jsx';
import TrackedLink from './TrackedLink.jsx';
export default function HomeNightChoices(){
  return <section className="home-night-entrance" aria-labelledby="home-night-title"><p className="section-kicker">夜の気分から</p><h2 id="home-night-title">今夜は、どう過ごしたい？</h2>
    <div className="home-night-grid">{nightDesires.map(d=><TrackedLink href={`/discover?night=${d.nightId}#food-direction`} key={d.id} className="desire-choice" event="discovery_start" parameters={{source:'home',night_id:d.nightId}}><ChoiceIcon name={d.icon} /><ChoiceText label={d.label} parts={d.parts} /><ChevronRight /></TrackedLink>)}</div>
    <div className="home-other-entrances"><Link href="/food"><ChoiceIcon name="meal" /><span>料理から探す</span><ChevronRight /></Link><Link href="/search"><NavigationSearchIcon /><span>日本酒から探す</span><ChevronRight /></Link></div>
    <Link href="/discover" className="text-link seasonal-entrance">季節・天候からも選ぶ <ChevronRight /></Link>
  </section>;
}
