import {normalizeTemperature,temperatureGroups,temperatureLabels} from '../../data/temperatureUX.js';
import {displaySpec} from '../../data/specDisplay.js';
export default function ServingGuide({values=[],range}){
  const groups=new Set(values.flatMap(normalizeTemperature).map(t=>t.group));
  const rangeText=displaySpec(range);
  return <div className="serving-guide"><h3>飲み方</h3>{groups.size>0&&<ul className="serving-categories">{temperatureGroups.filter(([id])=>groups.has(id)).map(([id,label])=><li key={id}>{label}</li>)}</ul>}
    {values.length>0?<p className="serving-detail">蔵元などの目安：{temperatureLabels(values).join('、')}</p>:<p className="muted-copy">飲用温度の目安は確認中です。</p>}
    {rangeText&&<p className="muted-copy">温度範囲：{rangeText}</p>}
    {groups.has('warm')&&<p className="serving-note">温かい飲み方を「熱燗」にまとめています。実際の温度は上の目安をご覧ください。</p>}
  </div>;
}
