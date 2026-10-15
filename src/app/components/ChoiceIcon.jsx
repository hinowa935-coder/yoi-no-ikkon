import {Moon,Wind,Sparkles,Soup,MessagesSquare,CloudRain,Sun,Snowflake,CalendarDays,Leaf,Flame,Utensils,Fish,CookingPot} from 'lucide-react';
import {OchokoIcon} from './InterfaceIcons.jsx';
const icons={moon:Moon,wind:Wind,sparkles:Sparkles,bowl:Soup,conversation:MessagesSquare,rain:CloudRain,sun:Sun,snow:Snowflake,calendar:CalendarDays,leaf:Leaf,flame:Flame,meal:Utensils,fish:Fish,pot:CookingPot};
export default function ChoiceIcon({name='meal'}){
  if(name==='cup')return <span className="choice-icon"><OchokoIcon /></span>;
  const Icon=icons[name]||Utensils;
  return <span className="choice-icon"><Icon size={24} strokeWidth={1.5} aria-hidden="true" /></span>;
}
export function DishIcon({method=''}){
  const name=/刺身|魚/.test(method)?'fish':/焼|炒|揚/.test(method)?'flame':/煮|鍋|蒸/.test(method)?'pot':/酢|サラダ|茹/.test(method)?'leaf':'meal';
  return <ChoiceIcon name={name} />;
}
export function ChoiceText({label,parts}){
  return <span className="choice-text">{(parts||[label]).map(part=><span className="choice-word" key={part}>{part}</span>)}</span>;
}
