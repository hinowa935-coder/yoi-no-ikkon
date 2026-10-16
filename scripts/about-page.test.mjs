import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {aboutTitle,aboutDescription,aboutIntroduction,aboutPaths,aboutMaker,aboutInterests,aboutDetails,aboutClosing,homeAbout} from '../src/app/about/content.js';
const read=path=>fs.readFileSync(path,'utf8');
test('Home uses exactly the two operator-supplied sentences after the discovery entrances',()=>{
 assert.equal(homeAbout.heading,'酒を飲む側から、米をつくる側へ。');
 assert.deepEqual(homeAbout.paragraphs,['佐賀で米づくりに携わります。','米づくりの現場で知ったことを、少しずつ宵の一献にも。']);
 const page=read('src/app/page.jsx');assert(page.indexOf('<DailyPick />')<page.indexOf('className="home-about"'));assert(page.includes('href="/about"'));
});
test('About keeps the maker and concept visible, with three ways and five concrete interests',()=>{
 assert.equal(aboutTitle,'宵の一献について');assert.equal(aboutIntroduction.heading,'こんな夜なら、何を食べよう。何を飲もう。');
 assert.equal(aboutPaths.length,3);assert.deepEqual(aboutInterests.map(i=>i.heading),['酒','米','食','土地','器']);
 const maker=aboutMaker.paragraphs.join('');for(const text of ['東京','佐賀','米づくり','知らない','農家だから分かる','ごはんも米。','日本酒も米。','現場'])assert(maker.includes(text));
 assert(!maker.includes('収入'));assert(maker.length<350);
 const page=read('src/app/about/page.jsx');assert(page.includes('className="about-prose about-maker"'));assert(!page.includes('Wine'));assert(page.includes('OchokoIcon'));
});
test('About has four native, closed disclosures with persistent summaries and no internal backlog copy',()=>{
 assert.deepEqual(aboutDetails.map(d=>d.heading),['料理について','おすすめの考え方','購入リンクについて','まだ、つくっている途中です']);
 for(const detail of aboutDetails){assert(detail.summary);assert(detail.paragraphs.length>0);}
 const page=read('src/app/about/page.jsx');assert(page.includes('<details'));assert(!/<details[^>]*\bopen(?:\s|=|>)/.test(page));assert(page.includes('{detail.summary}'));assert(page.includes('ChevronDown'));assert(!page.includes('use client'));
 assert(!JSON.stringify(aboutDetails).includes('料理の名前が重複'));assert(!JSON.stringify(aboutDetails).includes('商品画像が見つからな'));
 const purchase=aboutDetails.find(d=>d.id==='purchase');assert(purchase.summary.includes('広告収益'));assert(purchase.paragraphs.join('').includes('収益が入る'));assert(purchase.paragraphs.join('').includes('上位に表示する'));
 assert.equal(aboutClosing[2],'そんなときに、ふと思い出してもらえる場所に。');
});
test('About SEO, footer advertising and existing URL routes remain intact',()=>{
 const page=read('src/app/about/page.jsx');assert(page.includes('title: { absolute:'));assert(page.includes("canonical: '/about'"));assert(!page.includes('noindex'));assert(aboutDescription.includes('米づくり'));
 assert(read('app/about/page.jsx').includes('default, metadata'));assert(read('src/app/sitemap.js').includes('`${SITE_URL}/about`'));
 const shell=read('src/app/components/DiscoveryShell.jsx');for(const value of ['href="/about"','href="/about/advertising"','PURCHASE_INFORMATION_NOTICE','AFFILIATE_FOOTER_ACTIVE','AFFILIATE_FOOTER_INACTIVE','AMAZON_DISCLOSURE','<RakutenCredit />','お酒は20歳になってから。'])assert(shell.includes(value));
});
