import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {discoveryNights,isNightInSeason,orderedNights,recommendedNights,nightRecommendationMonths} from '../src/data/discoveryNights.js';
import {dailyRecommendation,daySeed,recommendSake,discoveryProducts,nightsForSake} from '../src/data/discovery.js';

test('all seasonal recommendations follow the exact month windows, including overlaps',()=>{
 const expected={spring:[3,4,5],rain:[5,6,7],humid:[6,7,8,9],festival:[7,8],moon:[9,10,11],autumn:[9,10,11],cold:[11,12,1,2,3],snow:[12,1,2],'year-end':[12]};
 assert.deepEqual(nightRecommendationMonths,expected);
 for(let month=1;month<=12;month++){
  const day=`2026-${String(month).padStart(2,'0')}-15`;
  const pool=recommendedNights(day);
  for(const n of discoveryNights)assert.equal(pool.some(p=>p.id===n.id),!expected[n.id]||expected[n.id].includes(month),`${n.id} month ${month}`);
  assert.equal(pool.filter(n=>n.group==='mood').length,10);
 }
 assert.equal(isNightInSeason('snow','invalid'),false);
 assert.equal(isNightInSeason('snow','2026-13-15'),false);
});
test('automatic daily picks never choose an out-of-season night across a full year',()=>{
 for(let day=0;day<365;day++){
  const seed=daySeed(new Date(Date.UTC(2026,0,1+day)));
  const pick=dailyRecommendation(seed);
  assert(isNightInSeason(pick.night.id,seed),seed);
  assert(pick.dish&&pick.recommendation);
 }
});
test('all selection options and explicit out-of-season recommendations remain available',()=>{
 for(let month=1;month<=12;month++){
  const day=`2026-${String(month).padStart(2,'0')}-15`;
  const all=orderedNights('season',day);
  assert.equal(all.length,9);
  assert(all.some(n=>n.id==='snow'));
  const states=all.map(n=>isNightInSeason(n.id,day));
  assert(!states.some((active,index)=>active&&states.slice(0,index).includes(false)));
 }
 assert.equal(recommendSake('湯豆腐','snow','2026-10-15').length,3);
 assert.equal(recommendSake('湯豆腐','year-end','2026-04-15').length,3);
 const item=discoveryProducts.find(p=>nightsForSake(p,Infinity).some(n=>n.id==='snow'));
 assert(item);
 assert(nightsForSake(item,Infinity).some(n=>n.id==='snow'));
});
test('runtime display uses Tokyo current date, not SSG build date or historic URL seed',()=>{
 const hook=fs.readFileSync('src/app/components/useCurrentTokyoDay.js','utf8');
 assert(hook.includes("timeZone:'Asia/Tokyo'"));
 assert(hook.includes('useSyncExternalStore'));
 assert(hook.includes("serverSnapshot=()=>''"));
 assert(hook.includes("window.addEventListener('pageshow'"));
 assert(fs.readFileSync('src/app/components/DiscoveryQueryFlow.jsx','utf8').includes('seasonSeed={today}'));
 assert(fs.readFileSync('src/app/components/DailyPick.jsx','utf8').includes('useCurrentTokyoDay()'));
});
