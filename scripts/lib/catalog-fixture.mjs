import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync(new URL('../../'+p,import.meta.url)));
export const additions=read('src/data/catalogAdditions.json').items;
const lifecycle=read('src/data/catalogLifecycle.json').records;
export const expectedActiveItems=[...read('src/data/discoveryCatalog.json').items,...additions].filter(i=>!lifecycle[i.id]||lifecycle[i.id].status==='ACTIVE');
export const expectedTotalItems=read('src/data/discoveryCatalog.json').items.length+additions.length;
