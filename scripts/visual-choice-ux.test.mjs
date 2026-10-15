import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {discoveryNights,foodDirections,discoveryDishes} from '../src/data/discoveryNights.js';
import {nightDesires,desireForNight} from '../src/data/visualChoices.js';
import {visibleSakePairings} from '../src/data/siteData.js';
import {buildCardPresentation,cardPairingExcerpt} from '../src/data/cardPresentation.js';
import {normalizeTemperature,temperatureGroups,matchesTemperature} from '../src/data/temperatureUX.js';

test('six desires cover every legacy mood without changing the nineteen night identities',()=>{
 assert.equal(nightDesires.length,6);
 assert.equal(discoveryNights.length,19);
 const ids=nightDesires.flatMap(d=>d.nightIds);
 assert.equal(ids.length,10);assert.equal(new Set(ids).size,10);
 for(const n of discoveryNights.filter(n=>n.group==='mood'))assert(desireForNight(n.id));
 for(const d of nightDesires){assert(d.nightIds.includes(d.nightId));assert.equal(d.parts.join(''),d.label);}
});
test('six food directions reuse the existing dishes and keep original memberships',()=>{
 assert.equal(foodDirections.length,6);
 for(const id of ['warm','fresh','hearty','small','grilled','comfort'])assert(foodDirections.some(d=>d.id===id));
 assert(discoveryDishes.find(d=>d.name==='湯豆腐').directions.includes('warm'));
 assert(discoveryDishes.find(d=>d.name==='焼きしいたけ').directions.includes('grilled'));
 assert(discoveryDishes.find(d=>d.name==='茶碗蒸し').directions.includes('comfort'));
});
test('all 492 catches are concise, nonempty and derived from their own facts without mutating data',()=>{
 const before=JSON.stringify(visibleSakePairings);
 for(const item of visibleSakePairings){
  const p=buildCardPresentation(item);
  assert(p.cardCatchphrase.length>0&&p.cardCatchphrase.length<=28,item.id);
  assert(!/日本一|究極|絶対|誰でも好き|奇跡|公式による|記載|調査/.test(p.cardCatchphrase),item.id);
  assert(p.tags.length<=3);
  for(const f of p.facts){
   if(f.evidence)assert(f.evidence.every(e=>e.sourceUrl&&e.verifiedAt));
   if(f.field==='verifiedFeatureTags')assert(item.sakeResearch.verifiedFeatureTags.includes(f.value));
   if(f.field?.startsWith('flavorProfile.'))assert([item.sakeResearch.flavorProfile[f.field.split('.')[1]]].flat().includes(f.value));
  }
  for(const other of visibleSakePairings)if(other.id!==item.id&&other.productName!==item.productName&&other.productName.length>4)assert(!p.cardCatchphrase.includes(other.productName),item.id);
 }
 assert.equal(JSON.stringify(visibleSakePairings),before);
});
test('absent taste evidence never acquires fabricated taste tags or descriptors',()=>{
 const fixture={id:'fixture',productName:'空の酒',brewery:'蔵',sakeResearch:{verifiedFeatureTags:[],featureEvidence:[],fieldEvidence:[],flavorProfile:{},classification:{tokuteiMeishoshu:'純米酒'},specs:{riceVariety:[]}}};
 const p=buildCardPresentation(fixture);
 assert.equal(p.kind,'identityOnly');assert.deepEqual(p.tags,[]);
 assert(!/香り|旨味|酸味|辛口|キレ/.test(p.cardCatchphrase));
});
test('pairing excerpts preserve a whole existing sentence rather than generating food claims',()=>{
 assert.equal(cardPairingExcerpt('湯豆腐と合わせる一杯。次の説明。'),'湯豆腐と合わせる一杯。');
 assert.equal(cardPairingExcerpt(''),'');
});
test('identity-only copy can use a sourced rice value without claiming taste or a sole-rice design',()=>{
 const fixture={id:'rice-fixture',productName:'確認用',brewery:'蔵',sakeResearch:{verifiedFeatureTags:[],featureEvidence:[],fieldEvidence:[],flavorProfile:{},classification:{tokuteiMeishoshu:'純米酒'},specs:{riceVariety:['山田錦','五百万石']}}};
 assert(!buildCardPresentation(fixture).cardCatchphrase.includes('山田錦'));
 fixture.sakeResearch.fieldEvidence=[{field:'specs.riceVariety',value:['山田錦','五百万石'],sourceUrl:'https://example.test/product',verifiedAt:'2026-10-16'}];
 const p=buildCardPresentation(fixture);
 assert.equal(p.cardCatchphrase,'山田錦を使った純米酒。');assert.equal(p.kind,'identityOnly');assert.deepEqual(p.tasteTags,[]);
});
test('drinking style pills use three requested labels while exact temperatures and legacy URLs remain',()=>{
 assert.deepEqual(temperatureGroups,[['cold','冷酒'],['room','常温'],['warm','熱燗']]);
 for(const raw of ['日向燗','人肌燗','ぬる燗','上燗','熱燗','飛び切り燗'])assert(matchesTemperature([raw],'group:warm'));
 assert(matchesTemperature(['冷や'],'group:room'));
 assert(!matchesTemperature(['冷酒'],'group:room'));
 assert.equal(normalizeTemperature('ぬる燗')[0].label,'ぬる燗（約40℃）');
});
test('compact previews preserve original creatives, named external and internal routes, and independent context',()=>{
 const preview=fs.readFileSync('src/app/components/SakeCardPreview.jsx','utf8');
 assert(preview.includes('contextHref||`/sake/${item.id}`'));
 assert(preview.includes('cardCatchphrase'));
 assert(preview.includes('詳しく見る'));
 const media=fs.readFileSync('src/app/components/ProductWindow.jsx','utf8');
 assert(media.includes('compact?image.compactHtml:image.html'));
 assert(media.includes('外部サイト'));
 assert(!fs.readFileSync('src/data/discovery.js','utf8').includes('cardPresentation'));
});
