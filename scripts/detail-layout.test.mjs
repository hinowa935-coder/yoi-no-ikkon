import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {detailSourceLabel,detailReferences} from '../src/data/detailPresentation.js';
import {allSakePairings,buildResourceLinks,visibleSakePairings} from '../src/data/siteData.js';
import {reviewedDetailLayout} from './lib/reviewed-detail-layout.mjs';
import {reviewedLocalSakanaFile} from './lib/reviewed-local-sakana.mjs';
const read=f=>fs.readFileSync(new URL('../'+f,import.meta.url),'utf8'),json=f=>JSON.parse(read(f)),hash=v=>createHash('sha256').update(v).digest('hex');
const page=read('src/app/sake/[slug]/page.jsx');
test('detail sections follow identity, image, taste, specs, purchase, sources, dishes, nights, share',()=>{
 const tokens=['className="sake-detail-hero"','<ProductWindow','className="detail-band sake-overview"','className="detail-band sake-further"','className="detail-band purchase-discovery"','className="detail-band sake-evidence"','className="detail-band sake-pairings"','className="detail-band sake-nights"','<RecommendShare'];
 const positions=tokens.map(t=>page.indexOf(t));assert(positions.every(n=>n>=0));assert.deepEqual([...positions].sort((a,b)=>a-b),positions);
 assert.equal((page.match(/<DetailAccordion /g)||[]).length,2);
 assert(page.includes('hasSpecs &&')&&page.includes('hasReferences &&'));
});
test('both disclosures use native details, live expanded state, controls, full summary and decorative chevron',()=>{
 const c=read('src/app/components/DetailAccordion.jsx'),css=read('src/app/globals.css');
 assert(c.includes('<details')&&c.includes('<summary')&&c.includes('onToggle=')&&!c.includes('open={'));
 assert(c.includes('aria-expanded={expanded}')&&c.includes('aria-controls={`${id}-content`}')&&c.includes('id={`${id}-content`}'));
 assert(c.includes('閉じる')&&c.includes('見る')&&c.includes('aria-hidden="true"'));
 assert(css.includes('.detail-accordion > summary:focus-visible')&&css.includes('min-height: 60px')&&css.includes('prefers-reduced-motion: reduce'));
});
test('temperature appears once only inside detailed information, outside sensory overview',()=>{
 const start=page.indexOf('<DetailAccordion id="sake-specs"'),end=page.indexOf('className="detail-band purchase-discovery"');
 assert.equal(page.split('<ServingGuide ').length-1,1);assert(page.slice(start,end).includes('<ServingGuide'));
 for(const label of ['精米歩合','アルコール度数','日本酒度','酸度','原料米'])assert(page.includes('"'+label+'"'));
 assert(!page.slice(page.indexOf('className="detail-band sake-overview"'),start).includes('ServingGuide'));
});
test('source labels shorten titles without promoting retailer evidence to official',()=>{
 assert.equal(detailSourceLabel({url:'https://www.sakenomy.jp/sake/123',name:'very long page title'}),'Sakenomyの商品情報');
 assert.equal(detailSourceLabel({url:'https://www.sakenomy.jp/brewery/123',scope:'brewery_identity_only'}),'Sakenomyの蔵元情報');
 assert.equal(detailSourceLabel({url:'https://item.rakuten.co.jp/shop/1/',type:'retailer'}),'楽天販売店の商品情報');
 assert.equal(detailSourceLabel({url:'https://example.com/product',type:'breweryOfficial'}),'蔵元公式の商品情報');
 assert.equal(detailSourceLabel({url:'https://example.com/product',type:'retailer'}),'専門酒販店の商品情報');
 const source={url:'https://example.com/product',name:'full metadata remains',scope:'product',type:'retailer'};const refs=detailReferences([source],[{href:source.url,label:'専門店・商品資料'}]);
 assert.equal(refs.productSources.length,1);assert.equal(refs.productSources[0].name,source.name);assert.equal(source.name,'full metadata remains');
 assert.deepEqual(detailReferences([{url:'javascript:alert(1)'}]),{breweryLinks:[],productSources:[]});
});
test('every existing product/source URL survives the display-only deduplication',()=>{
 const merchants=json('src/commerce/generated/merchant-links.json').records;
 for(const item of allSakePairings){const sources=item.sakeResearch.sources,links=buildResourceLinks(item),refs=detailReferences(sources,links,merchants[item.id]);const actual=[...refs.breweryLinks,...refs.productSources].map(r=>r.url);
  const expected=[...new Set([...sources.map(s=>s.url),...links.map(l=>l.href)].filter(u=>{try{return /^https?:$/.test(new URL(u).protocol);}catch{return false;}}))];
  assert.deepEqual([...actual].sort(),expected.sort(),item.id);assert.equal(actual.length,new Set(actual).size,item.id);
 }
});
test('existing data, commerce, PWA and other application files have not changed',()=>{
 const allowed=new Set(['src/app/sake/[slug]/page.jsx','src/app/globals.css']);
 for(const r of json('docs/detail-layout/baseline.json').files)if(!allowed.has(r.path)){const actual=hash(fs.readFileSync(new URL('../'+r.path,import.meta.url)));assert(actual===r.sha256||reviewedLocalSakanaFile(r.path,r.sha256,actual),r.path);}
 assert.equal(visibleSakePairings.length,484);
});
test('historical guard accepts only the exact authorized two-file presentation changes',()=>{
 for(const c of json('docs/detail-layout/source-changes.json').changes){assert(reviewedDetailLayout(c.file,c.beforeSha256,c.afterSha256));assert(!reviewedDetailLayout(c.file,'wrong',c.afterSha256));assert(!reviewedDetailLayout(c.file,c.beforeSha256,'tampered'));assert(!reviewedDetailLayout('src/data/discovery.js',c.beforeSha256,c.afterSha256));}
});
