import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {historicalBatch,reviewedHistoricalLifecycle,historicalAdditionCount} from './reviewed-historical-update.mjs';
import {shelfFinalBatch} from './reviewed-shelf-update.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url)));
export const lineupBatch=read('data/catalog-operations/brewery-lineup-batch.json');
export function reviewedLineupLifecycle(beforeHash,afterHash){return reviewedHistoricalLifecycle(beforeHash,afterHash)||lineupBatch.reviewed===true&&lineupBatch.automaticPublicationAllowed===false&&lineupBatch.lifecycleFile.beforeSha256===beforeHash&&(lineupBatch.lifecycleFile.afterSha256===afterHash||lineupBatch.lifecycleFile.afterSha256===historicalBatch.lifecycleFile.beforeSha256&&reviewedHistoricalLifecycle(historicalBatch.lifecycleFile.beforeSha256,afterHash));}
export function reviewedLineupAdditionCount(items){const added=items.filter(i=>lineupBatch.additions.includes(i.id)),shelf=items.filter(i=>shelfFinalBatch.additions.includes(i.id));if(added.length!==lineupBatch.additions.length||new Set(added.map(i=>i.id)).size!==added.length)throw Error('Invalid reviewed lineup IDs');if(shelf.length!==shelfFinalBatch.additions.length||new Set(shelf.map(i=>i.id)).size!==shelf.length)throw Error('Invalid reviewed shelf IDs');return added.length+historicalAdditionCount(items)+shelf.length;}
export function lineDigest(v){return createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');}
