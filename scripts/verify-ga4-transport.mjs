import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';

const origin = 'https://yoi-no-ikkon.netlify.app';
const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
assert(/^G-[A-Z0-9]{6,20}$/.test(id || ''));
const root = path.resolve('out');
const contentTypes = {'.html':'text/html','.js':'application/javascript','.css':'text/css','.txt':'text/plain','.svg':'image/svg+xml','.png':'image/png','.webmanifest':'application/manifest+json','.woff2':'font/woff2'};
const policy = fs.readFileSync(path.join(root, '_headers'), 'utf8').match(/^\s*Content-Security-Policy: (.+)$/m)[1];
assert(policy.includes('https://www.googletagmanager.com'));
assert(fs.readFileSync(path.join(root, '_headers'), 'utf8').includes('X-Robots-Tag: noindex'));
const server = http.createServer((req, res) => {
  const filename = path.resolve(root, '.' + decodeURIComponent(new URL(req.url, origin).pathname));
  if (filename !== root && !filename.startsWith(root + path.sep)) return res.writeHead(400).end();
  const asset = [filename, filename+'.html', path.join(filename, 'index.html')].find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!asset) return res.writeHead(404).end();
  res.writeHead(200, {'content-type':contentTypes[path.extname(asset)] || 'application/octet-stream', 'content-security-policy':policy, 'x-robots-tag':'noindex, nofollow, noarchive'});
  res.end(fs.readFileSync(asset));
});

const output = {startedAt:new Date().toISOString(), localExportMappedToVerificationOrigin:true, siteDeployed:false, dashboardVerified:false, delivered:[], blocked:[], retailerNetworkRequests:0};
let sequence = 0;
const searchCanary = 'qa-input-do-not-collect';
const inspectOnly = process.env.YOI_GA4_INSPECT_ONLY === '1';
const collectHost = host => host.endsWith('.google-analytics.com') || host.endsWith('.analytics.google.com');
function eventRows(req, url) {
  const query = new URLSearchParams(url.search);
  const body = req.postData() || '';
  return (body ? body.split(/\r?\n/).filter(Boolean) : ['']).map(line => {
    const params = new URLSearchParams(query);
    for (const [key, value] of new URLSearchParams(line)) params.set(key, value);
    return params;
  });
}
process.env.PLAYWRIGHT_BROWSERS_PATH ||= path.resolve('../../.cache/browser-engines');
const {chromium} = createRequire(import.meta.url)(process.env.YOI_PLAYWRIGHT_MODULE || 'C:/Users/okts0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  const local = 'http://127.0.0.1:'+server.address().port;
  browser = await chromium.launch({headless:true});
  const context = await browser.newContext({viewport:{width:390,height:844},serviceWorkers:'block',reducedMotion:'reduce'});
  await context.addInitScript(()=>{
    // This flag is private to the isolated QA tab, never to public visitors.
    const queue = [];
    const push = queue.push;
    queue.push = function (...rows) {
      for (const row of rows) {
        if (row?.[0]==='config' || row?.[0]==='event') {
          row[2]={...row[2],debug_mode:true};
          if (row[0]==='event') row[2].qa_manual_event='transport_qa';
        }
      }
      return push.apply(this, rows);
    };
    window.dataLayer = queue;
  });
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url());
    if (url.origin === origin) return route.fulfill({response:await context.request.get(local+url.pathname+url.search)});
    if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js' && url.searchParams.get('id') === id) {
      const response = await route.fetch({maxRedirects:0});
      output.officialTagStatus = response.status();
      return route.fulfill({response});
    }
    if (collectHost(url.hostname) && url.pathname === '/g/collect') {
      const requestOrder = ++sequence;
      const params = eventRows(req, url);
      const names = params.map(p=>p.get('en'));
      const prohibited = params.some(p=>p.get('tid')!==id || !p.get('en') ||
        [...p].some(([key,value])=>/link_url|search_term|user_id|email|phone|password/i.test(key) ||
          value.includes(searchCanary) || value.includes('hb.afl.rakuten.co.jp') || value.includes('a.r10.to/') ||
          value.includes('item.rakuten.co.jp/') || value.includes('search.rakuten.co.jp/') || value.includes('@')));
      if (prohibited) {
        output.blocked.push({names,reason:'privacy or destination guard'});
        return route.abort();
      }
      try {
        const response = inspectOnly ? null : await route.fetch({maxRedirects:0});
        for (const p of params) output.delivered.push({
          requestOrder,
          name:p.get('en'),status:response?.status() ?? 204,debug:p.get('_dbg')==='1'||p.get('ep.debug_mode')==='true'||p.get('ep.debug_mode')==='1',
          manual:p.get('ep.qa_manual_event')==='transport_qa',
          page:new URL(p.get('dl') || origin).pathname,
          ...(p.has('ep.placement')&&{placement:p.get('ep.placement')}),
        });
        return response ? route.fulfill({response}) : route.fulfill({status:204});
      } catch {
        output.blocked.push({names,reason:'transport failed'});
        return route.abort();
      }
    }
    if (req.isNavigationRequest() && (url.hostname.endsWith('.rakuten.co.jp') || url.hostname==='a.r10.to')) {
      output.retailerNavigationIntercepted = true;
      return route.fulfill({contentType:'text/html',body:'<title>QA: original retailer destination intercepted</title>'});
    }
    if (url.hostname.endsWith('.rakuten.co.jp') && req.resourceType()==='image') {
      return route.fulfill({contentType:'image/svg+xml',body:'<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>'});
    }
    return route.abort();
  });
  const page = await context.newPage();
  const faults=[];
  page.on('pageerror',error=>faults.push(error.name));
  page.on('console',message=>{if (/Content Security Policy|hydration/i.test(message.text())) faults.push('CSP or hydration');});
  const jump = async pathname => {
    const next = page.waitForURL(url=>url.pathname===pathname);
    await page.locator('a[href="'+pathname+'"]:visible').first().click();
    await next;
  };
  const first = await page.goto(origin+'/');
  assert(first.headers()['x-robots-tag'].includes('noindex'));
  await page.locator('script#yoi-ga4').waitFor({state:'attached'});
  const tagDeadline=Date.now()+15000;
  while (!output.delivered.some(row=>row.name==='page_view'&&row.status<300)&&Date.now()<tagDeadline) await page.waitForTimeout(200);
  assert(output.delivered.some(row=>row.name==='page_view'&&row.status<300),'Initial page view did not leave the browser');
  await jump('/food');
  const search = page.getByRole('searchbox',{name:'\u6599\u7406\u540d'});
  // Ensure a free-text string never reaches the collector, even during filtering.
  await search.fill(searchCanary);
  await search.fill('\u30a2\u30b8\u30d5\u30e9\u30a4');
  await page.getByRole('region',{name:'\u6599\u7406\u306e\u691c\u7d22\u7d50\u679c'}).waitFor();
  await jump('/food/item-bxzivf');
  const links = page.locator('.recommendation-grid .sake-detail-link:visible');
  await links.first().waitFor();
  const paths = await links.evaluateAll(nodes=>nodes.map(a=>a.pathname));
  const pick = paths.findIndex(value=>fs.readFileSync(path.join(root,value.slice(1)+'.html'),'utf8').includes('id="sake-local-sakana-toggle"'));
  assert(pick>=0);
  await links.nth(pick).click();
  await page.waitForURL(url=>url.pathname===paths[pick]);
  await page.locator('#sake-local-sakana-toggle').click();
  const link = page.locator('.local-sakana-purchase a:visible').first();
  const initial = await link.evaluate(a=>a.href);
  const popup = page.waitForEvent('popup');
  await link.click();
  const retail = await popup;
  await retail.waitForLoadState();
  assert(await retail.evaluate(()=>location.href)===initial);
  await retail.close();
  output.originalRetailDestinationPreserved = true;
  output.internalClickCount = await page.evaluate(()=>window.dataLayer.filter(x=>x.event==='specialty_rakuten_click').length);
  assert.equal(output.internalClickCount,1);
  const expected = {page_view:4,food_search:1,recommendation_select:1,view_sake_detail:1,local_specialty_open:1,rakuten_click:1};
  const deadline = Date.now()+25000;
  while (Date.now()<deadline && !Object.keys(expected).every(name=>output.delivered.some(row=>row.name===name))) await page.waitForTimeout(500);
  await page.waitForTimeout(2500);
  output.counts = Object.fromEntries(Object.keys(expected).map(name=>[name,output.delivered.filter(row=>row.name===name&&row.status>=200&&row.status<300).length]));
  output.faults=faults;
  assert.deepEqual(output.blocked,[]);
  assert.deepEqual(faults,[]);
  assert.deepEqual(output.counts,expected);
  const seen=output.delivered.filter(row=>row.name==='page_view').sort((a,b)=>a.requestOrder-b.requestOrder).map(row=>row.page);
  assert.deepEqual(seen,['/','/food','/food/item-bxzivf',paths[pick]]);
  assert(output.delivered.filter(row=>Object.hasOwn(expected,row.name)).every(row=>row.debug));
  output.passed = true;
} finally {
  if (browser) await browser.close();
  await new Promise(resolve=>server.close(resolve));
  output.endedAt=new Date().toISOString();
  const file=inspectOnly?'dispatch-inspection.json':'real-transport-verification.json';
  fs.writeFileSync('docs/ga4/'+file,JSON.stringify({...output,inspectOnly},null,2)+'\n');
  console.log(JSON.stringify({passed:output.passed||false,counts:output.counts,officialTagStatus:output.officialTagStatus,blocked:output.blocked,startedAt:output.startedAt,endedAt:output.endedAt}));
}
