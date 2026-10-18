// Only explicitly reviewed seasonal metadata affects automatic recommendations.
// Search, direct URLs, saved products and their pairing scores remain available.
export function seasonallyRecommended(item, date = new Date()) {
  const months = item.seasonality?.preferredMonths;
  if (!months?.length) return true;
  const parsed = date instanceof Date ? date : new Date(`${String(date).slice(0,10)}T12:00:00+09:00`);
  if (!Number.isFinite(parsed.getTime())) return false;
  const month = Number(new Intl.DateTimeFormat('en-US', {timeZone:'Asia/Tokyo',month:'numeric'}).format(parsed));
  return months.includes(month);
}
