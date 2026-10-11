import { normalizedClassification } from "./sakeResearchPhase21.js";

export const researchClassificationKeys = [
  "tokuteiMeishoshu", "junmai", "nonJunmai", "ginjo", "junmaiGinjo", "daiginjo", "junmaiDaiginjo",
  "ginjoFamily", "daiginjoFamily", "kimoto", "yamahai", "nama", "hiire", "nigori", "sparkling", "genshu", "muroka", "aged",
];
export const researchSpecKeys = [
  "ingredients", "riceVariety", "riceOrigin", "riceByRole", "polishingRatio", "polishingByRole", "alcoholPercentage",
  "nihonshudo", "acidity", "aminoAcidValue", "yeast", "waterSource", "kojiMold", "agingPeriod", "agingTemperature",
];
export const researchFlavorKeys = ["sweetness", "aroma", "umami", "acidity", "body", "finish"];
const designations = ["純米", "特別純米", "吟醸", "純米吟醸", "大吟醸", "純米大吟醸", "本醸造", "特別本醸造"];

// Only a sourced designation is normalized. A registration's name is never input here.
export function normalizeResearchRecord(input) {
  const r = structuredClone(input);
  r.researchPhase = "3";
  r.auditPhase = "3";
  r.classification = { ...Object.fromEntries(researchClassificationKeys.map(k => [k, null])), ...r.classification };
  r.specs = { ...Object.fromEntries(researchSpecKeys.map(k => [k, ["ingredients", "riceVariety"].includes(k) ? [] : null])), ...r.specs };
  r.flavorProfile = { ...Object.fromEntries(researchFlavorKeys.map(k => [k, null])), ...r.flavorProfile };
  for (const k of ["verifiedFeatureTags", "editorialTags", "featureEvidence", "fieldEvidence", "sources", "sourceAttempts", "servingTemperatures", "recommendedTemperatureRange", "temperatureRecommendations", "officialPairings", "pairingEvidence", "auditNotes", "aromaNotes", "tasteNotes"]) r[k] ??= [];
  // Coalesce already-sourced individual temperature labels, without adding values.
  for (const field of ["servingTemperatures", "recommendedTemperatureRange"]) {
    const entries = r.fieldEvidence.filter(e => e.field === field);
    if (r[field].length && entries.length === r[field].length && entries.every(e => typeof e.value === "string") &&
      JSON.stringify(entries.map(e => e.value)) === JSON.stringify(r[field]) &&
      entries.every(e => e.sourceUrl === entries[0].sourceUrl && e.sourceType === entries[0].sourceType && e.verifiedAt === entries[0].verifiedAt)) {
      r.fieldEvidence = r.fieldEvidence.filter(e => e.field !== field);
      r.fieldEvidence.push({ ...entries[0], value:r[field], meaning:entries.map(e=>e.meaning).join("；"), elementEvidence:entries, normalization:"同一資料にある各温度ラベルの根拠を配列へ集約。温度の追加なし" });
    }
  }
  r.featureTags = [...r.verifiedFeatureTags, ...r.editorialTags];
  const categoryProof = r.fieldEvidence.find(e => e.field === "classification.tokuteiMeishoshu" && e.value === r.classification.tokuteiMeishoshu && e.sourceUrl && e.sourceType && e.verifiedAt && e.meaning);
  if (categoryProof && !r.needsIdentification) {
    const original = r.classification.tokuteiMeishoshu;
    if (designations.includes(original)) {
      r.classification.tokuteiMeishoshu = `${original}酒`;
      categoryProof.value = r.classification.tokuteiMeishoshu;
      categoryProof.originalValue = original;
      categoryProof.normalization = "特定名称の酒接尾辞だけを統一";
    }
    const before = { ...r.classification };
    r.classification = normalizedClassification(r.classification);
    for (const key of ["junmai", "nonJunmai", "ginjo", "junmaiGinjo", "daiginjo", "junmaiDaiginjo", "ginjoFamily", "daiginjoFamily"]) {
      const value = r.classification[key];
      if (value == null) continue;
      if (before[key] != null && before[key] !== value) r.auditNotes.push(`分類整合性：公式特定名称に基づき${key}を${before[key]}から${value}へ正規化`);
      r.fieldEvidence = r.fieldEvidence.filter(e => e.field !== `classification.${key}`);
      r.fieldEvidence.push({ ...categoryProof, field: `classification.${key}`, value, derivedFrom: "classification.tokuteiMeishoshu", meaning: `直接確認した特定名称${r.classification.tokuteiMeishoshu}の排他・親子関係を正規化。${categoryProof.meaning}` });
    }
  }
  // Captured bytes and a read source are different states; absence stays explicit.
  r.identity ??= { productName: null, brandName: null, brewery: null, prefecture: null, officialProductUrl: null };
  const productUrl = r.identity.officialProductUrl;
  const productProof = r.fieldEvidence.find(e => e.field === "identity.productName" && e.sourceUrl === productUrl && e.sourceType === "breweryOfficial");
  if (productUrl && productProof && !r.fieldEvidence.some(e => e.field === "identity.officialProductUrl"))
    r.fieldEvidence.push({ ...productProof, field: "identity.officialProductUrl", value: productUrl, meaning: "商品名を照合した公式商品欄のURL", derivedFrom: "identity.productName" });
  if (r.needsIdentification) {
    r.identificationLeads ??= { registeredName: r.registeredName, brewery: r.identity.brewery, prefecture: r.identity.prefecture };
    r.identity = { productName: null, brandName: null, brewery: null, prefecture: null, officialProductUrl: null };
    r.fieldEvidence = r.fieldEvidence.filter(e => !e.field.startsWith("identity."));
  }
  return r;
}
