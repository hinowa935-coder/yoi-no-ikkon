"use client";

import { useMemo, useState } from "react";
import { sakePairings } from "../data/sakePairings";

const ALL = "すべて";

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

function SakeCard({ item }) {
  return (
    <article className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/86 p-5 shadow-2xl shadow-black/20">
      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <p className="text-sm text-[#d8bd7a]">
            {item.prefecture} / {item.region}
          </p>
          <span className="w-fit shrink-0 rounded-full border border-[#d8bd7a]/35 px-3 py-1 text-xs leading-none text-[#f2dfad] sm:text-sm">
            {item.nightType}
          </span>
        </div>

        <h3 className="mt-2 text-2xl font-medium leading-snug text-[#fff8e9]">
          {item.productName || item.sake}
        </h3>
        <p className="mt-1 text-sm leading-6 text-[#bdb5a5]">
          {item.brewery}
        </p>
        <a
          href={item.productUrl || item.officialUrl || item.webSearchUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex w-fit rounded-full border border-[#d8bd7a]/30 px-3 py-1 text-xs text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10 hover:text-[#fff8e9]"
        >
          {item.productUrl
            ? "商品を見る"
            : item.officialUrl
              ? "公式を見る"
              : "Webで探す"}
        </a>
      </div>

      <p className="mt-5 border-l border-[#d8bd7a]/50 pl-4 text-base leading-8 text-[#fff4d8]">
        {item.essay}
      </p>

      <div className="mt-5 space-y-4 text-sm text-[#d8d0bf]">
        <div>
          <p className="text-[#d8bd7a]">合う料理</p>
          <p className="mt-2 leading-7">{item.dishes.join("、")}</p>
        </div>
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
      </div>
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

  const nightOptions = useMemo(() => {
    const existing = unique(sakePairings.map((item) => item.nightType));
    return curatedNightOptions.filter((option) => existing.includes(option));
  }, []);

  const todayEntrances = useMemo(() => dailyPick(nightOptions, 3), [nightOptions]);

  const filteredItems = useMemo(() => {
    const keyword = freeKeyword.trim();

    return sakePairings.filter((item) => {
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
  }, [filters, freeKeyword]);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  return (
    <main className="min-h-screen bg-[#050914] text-[#fff8e9]">
      <div className="mx-auto flex w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#f8f0df]/10 pb-5">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#d8bd7a]">YOI NO GOHAN</p>
            <p className="mt-2 text-2xl font-semibold">宵ノごはん</p>
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
                宵ノごはん
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
          <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-4 sm:p-5">
              <p className="text-sm text-[#d8bd7a]">今夜の一本を探す</p>

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

            {filteredItems.length > 0 ? (
              <div className="grid gap-4 xl:grid-cols-2">
                {filteredItems.map((item) => (
                  <SakeCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-6 text-[#d8d0bf]">
                条件を少しゆるめると、今夜に似合う一本が見つかります。
              </div>
            )}
          </section>
        </section>
      </div>
    </main>
  );
}
