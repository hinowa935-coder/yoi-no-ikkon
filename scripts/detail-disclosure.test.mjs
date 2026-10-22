import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {namesSummary,specsSummary,purchaseSummary} from '../src/data/detailDisclosure.js';
import {reviewedDetailDisclosure} from './lib/reviewed-detail-disclosure.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('names are at most three, exact remainder, no reasons or fabricated empty names',()=>{
 assert.equal(namesSummary([]),'');assert.equal(namesSummary([null,undefined,'-', '不明']),'');
 assert.equal(namesSummary(['刺身']),'刺身');assert.equal(namesSummary(['刺身','冷奴']),'刺身・冷奴');
 assert.equal(namesSummary(['刺身','冷奴','焼き魚','煮物']),'刺身・冷奴・焼き魚 ほか1品');
 assert.equal(namesSummary([{name:'長い名前の料理を一つ目に用意する',reason:'hidden reason'},{name:'長い名前の料理を二つ目に用意する'},{name:'冷奴'}]),'長い名前の料理を一つ目に用意する ほか2品');
 assert.equal(namesSummary([{name:undefined},{name:null},{name:''}]),'');
});
test('spec summary uses existing formatted facts or neutral fallback',()=>{
 assert.equal(specsSummary([]),'酒質・原料米・温度を見る');
 assert.equal(specsSummary([['特定名称','純米吟醸'],['精米歩合','55%'],['蔵元','A']]),'純米吟醸・精米歩合55%');
});
test('purchase summary follows visible destination types, never claims stock for search links or Yahoo',()=>{
 const p=(provider,destinationType)=>({provider,destinationType});
 assert.equal(purchaseSummary({}),'');assert.equal(purchaseSummary({offers:[p('yahoo','product_page')]}),'');
 assert.equal(purchaseSummary({offers:[p('rakuten','product_page')]}),'楽天の商品ページあり');
 assert.equal(purchaseSummary({discoveryLinks:[p('rakuten','search_results')]}),'販売店・購入先を探す');
 assert.equal(purchaseSummary({offers:[p('rakuten','product_page')],discoveryLinks:[p('amazon','product_page')]}),'楽天ほか商品ページあり');
});
test('content is SSR, independent state, no nested dish accordion, telemetry contains only identifiers',()=>{
 const c=read('src/app/components/DetailAccordion.jsx'),p=read('src/app/sake/[slug]/page.jsx'),s=read('src/app/components/LocalSakana.jsx');
 assert(c.includes('children}</div>')&&!c.includes('expanded &&')&&!c.includes('fetch('));
 assert(c.includes('defaultOpen = false')&&c.includes('aria-describedby=')&&c.includes('type="button"'));
 assert(c.includes('sakeId, section, entrySource: "sake_detail"'));
 assert(!/localStorage|sessionStorage|searchParams/.test(c));
 assert(!p.includes('more-pairings')&&p.includes('dishes.map('));
 assert(p.includes('purchasePreview &&')&&p.includes('dishes.length > 0 || r.officialPairings.length > 0'));
 assert(s.includes('summary={namesSummary(cards)}')&&s.includes('if(!cards.length)return null'));
});
test('all unmodified baseline bytes remain exact; UI exceptions are narrow reviewed hashes',()=>{
 const baseline=JSON.parse(read('docs/detail-disclosure/baseline.json'));
 for(const row of baseline.files){const actual=createHash('sha256').update(fs.readFileSync(new URL('../'+row.path,import.meta.url))).digest('hex');assert(actual===row.sha256||reviewedDetailDisclosure(row.path,row.sha256,actual),row.path);}
 const changes=JSON.parse(read('docs/detail-disclosure/source-changes.json')).changes;
 assert.equal(changes.length,5);
 for(const c of changes){assert(reviewedDetailDisclosure(c.file,c.beforeSha256,c.afterSha256));assert(!reviewedDetailDisclosure(c.file,c.beforeSha256,'wrong'));assert(!reviewedDetailDisclosure('src/data/discovery.js',c.beforeSha256,c.afterSha256));}
});
