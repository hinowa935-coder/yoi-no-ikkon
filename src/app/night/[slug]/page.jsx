import { notFound } from "next/navigation";
import ShareButton from "../../components/ShareButton";
import {
  SITE_NAME,
  SITE_URL,
  buildSakeDescription,
  buildYoiCopy,
  getNightBySlug,
  getNightMoodEntry,
  getNightOptions,
  toPathSegment,
  unique,
} from "../../../data/siteData";

export function generateStaticParams() {
  return getNightOptions().map((name) => ({ slug: toPathSegment(name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const night = getNightBySlug(slug);
  if (!night) return {};

  const moodEntry = getNightMoodEntry(night.name);
  const displayName = moodEntry?.label || night.name;
  const title = `${displayName}に合う日本酒｜今夜の気分から探す｜${SITE_NAME}`;
  const description = `${displayName}に似合う日本酒と家庭料理のペアリングを紹介します。今夜の気分から一献を選ぶページです。`;
  const url = `${SITE_URL}/night/${toPathSegment(night.name)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: `${SITE_URL}/og-default.svg`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/og-default.svg`],
    },
  };
}

export default async function NightPage({ params }) {
  const { slug } = await params;
  const night = getNightBySlug(slug);
  if (!night) notFound();

  const moodEntry = getNightMoodEntry(night.name);
  const displayName = moodEntry?.label || night.name;
  const items = night.items;
  const foods = unique(items.flatMap((item) => item.dishes || [])).slice(0, 14);
  const moods = unique(items.flatMap((item) => item.moods || [])).slice(0, 10);
  const relatedNights = unique(
    items
      .flatMap((item) => item.moods || [])
      .flatMap((mood) =>
        items
          .filter((item) => item.moods?.includes(mood) && item.nightType !== night.name)
          .map((item) => item.nightType),
      ),
  ).slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${displayName}に合う日本酒`,
    description: `${displayName}に似合う日本酒と料理の案内。`,
    url: `${SITE_URL}/night/${toPathSegment(night.name)}`,
    hasPart: items.slice(0, 12).map((item) => ({
      "@type": "Product",
      name: item.productName || item.sake,
      url: `${SITE_URL}/sake/${item.id}`,
    })),
  };

  return (
    <main className="yoi-bg min-h-screen text-[#fff8e9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full max-w-6xl px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between border-b border-[#f8f0df]/10 pb-5">
          <a href="/" className="text-sm text-[#d8bd7a]">
            宵の一献
          </a>
          <a
            href="/#search"
            className="rounded-full border border-[#d8bd7a]/35 px-4 py-2 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
          >
            検索へ戻る
          </a>
        </header>

        <section className="py-10">
          <p className="text-sm text-[#d8bd7a]">今夜の気分から探す</p>
          <h1 className="font-display-ja mt-4 text-4xl font-normal leading-tight sm:text-6xl">
            {displayName}
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#d8d0bf] sm:text-lg">
            いまの気分に合う日本酒と家庭料理を、静かに選ぶページです。食べたい料理からも、飲みたい一本からも探せます。
          </p>
          <p className="mt-3 text-sm text-[#bdb5a5]">
            夜のタグ: {night.name}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ShareButton
              title={`${displayName}に合う日本酒｜${SITE_NAME}`}
              text={`${displayName}に似合う一献を探す。`}
              path={`/night/${toPathSegment(night.name)}`}
              eventName="share_night"
            />
            <a
              href={`/#search`}
              className="rounded-full border border-[#f8f0df]/12 px-4 py-2 text-sm text-[#d8d0bf] transition hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
            >
              条件検索で絞り込む
            </a>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 md:grid-cols-2">
            {items.slice(0, 12).map((item) => (
              <a
                key={item.id}
                href={`/sake/${item.id}`}
                className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5 transition hover:border-[#d8bd7a]/55 hover:bg-[#d8bd7a]/10"
              >
                <p className="text-xs text-[#d8bd7a]">
                  {item.prefecture} / {item.brewery}
                </p>
                <h2 className="font-display-ja mt-2 text-xl font-normal leading-8">
                  {item.productName || item.sake}
                </h2>
                <p className="mt-3 text-sm leading-7 text-[#d8d0bf]">
                  {buildSakeDescription(item)}
                </p>
                <p className="mt-4 text-xs text-[#bdb5a5]">
                  {buildYoiCopy(item)}
                </p>
                <p className="mt-2 text-xs text-[#bdb5a5]">
                  合う料理: {item.dishes.slice(0, 3).join("、")}
                </p>
              </a>
            ))}
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">この夜に合う料理</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {foods.map((food) => (
                  <a
                    key={food}
                    href={`/food/${toPathSegment(food)}`}
                    className="rounded-full border border-[#f8f0df]/12 px-3 py-1.5 text-sm text-[#d8d0bf] transition hover:border-[#d8bd7a]/50 hover:text-[#fff8e9]"
                  >
                    {food}
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">気分</h2>
              <p className="mt-4 text-sm leading-7 text-[#d8d0bf]">
                {moods.join("、")}
              </p>
            </div>
            {relatedNights.length > 0 ? (
              <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
                <h2 className="font-display-ja text-2xl font-normal">近い夜</h2>
                <div className="mt-4 grid gap-2">
                  {relatedNights.map((name) => (
                    <a
                      key={name}
                      href={`/night/${toPathSegment(name)}`}
                      className="text-sm leading-7 text-[#d8d0bf] transition hover:text-[#fff8e9]"
                    >
                      {name}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </div>
    </main>
  );
}
