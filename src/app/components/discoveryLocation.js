export function discoveryLocation(href, { nightId, directionId, dishName }) {
  const url = new URL(href);
  if (url.pathname.replace(/\/$/, "") !== "/discover" || !nightId) return null;
  for (const [key, value] of [["night", nightId], ["direction", directionId], ["dish", dishName]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  return url.pathname + url.search + url.hash;
}
