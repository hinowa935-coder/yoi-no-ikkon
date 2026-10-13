import { normalizeTemperature } from './temperatureUX.js';

// Editorial preferences, not measured intensity or new Verified attributes.
export const nightProfiles = {
  'after-work':['umami','body','finish'], quiet:['gentle','soft','balance'], together:['balance','gentle','food'],
  treat:['aroma','clear','finish'], 'just-one':['light','clean','acid'], dinner:['umami','body','acid','food'],
  reset:['clean','light','acid'], celebrate:['aroma','light','sparkling'], lingering:['umami','body','aged','finish'],
  ordinary:['balance','food','umami'], spring:['aroma','light','soft'], rain:['gentle','soft','umami'],
  humid:['light','clean','acid'], festival:['light','aroma','clean'], moon:['gentle','clear','balance'],
  autumn:['umami','soft','body'], cold:['umami','body'], snow:['gentle','soft','umami'], 'year-end':['umami','body','finish','food'],
};
const patterns = {
  umami:/旨味|旨み|うまみ/, body:/コク|濃醇|ふくらみ|豊かな味/, finish:/余韻|長い後味/,
  gentle:/穏やかな香|おだやかな香|控えめな香|やさしい香|ほのかな香/,
  soft:/柔らか|やわらか|柔和|まろやか/, balance:/バランス|調和/, food:/食中酒|食事に寄り添|料理に寄り添/,
  aroma:/華やか|華やい|フルーティ|果実.*香|吟醸香/, clear:/透明感|澄んだ|きれいな|綺麗な/,
  light:/軽快|軽やか|軽い口|淡麗/, clean:/キレ|すっきり|スッキリ|爽快/, acid:/酸味|酸の/,
  sparkling:/発泡|微発泡|スパークリング/, aged:/熟成|古酒/,
};
export const nightOverrides = {};
export const nightTemperaturePreferences = {cold:['warm','room'],snow:['warm','room'],autumn:['warm','room'],humid:['cold'],festival:['cold'],spring:['cold']};
const cache = new WeakMap();
export function nightAffinity(item, nightId, overrides=nightOverrides) {
  if(overrides===nightOverrides && cache.get(item)?.has(nightId))return cache.get(item).get(nightId);
  const preferences=nightProfiles[nightId] || [];
  const research=item.sakeResearch || {};
  const evidence=(research.featureEvidence || []).filter(e=>(research.verifiedFeatureTags || []).includes(e.feature)&&e.sourceUrl)
    .map(e=>({value:e.feature,sourceUrl:e.sourceUrl}));
  for(const [axis,value]of Object.entries(research.flavorProfile || {})) {
    const sources=(research.fieldEvidence || []).filter(e=>e.field===`flavorProfile.${axis}`&&e.sourceUrl);
    for(const source of sources)for(const v of [value].flat().filter(v=>typeof v==='string'))evidence.push({value:v,sourceUrl:source.sourceUrl});
  }
  const signals=preferences.flatMap(axis=>{
    const hit=evidence.find(e=>patterns[axis].test(e.value) && !/酸味を抑|酸味が少|酸味控え|香り.*控え/.test(axis==='acid'||axis==='aroma'?e.value:''));
    return hit?[{axis,...hit}]:[];
  });
  const desired=nightTemperaturePreferences[nightId] || [];
  const temperatureSources=(research.fieldEvidence || []).filter(e=>/servingTemperatures|recommendedTemperatureRange/.test(e.field)&&e.sourceUrl);
  const temperatureMatch=temperatureSources.length>0 && (research.servingTemperatures || []).flatMap(normalizeTemperature).some(t=>desired.includes(t.group));
  // Temperature can support a taste match, never manufacture a match on its own.
  const score=signals.length?Math.min(100,Math.round(signals.length/Math.max(2,preferences.length)*80)+(temperatureMatch?20:0)):0;
  const override=overrides[item.id]?.[nightId];
  const result = {score:override?.exclude?0:Math.max(0,Math.min(100,score+(override?.adjustment || 0))),signals,
    temperatureMatch,temperatureSourceUrls:temperatureMatch?temperatureSources.map(e=>e.sourceUrl):[],
    provenance:'editorialPreferenceFromSourcedFacts',override:override || null};
  if(overrides===nightOverrides){if(!cache.has(item))cache.set(item,new Map());cache.get(item).set(nightId,result);}
  return result;
}
