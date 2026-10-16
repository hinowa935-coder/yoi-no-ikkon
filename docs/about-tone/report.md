# About copy and navigation

## Scope

- The production source at `4a19be3` had `/about/advertising` but no `/about` route. Added the independent About page rather than replacing the legal page.
- All seven sections and the closing paragraphs use the supplied operator draft without editorial rewriting or omission. `approved-copy.md` is extracted from the supplied draft; a regression test compares the complete text in order.
- Preserved the operator's move from Tokyo to Saga, the fact that agriculture has not started, and uncertainty about future experience. No expertise claims, donation request, invented dialect, or additional storytelling.
- Home uses the supplied full introduction after the primary exploration entrances and daily recommendation. Added an About footer link without removing advertising information.
- Static server-rendered text; no new client state, fetch, dependency, image, or animation. The readable body width is at most 42rem, body size 16px, line height 1.95. Existing background and navigation are preserved.
- Absolute page title avoids the root title template adding the brand twice. Canonical `/about`, indexable, included in sitemap.

## Local verification

- Tests: 68/68 including four new About regressions.
- Existing browser flow: 58/58, WebKit and Chromium (search/back, filters, Discover, foods, details, favorites, seasonal explicit selection).
- About/home checks: 114/114 at 320, 360, 375, 390, 430, and 1280px. Mobile uses WebKit with an iPhone user agent; desktop uses Chromium. Not a real iPhone test.
- Full rendered article and home introduction match approved text at every width; headings, metadata, canonical, indexability, sitemap, footer, home navigation, touch targets and desktop keyboard focus verified. No horizontal clipping. Screenshots visually read on mobile and desktop.
- Webpack build: passed; 1160 static generation tasks. Postbuild: 1158 HTML pages, no internal research copy or stale 503 counts.
- Typecheck: passed. Existing lint (TypeScript syntax, conflict markers, public debug output; not ESLint): 99 source files, no failures.
- Internal links: 19342 across 1158 HTML pages, zero broken links.
- Secret scan: 7138 files, zero findings. `.env.local` ignored and untracked. No secret values printed or edited.
- `npm audit`: zero vulnerabilities; no dependency updates.
- Sake/Verified/food/commerce data, favorite storage, PWA, CSP, advertising page, and dependencies unchanged.

## Editorial review

The copy remains conversational and deliberately retains repeated wording. It describes a planned transition, not established agricultural expertise, does not denigrate Tokyo, distinguishes editorial pairing suggestions, and explains purchase links without adding promotional claims. No content was made more poetic or polished.

## Production verification

Production release and live QA results are recorded after deployment in `production.json` and the final local report. Deployment uses the existing main-branch Git integration for `yata-s-projects/yoi-no-ikkon`; unrelated pending food-audit documents and assets are not included.
