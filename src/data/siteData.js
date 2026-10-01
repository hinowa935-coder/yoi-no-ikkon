import { extraSakePairings } from "./extraSakePairings.js";
import { reviewPairingProduct } from "./sakePairingReview.js";
import { sakePairings } from "./sakePairings.js";

export const SITE_URL = "https://yoi-no-ikkon.vercel.app";
export const SITE_NAME = "宵の一献";
export const FAVORITES_KEY = "yoi-no-ikkon-favorites";

export const prefectureOrder = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
];

export const dishOptions = [
  "焼き魚",
  "煮魚",
  "刺身",
  "揚げ物",
  "煮物",
  "炒め物",
  "鍋物",
  "豆腐料理",
  "鶏料理",
  "豚肉料理",
  "ご飯もの",
  "家庭料理",
];

export const moodOptions = [
  "疲れた夜",
  "一人飲み",
  "静かな晩酌",
  "軽く飲みたい",
  "しっかり食べたい",
  "あたたまりたい",
  "さっぱりしたい",
  "家族の食卓",
  "友人と飲む",
  "週末",
  "雨の日",
  "気分を変えたい",
  "祝い",
];

export const tasteOptions = [
  "すっきり",
  "辛口",
  "酸味",
  "米の旨味",
  "食中酒",
  "やわらか",
  "甘み",
  "フルーティ",
  "華やか",
  "旨口",
  "燗向き",
  "濃醇",
];

export const curatedNightOptions = [
  "雨あがりの宵",
  "雨夜に寄り添う",
  "雪夜の静けさ",
  "秋夜の余韻",
  "花宵の気配",
  "月影に憩う",
  "月冴ゆる一献",
  "月灯りの余白",
  "月明のやすらぎ",
  "古灯の夜",
  "更けゆく余白",
  "冴ゆる宵口",
  "宵闇にほどける",
  "宵霞の余白",
  "宵待ちの杯",
  "宵涼みの一杯",
  "小夜のひと息",
  "小夜風の杯",
  "新月の軽やかさ",
  "深宵の語らい",
  "星明かりの杯",
  "星涼みの杯",
  "清宵の乾杯",
  "静寂の一献",
  "静謐の一献",
  "雪待ちの杯",
  "淡夜のやすらぎ",
  "灯下のぬくもり",
  "灯火親しむ夜",
  "薄明の余韻",
  "風待ちの一献",
  "夜雨のやさしさ",
  "夜更けの安堵",
  "夜風の一杯",
  "夜霧のひと息",
  "夜明け前の余韻",
  "露夜のやすらぎ",
];

export const nightMoodOptions = [
  {
    label: "疲れた夜",
    night: "夜更けの安堵",
    description: "やわらかく落ち着く一献へ",
  },
  {
    label: "ゆっくりしたい夜",
    night: "月明のやすらぎ",
    description: "余韻を急がず楽しむ一献へ",
  },
  {
    label: "ちょっと贅沢したい夜",
    night: "夜半の褒美酒",
    description: "香りと余韻に浸る一献へ",
  },
  {
    label: "ひとりで静かに飲みたい夜",
    night: "静謐の一献",
    description: "静けさに寄り添う一献へ",
  },
  {
    label: "誰かと飲みたい夜",
    night: "深宵の語らい",
    description: "会話のそばに置きたい一献へ",
  },
  {
    label: "しっかり食べたい夜",
    night: "灯下のぬくもり",
    description: "食卓をあたたかく支える一献へ",
  },
  {
    label: "軽く一杯だけ飲みたい夜",
    night: "小夜のひと息",
    description: "軽やかに整う一献へ",
  },
  {
    label: "さっぱり気分を変えたい夜",
    night: "夜風の一杯",
    description: "涼やかに抜ける一献へ",
  },
  {
    label: "雨音を聞きながら飲む夜",
    night: "雨夜に寄り添う",
    description: "しっとりした余白の一献へ",
  },
  {
    label: "週末を静かに迎える夜",
    night: "宵待ちの杯",
    description: "ゆっくり始める一献へ",
  },
];

const rawVisibleSakePairings = sakePairings
  .filter((item) => item.prefecture !== "沖縄県")
  .concat(extraSakePairings);

export const visibleSakePairings = rawVisibleSakePairings.map(reviewPairingProduct);

export function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

export function toPathSegment(value) {
  return encodeURIComponent(String(value).trim().replace(/\s+/g, "-"));
}

export function fromPathSegment(value) {
  return decodeURIComponent(String(value).replace(/-/g, " "));
}

export function getSakeById(id) {
  return visibleSakePairings.find((item) => item.id === id);
}

export function getNightBySlug(slug) {
  const name = fromPathSegment(slug);
  const items = visibleSakePairings.filter((item) => item.nightType === name);
  return items.length ? { name, items } : null;
}

export function getFoodBySlug(slug) {
  const name = fromPathSegment(slug);
  const items = visibleSakePairings.filter((item) => item.dishes?.includes(name));
  return items.length ? { name, items } : null;
}

export function getNightOptions() {
  const existing = unique(visibleSakePairings.map((item) => item.nightType));
  return curatedNightOptions
    .filter((option) => existing.includes(option))
    .concat(existing.filter((option) => !curatedNightOptions.includes(option)));
}

export function getNightMoodOptions() {
  const existing = getNightOptions();
  const entries = nightMoodOptions.filter((entry) => existing.includes(entry.night));

  return entries.length
    ? entries
    : existing.map((night) => ({
        label: night,
        night,
        description: "その夜に似合う一献へ",
      }));
}

export function getNightMoodEntry(name) {
  return getNightMoodOptions().find((entry) => entry.night === name) || null;
}

export function getFoodOptions() {
  return unique(visibleSakePairings.flatMap((item) => item.dishes || [])).sort(
    (a, b) => a.localeCompare(b, "ja"),
  );
}

export function getRelatedByNight(name, limit = 8) {
  return visibleSakePairings
    .filter((item) => item.nightType === name)
    .slice(0, limit);
}

export function getRelatedByFood(name, limit = 8) {
  return visibleSakePairings
    .filter((item) => item.dishes?.includes(name))
    .slice(0, limit);
}

export function getRelatedSake(item, limit = 6) {
  return visibleSakePairings
    .filter(
      (candidate) =>
        candidate.id !== item.id &&
        (candidate.nightType === item.nightType ||
          candidate.prefecture === item.prefecture ||
          candidate.dishes?.some((dish) => item.dishes?.includes(dish))),
    )
    .slice(0, limit);
}

export function safeHost(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function isInstagramUrl(url) {
  return Boolean(url && url.includes("instagram.com"));
}

export function isSameSite(leftUrl, rightUrl) {
  const leftHost = safeHost(leftUrl);
  const rightHost = safeHost(rightUrl);
  return Boolean(leftHost && rightHost && leftHost === rightHost);
}

export function buildResourceLinks(item) {
  const links = [];
  const seen = new Set();

  const push = (label, href, provider = "official") => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    links.push({ label, href, provider });
  };

  push(
    isInstagramUrl(item.officialUrl) ? "公式Instagram" : "公式サイト",
    item.officialUrl,
    isInstagramUrl(item.officialUrl) ? "instagram" : "official",
  );
  push("公式Instagram", item.instagramUrl, "instagram");
  push(
    isInstagramUrl(item.productUrl)
      ? "公式Instagram"
      : isSameSite(item.productUrl, item.officialUrl)
        ? "公式ラインナップ"
        : "参考リンク",
    item.productUrl,
    isInstagramUrl(item.productUrl)
      ? "instagram"
      : isSameSite(item.productUrl, item.officialUrl)
        ? "official_lineup"
        : "reference",
  );
  if (links.length === 0) push("Webで探す", item.webSearchUrl, "search");

  return links;
}

export function buildRecipeLinks(dish) {
  const encodedDish = encodeURIComponent(dish);

  return [
    {
      label: "クラシルで作り方を見る",
      href: `https://www.kurashiru.com/search?query=${encodedDish}`,
      provider: "kurashiru",
    },
    {
      label: "DELISH KITCHENで作り方を見る",
      href: `https://delishkitchen.tv/search?q=${encodedDish}`,
      provider: "delish_kitchen",
    },
  ];
}

export function buildPairingReason(item, dish = "家庭料理") {
  const tastes = item.taste || [];
  const styles = item.style || [];
  const profile = [...tastes, ...styles].join("、");
  const has = (...words) => words.some((word) => profile.includes(word));

  if (has("すっきり", "辛口", "キレ")) {
    return `${dish}の味を重くせず、すっきりした後口が油分や塩気を軽く整えます。食事の途中でも飲み進めやすい組み合わせです。`;
  }

  if (has("酸味", "爽やか", "軽やか")) {
    return `${dish}の旨みを、ほどよい酸が明るく引き締めます。口の中が重くなりにくく、次のひと口へ自然につながります。`;
  }

  if (has("米の旨味", "旨口", "純米", "食中酒")) {
    return `${dish}の甘みやだしの風味を、米の旨みが穏やかに受け止めます。派手すぎず、家庭料理に寄り添いやすい相性です。`;
  }

  if (has("フルーティ", "華やか", "甘み")) {
    return `${dish}に、やさしい香りと甘みが重なります。味わいをふくらませながら、食卓に少し華やかな余韻を添えます。`;
  }

  if (has("燗向き", "濃醇", "熟成")) {
    return `${dish}の温かみやコクに、ふくらみのある味わいがよくなじみます。ゆっくり飲むほど、料理との一体感が増す組み合わせです。`;
  }

  return `${dish}の味わいを邪魔せず、穏やかな香りと後口が食事に寄り添います。日常の食卓で試しやすい組み合わせです。`;
}

export function polishEssay(text = "") {
  return text
    .replaceAll("甘酸の調べが口中を明るくし、", "甘酸の調べがすっとほどけ、")
    .replaceAll("明るい酸の余白", "澄んだ酸の余白")
    .replaceAll("丸いコクが静かに口中を満たし、", "丸いコクが静かに広がり、")
    .replaceAll("澄んだ吟香が口中を軽く満たし、", "澄んだ吟香がふわりと広がり、")
    .replaceAll("清い酸味が舌先に光り、", "澄んだ酸味が軽やかに立ち、")
    .replaceAll("みずみずしい甘みが舌先で弾み、", "みずみずしい甘みが軽く弾み、")
    .replaceAll("落ち着いた厚みが喉もとにやさしく落ち、", "落ち着いた厚みがゆるやかに沈み、")
    .replaceAll("清らかな味筋が喉もとを抜け、", "清らかな味筋がすっと抜け、")
    .replaceAll("すっきりとした安堵を置く", "すっきりとした安堵を残す")
    .replaceAll("澄んだ酸の余白を残す", "澄んだ酸の余韻を残す")
    .replaceAll("軽やかな酸の線を引く", "澄んだ輪郭を残す")
    .replaceAll("すっと透明な線を引く", "透明な余韻を残す")
    .replaceAll("爽やかな余白をつくる", "爽やかな余韻を残す")
    .replaceAll("丸い余白をつくる", "まろやかな余韻を残す")
    .replaceAll("涼しい後味を連れていく", "涼やかな後味を残す")
    .replaceAll("軽い涼感を連れていく", "軽い涼感を残す")
    .replaceAll("穏やかな満足を残す", "穏やかな充足を残す")
    .replaceAll("清い輪郭を置く", "澄んだ輪郭を残す")
    .replaceAll("上品な甘みが明るくほどけ、", "上品な甘みがふわりとほどけ、")
    .replaceAll("深い旨みが温度の中でほどけ、", "深い旨みが燗の温度でほどけ、")
    .replaceAll("穏やかな熟成感が酸の芯を立て、", "穏やかな熟成感に酸の芯が通り、");
}

export function getSiteStats() {
  return {
    rawSakeCount: sakePairings.length,
    visibleBaseCount: sakePairings.filter((item) => item.prefecture !== "沖縄県").length,
    extraCount: extraSakePairings.length,
    visibleSakeCount: visibleSakePairings.length,
    breweries: unique(visibleSakePairings.map((item) => item.brewery)).length,
    prefectures: unique(visibleSakePairings.map((item) => item.prefecture)).length,
    regions: unique(visibleSakePairings.map((item) => item.region)).length,
    dishLinks: visibleSakePairings.flatMap((item) => item.dishes || []).length,
    uniqueDishes: getFoodOptions().length,
    dishCategories: unique(visibleSakePairings.flatMap((item) => item.dishCategories || [])).length,
    tastes: unique(visibleSakePairings.flatMap((item) => item.taste || [])).length,
    styles: unique(visibleSakePairings.flatMap((item) => item.style || [])).length,
    moods: unique(visibleSakePairings.flatMap((item) => item.moods || [])).length,
    nightTags: unique(visibleSakePairings.map((item) => item.nightType)).length,
    temperatures: unique(visibleSakePairings.flatMap((item) => item.temperature || [])).length,
  };
}

export function trackEvent(name, parameters = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...parameters });

  if (typeof window.plausible === "function") {
    window.plausible(name, { props: parameters });
  }
}
