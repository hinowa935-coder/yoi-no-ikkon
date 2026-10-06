import refs from "./favoriteReferences.json" with { type: "json" };
export const FAVORITES_KEY = "yoi-no-ikkon-favorites";
export function resolveFavorite(id) {
  if (refs.activeIds.includes(id)) return { status: "active", canonicalId: id };
  return refs.references.find(entry => entry.legacyId === id) || { status: "unknown" };
}
export function migrateFavorites(ids) {
  if (!Array.isArray(ids)) return [];
  return [...new Set(ids.filter(id => typeof id === "string").map(id => {
    const ref = resolveFavorite(id);
    return ref.status === "same_product_alias" ? ref.canonicalId : id;
  }))];
}
