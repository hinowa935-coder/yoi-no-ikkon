import "server-only";
import registry from "./registry.json";
import { SITE_URL, visibleSakePairings, buildPurchaseLinks } from "../data/siteData.js";
import { readCommerceConfig } from "./providers.js";
import { projectOffers, projectLabelImage } from "./validation.js";
import { productFingerprint } from "./validation.js";
import discovery from "./generated/discovery-links.json";
import { projectSearchOffers } from "./searchOffers.js";
import { readLocalPilotRegistry } from "./localPilot.js";
import { readLocalCommercialRegistry, projectLocalCommercialOffers } from "./localCommercial.js";
import releaseApprovals from "./release-approvals.json";
import { releaseApprovedOffer, selectPurchaseLinks } from "./purchaseRouting.js";
import rakutenStagedLinks from "./rakuten-staged-links.json";
import { rakutenStagedState } from "./rakutenLifecycle.js";
import { projectApprovedRakutenLink } from "./rakutenActivation.js";
import finalApprovals from './generated/commerce-final-approvals.json';
import {projectFinalCommerce} from './finalCommerce.js';

// Server components only: credentials and review records never reach client props.
export function commerceForSake(item) {
  const config = readCommerceConfig(process.env);
  if (config.registeredSite !== `${SITE_URL}/`) config.enabled = false;
  const activeRegistry = readLocalPilotRegistry(process.env, process.env.NODE_ENV) || registry;
  const exactOffers = projectOffers(item, activeRegistry, config, process.env);
  const searchOffers = projectSearchOffers(item, activeRegistry, config, process.env);
  const localCommercial = projectLocalCommercialOffers(item, readLocalCommercialRegistry(process.env, process.env.NODE_ENV), config, process.env, process.env.NODE_ENV);
  const approvedRakuten = projectApprovedRakutenLink(item, rakutenStagedLinks, releaseApprovals, config, process.env);
  const final=projectFinalCommerce(item,config);
  const finalOffer=final.offer;
  const commercialOffers = approvedRakuten ? [approvedRakuten] : finalOffer ? [finalOffer] : localCommercial;
  const directOffers = [...exactOffers, ...commercialOffers.filter(c => !exactOffers.some(o => o.marketplace === c.marketplace))];
  const projected = [...directOffers, ...searchOffers.filter(s => !directOffers.some(o => o.marketplace === s.marketplace))];
  const offers = process.env.NODE_ENV === "development" ? projected : projected
    .map(o => releaseApprovedOffer(item, o, releaseApprovals, config.registeredSite)||releaseApprovedOffer(item,o,finalApprovals,config.registeredSite)).filter(Boolean);
  const record = discovery[item.id];
  const disabled = (process.env.PURCHASE_DISCOVERY_DISABLED_PROVIDERS || "").split(",").map(s => s.trim());
  const links = process.env.PURCHASE_DISCOVERY_ENABLED === "false" || record?.productFingerprint !== productFingerprint(item) ? [] :
    record.links.filter(link => Date.parse(link.validUntil) > Date.now() && !disabled.includes(link.provider));
  const staged = rakutenStagedState(item, rakutenStagedLinks);
  const matchedNormal=final.normal;
  const registeredNormal=buildPurchaseLinks(item).filter(l=>!l.href.includes('item.rakuten.co.jp')||matchedNormal.length);
  const officialUrl=item.officialUrl||item.productUrl;
  const officialLink=officialUrl?[{sakeId:item.id,url:officialUrl,provider:'merchant',matchType:'official',destinationType:'official_site',isAffiliate:false,label:'蔵元・取扱店を見る'}]:[];
  const purchase = selectPurchaseLinks(item, { offers, normalProducts: [...matchedNormal,...registeredNormal, ...(staged?.normalProducts || [])],
    discoveryLinks: [...links,...officialLink], stagedStatuses: staged ? { rakuten: staged.status } : {} });
  let image = projectLabelImage(item, activeRegistry, exactOffers, Date.now(), process.env, config);
  if (image?.isAdvertisement && process.env.NODE_ENV !== "development") {
    image = releaseApprovedOffer(item, image, releaseApprovals, config.registeredSite);
  }
  return { ...purchase, discoveryLinks: purchase.normalLinks, image };
}
export function commerceDisclosureState() {
  const activeRegistry = readLocalPilotRegistry(process.env, process.env.NODE_ENV) || registry;
  if (!activeRegistry.offers.length && !(activeRegistry.searchOffers || []).length && !activeRegistry.images.some(i => i.permission?.isAdvertisement) &&
      !readLocalCommercialRegistry(process.env, process.env.NODE_ENV)?.commercialOffers.length && !releaseApprovals.links.length && !finalApprovals.links.length) return { active: false, amazon: false, rakuten:false };
  let active = false;
  let rakuten = false;
  let amazon = false;
  for (const item of visibleSakePairings) {
    const { offers, image } = commerceForSake(item);
    if (offers.length || image?.isAdvertisement) active = true;
    if (offers.some(o => o.marketplace === "amazon")) amazon = true;
    if (offers.some(o => o.marketplace === "rakuten")) rakuten = true;
  }
  return { active, amazon, rakuten };
}
