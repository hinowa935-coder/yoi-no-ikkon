import policy from './shelfPolicy.json' with {type: 'json'};
import {activeCatalog, publicationGate, validSource} from './operations.js';

export {policy as shelfPolicy};
export function shelfQualityGroup({directLink, formalImage}) {
  return directLink ? formalImage ? 'A' : 'B' : formalImage ? 'C' : 'D';
}
function japanDate(date) {
  const parsed = date instanceof Date ? date : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? date + 'T12:00:00+09:00' : date);
  if (!Number.isFinite(parsed.getTime())) throw Error('Invalid review date');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone: policy.timezone, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(parsed).map(p => [p.type, p.value]));
  return {year: Number(parts.year), month: Number(parts.month), day: Number(parts.day)};
}
export function seasonalReviewWindows(date = new Date()) {
  const {year, month, day} = japanDate(date), today = month * 100 + day;
  const windows = policy.windows.map(w => ({...w, year: today > w.endMonth * 100 + w.endDay ? year + 1 : year})).map(w => ({...w,
    opensOn: `${w.year}-${String(w.startMonth).padStart(2, '0')}-${String(w.startDay).padStart(2, '0')}`,
    closesOn: `${w.year}-${String(w.endMonth).padStart(2, '0')}-${String(w.endDay).padStart(2, '0')}`,
    current: w.year === year && today >= w.startMonth * 100 + w.startDay && today <= w.endMonth * 100 + w.endDay,
    execution: 'MANUAL_REVIEW_ONLY', scheduled: false}));
  return windows.sort((a, b) => a.opensOn.localeCompare(b.opensOn));
}
export function shelfStatus(id, records = {}) { return records[id]?.status || 'ACTIVE'; }
export function isSavedHistoryProduct(id, records = {}) { return ['INACTIVE', 'ARCHIVED'].includes(shelfStatus(id, records)); }
export function commerceReviewHorizon(records, date = new Date()) {
  const now = date instanceof Date ? date : new Date(/^\d{4}-\d{2}-\d{2}$/.test(String(date)) ? date + 'T12:00:00+09:00' : date);
  if (!Number.isFinite(now.getTime())) throw Error('Invalid review date');
  const deadlines = records.map(r => Date.parse(r.validUntil)).filter(Number.isFinite).sort((a, b) => a - b);
  const first = deadlines[0] || null, nextWindow = seasonalReviewWindows(date)[0];
  return {earliestValidUntil: first ? new Date(first).toISOString() : null,
    manualPreflightDueOn: first ? new Intl.DateTimeFormat('en-CA', {timeZone: policy.timezone, year: 'numeric', month: '2-digit', day: '2-digit'}).format(new Date(first - policy.commerceExpiryMaintenance.leadDays * 86400000)) : null,
    expiresBeforeNextSeasonalWindow: first != null && first < Date.parse(nextWindow.opensOn + 'T00:00:00+09:00'),
    expiredRecords: deadlines.filter(d => d <= now.getTime()).length,
    internalReviewDeadlineNotProviderLicenseTerm: true, automaticExtensionAllowed: false, scheduled: false};
}

// Plans never mutate catalog records, favorite IDs, redirects or approvals.
export function planShelfUpdate({items, lifecycle = {}, additions = [], removals = [], reactivations = [], approved = false, now = new Date().toISOString(), batchId, minimumActiveException = null}) {
  const errors = [], warnings = [], ids = new Set(items.map(i => i.id));
  const activeBefore = activeCatalog(items, lifecycle).length;
  if (!batchId || !/^[a-z0-9][a-z0-9-]{2,80}$/.test(batchId)) errors.push('BATCH_ID_REQUIRED');
  const changed = [...additions.map(a => a.product?.id), ...removals.map(r => r.sakeId), ...reactivations.map(r => r.sakeId)];
  if (new Set(changed).size !== changed.length || changed.some(id => !id)) errors.push('DUPLICATE_OR_MISSING_CHANGE_ID');
  for (const added of additions) {
    if (ids.has(added.product?.id)) errors.push('NEW_PRODUCT_ID_REQUIRED');
    if (added.candidate?.productionProductId !== added.product?.id) errors.push('CANDIDATE_PRODUCT_ID_MISMATCH');
    if (!publicationGate(added.candidate || {}, {now}).ready) errors.push('NEW_PRODUCT_PUBLICATION_GATE_FAILED');
    if (!added.whyAdded || added.sameProductAsRemoved === true) errors.push('NEW_PRODUCT_REVIEW_REQUIRED');
  }
  const reasonCodes = new Set(['UNRESOLVED_AFTER_RESCUE', 'END_OF_SEASON_AND_UNAVAILABLE', 'DISCONTINUED_OFFICIAL', 'DUPLICATE_CONFIRMED', 'SUCCESSOR_REPLACED']);
  const records = {...lifecycle}, auditLog = [];
  for (const removed of removals) {
    if (!ids.has(removed.sakeId)) errors.push('UNKNOWN_EXISTING_PRODUCT');
    if (shelfStatus(removed.sakeId, lifecycle) !== 'ACTIVE') errors.push('PRODUCT_ALREADY_OFF_SHELF');
    if (!['INACTIVE', 'ARCHIVED'].includes(removed.status)) errors.push('INVALID_REMOVAL_STATUS');
    const rescue = removed.rescueReview;
    const currentEvidence = checkedAt => { const age = Date.parse(now) - Date.parse(checkedAt); return Number.isFinite(age) && age >= 0 && age <= 7 * 86400000; };
    const sources = (rescue?.sources || []).filter(source => validSource(source) && currentEvidence(source.checkedAt));
    if (!rescue?.reviewed || rescue.stockConclusion !== 'NO_CONFIRMED_PURCHASABLE_SAME_SKU' || !rescue.searches?.filter(q => q.ok === true && currentEvidence(q.checkedAt)).length || !sources.length) errors.push('RESCUE_REVIEW_REQUIRED');
    if (!reasonCodes.has(removed.reasonCode) || !removed.whyInactive || removed.reviewed !== true) errors.push('DEACTIVATION_REASON_REQUIRED');
    if (removed.reasonCode === 'DISCONTINUED_OFFICIAL' && !sources.some(s => ['official', 'official_shop', 'manufacturer_document'].includes(s.sourceType) && s.explicitDiscontinuation === true)) errors.push('DISCONTINUATION_NOT_VERIFIED');
    if (removed.automatic === true || removed.redirectTo || removed.migrateFavoritesTo || removed.deleteProduct === true) errors.push('RETENTION_POLICY_VIOLATION');
    if (sources.length && sources.every(s => s.sourceType === 'rakuten_retail') && new Set(sources.map(s => {try { return new URL(s.sourceUrl).pathname.split('/')[1]; } catch { return null; }})).size < 2 && !rescue.noOtherMerchantAfterSearch) errors.push('ALTERNATIVE_MERCHANT_REVIEW_REQUIRED');
    records[removed.sakeId] = {...lifecycle[removed.sakeId], status: removed.status, batchId, checkedAt: now};
    auditLog.push({sakeId: removed.sakeId, from: 'ACTIVE', to: removed.status, batchId, checkedAt: now, reasonCode: removed.reasonCode,
      whyInactive: removed.whyInactive, rescueReview: rescue, automatic: false,
      retained: ['productId', 'specs', 'sources', 'sensory', 'pairing', 'oldUrls', 'favoriteHistory', 'commerceAudit']});
  }
  for (const restored of reactivations) {
    if (!ids.has(restored.sakeId) || shelfStatus(restored.sakeId, lifecycle) === 'ACTIVE') errors.push('REACTIVATION_TARGET_INVALID');
    if (!restored.reviewed || !restored.whyRestored || restored.candidate?.existingProductId !== restored.sakeId || restored.candidate?.productionProductId !== restored.sakeId || restored.candidate?.identityDecision?.sameExistingSku !== true) errors.push('SAME_EXISTING_SKU_REVIEW_REQUIRED');
    if (!publicationGate(restored.candidate || {}, {now}).ready) errors.push('REACTIVATION_PUBLICATION_GATE_FAILED');
    records[restored.sakeId] = {...lifecycle[restored.sakeId], status: 'ACTIVE', batchId, checkedAt: now};
    auditLog.push({sakeId: restored.sakeId, from: shelfStatus(restored.sakeId, lifecycle), to: 'ACTIVE', batchId, checkedAt: now, whyRestored: restored.whyRestored, sameExistingSku: true, automatic: false});
  }
  const activeAfter = activeBefore + additions.length + reactivations.length - removals.length;
  if (activeAfter < policy.targetActive.min || activeAfter > policy.targetActive.max) warnings.push('OUTSIDE_SOFT_ACTIVE_TARGET');
  if (removals.length > additions.length && activeAfter < policy.targetActive.min && !minimumActiveException?.reviewed) errors.push('UNBALANCED_MASS_DEACTIVATION');
  if (removals.length > Math.ceil(activeBefore / 10) && !minimumActiveException?.reviewed) errors.push('LARGE_REMOVAL_REQUIRES_EXPLICIT_REVIEW');
  if (activeAfter > activeBefore && activeAfter > policy.targetActive.max && !minimumActiveException?.reviewed) errors.push('UNBALANCED_GROWTH_REQUIRES_REVIEW');
  if (!approved) warnings.push('REVIEW_NOT_APPROVED_NO_WRITES');
  return {batchId, activeBefore, activeAfter, errors: [...new Set(errors)], warnings,
    ready: approved && errors.length === 0, dryRun: true, automaticPublicationAllowed: false, records, auditLog,
    additions: additions.map(a => ({sakeId: a.product?.id, whyAdded: a.whyAdded})),
    reactivations: reactivations.map(r => ({sakeId: r.sakeId, whyRestored: r.whyRestored})),
    retainedProductIds: items.map(i => i.id), migrations: [], redirects: [], deletions: []};
}
