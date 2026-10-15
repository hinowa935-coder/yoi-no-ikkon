// Approximate conventional names are display guidance, never replacement source values.
const names = [
  ['snow', '雪冷え', 5, 'cold'], ['flower', '花冷え', 10, 'cold'], ['cool', '涼冷え', 15, 'cold'],
  ['room', '冷や・常温', 20, 'room'], ['sun', '日向燗', 30, 'warm'], ['skin', '人肌燗', 35, 'warm'],
  ['lukewarm', 'ぬる燗', 40, 'warm'], ['upper', '上燗', 45, 'warm'], ['hot', '熱燗', 50, 'warm'], ['extra-hot', '飛び切り燗', 55, 'warm'],
];
export const temperatureGroups = [['cold', '冷酒'], ['room', '常温'], ['warm', '熱燗']];
export function normalizeTemperature(raw) {
  const value = String(raw).trim();
  const named = names.find(([,name]) => value.includes(name === '冷や・常温' ? '常温' : name));
  if (named) return [{raw, id:named[0], group:named[3], label:`${named[1]}（約${named[2]}℃）`, approximate:true}];
  if (/^(冷や|ひや|室温)(?:（.*）)?$/.test(value)) return [{raw,id:value.includes('△')?'room-caution':'room',group:'room',label:`冷や・常温（約20℃）${value.includes('△')?'・公式目安△':''}`,approximate:true}];
  if (value === '冷やまたはロック') return [...normalizeTemperature('冷や'), {raw,id:'rock',group:'cold',label:'ロック'}];
  if (value === 'やや冷えた状態〜常温') return [{raw,id:'cool-room',group:'cold',label:value},{raw,id:'room',group:'room',label:'冷や・常温（約20℃）',approximate:true}];
  if (/^(冷酒|冷|冷やして|冷たい|やや冷たい|少し冷やして|冷温)$/.test(value)) return [{raw,id:'cold-unspecified',group:'cold',label:'冷酒（温度指定なし）'}];
  if (/燗/.test(value)) { const general=/^(燗|燗酒|お燗|温燗)$/.test(value);return [{raw,id:general?'warm-unspecified':`warm:${value}`,group:'warm',label:general?'燗酒（温度指定なし）':value}]; }
  if (value === 'ロック') return [{raw,id:'rock',group:'cold',label:value}];
  // A source numeric range crossing groups is not a recommendation for every named temperature within it.
  if (/℃/.test(value)) {
    const numbers=value.match(/\d+(?:\.\d+)?/g)?.map(Number) || [];
    const low=Math.min(...numbers), high=Math.max(...numbers);
    const group=high<=15?'cold':low>=30?'warm':low>=16&&high<=25?'room':'';
    return [{raw,id:`raw:${value}`,group,label:value}];
  }
  return [{raw,id:`raw:${value}`,group:'',label:value}];
}
export function temperatureLabels(values=[]) {
  return [...new Set(values.flatMap(normalizeTemperature).map(t=>t.label))];
}
export function temperatureOptions(products) {
  const values=new Map();
  for(const p of products)for(const t of p.temperature.flatMap(normalizeTemperature))if(!values.has(t.id))values.set(t.id,t);
  return [...values.values()].map(t=>[t.id,t.label]);
}
export function matchesTemperature(values, selection) {
  if(!selection)return true;
  const normalized=values.flatMap(normalizeTemperature);
  if(selection.startsWith('group:'))return normalized.some(t=>t.group===selection.slice(6));
  // Legacy shared URLs retain exact raw values without interpreting cold sake as room-temperature sake.
  return values.includes(selection) || normalized.some(t=>t.id===selection);
}
