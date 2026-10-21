import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { PURCHASE_INFORMATION_NOTICE } from '../src/commerce/purchaseNotice.js';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('home preserves choosing, reading, returning and sharing order without extra wrapper cards',()=>{
 const page=read('src/app/page.jsx');
 const positions=['<DailyPick','className="home-about"','<HomeScreenGuide','<RecommendShare'].map(s=>page.indexOf(s));
 assert(positions.every((p,i)=>p>=0&&(!i||p>positions[i-1])));
 assert(page.includes('className="home-about-label">宵の一献について'));
 assert(page.includes('href="/about" className="text-link"'));
 assert(!page.includes('home-about utility-card'));
});

test('functional cards reuse the existing guide and share actions without touching their logic',()=>{
 const guide=read('src/app/components/HomeScreenGuide.jsx'),share=read('src/app/components/RecommendShare.jsx');
 assert(guide.includes("compact ? ' is-compact' : ' utility-card'"));
 assert(guide.includes('if (!platform) return null'));
 assert(guide.includes('navigator.standalone === true'));
 assert(share.includes("item ? '' : ' utility-card'"));
 assert(share.includes('<ShareButton')&&share.includes('site_share_open')&&share.includes('sake_share_open'));
});

test('footer separates quiet navigation, required disclosures, and a closed native notice',()=>{
 const footer=read('src/app/components/SiteFooter.jsx'),shell=read('src/app/components/DiscoveryShell.jsx');
 assert(shell.includes('<SiteFooter disclosure={disclosure} />'));
 assert(footer.includes('aria-label="フッターナビゲーション"'));
 for(const href of ['/','/about','/about/advertising'])assert(footer.includes('href="'+href+'"'));
 assert(footer.includes('お酒は20歳になってから。'));
 assert(footer.includes('<RakutenCredit />')&&footer.includes('disclosure.rakuten'));
 assert(footer.includes('AMAZON_DISCLOSURE')&&footer.includes('disclosure.amazon'));
 assert(footer.includes('AFFILIATE_FOOTER_ACTIVE')&&footer.includes('AFFILIATE_FOOTER_INACTIVE'));
 assert(footer.includes('<details className="footer-purchase-notice">'));
 assert(footer.includes('<summary>')&&!footer.includes('<details open'));
 assert(!/ShareButton|HomeScreenGuide|RecommendShare/.test(footer));
 const sentences=PURCHASE_INFORMATION_NOTICE.split('。').filter(Boolean).map(s=>s+'。');
 assert.equal([sentences.slice(0,2).join(''),sentences.slice(2).join('')].join(''),PURCHASE_INFORMATION_NOTICE);
});
