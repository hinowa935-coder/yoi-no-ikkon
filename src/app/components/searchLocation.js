export const searchFilterKeys = ["prefecture", "dish", "taste", "classification", "temperature", "night", "sort"];
export const emptySearchFilters = () => Object.fromEntries(searchFilterKeys.map(key => [key, ""]));
export function readSearchLocation(search) {
  const params = new URLSearchParams(search);
  const count = Number(params.get("count"));
  return {
    keyword: params.get("q") || "",
    filters: Object.fromEntries(searchFilterKeys.map(key => [key, params.get(key) || ""])),
    onlySaved: params.get("saved") === "1",
    limit: Number.isInteger(count) && count >= 24 ? Math.min(count, 1000) : 24,
  };
}
export function writeSearchLocation(search, state) {
  const params = new URLSearchParams(search);
  const values = { q: state.keyword, ...state.filters, saved: state.onlySaved ? "1" : "", count: state.limit > 24 ? String(state.limit) : "" };
  for (const [key, value] of Object.entries(values)) {
    if (value) params.set(key, value); else params.delete(key);
  }
  return params.size ? `?${params}` : "";
}
