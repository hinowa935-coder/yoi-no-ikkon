export const PROVIDERS = {
  amazon: { name: "Amazon Associates", marketplaces: ["amazon"], hosts: ["www.amazon.co.jp", "amazon.co.jp", "amzn.to"] },
  rakuten: { name: "楽天アフィリエイト", marketplaces: ["rakuten"], hosts: ["hb.afl.rakuten.co.jp", "a.r10.to"] },
  moshimo: { name: "もしもアフィリエイト", marketplaces: ["amazon", "rakuten", "merchant"], hosts: ["af.moshimo.com"] },
  valuecommerce: { name: "バリューコマース", marketplaces: ["yahoo", "merchant"], hosts: ["ck.jp.ap.valuecommerce.com"] },
  a8: { name: "A8.net", marketplaces: ["amazon", "rakuten", "merchant"], hosts: ["px.a8.net", "rpx.a8.net"] },
  merchant: { name: "提携酒販店", marketplaces: ["merchant", "yahoo"], hosts: [] },
};

export const MARKETPLACES = { amazon: "Amazon", rakuten: "楽天市場", yahoo: "Yahoo!ショッピング", merchant: "販売店" };
export const AMAZON_DISCLOSURE = "Amazon のアソシエイトとして、宵の一献は適格販売により収入を得ています。";

export function readCommerceConfig(env = {}) {
  return {
    enabled: env.AFFILIATE_ENABLED === "true",
    registeredSite: env.AFFILIATE_REGISTERED_SITE,
    enabledProviders: Object.keys(PROVIDERS).filter(id => env[`AFFILIATE_${id.toUpperCase()}_ENABLED`] === "true"),
    routes: {
      amazon: env.AFFILIATE_AMAZON_ROUTE || "none",
      rakuten: env.AFFILIATE_RAKUTEN_ROUTE || "none",
      yahoo: env.AFFILIATE_YAHOO_ROUTE || "none",
    },
  };
}
