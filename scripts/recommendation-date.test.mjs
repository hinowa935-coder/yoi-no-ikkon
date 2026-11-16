import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {tokyoDay, isRecommendationDay, recommendationRotationDay} from '../src/data/recommendationDate.js';
import {recommendSake, recommendationPool, suggestDishes, discoveryProducts} from '../src/data/discovery.js';
import {seasonallyRecommended} from '../src/catalog/seasonality.js';
import {localSakanaForSake} from '../src/specialties/localSakana.js';
import {reviewedRecommendationDate} from './lib/reviewed-recommendation-date.mjs';

const patterns = [
  ['アジフライ','ordinary','2026-10-27'], ['焼き魚','quiet','2026-10-27'],
  ['鯛の昆布じめ','moon','2026-10-27'], ['豚の生姜焼き','dinner','2026-10-27'],
  ['鶏の唐揚げ','after-work','2026-10-27'], ['枝豆','just-one','2026-10-27'],
  ['湯豆腐','cold','2026-10-27'], ['きゅうりとわかめの酢の物','reset','2026-10-27'],
  ['肉じゃが','ordinary','2026-03-01'], ['冷奴','spring','2026-04-15'],
  ['焼き餃子','rain','2026-06-01'], ['豚しゃぶサラダ','humid','2026-07-01'],
  ['だし巻き卵','festival','2026-08-01'], ['ぶりの照り焼き','autumn','2026-09-01'],
  ['茶碗蒸し','snow','2026-12-31'], ['白菜と豚肉の重ね煮','year-end','2027-01-01'],
  ['なす味噌炒め','together','2026-05-31'], ['焼き厚揚げ','treat','2026-11-01'],
  ['蒸し鶏のねぎだれ','quiet','2026-02-28'], ['きゅうりの浅漬け','ordinary','2026-10-23'],
];
const ids = picks => picks.map(r => r.item.id);

test('Tokyo calendar day validates dates and normalizes explicitly zoned instants', () => {
  assert.equal(tokyoDay('2026-10-26T15:00:00Z'), '2026-10-27');
  assert.equal(tokyoDay('2026-10-27T00:00:00+09:00'), '2026-10-27');
  assert.equal(tokyoDay('2026-10-26T14:59:59Z'), '2026-10-26');
  assert.equal(tokyoDay('2026-02-28T15:00:00Z'), '2026-03-01');
  assert(!isRecommendationDay('2026-02-30'));
  assert(!isRecommendationDay('2026-13-01'));
  assert.throws(() => tokyoDay('2026-10-27T12:00:00'), RangeError);
});

test('all foods share Friday-start rotation; seasonal eligibility still uses actual day', () => {
  assert.equal(recommendationRotationDay('2026-10-27'), '2026-10-23');
  assert.equal(recommendationRotationDay('2026-10-29'), '2026-10-23');
  assert.equal(recommendationRotationDay('2026-10-30'), '2026-10-30');
  assert.equal(recommendationRotationDay('2027-01-01'), '2027-01-01');
  for (const [dish,night,day] of patterns) {
    assert(recommendationPool(dish,night,day).every(r => seasonallyRecommended(r.item,day)));
  }
});

test('2026-10-27 Ajifry includes Kawatsuru and its Kagawa Honetsukidori remains available', () => {
  const picks = recommendSake('アジフライ','ordinary','2026-10-27');
  assert(ids(picks).includes('kawatsuru-junmai-ooseto-hiire-v1'));
  const item = picks.find(r => r.item.id === 'kawatsuru-junmai-ooseto-hiire-v1').item;
  assert(localSakanaForSake(item).some(c => c.name === '骨付鳥' && c.prefecture === '香川県'));
});

test('20 patterns repeat exactly including top1/top3/top5, scores and reasons without mutating data', () => {
  const before = JSON.stringify(discoveryProducts);
  for (const [dish,night,day] of patterns) {
    for (const limit of [1,3,5]) {
      const first = recommendSake(dish,night,day,limit);
      assert.deepEqual(recommendSake(dish,night,day,limit),first);
      assert.equal(first.length,limit);
      assert.equal(new Set(first.map(r => r.item.brewery)).size,limit);
      assert(first.every(r => r.strength >= 6 && r.nightAffinity.score > 0 && r.reason));
    }
  }
  assert.equal(JSON.stringify(discoveryProducts),before);
});

test('UTC, Tokyo and overseas processes produce identical IDs, order, scores, reasons and dishes', () => {
  const script = `import {recommendSake,suggestDishes} from './src/data/discovery.js';
    const p=${JSON.stringify(patterns)};
    console.log(JSON.stringify({p:p.map(([d,n,day])=>[1,3,5].map(l=>recommendSake(d,n,day,l).map(r=>({id:r.item.id,score:r.score,reason:r.reason})))),d:suggestDishes('quiet','warm','2026-10-27').map(d=>d.name)}));`;
  const outputs = ['UTC','Asia/Tokyo','America/Los_Angeles','Pacific/Honolulu'].map(TZ => {
    const r = spawnSync(process.execPath,['--input-type=module','-e',script],{encoding:'utf8',env:{...process.env,TZ}});
    assert.equal(r.status,0,r.stderr);
    return JSON.parse(r.stdout);
  });
  for (const result of outputs) assert.deepEqual(result,outputs[0]);
  assert.deepEqual(ids(recommendSake('アジフライ','ordinary',new Date('2026-10-26T15:00:00Z'))),ids(recommendSake('アジフライ','ordinary','2026-10-27T00:00:00+09:00')));
});

test('food page does not freeze selections in SSG and both selection paths share the Tokyo clock', () => {
  const page = fs.readFileSync('src/app/food/[slug]/page.jsx','utf8');
  const component = fs.readFileSync('src/app/components/FoodRecommendations.jsx','utf8');
  assert(!page.includes('recommendSake('));
  assert(page.includes('<Suspense fallback={<FoodRecommendationsPending />}><FoodRecommendations'));
  assert(component.includes('useCurrentTokyoDay()'));
  assert(component.includes("recommendationPool(dish, 'ordinary', day)"));
  assert(!fs.readFileSync('src/data/discovery.js','utf8').includes('kawatsuru'));
});

test('historical guards accept only exact authorized code hashes, never catalog/commerce edits', () => {
  const review = JSON.parse(fs.readFileSync('docs/recommendation-date-fix/source-changes.json','utf8'));
  for (const row of review.changes) for (const before of row.historicalBeforeHashes) {
    assert(reviewedRecommendationDate(row.file,before,row.afterSha256));
    assert(!reviewedRecommendationDate(row.file,before,'tampered'));
    assert(!reviewedRecommendationDate(row.file,'wrong',row.afterSha256));
    assert(!reviewedRecommendationDate('src/data/discoveryCatalog.json',before,row.afterSha256));
    assert(!reviewedRecommendationDate('src/commerce/localSakana.json',before,row.afterSha256));
  }
});
