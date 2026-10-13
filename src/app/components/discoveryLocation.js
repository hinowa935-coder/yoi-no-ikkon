export function discoveryLocation(href, { nightId, directionId, dishName, seed, dishLimit }) {
  const url = new URL(href);
  if (url.pathname.replace(/\/$/, "") !== "/discover") return null;
  for (const [key, value] of [["night", nightId], ["direction", directionId], ["dish", dishName]]) {
    if (value) url.searchParams.set(key, value);
    else url.searchParams.delete(key);
  }
  if(seed)url.searchParams.set('day',seed);
  if(dishLimit>6)url.searchParams.set('dishes',String(dishLimit));else url.searchParams.delete('dishes');
  return url.pathname + url.search + url.hash;
}
