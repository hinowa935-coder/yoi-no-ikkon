'use client';

import {useEffect, useRef, useState} from 'react';
import Script from 'next/script';
import {usePathname} from 'next/navigation';
import {
  analyticsMeasurementId, analyticsPageLocation, analyticsPreview, analyticsReferrer, initializeAnalytics,
  sakeAnalyticsFields, trackAnalytics, trackRakutenNavigation,
} from '../../data/analytics.js';

const getSakeDetail = () => document.querySelector('.sake-detail-hero[data-ga-sake-id]');

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const previous = useRef(null);
  const [tagId, setTagId] = useState(null);

  useEffect(() => {
    const id = analyticsMeasurementId();
    if (!id || !pathname || previous.current?.path === pathname) return;
    const title = document.title;
    const page = {
      page_location: analyticsPageLocation(pathname, previous.current ? '' : window.location.search, window),
      page_referrer: previous.current?.location.split('?')[0] || analyticsReferrer(document.referrer),
      page_title: title,
      ...(analyticsPreview(window) ? {debug_mode:true} : {}),
    };
    previous.current = {path: pathname, location: page.page_location};
    try {
      initializeAnalytics(window, id, page);
      // Set the clean context for custom and enhanced events as well as page_view.
      window.gtag('set', page);
      window.gtag('event', 'page_view', {...page, send_to: id});
    } catch {
      // The page still works when the tag is unavailable.
    }
    setTagId(id);
    const detail = getSakeDetail();
    if (detail && pathname === '/sake/' + detail.dataset.gaSakeId) trackAnalytics('view_sake_detail', sakeAnalyticsFields(detail));
  }, [pathname]);

  useEffect(() => {
    if (!tagId) return;
    const click = event => trackRakutenNavigation(event, getSakeDetail());
    // Bubble after existing click handlers, including expired-offer protection.
    document.addEventListener('click', click);
    document.addEventListener('auxclick', click);
    return () => {
      document.removeEventListener('click', click);
      document.removeEventListener('auxclick', click);
    };
  }, [tagId]);

  return tagId ? <Script id="yoi-ga4" src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`} strategy="afterInteractive" async /> : null;
}
