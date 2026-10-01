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

function includesAny(values, words) {
  const text = values.filter(Boolean).join("、");
  return words.some((word) => text.includes(word));
}

function slugHash(value) {
  let hash = 2166136261;
  for (const char of String(value)) {
    hash ^= char.codePointAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function toPathSegment(value) {
  const raw = String(value).trim();
  const readable = raw
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 42);
  return `${readable || "item"}-${slugHash(raw)}`;
}

export function fromPathSegment(value) {
  try {
    return decodeURIComponent(String(value).replace(/-/g, " "));
  } catch {
    return String(value);
  }
}

function findOptionBySlug(options, slug) {
  const decoded = fromPathSegment(slug);
  return options.find((name) => toPathSegment(name) === slug) || options.find((name) => name === decoded);
}

export function getSakeById(id) {
  return visibleSakePairings.find((item) => item.id === id);
}

export function getNightBySlug(slug) {
  const name = findOptionBySlug(getNightOptions(), slug);
  if (!name) return null;
  const items = visibleSakePairings.filter((item) => item.nightType === name);
  return items.length ? { name, items } : null;
}

export function getFoodBySlug(slug) {
  const name = findOptionBySlug(getFoodOptions(), slug);
  if (!name) return null;
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
  const profile = getFoodProfile(dish);

  if (!profile.recipeUrl) return [];

  return [
    {
      label: profile.recipeLabel || "作り方を見る ↗",
      href: profile.recipeUrl,
      provider: profile.recipeProvider || "recipe",
    },
  ];
}

export function buildPairingReason(item, dish = "家庭料理") {
  const tastes = item.taste || [];
  const styles = item.style || [];
  const profile = [...tastes, ...styles];
  const has = (...words) => includesAny(profile, words);
  const dishCue = getDishPairingCue(dish);

  if (has("すっきり", "辛口", "キレ")) {
    return `${dishCue}を重くせず、すっきりした後口が油分や塩気を軽く整えます。食事の途中でも飲み進めやすい組み合わせです。`;
  }

  if (has("酸味", "爽やか", "軽やか")) {
    return `${dishCue}にほどよい酸が重なり、味をきゅっと引き締めます。口の中が重くなりにくく、次のひと口へ自然につながります。`;
  }

  if (has("米の旨味", "旨口", "純米", "食中酒")) {
    return `${dishCue}を、米の旨みが穏やかに受け止めます。派手すぎず、家庭料理に合わせやすい相性です。`;
  }

  if (has("フルーティ", "華やか", "甘み")) {
    return `${dishCue}に、やさしい香りと甘みが重なります。味をふくらませながら、食卓を少し華やかにしてくれます。`;
  }

  if (has("燗向き", "濃醇", "熟成")) {
    return `${dishCue}に、コクのある味わいがよくなじみます。温めても味がぼやけにくく、料理との一体感が出やすい組み合わせです。`;
  }

  return `${dishCue}を邪魔せず、穏やかな香りと後口が食事を支えます。日常の食卓で試しやすい組み合わせです。`;
}

const recipeDataByDish = {
  肉じゃが: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E8%82%89%E3%81%98%E3%82%83%E3%81%8C",
    recipeLabel: "肉じゃがの作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約30分",
    servings: "2〜3人分",
  },
  冷奴: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E5%86%B7%E5%A5%B4",
    recipeLabel: "冷奴の作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約5分",
    servings: "1〜2人分",
  },
  鶏の唐揚げ: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E9%B6%8F%E3%81%AE%E5%94%90%E6%8F%9A%E3%81%92",
    recipeLabel: "鶏の唐揚げの作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約30分",
    servings: "2〜3人分",
  },
  焼き魚: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E7%84%BC%E3%81%8D%E9%AD%9A",
    recipeLabel: "焼き魚の作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約15分",
    servings: "1〜2人分",
  },
  餃子: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E9%A4%83%E5%AD%90",
    recipeLabel: "餃子の作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約40分",
    servings: "2〜3人分",
  },
  おでん: {
    recipeUrl: "https://www.kurashiru.com/search?query=%E3%81%8A%E3%81%A7%E3%82%93",
    recipeLabel: "おでんの作り方を見る ↗",
    recipeProvider: "kurashiru",
    cookingTime: "約60分",
    servings: "3〜4人分",
  },
};

function getDishPairingCue(dish = "家庭料理") {
  if (dish.includes("冷奴") || dish.includes("豆腐")) {
    return `${dish}の淡い旨みや薬味の香り`;
  }
  if (dish.includes("唐揚げ") || dish.includes("揚げ") || dish.includes("天ぷら") || dish.includes("フライ")) {
    return `${dish}の香ばしさと油分`;
  }
  if (dish.includes("焼き魚") || dish.includes("塩焼き") || dish.includes("干物")) {
    return `${dish}の焼き目の香ばしさと塩気`;
  }
  if (dish.includes("煮") || dish.includes("肉じゃが") || dish.includes("筑前煮") || dish.includes("おでん")) {
    return `${dish}のだしや甘辛い味付け`;
  }
  if (dish.includes("刺身") || dish.includes("たたき") || dish.includes("カルパッチョ")) {
    return `${dish}の淡い旨み`;
  }
  if (dish.includes("酢") || dish.includes("南蛮") || dish.includes("マリネ") || dish.includes("梅")) {
    return `${dish}の酸味や香り`;
  }
  if (dish.includes("鍋") || dish.includes("湯豆腐")) {
    return `${dish}の温かいだし`;
  }
  if (dish.includes("照り焼き") || dish.includes("生姜焼き") || dish.includes("炒め")) {
    return `${dish}の香ばしさと甘辛さ`;
  }

  return `${dish}の味わい`;
}

function buildFoodDescription(name = "家庭料理") {
  if (name.includes("冷奴") || name.includes("豆腐")) {
    return `${name}は、豆腐のやさしい味を薬味やたれで楽しむ一品です。食卓の最初にも、軽い晩酌にも合わせやすい家庭料理です。`;
  }
  if (name.includes("唐揚げ") || name.includes("揚げ") || name.includes("フライ")) {
    return `${name}は、香ばしさとほどよい油分が魅力の一皿です。後口を整える日本酒を合わせると、食べ進めやすくなります。`;
  }
  if (name.includes("焼き魚") || name.includes("塩焼き") || name.includes("干物")) {
    return `${name}は、焼き目の香ばしさと塩気を楽しむ定番の家庭料理です。すっきりした酒や米の旨みがある酒とよく合います。`;
  }
  if (name.includes("煮") || name.includes("肉じゃが") || name.includes("筑前煮") || name.includes("おでん")) {
    return `${name}は、だしや甘辛い味付けがしみた家庭料理です。米の旨みやコクのある日本酒が、味を受け止めてくれます。`;
  }
  if (name.includes("刺身") || name.includes("たたき") || name.includes("カルパッチョ")) {
    return `${name}は、素材の旨みをそのまま楽しむ一品です。香りが強すぎず、後口のきれいな日本酒を選ぶと合わせやすいです。`;
  }
  if (name.includes("酢") || name.includes("南蛮") || name.includes("マリネ") || name.includes("梅")) {
    return `${name}は、酸味や香りでさっぱり食べられる一品です。酸のある日本酒や軽やかなタイプと合わせると、味がまとまります。`;
  }
  if (name.includes("鍋") || name.includes("湯豆腐")) {
    return `${name}は、温かいだしと具材の旨みを楽しむ料理です。常温や燗でもおいしい日本酒を合わせると、食卓が落ち着きます。`;
  }
  if (name.includes("照り焼き") || name.includes("生姜焼き") || name.includes("炒め")) {
    return `${name}は、香ばしさと甘辛い味付けが食欲を誘う一皿です。キレのある酒や旨みのある酒が、味の濃さを整えます。`;
  }

  return `${name}は、日々の食卓に取り入れやすい家庭料理です。味付けや食感に合わせて、日本酒の香り、旨み、後口を選ぶと楽しみやすくなります。`;
}

function chooseById(item, values) {
  const seed = Array.from(item.id || item.sake || "").reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return values[seed % values.length];
}

export function getFoodProfile(name) {
  const recipeData = recipeDataByDish[name] || {};

  return {
    name,
    description: buildFoodDescription(name),
    ingredients: [],
    instructions: [],
    cookingTime: recipeData.cookingTime || "",
    servings: recipeData.servings || "",
    recipeUrl: recipeData.recipeUrl || "",
    recipeLabel: recipeData.recipeLabel || "",
    recipeProvider: recipeData.recipeProvider || "",
  };
}

export function buildSakeDescription(item, focusDish = "") {
  const profile = [...(item.taste || []), ...(item.style || [])];
  const dishes = focusDish ? [focusDish] : (item.dishes || []).slice(0, 2);
  const dishText = focusDish || (dishes.length ? `${dishes.join("や")}など` : "普段の家庭料理");
  const dishCue = focusDish ? getDishPairingCue(focusDish) : `${dishText}の香ばしさや塩気`;
  const temperatureText = (item.temperature || []).slice(0, 2).join("、");

  if (includesAny(profile, ["すっきり", "辛口", "キレ"])) {
    return chooseById(item, [
      `後口のキレがよく、食事中でも飲み進めやすい日本酒です。${dishText}に合わせると、塩気や油分を軽く整えてくれます。`,
      `すっきりした飲み口で、料理の味を重くしにくいタイプです。${dishCue}にも合わせやすいです。`,
      `辛口寄りの輪郭があり、食事の途中で口の中を整えてくれます。${dishText}と合わせると、後味がだれにくくなります。`,
    ]);
  }
  if (includesAny(profile, ["酸味", "爽やか", "軽やか"])) {
    return chooseById(item, [
      `ほどよい酸味があり、口当たりは軽快です。${dishText}と合わせると、味を引き締めながらさっぱり楽しめます。`,
      `軽やかな酸があり、飲み口に清潔感があります。${dishText}の旨みを引き立てつつ、後味をすっきりまとめます。`,
      `爽やかな酸味が持ち味で、濃すぎない料理と相性のよいタイプです。${dishText}にも自然になじみます。`,
    ]);
  }
  if (includesAny(profile, ["米の旨味", "旨口", "純米", "食中酒"])) {
    return chooseById(item, [
      `米の旨みを穏やかに感じられる、食卓向きの味わいです。${dishText}のだしや甘辛い味付けにも合わせやすい一本です。`,
      `派手すぎない旨みがあり、食事に寄り添うタイプです。${dishText}の味を受け止めながら、飲み疲れしにくく楽しめます。`,
      `ふくらみのある旨みが特徴で、家庭料理に合わせやすい日本酒です。${dishText}と合わせると、味のまとまりが出ます。`,
    ]);
  }
  if (includesAny(profile, ["フルーティ", "華やか", "甘み"])) {
    return chooseById(item, [
      `香りが華やかで、やさしい甘みを楽しめます。${dishText}と合わせると、食卓に少し明るい印象を添えてくれます。`,
      `果実感のある香りがあり、飲み始めから親しみやすい味わいです。${dishText}にも軽やかに重なります。`,
      `甘みと香りのバランスがよく、単体でも料理と一緒でも楽しめます。${dishText}と合わせると、味がやわらぎます。`,
    ]);
  }
  if (includesAny(profile, ["燗向き", "濃醇", "熟成", "山廃"])) {
    return chooseById(item, [
      `コクのある味わいで、${temperatureText || "常温や燗"}でも輪郭が崩れにくいタイプです。${dishText}の旨みとよくなじみます。`,
      `しっかりした旨みがあり、温度を少し上げても楽しみやすい日本酒です。${dishText}のような味のある料理に向きます。`,
      `落ち着いたコクがあり、食事と合わせてじっくり飲みたいタイプです。${dishText}と合わせると、味に厚みが出ます。`,
    ]);
  }

  return chooseById(item, [
    `穏やかな香りと飲みやすい後口を持つ日本酒です。${dishText}に合わせやすく、日々の食卓で試しやすい一本です。`,
    `香りと味の主張が強すぎず、料理と合わせて楽しみやすいタイプです。${dishText}にも無理なく寄り添います。`,
    `飲み口のまとまりがよく、普段の食卓に置きやすい日本酒です。${dishText}と合わせると、食事の流れが自然になります。`,
  ]);
}

export function buildYoiCopy(item) {
  const label = item.nightType || "食卓に、静かな一献を。";
  return label.length > 18 ? `${label.slice(0, 18)}…` : label;
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
