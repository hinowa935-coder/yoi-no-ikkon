import { COMMERCE_SITE } from '../data/siteIdentity.js';
import { productFingerprint } from './validation.js';

export const approvalWindowMs = 30 * 86_400_000;

export function approvalIsCurrent(record, item, now) {
  if (!record || record.approved !== true ||
      record.sakeId !== item.id || record.productFingerprint !== productFingerprint(item) ||
      record.registeredSite !== COMMERCE_SITE || record.permissionConfirmed !== true || record.identityReviewed !== true ||
      ['UNKNOWN','CONFLICT','UNCONFIRMED'].includes(record.editionStatus)) return false;
  const verified = Date.parse(record.verifiedAt), until = Date.parse(record.validUntil);
  return verified <= now && until > now && until - verified <= approvalWindowMs;
}
