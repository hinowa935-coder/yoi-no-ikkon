export const primaryDestinations = [
  {id: 'tonight', href: '/', label: '今夜', areas: ['/discover', '/food', '/nights', '/night']},
  {id: 'search', href: '/search', label: '探す', areas: ['/sake']},
  {id: 'ochoko', href: '/ochoko', label: 'おちょこ', areas: []},
];

export function navigationCurrent(pathname, destination) {
  const path = pathname?.replace(/\/$/, '') || '/';
  if (path === destination.href) return 'page';
  const areas = [destination.href, ...destination.areas].filter(p => p !== '/');
  return areas.some(p => path.startsWith(`${p}/`) || path === p) ? 'location' : undefined;
}
