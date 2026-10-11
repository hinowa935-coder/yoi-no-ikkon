import overrides from './pairingReasonOverrides.json' with { type: 'json' };
const byPair=new Map(overrides.map(entry=>[`${entry.sakeId}\0${entry.dishName}`,entry]));
export function refineGroundedPairing(reason,item,dish) {
  const entry=byPair.get(`${item.id}\0${dish.name}`);
  if(!entry||entry.before!==reason||dish.flavor!==entry.dishFlavor||dish.method!==entry.dishMethod)return null;
  const r=item.sakeResearch;
  if(r.needsIdentification)return null;
  // Exact saved values guard the reviewed copy against future product/food changes.
  const fact=entry.sakeFact;
  const evidence=fact.kind==='verifiedFeatureTag'?r.featureEvidence:r.fieldEvidence;
  if(!evidence.some(e=>JSON.stringify(e)===JSON.stringify(fact.evidence)))return null;
  if(fact.kind==='verifiedFeatureTag'&&!r.verifiedFeatureTags.includes(fact.feature))return null;
  if(fact.kind==='officialFlavorField'&&![r.flavorProfile[fact.evidence.field.split('.')[1]]].flat().includes(fact.feature))return null;
  if(entry.officialPairingEvidence&&(!r.officialPairings.includes(dish.name)||!r.pairingEvidence.some(e=>JSON.stringify(e)===JSON.stringify(entry.officialPairingEvidence))))return null;
  return {reason:entry.after,sourceUrls:[fact.evidence.sourceUrl,...(entry.officialPairingEvidence?[entry.officialPairingEvidence.sourceUrl]:[])]};
}
