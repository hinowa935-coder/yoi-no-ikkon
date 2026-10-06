export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...parameters });
  if (typeof window.plausible === "function") window.plausible(name, { props: parameters });
}
