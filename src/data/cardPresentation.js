import {buildSakeIntroduction,naturalTasteTerm} from './sakeIntroduction.js';
const tastePattern=/香|旨|コク|酸|甘|辛口|中口|淡麗|芳醇|濃醇|軽|キレ|後口|後味|余韻|熟成|口当たり|なめらか|透明感|フレッシュ|発泡|にごり|爽やか|果実|フルーティ|ジューシー|食中酒/;
const shortTag=term=>term.replace(/の味わい$|な味わい$/,'');
export function buildCardPresentation(item){
  const intro=buildSakeIntroduction(item);
  const facts=intro.segments.flatMap(s=>s.facts||[]).filter(f=>f.term&&f.evidence?.length);
  for(const value of item.sakeResearch.verifiedFeatureTags||[]){
    const term=value==='食中酒向き'?value:naturalTasteTerm(value);
    const evidence=(item.sakeResearch.featureEvidence||[]).filter(e=>e.feature===value&&e.sourceUrl&&e.verifiedAt);
    if(term&&tastePattern.test(term)&&evidence.length&&!facts.some(f=>f.term===term))facts.push({term,value,field:'verifiedFeatureTags',evidence});
  }
  const unique=facts.filter((f,i)=>facts.findIndex(g=>g.term===f.term)===i);
  const short=unique.filter(f=>f.term.length<=24&&f.term!=='食中酒向き');
  const first=short[0];
  const second=short.find(f=>f!==first&&!f.term.includes(first?.term)&&!first?.term.includes(f.term)&&first.term.length+f.term.length<=26);
  let text,used;
  if(first&&second){
    const conjunction=first.term.includes('と')||second.term.includes('と')?'、':'と';
    text=`${first.term}${conjunction}${second.term}。`;used=[first,second];
  }else if(first){
    text=first.term+(first.term.length>17?'。':'を楽しむ、今夜の一献。');used=[first];
  }else{
    const classification=item.sakeResearch.classification.tokuteiMeishoshu;
    const identity=intro.segments.find(s=>s.facts?.some(f=>f.evidence?.length));
    const meal=unique.find(f=>f.term==='食中酒向き');
    const rice=(item.sakeResearch.specs.riceVariety||[]).map(value=>({value,field:'specs.riceVariety',evidence:(item.sakeResearch.fieldEvidence||[]).filter(e=>e.field==='specs.riceVariety'&&[e.value].flat().includes(value)&&e.sourceUrl&&e.verifiedAt)})).find(f=>f.evidence.length);
    const riceText=rice?`${rice.value}を使った${classification||'一献'}。`:'';
    text=meal?'食事と一緒に楽しみたい、今夜の一献。':identity&&identity.text.length<=28?identity.text:riceText&&riceText.length<=28?riceText:classification?`${classification}を、いつもの食卓に。`:'今夜の食卓で出会う、一献。';
    used=meal?[meal]:identity&&identity.text.length<=28?identity.facts:riceText&&riceText.length<=28?[rice,...(classification?[{field:'classification.tokuteiMeishoshu',value:classification}]:[])]:classification?[{field:'classification.tokuteiMeishoshu',value:classification}]:[];
  }
  // Display labels never become Verified facts or recommendation inputs.
  const tasteTags=[...new Set(unique.map(f=>shortTag(f.term)).filter(t=>t.length<=13))].slice(0,3);
  const fallbackTags=(item.sakeResearch.verifiedFeatureTags||[]).filter(t=>t.length<=13&&!/酵母|協会|度|精米|限定|通年|BY/.test(t)).slice(0,3);
  const tags=tasteTags.length?tasteTags:fallbackTags;
  return {cardCatchphrase:text,tags,tasteTags,facts:used,kind:first?'taste':'identityOnly',tagEvidence:tags.map(tag=>({tag,kind:tasteTags.length?'taste':'otherFeature',facts:tasteTags.length?unique.filter(f=>shortTag(f.term)===tag):(item.sakeResearch.featureEvidence||[]).filter(e=>e.feature===tag)}))};
}
export function cardPairingExcerpt(reason=''){
  return reason.split(/(?<=。)/u).find(part=>part.trim())?.trim()||'';
}
