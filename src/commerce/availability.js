import holds from './generated/availability-holds.json' with {type: 'json'};
export function purchaseUnavailable(id) { return holds.records[id]?.purchaseBlocked === true; }
export function imageDisplayUnavailable(id) { return holds.records[id]?.hideImage === true; }
export function unavailableSearchLink(item) {
  return {sakeId: item.id, provider: 'rakuten', destinationType: 'search_results', matchType: 'search', isAffiliate: false,
    url: 'https://search.rakuten.co.jp/search/mall/' + encodeURIComponent(item.productName) + '/', label: '楽天でこの銘柄を探す'};
}
