import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { INTERNAL_COPY } from "../src/data/publicDisplay.js";

const { parse } = createRequire(import.meta.url)("next/dist/compiled/node-html-parser");
const mode = process.argv[2] || "local";
const output = process.argv[3] || "docs/post-launch-hotfix/local.json";
const base = "https://yoi-no-ikkon.vercel.app";
const oldCount = /(?:503|５０３)\s*(?:商品|本|種類|銘柄)|全\s*(?:503|５０３)/;
const files = fs.readdirSync("out", { recursive: true }).filter(f => f.endsWith(".html"));
const queue = [...files], rows = [], issues = [];
function audit(html) {
  const dom = parse(html);
  const schemas = dom.querySelectorAll('script[type="application/ld+json"]').map(n => n.text);
  const meta = dom.querySelectorAll("meta").map(n => n.getAttribute("content") || "");
  dom.querySelectorAll("script,style").forEach(n => n.remove());
  const values = [...dom.querySelectorAll("h1,h2,h3,p,li,dd,dt,summary,option,button,small,label,a").map(n => n.text.trim()), dom.text, ...meta, ...schemas];
  const internal = [...new Set(values.filter(v => INTERNAL_COPY.test(v)).filter(v => v.length < 1000))];
  const counts = [...new Set(values.filter(v => oldCount.test(v)).filter(v => v.length < 1000))];
  // A broad body match must not be hidden by the short-excerpt limit.
  return { internal, oldCounts: counts, internalDetected: values.some(v => INTERNAL_COPY.test(v)), oldCountDetected: values.some(v => oldCount.test(v)) };
}
async function worker() {
  while (queue.length) {
    const file = queue.shift();
    const relative = file.replaceAll("\\", "/");
    const route = relative === "index.html" ? "/" : relative.replace(/(?:\/index)?\.html$/, "");
    try {
      let html, status = 200;
      if (mode === "live") {
        const response = await fetch(`${base}/${route.replace(/^\//, "")}`, { signal: AbortSignal.timeout(30000), cache: "no-store" });
        status = response.status;
        if (status !== 200 && !(["404", "_not-found"].includes(route) && status === 404)) throw new Error(`HTTP ${status}`);
        html = await response.text();
      } else html = fs.readFileSync(path.join("out", file), "utf8");
      rows.push({ route: route.startsWith("/") ? route : `/${route}`, status, ...audit(html) });
    } catch (error) { issues.push({ route, message: error.message }); }
  }
}
await Promise.all(Array.from({ length: mode === "live" ? 4 : 1 }, () => worker()));
rows.sort((a, b) => a.route.localeCompare(b.route));
const result = { mode, base: mode === "live" ? base : "out/", verifiedAt: new Date().toISOString(), expected: files.length, pages: rows.length, internalPages: rows.filter(r => r.internalDetected).length, oldCountPages: rows.filter(r => r.oldCountDetected).length, issues, rows };
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2));
console.log(JSON.stringify({ ...result, rows: rows.filter(r => r.internalDetected || r.oldCountDetected).map(r => ({ ...r, internal: r.internal.filter(v => !v.includes("<!DOCTYPE")) })) }, null, 2));
if (issues.length || result.internalPages || result.oldCountPages) process.exitCode = 1;
