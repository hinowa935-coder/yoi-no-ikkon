import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';

const origin = 'https://yoi-no-ikkon.netlify.app';
const control = 'https://yoi-no-ikkon.vercel.app';
const root = path.resolve('out');
const sha = value => createHash('sha256').update(value).digest('hex');
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('../../.cache/browser-engines');
const {chromium, webkit} = createRequire(import.meta.url)(
  process.env.YOI_PLAYWRIGHT_MODULE || 'C:/Users/okts0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright'
);
const policy = fs.readFileSync(path.join(root, '_headers'), 'utf8').match(/^\s*Content-Security-Policy: (.+)$/m)[1];
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.txt':'text/plain','.json':'application/json','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
const stub = 'window.gtag = function () { window.dataLayer.push(arguments); };';
const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jR6cAAAAASUVORK5CYII=', 'base64');
const rows = [];
const townPairing = 'id="sake-local-sakana-toggle"';

function asset(url) {
  const file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
  assert(file === root || file.startsWith(root + path.sep));
  return [file, file + '.html', path.join(file, 'index.html')].find(f => fs.existsSync(f) && fs.statSync(f).isFile());
}
const server = http.createServer((req,res) => {
  try {
    const file = asset(new URL(req.url,'http://localhost'));
    if (!file) return res.writeHead(404).end();
    return res.writeHead(200, {
      'content-type': types[path.extname(file)] || 'application/octet-stream',
      'content-security-policy': policy,
      'x-robots-tag':'noindex, nofollow, noarchive',
    }).end(fs.readFileSync(file));
  } catch {
    return res.writeHead(400).end();
  }
});

async function configure(context, tagFailure = false) {
  const requests = {tag:0, googleCollection:0, simulatedRetailNavigation:0};
  const errors = [];
  await context.route('**/*', async route => {
    const u = new URL(route.request().url());
    if ([origin,control].includes(u.origin)) return route.fulfill({
      response: await context.request.get(local + u.pathname + u.search),
    });
    if (u.hostname === 'www.googletagmanager.com' && u.pathname === '/gtag/js') {
      requests.tag++;
      return tagFailure ? route.abort() : route.fulfill({contentType:'application/javascript',body:stub});
    }
    if (u.hostname.endsWith('google-analytics.com') || u.hostname.endsWith('analytics.google.com')) {
      requests.googleCollection++;
      return route.abort();
    }
    if (['hbb.afl.rakuten.co.jp','image.rakuten.co.jp','thumbnail.image.rakuten.co.jp'].includes(u.hostname))
      return route.fulfill({contentType:'image/png',body:image});
    if (route.request().isNavigationRequest() && (u.hostname.endsWith('.rakuten.co.jp') || u.hostname === 'a.r10.to')) {
      requests.simulatedRetailNavigation++;
      return route.fulfill({contentType:'text/html',body:'<title>Retail link fixture</title>'});
    }
    return route.abort();
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator,'share',{configurable:true,value:async data=>{window.__shared=data.url;}});
    if (PerformanceObserver.supportedEntryTypes.includes('layout-shift')) {
      window.__unexpectedShift = 0;
      new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__unexpectedShift+=entry.value;})
        .observe({type:'layout-shift',buffered:true});
    }
  });
  const page=await context.newPage();
  page.on('pageerror', error=>errors.push(error.name));
  page.on('console', message=>{if (/Content Security Policy|hydration|did not match/i.test(message.text()))errors.push('CSP or hydration');});
  return {page,requests,errors};
}

const events = page => page.evaluate(() => (window.dataLayer||[]).filter(row=>row[0]==='event').map(row=>({name:row[1],fields:row[2]})));
async function count(page,name,expected) {
  await page.waitForFunction(({name,expected})=>(window.dataLayer||[]).filter(row=>row[0]==='event'&&row[1]===name).length===expected,{name,expected});
}
async function navigate(page, href) {
  const next = page.waitForURL(u=>u.pathname===href);
  await page.locator('a[href="'+href+'"]:visible').first().click();
  await next;
}
async function retail(page, link) {
  const href = await link.evaluate(a=>a.href);
  assert(/^https:/.test(href));
  const popup=page.waitForEvent('popup');
  await link.click();
  const result=await popup;
  await result.waitForLoadState('domcontentloaded');
  const destination=await result.evaluate(()=>location.href);
  assert(sha(destination)===sha(href),'Navigation must use the original, unmodified URL');
  await result.close();
  return /(?:^|\.)afl\.rakuten\.co\.jp$|^a\.r10\.to$/.test(new URL(href).hostname);
}
async function foodSearch(page, keyword) {
  await page.getByRole('searchbox',{name:'料理名'}).fill(keyword);
  await page.getByRole('region',{name:'料理の検索結果'}).waitFor();
}

await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const local = 'http://127.0.0.1:'+server.address().port;
try {
  for (const engine of [chromium, webkit]) {
    const browser=await engine.launch({headless:true});
    try {
      const context=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
      const {page,requests,errors}=await configure(context);
      const response=await page.goto(origin+'/?utm_source=instagram&utm_medium=social&utm_content=person%40example.test');
      assert(response.headers()['x-robots-tag'].includes('noindex'));
      await count(page,'page_view',1);
      await page.locator('script#yoi-ga4').waitFor({state:'attached'});
      assert(await page.locator('script#yoi-ga4').evaluate(s=>s.async));
      assert((await events(page))[0].fields.page_location===origin+'/?utm_source=instagram&utm_medium=social');
      await page.waitForTimeout(400);
      const initialShift=await page.evaluate(()=>window.__unexpectedShift??null);
      if (initialShift!==null) assert(initialShift<0.1);
      await navigate(page,'/food');
      await count(page,'page_view',2);
      await foodSearch(page,'person@example.test');
      await count(page,'food_search',1);
      await foodSearch(page,'\u30a2\u30b8\u30d5\u30e9\u30a4');
      assert.equal((await events(page)).filter(e=>e.name==='page_view').length,2);
      const foodPath='/food/item-bxzivf';
      await navigate(page,foodPath);
      await count(page,'page_view',3);
      await count(page,'food_search',2);
      const choices=page.locator('.recommendation-grid .discovery-sake:visible');
      await choices.first().waitFor();
      const paths=await choices.locator('.sake-detail-link').evaluateAll(links=>links.map(link=>link.pathname));
      const pick=paths.findIndex(pathname=>fs.readFileSync(asset(new URL(pathname,origin)),'utf8').includes(townPairing));
      assert(pick>=0,'At least one displayed recommendation should have local specialties for this fixture');
      const selected=choices.nth(pick).locator('.sake-detail-link');
      const selectedPath=await selected.getAttribute('href');
      await selected.click();
      await page.waitForURL(u=>u.pathname===selectedPath);
      await count(page,'page_view',4);
      await count(page,'view_sake_detail',1);
      await count(page,'recommendation_select',1);
      const detail=page.locator('.sake-detail-hero[data-ga-sake-id]');
      const sakeId=await detail.getAttribute('data-ga-sake-id');
      const selection=(await events(page)).find(e=>e.name==='recommendation_select').fields;
      assert.equal(selection.sake_id,sakeId);
      assert.equal(selection.position,pick+1);
      assert.equal(selection.dish_id,'item-bxzivf');

      const localToggle=page.locator('#sake-local-sakana-toggle');
      await localToggle.click();
      await count(page,'local_specialty_open',1);
      await localToggle.click();
      assert.equal((await events(page)).filter(e=>e.name==='local_specialty_open').length,1);
      await localToggle.click();
      await count(page,'local_specialty_open',2);
      await retail(page,page.locator('.local-sakana-purchase a:visible').first());
      await count(page,'rakuten_click',1);
      await page.locator('#sake-purchase-toggle').click();
      const purchase=page.locator('.is-rakuten a:visible').first();
      const affiliate=await retail(page,purchase);
      await count(page,'rakuten_click',2);
      const saved=detail.locator('.ochoko-button');
      await saved.click();
      assert.equal(await saved.getAttribute('aria-pressed'),'true');
      await page.getByRole('button',{name:'\u3053\u306e\u65e5\u672c\u9152\u3092\u53cb\u9054\u306b\u3059\u3059\u3081\u308b'}).click();
      await page.waitForFunction(()=>Boolean(window.__shared));
      await navigate(page,'/ochoko');
      await count(page,'page_view',5);
      assert(await page.locator('a[href="'+selectedPath+'"]').count()>0,'saved sake persists across navigation');
      await page.goBack();
      await count(page,'page_view',6);
      await count(page,'view_sake_detail',2);
      await navigate(page,'/search');
      await count(page,'page_view',7);
      await navigate(page,'/about');
      await count(page,'page_view',8);

      const queued=await events(page);
      const clickEvents=queued.filter(e=>e.name==='rakuten_click');
      assert.deepEqual(clickEvents.map(e=>e.fields.placement),['local_specialty','sake_purchase']);
      assert(clickEvents.every(e=>e.fields.destination_domain==='rakuten.co.jp'&&e.fields.sake_id===sakeId));
      assert(clickEvents[0].fields.specialty_id&&clickEvents[0].fields.specialty_name);
      assert.equal(await page.evaluate(()=>window.dataLayer.filter(e=>e.event==='specialty_rakuten_click').length),1);
      if (affiliate) assert.equal(await page.evaluate(()=>window.dataLayer.filter(e=>e.event==='affiliate_click').length),1);
      assert(!/person|hb\.afl\.rakuten|link_url|affiliateId|view_search_results/.test(JSON.stringify(queued)));
      assert.equal(requests.tag,1);
      assert.equal(requests.googleCollection,0);
      assert.equal(requests.simulatedRetailNavigation,2);
      assert.deepEqual(errors,[]);
      rows.push({engine:engine.name(),case:'complete_flow',selectedSake:sakeId,events:queued.map(e=>e.name),requests,unexpectedLayoutShift:initialShift,affiliateOfferExercised:affiliate,localInternalRecord:true,noDuplicate:true,canonicalSharePreserved:true});
      await context.close();

      const direct=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
      const approved=await configure(direct);
      await approved.page.goto(origin+'/sake/nabeshima-junmai-ginjo');
      await count(approved.page,'page_view',1);
      await approved.page.locator('#sake-purchase-toggle').click();
      const approvedLink=approved.page.locator('.is-rakuten .affiliate-offers a:visible').first();
      assert(await retail(approved.page,approvedLink),'Expected a current approved offer for the independent affiliate fixture');
      await count(approved.page,'rakuten_click',1);
      assert.equal(await approved.page.evaluate(()=>window.dataLayer.filter(e=>e.event==='affiliate_click').length),1);
      assert.deepEqual(approved.errors,[]);
      rows.push({engine:engine.name(),case:'approved_affiliate_offer',localInternalRecord:true,unchangedDestination:true,oneGa4Event:true});
      await direct.close();

      const failure=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
      const failing=await configure(failure,true);
      await failing.page.goto(origin+selectedPath);
      await count(failing.page,'page_view',1);
      await failing.page.locator('#sake-purchase-toggle').click();
      await retail(failing.page,failing.page.locator('.is-rakuten a:visible').first());
      assert.equal(failing.requests.tag,1);
      assert.equal(failing.requests.googleCollection,0);
      assert.deepEqual(failing.errors,[]);
      rows.push({engine:engine.name(),case:'blocked_tag',navigationContinues:true});
      await failure.close();

      const inactive=await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block'});
      const off=await configure(inactive);
      await off.page.goto(control+'/food?q=%E3%82%A2%E3%82%B8%E3%83%95%E3%83%A9%E3%82%A4');
      await off.page.getByRole('region',{name:'料理の検索結果'}).waitFor();
      await off.page.waitForTimeout(600);
      assert.deepEqual(await events(off.page),[]);
      assert.equal(off.requests.tag,0);
      assert.deepEqual(off.errors,[]);
      rows.push({engine:engine.name(),case:'disabled_other_origin',tagRequests:0});
      await inactive.close();
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise(resolve=>server.close(resolve));
  fs.writeFileSync('docs/ga4/browser-verification.json',JSON.stringify({verifiedAt:new Date().toISOString(),externalRequestsBlocked:true,debugViewVerified:false,realtimeVerified:false,rows},null,2)+'\n');
}
console.log(JSON.stringify(rows.map(row=>({engine:row.engine,case:row.case,events:row.events?.length,unexpectedLayoutShift:row.unexpectedLayoutShift,affiliateOfferExercised:row.affiliateOfferExercised}))));
