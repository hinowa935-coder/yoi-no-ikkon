import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { aboutTitle, aboutDescription, aboutSections, aboutClosing, homeAbout } from '../src/app/about/content.js';

const read = path => fs.readFileSync(path, 'utf8');
const normalize = text => text.replace(/\r/g, '').replace(/\s+/g, ' ').trim();

test('About preserves the operator-approved draft in full and in order', () => {
  const actual = [`# ${aboutTitle}`, ...aboutSections.flatMap(section => [`## ${section.heading}`, ...section.paragraphs]), ...aboutClosing].join('\n\n');
  assert.equal(normalize(actual), normalize(read('docs/about-tone/approved-copy.md')));
  assert.equal(aboutSections.length, 7);
  assert(aboutSections.flatMap(section => section.paragraphs).includes('まだ始めてもいないので、偉そうなことは言えません。'));
});

test('About metadata has an absolute title, canonical, and no noindex', () => {
  const source = read('src/app/about/page.jsx');
  assert(source.includes('title: { absolute:'));
  assert(source.includes("canonical: '/about'"));
  assert(!source.includes('noindex'));
  assert.equal(aboutDescription, '夜の気分や家庭料理から日本酒を選ぶ「宵の一献」を作った理由と、東京を離れて佐賀で農業を始める運営者について。');
  assert(read('app/about/page.jsx').includes('default, metadata'));
  assert(read('src/app/sitemap.js').includes('`${SITE_URL}/about`'));
});

test('Home puts the supplied introduction below all primary exploration entrances', () => {
  const source = read('src/app/page.jsx');
  assert(source.indexOf('<DailyPick />') < source.indexOf('className="home-about"'));
  assert(source.includes('href="/about"'));
  assert.equal(homeAbout.heading, '酒を飲む側から、米をつくる側へ。');
  assert.deepEqual(homeAbout.paragraphs, [
    '東京で会社員として働く生活をやめて、地元の佐賀で農業を始めます。',
    'まだ分からないことばかりですが、そこで知ったことや感じたことも、少しずつ宵の一献に持って帰ってこられたらと思っています。',
  ]);
});

test('Footer preserves advertising and purchase disclosures alongside the new About link', () => {
  const source = read('src/app/components/DiscoveryShell.jsx');
  for (const value of ['href="/about"', 'href="/about/advertising"', 'PURCHASE_INFORMATION_NOTICE', 'AFFILIATE_FOOTER_ACTIVE', 'AFFILIATE_FOOTER_INACTIVE', 'AMAZON_DISCLOSURE', '<RakutenCredit />', 'お酒は20歳になってから。']) assert(source.includes(value), value);
  assert(!read('src/app/about/page.jsx').includes('use client'));
});
