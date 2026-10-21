export const selectedValues = value => [...new Set((Array.isArray(value) ? value : [value]).filter(Boolean))];
export const matchesSelection = (value, predicate) => !selectedValues(value).length || selectedValues(value).some(predicate);
export function toggleSelection(current, value) {
  const values = selectedValues(current);
  const next = values.includes(value) ? values.filter(v => v !== value) : [...values, value];
  return next.length > 1 ? next : next[0] || '';
}
