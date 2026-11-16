import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import {
  analyticsMeasurementId, analyticsPageLocation, analyticsReferrer,
  initializeAnalytics, trackAnalytics, trackRakutenNavigation,
} from '../src/data/analytics.js';
import {netlifyRouting} from './netlify-export.mjs';
import {trackEvent} from '../src/data/telemetry.js';
import {observeAffiliate} from '../src/commerce/tracking.js';

const origin = 'https://yoi-no-ikkon.netlify.app';
const id = 'G-TESTONLY00';
const browser = () => ({location: {origin}});
const vercel = JSON.parse(fs.readFileSync(new URL('../vercel.json', import.meta.url)));

test('no GA4 ID, invalid ID, development or a different origin cannot start analytics', () => {
  assert.equal(analyticsMeasurementId(browser(), id, 'production'), id);
  for (const bad of ['', 'G-<SCRIPT>', 'GT-1234567']) assert.equal(analyticsMeasurementId(browser(), bad, 'production'), null);
  assert.equal(analyticsMeasurementId(browser(), id, 'development'), null);
  for (const value of ['https://yoi-no-ikkon.vercel.app', 'http://localhost:3100', 'https://example.netlify.app']) {
    assert.equal(analyticsMeasurementId({location: {origin: value}}, id, 'production'), null);
  }
  assert.equal(analyticsMeasurementId(undefined, id, 'production'), null);
  const win = {...browser(), gtag: () => assert.fail('no ID must not send')};
  assert.doesNotThrow(() => trackAnalytics('food_search', {}, win, ''));
});

test('page context drops arbitrary query, fragment and referrer path, and keeps the planned Instagram campaign', () => {
  assert.equal(analyticsPageLocation('/food', '?q=person%40example.test&phone=0123#x'), origin + '/food');
  assert.equal(analyticsPageLocation('/', '?utm_source=instagram&utm_medium=social&utm_content=person%40example.test'), origin + '/?utm_source=instagram&utm_medium=social');
  assert.equal(analyticsPageLocation('/person@example.test'), origin + '/404');
  assert.equal(analyticsPageLocation('//example.test'), origin + '/404');
  assert.equal(analyticsReferrer('https://www.instagram.com/users/name?secret=1'), 'https://www.instagram.com');
  assert.equal(analyticsReferrer('javascript:alert(0)'), '');
});

test('one tag config suppresses automatic initial page_view and preserves the original queue', () => {
  const win = browser();
  win.dataLayer = [{event: 'affiliate_click'}];
  const page = {page_location: origin + '/', page_referrer: ''};
  initializeAnalytics(win, id, page);
  initializeAnalytics(win, id, page);
  const [old, settings, js, config] = win.dataLayer;
  assert.equal(old.event, 'affiliate_click');
  assert.equal(win.dataLayer.length, 4);
  assert.deepEqual(Array.from(settings), ['set', {...page, send_page_view: false}]);
  assert.equal(js[0], 'js');
  assert.deepEqual(Array.from(config), ['config', id, {...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false}]);
});

test('custom events are explicit and missing or throwing gtag never affects the caller', () => {
  const win = browser();
  assert.doesNotThrow(() => trackAnalytics('food_search', {}, win, id));
  win.gtag = () => { throw Error('tag unavailable'); };
  assert.doesNotThrow(() => trackAnalytics('rakuten_click', {}, win, id));
  const calls = [];
  win.gtag = (...args) => calls.push(args);
  trackAnalytics('recommendation_select', {dish_id: 'item-bxzivf', sake_id: 'kawatsuru', position: 1, query: 'person@example.test', url: 'private'}, win, id);
  trackAnalytics('food_search', {category: 'fish', dish_name: 'person@example.test'}, win, id);
  trackAnalytics('affiliate_click', {sake_id: 'old'}, win, id);
  trackAnalytics('__proto__', {}, win, id);
  assert.deepEqual(calls, [
    ['event', 'recommendation_select', {send_to: id, dish_id: 'item-bxzivf', sake_id: 'kawatsuru', position: 1}],
    ['event', 'food_search', {send_to: id, category: 'fish'}],
  ]);
});

test('Rakuten click uses safe metadata, counts primary and middle button, and ignores blocked or other links', () => {
  const fields = {dataset: {gaSakeId: 'sake-id', gaSakeName: 'Sake', gaPrefecture: 'Kagawa'}};
  const placement = {dataset: {gaRakutenPlacement: 'local_specialty', gaSpecialtyId: 'regional-food', gaSpecialtyName: 'Chicken'}};
  const anchor = {href: 'https://item.rakuten.co.jp/test/product/?tracking=do-not-send', closest: selector => selector.includes('placement') ? placement : null};
  const event = {type: 'click', button: 0, target: {closest: () => anchor}};
  const calls = [];
  const emit = (...args) => calls.push(args);
  trackRakutenNavigation(event, fields, emit);
  trackRakutenNavigation({...event, type: 'auxclick', button: 1}, fields, emit);
  trackRakutenNavigation({...event, type: 'auxclick', button: 2}, fields, emit);
  trackRakutenNavigation({...event, defaultPrevented: true}, fields, emit);
  anchor.href = 'https://item.rakuten.co.jp.evil.example/test';
  trackRakutenNavigation(event, fields, emit);
  assert.equal(calls.length, 2);
  assert.deepEqual(calls[0], ['rakuten_click', {sake_id: 'sake-id', sake_name: 'Sake', prefecture: 'Kagawa', placement: 'local_specialty', specialty_id: 'regional-food', specialty_name: 'Chicken', destination_domain: 'rakuten.co.jp'}]);
  assert(!JSON.stringify(calls).includes('do-not-send'));
});

test('GA4 failure is isolated from the usual Rakuten click and does not cancel navigation', () => {
  const listeners = {};
  const element = {addEventListener: (name, fn) => {listeners[name] = fn;}, removeEventListener() {}};
  const offer = {sakeId: 'tested', provider: 'rakuten', isAffiliate: true, validUntil: '2099-01-01'};
  const win = browser();
  win.gtag = () => {throw Error('blocked');};
  const old = globalThis.window;
  try {
    globalThis.window = {...win,location:{origin,pathname:'/sake/tested'}};
    const anchor = {href: 'https://item.rakuten.co.jp/test/product/', closest: () => ({dataset: {gaRakutenPlacement: 'sake_purchase'}})};
    const event = {type: 'click', button: 0, target: {closest: () => anchor}, preventDefault: () => assert.fail('valid link must not be delayed or canceled')};
    observeAffiliate(element, offer, trackEvent);
    listeners.click(event);
    trackRakutenNavigation(event, null, (name, params) => trackAnalytics(name, params, win, id));
    assert.equal(globalThis.window.dataLayer.filter(row => row.event === 'affiliate_click').length, 1);
  } finally {
    if (old === undefined) delete globalThis.window;
    else globalThis.window = old;
  }
});

test('only Netlify GA4 export adds Google tag and measurement hosts, preserving every other header and redirect', () => {
  const before = netlifyRouting(vercel, '');
  const after = netlifyRouting(vercel, id);
  const csp = '  Content-Security-Policy: ';
  const policy = after.headers.split('\n').find(line => line.startsWith(csp));
  assert(policy.includes('script-src \'self\' \'unsafe-inline\' https://www.googletagmanager.com;'));
  assert(policy.includes('connect-src \'self\' https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com;'));
  assert(!/doubleclick|unsafe-eval|googleadservices/.test(policy));
  const otherHeaders = text => text.split('\n').filter(line => !line.startsWith(csp));
  assert.deepEqual(otherHeaders(before.headers), otherHeaders(after.headers));
  assert.equal(before.redirects, after.redirects);
});
