import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {historicalBatch,reviewedHistoricalLifecycle,historicalAdditionCount} from './reviewed-historical-update.mjs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url)));
export const lineupBatch=read('data/catalog-operations/brewery-lineup-batch.json');
export function reviewedLineupLifecycle(beforeHash,afterHash){return reviewedHistoricalLifecycle(beforeHash,afterHash)||lineupBatch.reviewed===true&&lineupBatch.automaticPublicationAllowed===false&&lineupBatch.lifecycleFile.beforeSha256===beforeHash&&(lineupBatch.lifecycleFile.afterSha256===afterHash||lineupBatch.lifecycleFile.afterSha256===historicalBatch.lifecycleFile.beforeSha256&&reviewedHistoricalLifecycle(historicalBatch.lifecycleFile.beforeSha256,afterHash));}
export function reviewedLineupAdditionCount(items){const added=items.filter(i=>lineupBatch.additions.includes(i.id));if(added.length!==lineupBatch.additions.length||new Set(added.map(i=>i.id)).size!==added.length)throw Error('Invalid reviewed lineup IDs');return added.length+historicalAdditionCount(items);}
export function lineDigest(v){return createHash('sha256').update(typeof v==='string'?v:JSON.stringify(v)).digest('hex');}
