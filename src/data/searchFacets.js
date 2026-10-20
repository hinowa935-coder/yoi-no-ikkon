export const simpleTasteOptions=['すっきり','まろやか','旨味しっかり','甘め','辛め'];
export const aromaOptions=['華やか','穏やか','香り控えめ'];
export const bodyOptions=['軽やか','しっかり'];
export function matchesSensoryFacets(item,filters){
  const profile=item.sakeResearch.flavorProfile||{};
  const tags=[...(item.taste||[]),...(item.sakeResearch.verifiedFeatureTags||[])].join(' ');
  const aroma=String(profile.aroma||'');
  if(filters.aroma){
    const patterns={華やか:/華やか|フルーティ|果実|香り高い/,穏やか:/穏やか|おだやか/,香り控えめ:/控えめ|控え目|ひかえめ/};
    const tagPatterns={華やか:/華やかな香|果実.*香|フルーティ/,穏やか:/穏やかな香|おだやかな香|香り.*穏やか/,香り控えめ:/香り.*控え|控えめな香/};
    if(!patterns[filters.aroma]?.test(aroma)&&!tagPatterns[filters.aroma]?.test(tags))return false;
  }
  if(filters.body){
    const body=String(profile.body||'')+' '+tags;
    const pattern=filters.body==='軽やか'?/軽快|軽やか|軽い|ライト|淡麗/:filters.body==='しっかり'?/濃醇|濃厚|重厚|厚み|ふくよか|コク|ボディ.*しっかり/:null;
    if(!pattern?.test(body))return false;
  }
  return true;
}
