import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..', import.meta.url));
const TARGET_SITE='https://yoi-no-ikkon.netlify.app/';
const now=Date.now();
const read=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));

const historical=read('docs/netlify-image-recovery/historical-active-484.json');
const current=read('src/commerce/generated/product-media.json');
const out=[];

for (const h of historical.records) {
  const c=current.records?.[h.sakeId] ?? null;
  const currentExpiry=c?.validUntil ? Date.parse(c.validUntil) : NaN;
  const currentNetlifyApproved=Boolean(
    c &&
    c.registeredSite===TARGET_SITE &&
    c.permissionConfirmed===true &&
    c.matchConfidence==='high' &&
    c.sourceType==='rakutenOfficialTool' &&
    Number.isFinite(currentExpiry) &&
    currentExpiry>now
  );

  if (currentNetlifyApproved) continue;

  let reason='NO_CURRENT_NETLIFY_APPROVAL';
  if (c) {
    const identityChanged =
      c.productFingerprint!==h.productFingerprint ||
      c.capacityMl!==h.capacityMl ||
      c.imageCapacityMl!==h.imageCapacityMl ||
      c.sakeName!==h.sakeName ||
      c.brewery!==h.brewery ||
      c.brandName!==h.brandName;
    if (identityChanged) reason='IDENTITY_OR_CAPACITY_DRIFT_REVIEW_REQUIRED';
    else if (c.registeredSite!==TARGET_SITE) reason='OLD_OR_OTHER_REGISTERED_SITE';
    else if (!Number.isFinite(currentExpiry) || currentExpiry<=now) reason='CURRENT_NETLIFY_APPROVAL_EXPIRED';
    else reason='CURRENT_RECORD_FAILS_FORMAL_IMAGE_GATE';
  }

  out.push({
    sakeId:h.sakeId,
    sakeName:h.sakeName,
    brewery:h.brewery,
    brandName:h.brandName,
    capacityMl:h.capacityMl,
    itemCode:h.itemCode,
    productUrl:h.productUrl,
    historicalProductFingerprint:h.productFingerprint,
    reason,
    action:'REVERIFY_CURRENT_SKU_AND_FORMAL_MATERIAL_FOR_NETLIFY_DO_NOT_AUTO_APPROVE'
  });
}

const summary={
  targetSite:TARGET_SITE,
  historicalCandidates:historical.records.length,
  currentNetlifyApproved:historical.records.length-out.length,
  recoveryQueue:out.length,
  byReason:Object.fromEntries([...new Set(out.map(r=>r.reason))].sort().map(k=>[k,out.filter(r=>r.reason===k).length]))
};

if (process.argv.includes('--write')) {
  const dir=path.join(root,'docs/netlify-image-recovery');
  fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'historical-recovery-queue.json'),JSON.stringify({checkedAt:new Date().toISOString(),...summary,records:out},null,2)+'\n');
}
console.log(JSON.stringify(summary,null,2));
