const tokyo = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit',
});

export function isRecommendationDay(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(value + 'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function tokyoDay(value = new Date()) {
  if (isRecommendationDay(value)) return value;
  // Timestamps must identify an instant, not depend on the host's local timezone.
  if (typeof value === 'string' && !/(Z|[+-]\d{2}:\d{2})$/.test(value)) {
    throw new RangeError('Recommendation timestamps require a timezone');
  }
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) throw new RangeError('Invalid recommendation date');
  return tokyo.format(date);
}

export function recommendationRotationDay(day) {
  const date = new Date(tokyoDay(day) + 'T00:00:00Z');
  // Keep one grounded selection through a Friday-start week; seasonality uses the actual day.
  date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 2) % 7);
  return date.toISOString().slice(0, 10);
}

export function explicitRecommendationDay(seed) {
  return isRecommendationDay(seed) || seed instanceof Date ||
    (typeof seed === 'string' && /^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/.test(seed))
    ? tokyoDay(seed) : null;
}

export function recommendationViewDay(queryDay, today, mode = process.env.NODE_ENV) {
  const qa = mode === 'development' || mode === 'test';
  return qa && isRecommendationDay(queryDay) ? queryDay : today;
}
