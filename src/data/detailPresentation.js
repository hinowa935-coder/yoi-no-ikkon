const sourceHost = url => {
  try { const parsed = new URL(url); return /^https?:$/.test(parsed.protocol) ? parsed.hostname.replace(/^www\./, "") : ""; }
  catch { return ""; }
};

export function detailSourceLabel(source) {
  const host = sourceHost(source.url);
  if (host === "sakenomy.jp") return source.scope === "brewery_identity_only" || new URL(source.url).pathname.startsWith('/brewery/') ? "Sakenomyの蔵元情報" : "Sakenomyの商品情報";
  if (host === "meimonshu.jp" || host.endsWith(".meimonshu.jp")) return "日本名門酒会の商品情報";
  if (host === "jp.sake-times.com" || host === "sake-times.com") return "SAKETIMESの記事";
  if (host === "item.rakuten.co.jp") return "楽天販売店の商品情報";
  if (source.type === "breweryOfficial") return source.scope === "brewery_identity_only" ? "蔵元公式サイト" : "蔵元公式の商品情報";
  if (source.type === "retailer") return "専門酒販店の商品情報";
  if (source.type === "industry") return "酒造団体の商品情報";
  if (source.type === "government") return "公的機関の商品情報";
  return "専門資料の商品情報";
}

export function detailReferences(sources = [], links = [], merchant = {}) {
  const breweryLinks = [], productSources = [], seen = new Set();
  const add = (target, url, label, metadata) => {
    const host = sourceHost(url);
    if (!host || seen.has(url)) return;
    seen.add(url); target.push({ ...metadata, url, label, host });
  };
  for (const link of links) {
    const referenceOnly = merchant.type === "E" && merchant.originalUrl === link.href;
    if (!referenceOnly && /公式サイト|公式Instagram|蔵元情報/.test(link.label)) add(breweryLinks, link.href, link.label === "蔵元公式サイト" ? "公式サイトを見る" : link.label, link);
  }
  for (const source of sources) add(productSources, source.url, detailSourceLabel(source), source);
  for (const link of links) add(productSources, link.href, merchant.type === "E" && merchant.originalUrl === link.href ? "出典・参考情報" : link.label, link);
  return { breweryLinks, productSources };
}
