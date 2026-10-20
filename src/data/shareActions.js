import { SITE_URL } from './siteIdentity.js';

export function canonicalShareUrl(path) {
  const url = new URL(path, SITE_URL);
  if (url.origin !== SITE_URL || url.username || url.password) throw new Error('Only site pages can be shared');
  url.search = '';
  url.hash = '';
  return url.toString();
}

export async function shareOrCopy(data, browser = navigator) {
  if (typeof browser.share === 'function') {
    try {
      await browser.share(data);
      return 'shared';
    } catch (error) {
      if (error?.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    if (typeof browser.clipboard?.writeText !== 'function') return 'failed';
    await browser.clipboard.writeText(data.url);
    return 'copied';
  } catch {
    return 'failed';
  }
}

export function homeGuidePlatform(userAgent, standalone) {
  if (standalone) return null;
  if (/iPhone|iPod/i.test(userAgent)) return 'ios';
  if (/Android/i.test(userAgent)) return 'android';
  return null;
}
