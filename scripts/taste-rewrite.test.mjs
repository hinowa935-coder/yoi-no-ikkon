import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import descriptions from '../src/data/tasteDescriptions.json' with {type:'json'};
import {buildTasteDescription,missingTasteDescription} from '../src/data/tasteDescription.js';
import {visibleSakePairings,buildSakeListSummary} from '../src/data/siteData.js';
import {reviewedTasteRewrite} from './lib/reviewed-taste-rewrite.mjs';
const baseline=JSON.parse(fs.readFileSync(new URL('../docs/taste-rewrite/baseline.json',import.meta.url)));
const hash=s=>createHash('sha256').update(s).digest('hex');
test('every production ACTIVE has a reviewed editorial record, without changing the sake catalog or list summaries',()=>{
 assert.equal(visibleSakePairings.length,baseline.productionSitemapActive);assert.equal(Object.keys(descriptions.records).length,visibleSakePairings.length);assert.equal(hash(JSON.stringify(visibleSakePairings)),baseline.itemsHash);
 for(const i of visibleSakePairings){assert(descriptions.records[i.id]);assert.equal(buildSakeListSummary(i),baseline.summaries.find(s=>s.sakeId===i.id).text);}
});
test('all existing data, purchases, images, pairings, nights, temperatures, PWA and styling retain exact bytes',()=>{
 for(const f of baseline.files){const actual=hash(fs.readFileSync(new URL('../'+f.path,import.meta.url)));assert(actual===f.sha256||reviewedTasteRewrite(f.path,f.sha256,actual),f.path);}
 assert(!reviewedTasteRewrite('src/data/discovery.js','wrong','wrong'));assert(!reviewedTasteRewrite('src/app/sake/[slug]/page.jsx','wrong','wrong'));
});
test('nonempty rewrites have value-level or reviewed current-product evidence, and no fabricated classification prose',()=>{
 for(const i of visibleSakePairings){const r=descriptions.records[i.id];assert(r.identity.productName===i.productName&&r.identity.brewery===i.brewery);if(!r.text)continue;assert(r.claims.length>0);assert(r.text.length<=125);assert(!/純米吟醸らしい|純米酒ならでは|バランスが良い|万人受け|最高級|undefined|null/.test(r.text));
  for(const c of r.claims){assert(c.sourceUrl&&/^https?:$/.test(new URL(c.sourceUrl).protocol)&&c.verifiedAt&&c.sourceType);if(c.field){const value=c.field.split('.').reduce((v,k)=>v?.[k],i.sakeResearch);assert([value].flat().includes(c.claim),i.id+' '+c.claim);}}
 }
});
test('held products use a transparent neutral hint rather than inventing an aroma, acid or finish from their class',()=>{
 for(const i of visibleSakePairings){const r=descriptions.records[i.id];if(r.text===null){assert(r.status.startsWith('HELD_'));assert.equal(buildTasteDescription(i).text,missingTasteDescription);}}
});
test('a renamed SKU or changed brewery never inherits another product description',()=>{
 const i=visibleSakePairings.find(i=>descriptions.records[i.id].text);for(const patch of [{productName:'別の商品'},{brewery:'別の蔵元'},{prefecture:'別の県'},{id:'unknown'}])assert.equal(buildTasteDescription({...i,...patch},'fallback').text,'fallback');
});
test('new sensory facts remain editorial only and sources use existing reference semantics',()=>{
 const i=visibleSakePairings.find(i=>i.id==='koimari-saki'),before=JSON.stringify(i);assert.match(buildTasteDescription(i).text,/みずみずしい口当たり/);assert.equal(JSON.stringify(i),before);assert.deepEqual(i.sakeResearch.verifiedFeatureTags,[]);assert(buildTasteDescription(i).sources.every(s=>s.scope==='product'));
});
test('temperature-dependent and temporal notes preserve their qualifiers; no generic causal finish is invented',()=>{
 assert.match(descriptions.records['kirakucho-lvvrsw-4'].text,/ぬる燗で/);assert.match(descriptions.records['tedorigawa-yamahai-junmai'].text,/冷酒や常温では/);assert.match(descriptions.records['tedorigawa-yamahai-junmai'].text,/燗にすると/);assert.match(descriptions.records['kikko-hanabishi-hdomtl-4'].text,/開栓後/);
 assert(!descriptions.records['kankiku-ocean99-toumi-arrival-hiire-v1'].text.includes('厚み'));
});
test('detail text is rendered as React text, metadata and JSON-LD agree, with no new HTML injection path',()=>{
 const page=fs.readFileSync(new URL('../src/app/sake/[slug]/page.jsx',import.meta.url),'utf8');assert(page.includes('{taste.text}</p>'));assert(page.includes('description: taste.text'));assert(!page.includes('dangerouslySetInnerHTML={{ __html: taste'));
});
