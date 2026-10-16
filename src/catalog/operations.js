export const CANDIDATE_STATES = Object.freeze(['RESEARCH','RAKUTEN_FOUND','PRODUCT_IDENTIFIED','SPEC_PARTIAL','SPEC_READY','SENSORY_RESEARCH','PAIRING_RESEARCH','WAITING_FOR_STOCK','WAITING_FOR_COMMERCIAL_IMAGE','PAIRING_READY','PRODUCTION_READY','ACTIVE','INACTIVE','ARCHIVED']);
export const LIFECYCLE_STATES = Object.freeze(['ACTIVE','INACTIVE','ARCHIVED']);
export const MAJOR_FIELDS = Object.freeze(['brand','breweryId','classification','namaHiire','genshu','muroka','nigori','sparkling','riceSeries','series','seasonalDesign','pressingMethod']);
export const SENSORY_FIELDS = Object.freeze(['sweetness','acidity','umami','aroma','body','finish','bitterness','carbonation','alcoholImpression']);
const corporate = /株式会社|有限会社|合資会社|合名会社|[\s　]/g;
export function normalizeBreweryName(name){return String(name||'').normalize('NFKC').replace(corporate,'');}
export function breweryKey({breweryName,brewery,prefecture}){return `${prefecture||'UNKNOWN'}|${normalizeBreweryName(breweryName||brewery)}`;}
export function validSource(source){
 if(!source?.sourceUrl||!source?.checkedAt||source.retrieved!==true)return false;
 try{const u=new URL(source.sourceUrl);return u.protocol==='https:'&&!u.username&&!u.password&&Number.isFinite(Date.parse(source.checkedAt));}catch{return false;}
}
export function compareIdentity(target,observed){
 const conflicts=[],unknown=[],differences=[];
 for(const field of MAJOR_FIELDS){
  if(target[field]==null||observed[field]==null){unknown.push(field);continue;}
  if(String(target[field]).normalize('NFKC')!==String(observed[field]).normalize('NFKC'))conflicts.push({field,target:target[field],observed:observed[field]});
 }
 for(const field of ['alcohol','polishing','rice','nihonshudo','acidity','lot','by','label'])if(target[field]!=null&&observed[field]!=null&&String(target[field])!==String(observed[field]))differences.push({field,officialValue:target[field],retailObservedValue:observed[field],differenceNote:'製造時期・ロット・小売記載等の差の可能性。原因は未確定。'});
 const capacityMatch=Number.isFinite(target.capacityMl)&&Number.isFinite(observed.capacityMl)&&(target.capacityMl===observed.capacityMl||observed.capacityChoices?.includes(target.capacityMl));
 if(!capacityMatch)unknown.push('capacity');
 if(observed.singleProduct!==true)conflicts.push({field:'singleProduct',observed:observed.singleProduct??null});
 return{decision:conflicts.length?'DIFFERENT_SKU':unknown.length?'NEEDS_REVIEW':'COMMERCIAL_MATCH',conflicts,unknown,differences,capacityMatch};
}
export function seasonalTypes(name){
 const rules=[['spring',/春酒|春限定/],['summer',/夏酒|夏限定/],['autumn',/ひやおろし|冷やおろし|秋あがり|秋上がり/],['new_sake',/新酒|しぼりたて|搾りたて/],['winter',/冬限定/],['nama',/生酒|生原酒/],['nigori',/にごり|おりがらみ/]];
 return rules.filter(([,pattern])=>pattern.test(name||'')).map(([type])=>type);
}
export function eligibleSensoryEvidence(entries,{skuId,now=new Date().toISOString(),maxAgeDays=1095}={}){
 const seen=new Set(),accepted=[],excluded=[];
 for(const entry of entries||[]){
  const key=entry.contentFingerprint||`${entry.sourceUrl}|${entry.reviewId||entry.evidenceId||''}`;
  let reason=null;
  if(!validSource(entry))reason='SOURCE_UNCONFIRMED';
  else if(entry.skuId!==skuId||entry.skuMatch!==true||entry.versionMatched!==true)reason='SKU_OR_VERSION_UNCONFIRMED';
  else if(entry.experienced!==true||entry.specificTasting!==true)reason='NO_SPECIFIC_TASTING';
  else if(!entry.independenceGroup)reason='INDEPENDENCE_UNCONFIRMED';
  else if(seen.has(key))reason='DUPLICATE';
  else if(!entry.publishedAt||!Number.isFinite(Date.parse(entry.publishedAt)))reason='REVIEW_DATE_UNKNOWN';
  else if(Date.parse(entry.publishedAt)>Date.parse(now)+86400000)reason='FUTURE_REVIEW_DATE';
  else if((Date.parse(now)-Date.parse(entry.publishedAt))/86400000>maxAgeDays&&entry.currentDesignReconfirmed!==true)reason='OLD_REVIEW_NEEDS_REVALIDATION';
  else if(!entry.traits?.length&&!entry.pairings?.length&&!entry.temperatures?.length)reason='NO_SENSORY_TRAITS';
  if(reason)excluded.push({evidenceId:entry.evidenceId,reason});else{accepted.push(entry);seen.add(key);}
 }
 return{accepted,excluded};
}
export function sensoryConsensus(entries,options){
 const {accepted,excluded}=eligibleSensoryEvidence(entries,options),result={};
 for(const field of SENSORY_FIELDS){
  const observations=accepted.flatMap(e=>(e.traits||[]).filter(t=>t.field===field&&t.value).map(t=>({...t,evidenceId:e.evidenceId,group:e.independenceGroup,official:['official','official_shop','manufacturer_document'].includes(e.sourceType)})));
  const groupsByValue=new Map();for(const o of observations){const set=groupsByValue.get(o.value)||new Set();set.add(o.group);groupsByValue.set(o.value,set);}
  const ordered=[...groupsByValue].sort((a,b)=>b[1].size-a[1].size),winner=ordered[0];
  const contested=ordered.length>1&&ordered[1][1].size===winner[1].size;
  const officialAgreement=winner&&observations.some(o=>o.value===winner[0]&&o.official);
  result[field]={value:winner&&!contested&&winner[1].size>=2?winner[0]:null,confidence:!winner||contested||winner[1].size<2?'low':officialAgreement&&winner[1].size>=3?'high':'medium',evidenceIds:observations.map(o=>o.evidenceId),independentSources:winner?.[1].size||0,contested};
 }
 return{fields:result,acceptedEvidenceIds:accepted.map(e=>e.evidenceId),excluded,provenance:'editorial_sensory_consensus',notVerifiedSpecifications:true};
}
export function communityPairings(entries,{skuId,compatibleDishes=[],...options}={}){
 const {accepted}=eligibleSensoryEvidence(entries,{skuId,...options}),byDish=new Map();
 for(const e of accepted)for(const dish of e.pairings||[]){if(!byDish.has(dish))byDish.set(dish,[]);byDish.get(dish).push(e);}
 return[...byDish].map(([dish,evidence])=>({dish,evidenceIds:evidence.map(e=>e.evidenceId),independentSources:new Set(evidence.map(e=>e.independenceGroup)).size,confidence:new Set(evidence.map(e=>e.independenceGroup)).size>=2&&compatibleDishes.includes(dish)?'medium':'low',provenance:'community',official:false,broaderCategoriesGenerated:false}));
}
export function publicationGate(candidate,{now=new Date().toISOString()}={}){
 const age=Date.parse(now)-Date.parse(candidate.commercialDecision?.checkedAt);
 const specSources=candidate.specEvidence||[];
 const independentSpecHosts=new Set(specSources.filter(validSource).map(s=>new URL(s.sourceUrl).hostname));
 const corroborated=specSources.some(s=>['official','official_shop','manufacturer_document'].includes(s.sourceType))||independentSpecHosts.size>=2;
 const checks={brewery:!!candidate.breweryId&&candidate.identityDecision?.breweryConfirmed===true,product:candidate.identityDecision?.productConfirmed===true,classification:!!candidate.productType,identity:candidate.identityDecision?.skuConfirmed===true&&candidate.identityDecision?.majorConflicts?.length===0,specs:candidate.specStatus==='SPEC_READY'&&['high','medium'].includes(candidate.specConfidence),specEvidence:(candidate.specEvidence||[]).length>0&&(candidate.specEvidence||[]).every(validSource),capacity:Number.isFinite(candidate.capacityMl)&&candidate.capacityMl>0,stock:candidate.commercialStatus==='LIVE_PURCHASE_CONFIRMED'&&candidate.commercialDecision?.checkedAt&&Date.parse(now)-Date.parse(candidate.commercialDecision.checkedAt)<=86400000,affiliate:candidate.commercialDecision?.formalAffiliate===true&&candidate.commercialDecision?.sameSku===true,image:candidate.imageStatus==='FORMAL_IMAGE_CONFIRMED'&&candidate.imageDecision?.originalUnmodified===true&&candidate.imageDecision?.sameSku===true&&candidate.imageDecision?.capacityMl===candidate.capacityMl,sensory:candidate.sensoryStatus==='SENSORY_READY'&&['high','medium'].includes(candidate.sensoryConfidence),pairing:candidate.pairingStatus==='PAIRING_READY'&&(candidate.editorialPairings||[]).length>0,night:(candidate.nightEvidence||[]).length>0,duplicate:candidate.duplicateChecked===true,qa:candidate.qaPassed===true};
 checks.specEvidence=checks.specEvidence&&corroborated&&specSources.every(s=>!['review','community','rakuten_review','editorial'].includes(s.sourceType));
 checks.stock=checks.stock&&age>=0;
 checks.affiliate=checks.affiliate&&candidate.commercialDecision?.registeredSite==='https://yoi-no-ikkon.vercel.app/'&&/^[a-f0-9]{64}$/.test(candidate.commercialDecision?.originalSha256||'')&&Date.parse(candidate.commercialDecision?.validUntil)>Date.parse(now);
 checks.image=checks.image&&/^[a-f0-9]{64}$/.test(candidate.imageDecision?.originalSha256||'')&&Date.parse(candidate.imageDecision?.validUntil)>Date.parse(now);
 const missing=Object.entries(checks).filter(([,ok])=>!ok).map(([field])=>field);
 return{ready:missing.length===0,checks,missing,automaticPublicationAllowed:false};
}
export function validateCandidate(candidate){
 const errors=[];
 if(!candidate.candidateProductId)errors.push('MISSING_ID');
 if(!CANDIDATE_STATES.includes(candidate.state))errors.push('INVALID_STATE');
 const approvalTime=candidate.publicationApprovedAt;
 if(approvalTime&&!Number.isFinite(Date.parse(approvalTime)))errors.push('INVALID_APPROVAL_DATE');
 if(['PRODUCTION_READY','ACTIVE'].includes(candidate.state)&&!publicationGate(candidate,approvalTime?{now:approvalTime}:undefined).ready)errors.push('PUBLICATION_GATE_FAILED');
 if((candidate.communityPairings||[]).some(p=>p.official===true))errors.push('COMMUNITY_IS_NOT_OFFICIAL');
 if((candidate.verifiedEvidence||[]).some(e=>['review','community','rakuten_review','editorial'].includes(e.sourceType)))errors.push('SUBJECTIVE_EVIDENCE_IS_NOT_VERIFIED_SPEC');
 return errors;
}
export function activeCatalog(items,lifecycle={}){return items.filter(i=>{const state=lifecycle[i.id]?.status||'ACTIVE';if(!LIFECYCLE_STATES.includes(state))throw Error('Invalid catalog lifecycle');return state==='ACTIVE';});}
export function catalogItem(items,id){return items.find(i=>i.id===id);}
export function compareObservation(previous,current){
 if(previous?.fingerprint&&previous.fingerprint===current.fingerprint)return[];
 if(current.retrieved!==true)return[{type:'RETRIEVAL_FAILED',reason:'Failed retrieval is not sold-out, season end, discontinuation or absence.'}];
 if(!previous)return[{type:current.newBrewery?'NEW_BREWERY':current.seasonality?.length?'NEW_SEASONAL_PRODUCT':'NEW_PRODUCT'}];
 const events=[];
 if(previous.fingerprint===current.fingerprint)return events;
 if(previous.stock===false&&current.stock===true)events.push({type:'RESTOCKED'});
 if(previous.stock===true&&current.stock===false)events.push({type:'STOCK_REVIEW_REQUIRED',notSeasonEnd:true});
 if(current.merchantCodes?.some(m=>!previous.merchantCodes?.includes(m)))events.push({type:'NEW_RAKUTEN_MERCHANT'});
 if(!previous.formalImage&&current.formalImage)events.push({type:'NEW_COMMERCIAL_IMAGE'});
 if(previous.specFingerprint!==current.specFingerprint)events.push({type:'SPEC_CHANGED'});
 if(current.successorClaim&&current.successorClaim!==previous.successorClaim)events.push({type:'POSSIBLE_SUCCESSOR',requiresReview:true});
 if(current.seasonEndClaim&&current.seasonEndClaim!==previous.seasonEndClaim)events.push({type:'POSSIBLE_SEASON_END',requiresReview:true});
 return events.length?events:[{type:'SOURCE_CHANGED'}];
}
export function reviewQueue(previous,current){
 return current.flatMap(observation=>compareObservation(previous.find(p=>p.candidateProductId===observation.candidateProductId),observation).map(event=>({...event,candidateProductId:observation.candidateProductId,sourceFingerprint:observation.fingerprint,checkedAt:observation.checkedAt,automaticPublicationAllowed:false,productionMutationAllowed:false})));
}
