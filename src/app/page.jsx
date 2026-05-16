"use client";

import { useEffect, useMemo, useState } from "react";
import { sakePairings } from "../data/sakePairings";

const ALL = "すべて";
const FAVORITES_KEY = "yoi-no-ikkon-favorites";

const dishOptions = [
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

const moodOptions = [
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

const tasteOptions = [
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

const curatedNightOptions = [
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

const prefectureOrder = [
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
  "沖縄県",
];

const searchFields = [
  { key: "dish", label: "料理", options: dishOptions },
  { key: "mood", label: "気分", options: moodOptions },
  { key: "area", label: "産地", options: prefectureOrder },
  { key: "taste", label: "味わい", options: tasteOptions },
];

function unique(values) {
  return Array.from(new Set(values.filter(Boolean)));
}

function includesKeyword(values, keyword) {
  if (!keyword || keyword === ALL) return true;
  return values.some((value) => String(value).includes(keyword));
}

function searchValues(item, key) {
  if (key === "dish") return [...item.dishes, ...item.dishCategories];
  if (key === "mood") return [...item.moods];
  if (key === "area") return [item.prefecture, item.region, item.areaGroup];
  if (key === "taste") return [...item.taste, ...item.style];
  if (key === "night") return [item.nightType];
  return [];
}

function dailyPick(list, count) {
  const today = new Date().toLocaleDateString("ja-JP", {
    timeZone: "Asia/Tokyo",
  });
  const seed = Array.from(today).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );

  return Array.from({ length: count }, (_, index) => {
    const position = (seed + index * 7) % list.length;
    return list[position];
  });
}

function OchokoIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
    >
      <path
        d="M6.5 9.5c.55 5.6 1.8 8 5.5 8s4.95-2.4 5.5-8"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
      <path
        d="M5.2 8.2c0 1.15 3.05 2.1 6.8 2.1s6.8-.95 6.8-2.1S15.75 6.1 12 6.1 5.2 7.05 5.2 8.2Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.8 17.2h6.4M9.7 19.1h4.6"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.7"
      />
      <path
        d="M9.7 8.05c.55-.25 1.35-.4 2.3-.4s1.75.15 2.3.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.2"
        opacity=".72"
      />
    </svg>
  );
}

function SakeCard({
  item,
  isFavorite,
  onToggleFavorite,
  initialExpanded = false,
  featured = false,
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const productHref = item.productUrl || item.officialUrl || item.webSearchUrl;

  return (
    <article
      className={`rounded-lg border bg-[#0b1729]/86 p-4 shadow-2xl shadow-black/20 sm:p-5 ${
        featured
          ? "border-[#d8bd7a]/45"
          : "border-[#f8f0df]/12"
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs leading-5 text-[#d8bd7a] sm:text-sm">
              {item.prefecture} / {item.region}
            </p>
            <h3 className="mt-1 text-xl font-medium leading-snug text-[#fff8e9] sm:text-2xl">
              {item.productName || item.sake}
            </h3>
            <p className="mt-1 text-sm leading-6 text-[#bdb5a5]">
              {item.brewery}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onToggleFavorite(item.id)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "お気に入りから外す" : "お気に入りに入れる"}
            title={isFavorite ? "お気に入りから外す" : "お気に入りに入れる"}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
              isFavorite
                ? "border-[#d8bd7a]/75 bg-[#d8bd7a]/18 text-[#f4d98e]"
                : "border-[#f8f0df]/16 text-[#d8d0bf] hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10 hover:text-[#fff4d8]"
            }`}
          >
            <OchokoIcon filled={isFavorite} />
          </button>
        </div>

        <span className="mt-3 inline-flex w-fit rounded-full border border-[#d8bd7a]/35 px-3 py-1 text-xs leading-none text-[#f2dfad]">
          {item.nightType}
        </span>
      </div>

      <p className="mt-4 border-l border-[#d8bd7a]/50 pl-4 text-sm leading-7 text-[#fff4d8] sm:text-base sm:leading-8">
        {item.essay}
      </p>

      <div className="mt-4 text-sm text-[#d8d0bf]">
        <p className="text-[#d8bd7a]">合う料理</p>
        <p className="mt-2 leading-7">{item.dishes.slice(0, 3).join("、")}</p>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
        className="mt-4 w-full rounded-lg border border-[#f8f0df]/12 px-4 py-2.5 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
      >
        {isExpanded ? "詳細を閉じる" : "詳細を見る"}
      </button>

      {isExpanded ? (
        <div className="mt-4 space-y-4 border-t border-[#f8f0df]/10 pt-4 text-sm text-[#d8d0bf]">
          <div>
            <p className="text-[#d8bd7a]">気分</p>
            <p className="mt-2 leading-7">{item.moods.join("、")}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-[#d8bd7a]">おすすめ温度</p>
              <p className="mt-2 leading-7">{item.temperature.join("、")}</p>
            </div>
            <div>
              <p className="text-[#d8bd7a]">味わい</p>
              <p className="mt-2 leading-7">{item.taste.slice(0, 4).join("、")}</p>
            </div>
          </div>
          <div>
            <p className="text-[#d8bd7a]">全料理</p>
            <p className="mt-2 leading-7">{item.dishes.join("、")}</p>
          </div>
          <a
            href={productHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex w-fit rounded-full border border-[#d8bd7a]/30 px-3 py-1.5 text-xs text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10 hover:text-[#fff8e9]"
          >
            {item.productUrl
              ? "商品を見る"
              : item.officialUrl
                ? "公式を見る"
                : "Webで探す"}
          </a>
        </div>
      ) : null}
    </article>
  );
}

export default function Page() {
  const [filters, setFilters] = useState({
    dish: ALL,
    mood: ALL,
    area: ALL,
    taste: ALL,
    night: ALL,
  });
  const [freeKeyword, setFreeKeyword] = useState("");
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(FAVORITES_KEY);
      if (saved) {
        setFavoriteIds(JSON.parse(saved));
      }
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  const nightOptions = useMemo(() => {
    const existing = unique(sakePairings.map((item) => item.nightType));
    return curatedNightOptions.filter((option) => existing.includes(option));
  }, []);

  const todayEntrances = useMemo(() => dailyPick(nightOptions, 3), [nightOptions]);

  const filteredItems = useMemo(() => {
    const keyword = freeKeyword.trim();

    return sakePairings.filter((item) => {
      if (showFavoritesOnly && !favoriteIds.includes(item.id)) {
        return false;
      }

      const structuredMatch = Object.entries(filters).every(([key, value]) =>
        includesKeyword(searchValues(item, key), value),
      );

      if (!structuredMatch) return false;
      if (!keyword) return true;

      const freeValues = [
        item.sake,
        item.productName,
        item.brewery,
        item.prefecture,
        item.region,
        item.areaGroup,
        item.nightType,
        item.essay,
        ...item.style,
        ...item.taste,
        ...item.moods,
        ...item.dishes,
        ...item.dishCategories,
      ];

      return freeValues.some((value) => String(value).includes(keyword));
    });
  }, [favoriteIds, filters, freeKeyword, showFavoritesOnly]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const toggleFavorite = (id) => {
    setFavoriteIds((current) => {
      const next = current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id];

      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <main className="min-h-screen bg-[#050914] text-[#fff8e9]">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#f8f0df]/10 pb-5">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#d8bd7a]">YOI NO IKKON</p>
            <p className="mt-2 text-2xl font-semibold">宵の一献</p>
          </div>
          <a
            href="#search"
            className="rounded-full border border-[#d8bd7a]/35 px-4 py-2 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
          >
            探す
          </a>
        </header>

        <section className="grid gap-7 py-8 lg:grid-cols-[1fr_280px] lg:items-start lg:py-10">
          <div className="space-y-8">
            <div>
              <p className="text-sm text-[#d8bd7a]">
                日本酒と家庭料理、夜の案内
              </p>
              <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight text-[#fff8e9] sm:text-6xl">
                宵の一献
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-[#d8d0bf] sm:text-lg">
                家庭料理、気分、産地、味わい、夜の気配から、今夜の食卓に似合う一本を探す。全国の酒蔵から、静かな言葉を添えて。
              </p>
            </div>

            <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
              <div className="border-l border-[#d8bd7a]/50 pl-4">
                <p className="text-2xl font-medium text-[#fff8e9] sm:text-3xl">
                  {sakePairings.length}本
                </p>
                <p className="mt-1 text-sm text-[#bdb5a5]">
                  今夜の候補を静かにめくる
                </p>
              </div>
              <div className="border-l border-[#d8bd7a]/50 pl-4">
                <p className="text-2xl font-medium text-[#fff8e9] sm:text-3xl">47都道府県</p>
                <p className="mt-1 text-sm text-[#bdb5a5]">
                  北から南へ、土地の香りを辿る
                </p>
              </div>
              <div className="border-l border-[#d8bd7a]/50 pl-4">
                <p className="text-2xl font-medium text-[#fff8e9] sm:text-3xl">
                  いつもの一皿
                </p>
                <p className="mt-1 text-sm text-[#bdb5a5]">
                  焼く、煮る、揚げる。家庭の味から
                </p>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[280px] justify-self-center rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-4 sm:justify-self-end">
            <div className="mb-4 overflow-hidden rounded-lg border border-[#f8f0df]/10 bg-[#020814]/45">
              <img
                src="/images/ochoko-moon-reflection-only.png"
                alt="おちょこに三日月が映るイラスト"
                className="h-32 w-full object-cover object-[center_72%] sm:h-36 lg:h-40"
              />
            </div>
            <p className="text-sm text-[#d8bd7a]">今宵の入り口</p>
            <div className="mt-4 space-y-3">
              {todayEntrances.map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setFilters({
                      dish: ALL,
                      mood: ALL,
                      area: ALL,
                      taste: ALL,
                      night: label,
                    });
                    setFreeKeyword("");
                    document
                      .getElementById("results")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="w-full rounded-lg border border-[#f8f0df]/12 bg-[#f8f0df]/5 px-4 py-4 text-left text-[#fff8e9] transition hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          id="search"
          className="grid gap-8 py-6 lg:grid-cols-[380px_1fr] lg:py-8"
        >
          <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <button
              type="button"
              onClick={() => setFiltersOpen((current) => !current)}
              className="flex w-full items-center justify-between rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 px-4 py-3 text-left text-sm text-[#f2dfad] lg:hidden"
            >
              <span>検索条件</span>
              <span>{filtersOpen ? "閉じる" : "開く"}</span>
            </button>

            <div
              className={`rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-4 sm:p-5 ${
                filtersOpen ? "block" : "hidden"
              } lg:block`}
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-[#d8bd7a]">今夜の一本を探す</p>
                <span className="text-xs text-[#bdb5a5]">
                  {filteredItems.length}本
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowFavoritesOnly((current) => !current);
                }}
                aria-pressed={showFavoritesOnly}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition ${
                  showFavoritesOnly
                    ? "border-[#d8bd7a]/70 bg-[#d8bd7a]/18 text-[#fff4d8]"
                    : "border-[#f8f0df]/12 text-[#f2dfad] hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
                }`}
              >
                <OchokoIcon filled={showFavoritesOnly} />
                {showFavoritesOnly
                  ? "おちょこを付けた酒だけ表示中"
                  : "おちょこを付けた酒だけ"}
              </button>

              <div className="mt-4 rounded-lg border border-[#f8f0df]/10 bg-[#020814]/45 p-3">
                <p className="text-sm text-[#d8bd7a]">組み合わせ条件</p>
                <div className="mt-3 grid gap-2">
                  {searchFields.map((field) => (
                    <label key={field.key} className="block">
                      <span className="mb-1 block text-xs text-[#bdb5a5]">
                        {field.label}
                      </span>
                      <select
                        value={filters[field.key]}
                        onChange={(event) =>
                          updateFilter(field.key, event.target.value)
                        }
                        className="w-full rounded-lg border border-[#f8f0df]/12 bg-[#020814]/80 px-3 py-2.5 text-sm text-[#fff8e9] outline-none focus:border-[#d8bd7a]"
                      >
                        <option>{ALL}</option>
                        {field.options.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-[#d8bd7a]/20 bg-[#101c31]/70 p-3">
                <p className="text-sm text-[#d8bd7a]">夜の言葉</p>
                <label className="mt-3 block">
                  <span className="mb-1 block text-xs text-[#bdb5a5]">
                    夜の気配を選ぶ
                  </span>
                  <select
                    value={filters.night}
                    onChange={(event) => updateFilter("night", event.target.value)}
                    className="w-full rounded-lg border border-[#f8f0df]/12 bg-[#020814]/80 px-3 py-2.5 text-sm text-[#fff8e9] outline-none focus:border-[#d8bd7a]"
                  >
                    <option>{ALL}</option>
                    {nightOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-sm text-[#d8bd7a]">
                  キーワード
                </span>
                <input
                  value={freeKeyword}
                  onChange={(event) => setFreeKeyword(event.target.value)}
                  placeholder="例: 雨、酸味、鶏料理、佐賀"
                  className="w-full rounded-lg border border-[#f8f0df]/15 bg-[#020814]/80 px-4 py-4 text-base text-[#fff8e9] outline-none transition placeholder:text-[#8f8879] focus:border-[#d8bd7a] focus:ring-2 focus:ring-[#d8bd7a]/20"
                />
              </label>

              <button
                type="button"
                onClick={() => {
                  setFilters({
                    dish: ALL,
                    mood: ALL,
                    area: ALL,
                    taste: ALL,
                    night: ALL,
                  });
                  setFreeKeyword("");
                  setShowFavoritesOnly(false);
                }}
                className="mt-4 w-full rounded-lg border border-[#f8f0df]/12 px-4 py-3 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
              >
                条件をリセット
              </button>
            </div>
          </aside>

          <section id="results" className="min-w-0">
            <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-[#d8bd7a]">検索結果</p>
                <h2 className="mt-1 text-3xl font-medium">
                  {filteredItems.length}本
                </h2>
              </div>
              <p className="text-sm text-[#bdb5a5]">
                全{sakePairings.length}本から{filteredItems.length}本を表示中
              </p>
            </div>

            <div className="mb-5 grid gap-3 sm:flex sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowFavoritesOnly((current) => !current);
                }}
                aria-pressed={showFavoritesOnly}
                className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm transition ${
                  showFavoritesOnly
                    ? "border-[#d8bd7a]/70 bg-[#d8bd7a]/18 text-[#fff4d8]"
                    : "border-[#f8f0df]/12 text-[#f2dfad] hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
                }`}
              >
                <OchokoIcon filled={showFavoritesOnly} />
                {showFavoritesOnly ? "おちょこ表示中" : "おちょこ付きのみ"}
              </button>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredItems.map((item) => (
                  <SakeCard
                    key={item.id}
                    item={item}
                    isFavorite={favoriteIds.includes(item.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-6 text-[#d8d0bf]">
                {showFavoritesOnly
                  ? "お気に入りに入れた一本が、ここに並びます。"
                  : "条件を少しゆるめると、今夜に似合う一本が見つかります。"}
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
