import catalog from "./discoveryCatalog.json" with { type: "json" };
import { discoveryDishes, discoveryNights, foodDirections } from "./discoveryNights.js";
import { naturalTasteTerm } from "./sakeIntroduction.js";

export { discoveryDishes, discoveryNights, foodDirections };
export const discoveryProducts = catalog.items;
export function isDiscoverySake(item) {
  const otherCategories = new Set(["リキュール", "クラフトサケ", "どぶろく", "その他の醸造酒", "果実酒", "焼酎"]);
  const facts = [item.sakeResearch.identity.beverageCategory, ...(item.sakeResearch.verifiedFeatureTags || [])];
  return !facts.some(value => otherCategories.has(value));
}
export function rotationHash(text) {
  let hash = 2166136261;
  for (const char of String(text)) hash = Math.imul(hash ^ char.codePointAt(0), 16777619);
  return hash >>> 0;
}
export function daySeed(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
}
export function dishProfile(name) {
  const curated = discoveryDishes.find(d => d.name === name);
  if (curated) return curated;
  const oily = /唐揚げ|揚げ|天ぷら|フライ|餃子|炒め/.test(name);
  const rich = /煮|味噌|照り焼き|生姜焼き|きんぴら|炊き|バター/.test(name);
  const vinegar = /酢|南蛮|マリネ|梅|ポン酢/.test(name);
  const delicate = /刺|たたき|冷奴|豆腐|湯葉|おひたし|カルパッチョ|蒸し/.test(name);
  return { name, oily, rich, vinegar, delicate,
    method: oily ? "揚げ物・炒め物" : rich ? "煮物・焼き物" : vinegar ? "酢の物" : delicate ? "軽い一皿" : "家庭料理",
    flavor: oily ? "油のコク" : rich ? "だしやタレの旨味" : vinegar ? "さっぱりした酸味" : delicate ? "素材の穏やかな味" : "日々の食卓の味" };
}
function officialMatch(item, dish) {
  const exact = item.officialPairings.find(name => name === dish.name);
  if (exact) return { name: exact, exact: true };
  // Only explicit category wording can be expanded to a home dish; label it editorial.
  const categories = [
    [/魚料理|魚介料理/, /魚|鯖|鯛|ぶり|鮭|刺|ししゃも|いか|帆立/],
    [/肉料理/, /鶏|豚|牛|肉|餃子/],
    [/揚げ物/, /唐揚げ|フライ|天ぷら|揚げ/],
    [/煮物/, /煮|肉じゃが/],
    [/豆腐料理/, /豆腐|冷奴|厚揚げ/],
    [/焼き魚/, /焼き鯖|塩焼き|焼き鮭/],
  ];
  const name = item.officialPairings.find(pair => categories.some(([pairRe, dishRe]) => pairRe.test(pair) && dishRe.test(dish.name)));
  return name ? { name, exact: false } : null;
}
export function scorePairing(item, dishName, nightId = "ordinary") {
  const dish = dishProfile(dishName);
  const night = discoveryNights.find(n => n.id === nightId) || discoveryNights.at(-1);
  const facts = [...(item.sakeResearch.verifiedFeatureTags || []), ...Object.values(item.sakeResearch.flavorProfile || {}).flat().filter(Boolean)];
  const has = re => facts.some(fact => re.test(fact));
  const phrase = re => {
    const fact = facts.find(value => typeof value === "string" && value.length <= 36 && re.test(value));
    const axis = Object.entries(item.sakeResearch.flavorProfile || {}).find(([, value]) => [value].flat().includes(fact))?.[0];
    return fact ? naturalTasteTerm(fact, axis) || "酒の味わい" : "酒の味わい";
  };
  const signals = [];
  const official = officialMatch(item, dish);
  if (official) signals.push({ kind: "official", weight: official.exact ? 10 : 8,
    reason: official.exact ? `${dish.name}と相性のよい組み合わせ。合わせて楽しめます。`
      : `${official.name}に合うお酒。ご家庭では、${dish.name}と合わせてみる提案です。`,
    sourceUrls: (item.sakeResearch.pairingEvidence || []).filter(e => e.dish === official.name).map(e => e.sourceUrl) });
  if (item.yoiPairings.includes(dish.name)) signals.push({ kind: "existingEditorial", weight: 8,
    reason: `${dish.name}と一緒に、晩ごはんの一杯を。`, sourceUrls: [] });
  if (dish.rich && has(/旨味|旨み|うまみ|コク|濃醇/)) signals.push({ kind: "taste", weight: 7,
    reason: `${phrase(/旨味|旨み|うまみ|コク|濃醇/)}を、${dish.flavor}と一緒に楽しむ提案です。`, sourceUrls: tasteSources(item, /旨味|旨み|うまみ|コク|濃醇/) });
  if (dish.oily && has(/キレ|すっきり|スッキリ|軽快|爽快/)) signals.push({ kind: "taste", weight: 7,
    reason: `${dish.flavor}のあとに、${phrase(/キレ|すっきり|スッキリ|軽快|爽快/)}を楽しむ提案です。`, sourceUrls: tasteSources(item, /キレ|すっきり|スッキリ|軽快|爽快/) });
  if (dish.vinegar && has(/酸/) && !has(/酸味を抑|酸味が少|酸味控え/)) signals.push({ kind: "taste", weight: 6,
    reason: `${dish.flavor}と、お酒の酸味を合わせて楽しむ提案です。`, sourceUrls: tasteSources(item, /酸/) });
  if (dish.delicate && has(/穏やかな香|やさしい香|ほのかな|軽やか|軽快|淡麗/)) signals.push({ kind: "taste", weight: 6,
    reason: `${dish.flavor}と、${phrase(/穏やかな香|やさしい香|ほのかな|軽やか|軽快|淡麗/)}を一緒に楽しむ提案です。`, sourceUrls: tasteSources(item, /穏やかな香|やさしい香|ほのかな|軽やか|軽快|淡麗/) });
  if (dish.oily && has(/辛口|ドライ/)) signals.push({ kind: "taste", weight: 6,
    reason: `${dish.flavor}と、酒の辛口の飲み口を合わせて楽しむ提案です。`, sourceUrls: tasteSources(item, /辛口|ドライ/) });
  if (has(/食中酒/)) signals.push({ kind: "taste", weight: 6,
    reason: `食事と一緒に楽しめるお酒。今夜は${dish.name}と、味付けに合わせて試してみる提案です。`, sourceUrls: tasteSources(item, /食中酒/) });
  const strongest = signals.sort((a, b) => b.weight - a.weight)[0];
  const mood = night.moods.some(m => item.moods.includes(m)) ? 1 : 0;
  const warm = night.warm && item.temperature.some(t => /燗/.test(t)) ? 1 : 0;
  // Max, not sum: more published facts do not automatically mean a higher rank.
  return { score: (strongest?.weight || 0) + mood + warm, strength: strongest?.weight || 0,
    reason: strongest?.reason || "", basis: strongest?.kind || null, signals,
    sourceUrls: strongest?.sourceUrls || [], provenance: "editorialAlgorithm", officialExact: Boolean(official?.exact) };
}
function tasteSources(item, re) {
  return [...new Set((item.sakeResearch.featureEvidence || []).filter(e => re.test(e.feature)).map(e => e.sourceUrl)
    .concat((item.sakeResearch.fieldEvidence || []).filter(e => e.field.startsWith("flavorProfile.") && re.test(String(e.value))).map(e => e.sourceUrl)))];
}
export function recommendationPool(dish, nightId = "ordinary") {
  const candidates = discoveryProducts.filter(isDiscoverySake).map(item => ({ item, ...scorePairing(item, dish, nightId) })).filter(r => r.strength >= 6);
  const top = Math.max(0, ...candidates.map(r => r.score));
  return candidates.filter(r => r.score >= Math.max(6, top - 5));
}
export function recommendSake(dish, nightId = "ordinary", seed = "v1", limit = 3) {
  const pool = recommendationPool(dish, nightId).sort((a, b) =>
    rotationHash(`${seed}:${nightId}:${dish}:${a.item.id}`) - rotationHash(`${seed}:${nightId}:${dish}:${b.item.id}`)).slice(0, 60);
  const chosen = [];
  while (pool.length && chosen.length < limit) {
    const index = pool.findIndex(r => !chosen.some(c => c.item.brewery === r.item.brewery || c.item.prefecture === r.item.prefecture));
    const breweryIndex = pool.findIndex(r => !chosen.some(c => c.item.brewery === r.item.brewery));
    chosen.push(pool.splice(index >= 0 ? index : breweryIndex >= 0 ? breweryIndex : 0, 1)[0]);
  }
  return chosen;
}
export function suggestDishes(nightId, directionId, seed = "v1") {
  return discoveryDishes.filter(d => d.directions.includes(directionId) && recommendationPool(d.name, nightId).length >= 3)
    .sort((a, b) => rotationHash(`${seed}:${nightId}:${a.name}`) - rotationHash(`${seed}:${nightId}:${b.name}`)).slice(0, 6);
}
export function dishesForSake(item, seed = "v1") {
  const names = [...new Set([...item.yoiPairings, ...discoveryDishes.map(d => d.name),
    ...item.officialPairings.filter(d => catalog.foodNames.includes(d))])];
  return names.map(name => ({ ...dishProfile(name), ...scorePairing(item, name) })).filter(d => d.strength >= 6)
    .sort((a, b) => b.score - a.score || rotationHash(`${seed}:${a.name}`) - rotationHash(`${seed}:${b.name}`)).slice(0, 6);
}
export function nightsForSake(item) {
  return [...discoveryNights].sort((a, b) =>
    b.moods.filter(m => item.moods.includes(m)).length - a.moods.filter(m => item.moods.includes(m)).length).slice(0, 3);
}
export function dailyRecommendation(seed) {
  const night = discoveryNights[rotationHash(seed) % discoveryNights.length];
  const direction = foodDirections[rotationHash(`${seed}:food`) % foodDirections.length];
  const dish = suggestDishes(night.id, direction.id, seed)[0];
  return { night, direction, dish, recommendation: recommendSake(dish.name, night.id, seed)[0] };
}
