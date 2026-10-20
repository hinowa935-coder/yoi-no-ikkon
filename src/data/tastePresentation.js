import {displaySpec} from './specDisplay.js';

// Legacy profile fields can contain a different sensory trait. Do not relabel it.
export function tastePresentationRows(profile={}) {
  return [
    ['甘味','sweetness',/甘味|甘み|甘さ|甘口|甘い|甘め/],
    ['酸味','acidity',/酸/],
    ['旨味','umami',/旨|うま味|うまみ|コク/],
    ['香り','aroma',/香|アロマ|フルーティ|果実/],
    ['飲み口','body',/軽快|軽やか|軽い|ライト|淡麗|濃醇|濃厚|重厚|厚み|ふくよか|コク|ボディ|口当たり|なめらか|滑らか/],
  ].flatMap(([label,key,meaning])=>{
    const value=displaySpec(profile[key]);
    return value&&meaning.test(value)?[[label,value]]:[];
  });
}
