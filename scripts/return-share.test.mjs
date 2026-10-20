import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { canonicalShareUrl, shareOrCopy, homeGuidePlatform } from '../src/data/shareActions.js';
import { SITE_URL, SITE_NAME } from '../src/data/siteIdentity.js';
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const data = {title:'真澄 白妙 SHIRO｜宵の一献',text:'この一献、よさそう。真澄 白妙 SHIRO',url:canonicalShareUrl('/sake/masumi-shiro-lineup-v1')};

test('share URLs use canonical production, never tracking, preview, or retail destinations', () => {
  assert.equal(SITE_NAME, '宵の一献');
  assert.equal(canonicalShareUrl('/?utm_source=ignored#footer'), SITE_URL + '/');
  assert.equal(canonicalShareUrl('/sake/shichida-junmai?night=quiet#pairing'), SITE_URL + '/sake/shichida-junmai');
  for (const url of ['https://item.rakuten.co.jp/shop/product/','https://hb.afl.rakuten.co.jp/test','//evil.example/','https://yoi-no-ikkon.vercel.app.evil.example/','javascript:alert(1)']) assert.throws(() => canonicalShareUrl(url));
});
test('native share receives only short first-party data without waiting for analytics', async () => {
  const calls = [];
  const promise = shareOrCopy(data,{share:d=>{calls.push(d);return Promise.resolve();},clipboard:{writeText:()=>assert.fail('copy not expected')}});
  assert.deepEqual(calls,[data]);
  assert.equal(await promise,'shared');
});
test('unsupported share copies the canonical URL only', async () => {
  let copied;
  assert.equal(await shareOrCopy(data,{clipboard:{writeText:async value=>{copied=value;}}}),'copied');
  assert.equal(copied,data.url);
});
test('cancellation is silent and does not copy without consent', async () => {
  assert.equal(await shareOrCopy(data,{share:async()=>{throw {name:'AbortError'};},clipboard:{writeText:()=>assert.fail('cancel must not copy')}}),'cancelled');
});
test('technical share failure falls back to clipboard', async () => {
  let copied = false;
  assert.equal(await shareOrCopy(data,{share:async()=>{throw new Error('blocked');},clipboard:{writeText:async()=>{copied=true;}}}),'copied');
  assert(copied);
});
test('missing or denied clipboard returns a handled failure', async () => {
  assert.equal(await shareOrCopy(data,{}),'failed');
  assert.equal(await shareOrCopy(data,{clipboard:{writeText:async()=>{throw new Error('denied');}}}),'failed');
});
test('home guide is mobile only and standalone always suppresses it', () => {
  assert.equal(homeGuidePlatform('iPhone Safari',false),'ios');
  assert.equal(homeGuidePlatform('Android Chrome',false),'android');
  assert.equal(homeGuidePlatform('Windows Chrome',false),null);
  for(const ua of ['iPhone Safari','Android Chrome'])assert.equal(homeGuidePlatform(ua,true),null);
});
test('new share CTA appears once at the end, never beside a purchase or favorite action', () => {
  const page=read('src/app/sake/[slug]/page.jsx');
  assert.equal(page.match(/<RecommendShare /g).length,1);
  assert(page.indexOf('className="detail-band sake-pairings"')>0);
  assert(page.indexOf('<RecommendShare ')>page.indexOf('className="detail-band sake-pairings"'));
  assert(!page.includes('<ShareButton'));
  const home=read('src/app/page.jsx');
  assert(home.indexOf('<HomeScreenGuide')>home.indexOf('className="home-about"'));
  assert(home.indexOf('<RecommendShare')>home.indexOf('<HomeScreenGuide'));
  assert(read('src/app/ochoko/page.jsx').includes('<HomeScreenGuide compact />'));
});
test('guide is disclosure-only, keyboard accessible, and cannot invoke install prompt', () => {
  const guide=read('src/app/components/HomeScreenGuide.jsx');
  assert(guide.includes('<details')&&guide.includes('<summary>'));
  assert(guide.includes("event.key === 'Escape'"));
  assert(guide.includes('navigator.standalone === true'));
  assert(guide.includes("window.matchMedia('(display-mode: standalone)')"));
  assert(!/beforeinstallprompt|\.prompt\(/.test(guide));
});
