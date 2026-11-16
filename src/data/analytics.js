import { SITE_URL as origin } from './siteIdentity.js';

const branchOrigin = 'https://netlify-public-release-20261116--yoi-no-ikkon.netlify.app';
const eventFields = {
  food_search: ['dish_id', 'dish_name', 'category', 'mood'],
  recommendation_select: ['dish_id', 'dish_name', 'sake_id', 'sake_name', 'position'],
  view_sake_detail: ['sake_id', 'sake_name', 'prefecture'],
  local_specialty_open: ['sake_id', 'sake_name', 'prefecture', 'specialty_count'],
  rakuten_click: ['sake_id', 'sake_name', 'placement', 'specialty_id', 'specialty_name', 'destination_domain'],
};
const rakutenHosts = new Set(['item.rakuten.co.jp', 'search.rakuten.co.jp', 'hb.afl.rakuten.co.jp', 'a.r10.to']);
const routes = /^(?:\/|\/(?:food|search|discover|ochoko|about)(?:\/)?|\/about\/advertising\/?|\/(?:sake|food|night|nights)\/[a-z0-9-]{1,120}\/?|\/404)$/;

export function analyticsPreview(browser = globalThis.window, enabled = process.env.NEXT_PUBLIC_GA_RELEASE_PREVIEW) {
  return enabled === 'true' && browser?.location.origin === branchOrigin;
}

export function analyticsMeasurementId(browser = globalThis.window, id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, mode = process.env.NODE_ENV, preview) {
  return mode === 'production' && (browser?.location.origin === origin || analyticsPreview(browser,preview)) &&
    /^G-[A-Z0-9]{6,20}$/.test(id || '') ? id : null;
}

export function analyticsPageLocation(pathname, search = '', browser) {
  const url = new URL(routes.test(pathname) ? pathname : '/404', analyticsPreview(browser) ? branchOrigin : origin);
  const query = new URLSearchParams(search);
  // Recognize the planned public Instagram campaign, not arbitrary query strings.
  if (query.get('utm_source') === 'instagram' && query.get('utm_medium') === 'social') {
    url.searchParams.set('utm_source', 'instagram');
    url.searchParams.set('utm_medium', 'social');
  }
  return url.href;
}

export function analyticsReferrer(value) {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.origin : '';
  } catch {
    return '';
  }
}

export function initializeAnalytics(browser, id, page) {
  if (typeof browser.gtag === 'function') return;
  browser.dataLayer = browser.dataLayer || [];
  browser.gtag = function () { browser.dataLayer.push(arguments); };
  // Apply page controls before the tag processes its initialization triggers.
  browser.gtag('set', {...page, send_page_view: false});
  browser.gtag('js', new Date());
  browser.gtag('config', id, {
    ...page,
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export function trackAnalytics(name, fields = {}, browser = globalThis.window, id = analyticsMeasurementId(browser)) {
  const allowed = Object.hasOwn(eventFields, name) ? eventFields[name] : null;
  if (!id || !allowed || typeof browser?.gtag !== 'function') return;
  const safe = {send_to: id};
  for (const key of allowed) {
    const value = fields[key];
    if (typeof value === 'string' && value.length > 0 && value.length <= 100 && !/[@\r\n]|https?:|\bwww\./i.test(value)) safe[key] = value;
    if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) safe[key] = value;
  }
  try {
    browser.gtag('event', name, safe);
  } catch {
    // Analytics must never interrupt an interaction.
  }
}

export function sakeAnalyticsFields(element) {
  const data = element?.dataset;
  return {sake_id: data?.gaSakeId, sake_name: data?.gaSakeName, prefecture: data?.gaPrefecture};
}

export function trackRakutenNavigation(event, detail, emit = trackAnalytics) {
  if (event.defaultPrevented || (event.type === 'auxclick' ? event.button !== 1 : event.button !== 0)) return;
  const anchor = event.target?.closest?.('a[href]');
  const placement = anchor?.closest('[data-ga-rakuten-placement]');
  if (!placement) return;
  try {
    const url = new URL(anchor.href);
    if (url.protocol !== 'https:' || !rakutenHosts.has(url.hostname)) return;
  } catch {
    return;
  }
  emit('rakuten_click', {
    ...sakeAnalyticsFields(anchor.closest('[data-ga-sake-id]') || detail),
    placement: placement.dataset.gaRakutenPlacement,
    specialty_id: placement.dataset.gaSpecialtyId,
    specialty_name: placement.dataset.gaSpecialtyName,
    destination_domain: 'rakuten.co.jp',
  });
}
