// Research records remain intact; only presentation text passes this boundary.
export const INTERNAL_COPY = /未取得|取得不足|未確認|未記載|未掲載|品種不明|本文|公式表記|対象商品(?:欄|の補足資料)|商品別公式資料|名称未|品種未|要商品(?:詳細確認|特定)|次回調査|調査(?:済み?|中)|同定|照合|補足[・/]探索|所在地の確認資料|\b(?:needsIdentification|dataConfidence|confidence|verifiedFeatureTags|editorialTags|featureEvidence|fieldEvidence|replacementHistory|Phase|SKU|audit)\b|evidence不足/i;

export function publicTags(tags = []) {
  return tags.filter(tag => typeof tag === "string" && tag.trim() && !INTERNAL_COPY.test(tag));
}

export function publicSpecText(value) {
  // Preserve both published percentages rather than resolving the source discrepancy.
  const labels = {
    "本文80%。原料米欄は五百万石(68%)・ふさこがね(80%)と併記（麹米・掛米の役割未掲載）": "80%（原料米別の表記：五百万石68%・ふさこがね80%）",
    "国産（本文では地元産）": "国産（地元産）",
  };
  const text = (labels[String(value)] || String(value)).replace(/[（(]([^）)]*)[）)]/g, (all, note) => INTERNAL_COPY.test(note) ? "" : all).trim();
  return INTERNAL_COPY.test(text) ? "" : text;
}

export function publicSourceName(source, fallback = "商品情報") {
  if (source.name && !INTERNAL_COPY.test(source.name)) return source.name;
  try { return new URL(source.url).hostname.replace(/^www\./, ""); }
  catch { return fallback; }
}
