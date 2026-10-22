import {visiblePurchaseLinks, purchaseProvider} from '../commerce/purchasePresentation.js';

export function namesSummary(items, budget = 22) {
  const names = items.map(item => typeof item === 'string' ? item : item?.name).filter(name => typeof name === 'string' && name.trim() && !['-', '不明', 'null', 'undefined'].includes(name.trim()));
  if (!names.length) return '';
  let shown = names.slice(0, 3);
  while (shown.length > 1 && shown.join('・').length > budget) shown = shown.slice(0, -1);
  return shown.join('・') + (names.length > shown.length ? ` ほか${names.length - shown.length}品` : '');
}

export function specsSummary(essentials) {
  const text = essentials.filter(([label]) => ['特定名称', '精米歩合'].includes(label))
    .map(([label, value]) => label === '精米歩合' ? `精米歩合${value}` : value).join('・');
  return text && text.length <= 30 ? text : '酒質・原料米・温度を見る';
}

export function purchaseSummary({offers = [], discoveryLinks = []}) {
  const links = visiblePurchaseLinks([...offers, ...discoveryLinks]);
  if (!links.length) return '';
  const products = links.filter(link => link.destinationType === 'product_page');
  const providers = [...new Set(products.map(purchaseProvider))];
  if (providers.includes('rakuten')) return providers.length > 1 ? '楽天ほか商品ページあり' : '楽天の商品ページあり';
  if (providers.includes('amazon')) return providers.length > 1 ? 'Amazonほか商品ページあり' : 'Amazonの商品ページあり';
  if (products.length) return '蔵元・販売店の商品ページを見る';
  return '販売店・購入先を探す';
}
