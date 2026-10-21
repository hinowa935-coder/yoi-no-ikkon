import {foodCatalog,foodNameMatches} from './foodCatalog.js';

// Navigation categories only: never used as pairing or ingredient evidence.
export const foodBrowseCategories=[
  {id:'fish',name:'魚・魚介',icon:'fish'},
  {id:'meat',name:'肉料理',icon:'meat'},
  {id:'vegetables',name:'野菜・豆腐',icon:'leaf'},
  {id:'grill',name:'焼く・炒める',icon:'flame'},
  {id:'fried',name:'揚げもの',icon:'fried'},
  {id:'simmered',name:'煮もの・鍋',icon:'pot'},
  {id:'rice',name:'ごはん・麺',icon:'rice'},
  {id:'local-snacks',name:'郷土料理・つまみ',icon:'map'},
];
const fish=/魚|鮭|鯖|さば|鯵|あじ|アジ|鯛|たい|真鯛|かれい|さんま|ししゃも|いわし|かつお|まぐろ|サーモン|ぶり|鰹|鮪|鰤|鰯|鰻|うなぎ|いか|イカ|たこ|タコ|えび|エビ|海老|かに|カニ|蟹|牡蠣|かき|帆立|ほたて|貝|しじみ|あさり|しらす|じゃこ|明太|ままかり|いかなご|なめろう|刺身|しんじょう|ツナ|たらちり/;
const meat=/鶏|とり天|焼き鳥|ねぎま|チキン|ささみ|手羽|豚|牛|肉|そぼろ|ハンバーグ|ハム|すき焼き|ジンギスカン|もつ|ホルモン|馬刺|砂肝/;
const vegetables=/野菜|菜|なす|ナス|きのこ|しめじ|しいたけ|なめこ|ごぼう|れんこん|蓮根|芋|いも|ポテト|じゃが|大根|かぶ|蕪|にんじん|キャロット|キャベツ|きゅうり|オクラ|おくら|ねぎ|にら|ピーマン|トマト|もやし|ブロッコリー|春菊|水菜|ほうれん草|小松菜|かぼちゃ|山芋|長芋|豆|納豆|厚揚げ|油揚げ|湯波|冷奴|とうふ|こんにゃく|わかめ|もずく|ひじき|海藻|いちじく|柿|アボカド|しらたき/;
const rice=/ご飯|ごはん|めし|飯|丼|寿司|すし|おにぎり|むすび|茶漬け|雑炊|うどん|そば|そうめん|麺|ほうとう|ひっつみ|サンド/;
const fried=/揚げ|唐揚|竜田|フライ|天ぷら|とり天|チキンカツ|南蛮風|チキン南蛮|チップス|コロッケ|春巻き|ナゲット/;
const grill=/焼|炒|ステーキ|ムニエル|バター醤油|ねぎま|田楽|にら玉|チャンプルー|しりしり|きんぴら|油揚げピザ/;
const simmered=/煮|鍋|汁|おでん|すき焼き|肉じゃが|肉豆腐|豚バラ大根|そぼろあん|きのこあん/;
export function foodBrowseMembership(food){
  const name=food.name,ingredients=(food.mainIngredients||[]).join(' '),ids=[];
  if(fish.test(name)&&name!=='いぶりがっこ'||fish.test(ingredients)||food.category==='練り物'||food.category==='刺身'&&name!=='きゅうりのたたき')ids.push('fish');
  if(meat.test(name)||meat.test(ingredients)||['唐揚げ','どて煮','筑前煮'].includes(name))ids.push('meat');
  if(vegetables.test(name)&&name!=='柿の葉寿司'||vegetables.test(ingredients)||['郷土の豆料理','サラダ','豆腐料理'].includes(food.category)||['いぶりがっこ','筑前煮'].includes(name))ids.push('vegetables');
  if(grill.test(name.replace('焼き豆腐','豆腐'))&&name!=='すき焼き'||name==='鶏ちゃん'||name==='明太だし巻き'||name==='豚キムチ')ids.push('grill');
  if(fried.test(name.replace(/厚揚げ|油揚げ/g,'豆腐'))||food.category==='揚げ物'||name==='じゃこ天')ids.push('fried');
  if(simmered.test(name)||['煮物','鍋物','汁物'].includes(food.category)&&name!=='じゃがバター'||name==='根菜ポトフ和風')ids.push('simmered');
  if(rice.test(name)&&name!=='いかそうめん')ids.push('rice');
  if(food.regionalCuisine||food.region.length||['刺身','和え物','漬物','酢の物','練り物','おひたし','茹で物'].includes(food.category)&&!rice.test(name)||/たくあん|おばんざい|餃子|しんじょう|まんじゅう|茶碗蒸し|砂肝/.test(name)||/卵|玉子|チーズ|焼き味噌/.test(name)&&!rice.test(name))ids.push('local-snacks');
  return [...new Set(ids)];
}
export const foodBrowseIndex=new Map(foodCatalog.map(food=>[food.id,foodBrowseMembership(food)]));
export function matchesFoodBrowse(food,{query='',category=''}={}){
  const broad=foodBrowseCategories.some(c=>c.id===category);
  return (!query||foodNameMatches(food.name,query))&&(!category||(broad?foodBrowseIndex.get(food.id)?.includes(category):food.category===category));
}
