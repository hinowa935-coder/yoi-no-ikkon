// Phase 13 is a limited copy pass, not a change to pairing evidence or scoring.
const initialDishes = new Set([
  "肉じゃが", "湯豆腐", "鯖の味噌煮", "白菜と豚肉の重ね煮", "茶碗蒸し", "豆腐のきのこあん",
  "冷奴", "きゅうりとわかめの酢の物", "豚しゃぶサラダ", "蒸し鶏のねぎだれ", "トマトと大葉の冷奴", "鯛の昆布じめ",
  "鶏の唐揚げ", "豚の生姜焼き", "焼き餃子", "鶏の照り焼き", "ぶりの照り焼き", "なす味噌炒め",
  "だし巻き卵", "枝豆", "焼きしいたけ", "きゅうりの浅漬け", "ほうれん草のおひたし", "焼き厚揚げ",
]);

export function refineMealPairingReason(reason, dishName, basis) {
  const original = `食事と一緒に楽しめるお酒。今夜は${dishName}と、味付けに合わせて試してみる提案です。`;
  if (basis !== "taste" || !initialDishes.has(dishName) || reason !== original) return reason;
  return `今夜は${dishName}と一緒に。食事とともに楽しめる一杯です。`;
}
