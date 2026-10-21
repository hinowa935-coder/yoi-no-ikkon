import {selectedValues} from '../../data/searchSelections.js';
export const searchFilterKeys = ["prefecture", "dish", "taste", "classification", "temperature", "night", "sort", "aroma", "body"];
export const emptySearchFilters = () => Object.fromEntries(searchFilterKeys.map(key => [key, ""]));
export const isCurrentSearchLocation = (location, search) => location.pathname.replace(/\/$/, '') === '/search' && location.search === search;
export function readSearchLocation(search) {
  const params = new URLSearchParams(search);
  const count = Number(params.get("count"));
  return {
    keyword: params.get("q") || "",
    filters: Object.fromEntries(searchFilterKeys.map(key => {const values=selectedValues(params.getAll(key));return [key,key==='sort'?values[0]||'':values.length>1?values:values[0]||''];})),
    onlySaved: params.get("saved") === "1",
    limit: Number.isInteger(count) && count >= 24 ? Math.min(count, 1000) : 24,
  };
}
export function writeSearchLocation(search, state) {
  const params = new URLSearchParams(search);
  const values = { q: state.keyword, ...state.filters, saved: state.onlySaved ? "1" : "", count: state.limit > 24 ? String(state.limit) : "" };
  for (const [key, value] of Object.entries(values)) {
    params.delete(key);
    for(const item of selectedValues(value))params.append(key,item);
  }
  return params.size ? `?${params}` : "";
}
