import overrides from './highExposurePairingOverrides.json' with { type: 'json' };
const byPair = new Map(overrides.map(entry => [`${entry.sakeId}\0${entry.dishName}`, entry]));

export function refineHighExposurePairing(reason, item, dish) {
  const entry = byPair.get(`${item.id}\0${dish.name}`);
  if (!entry || entry.before !== reason || item.sakeResearch.needsIdentification) return null;
  if (entry.dishFlavor && (dish.flavor !== entry.dishFlavor || dish.method !== entry.dishMethod)) return null;
  const r = item.sakeResearch, fact = entry.sakeFact;
  // Reviewed text is valid only while the exact saved facts and sources still match.
  if (fact) {
    const evidence = fact.kind === 'verifiedFeatureTag' ? r.featureEvidence : r.fieldEvidence;
    if (!(evidence || []).some(e => JSON.stringify(e) === JSON.stringify(fact.evidence))) return null;
    if (fact.kind === 'verifiedFeatureTag' && !r.verifiedFeatureTags.includes(fact.feature)) return null;
    if (fact.kind === 'officialFlavorField' && ![r.flavorProfile[fact.evidence.field.split('.')[1]]].flat().includes(fact.feature)) return null;
  }
  const official = entry.officialPairingEvidence;
  if (official && (!r.officialPairings.includes(dish.name) || !(r.pairingEvidence || []).some(e => JSON.stringify(e) === JSON.stringify(official)))) return null;
  return { reason: entry.after, sourceUrls: [...new Set([fact?.evidence.sourceUrl, official?.sourceUrl].filter(Boolean))] };
}
