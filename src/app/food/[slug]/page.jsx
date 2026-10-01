import { notFound } from "next/navigation";
import ShareButton from "../../components/ShareButton";
import TrackedExternalLink from "../../components/TrackedExternalLink";
import {
  SITE_NAME,
  SITE_URL,
  buildPairingReason,
  buildRecipeLinks,
  buildSakeFeatureTags,
  buildSakeListSummary,
  buildYoiCopy,
  getFoodBySlug,
  getFoodOptions,
  getFoodProfile,
  toPathSegment,
  unique,
} from "../../../data/siteData";

export function generateStaticParams() {
  return getFoodOptions().map((name) => ({ slug: toPathSegment(name) }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) return {};

  const title = `${food.name}に合う日本酒｜おすすめのペアリング｜${SITE_NAME}`;
  const description = `${food.name}に合わせたい日本酒を、味わい・温度帯・今夜の気分から紹介します。家庭料理と日本酒のペアリングを探すページです。`;
  const url = `${SITE_URL}/food/${toPathSegment(food.name)}`;

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

export default async function FoodPage({ params }) {
  const { slug } = await params;
  const food = getFoodBySlug(slug);
  if (!food) notFound();

  const items = food.items;
  const nights = unique(items.map((item) => item.nightType)).slice(0, 10);
  const categories = unique(items.flatMap((item) => item.dishCategories || [])).slice(0, 8);
  const tastes = unique(items.flatMap((item) => item.taste || [])).slice(0, 12);
  const relatedFoods = unique(
    items.flatMap((item) => item.dishes || []).filter((dish) => dish !== food.name),
  ).slice(0, 12);
  const foodProfile = getFoodProfile(food.name);
  const recipeLinks = buildRecipeLinks(food.name);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${food.name}に合う日本酒`,
    description: `${food.name}に合う日本酒と家庭料理のペアリング。`,
    url: `${SITE_URL}/food/${toPathSegment(food.name)}`,
    about: {
      "@type": "Thing",
      name: food.name,
    },
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
          <p className="text-sm text-[#d8bd7a]">料理から探す</p>
          <h1 className="font-display-ja mt-4 text-4xl font-normal leading-tight sm:text-6xl">
            {food.name}に合う日本酒
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-[#d8d0bf] sm:text-lg">
            いつもの一皿から、食卓に合う一献へ。この料理に合う日本酒と、なぜ合うのかを短く紹介します。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ShareButton
              title={`${food.name}に合う日本酒｜${SITE_NAME}`}
              text={`${food.name}から一献を探す。`}
              path={`/food/${toPathSegment(food.name)}`}
              eventName="share_food"
            />
            <a
              href="/#search"
              className="rounded-full border border-[#f8f0df]/12 px-4 py-2 text-sm text-[#d8d0bf] transition hover:border-[#d8bd7a]/60 hover:bg-[#d8bd7a]/10"
            >
              条件検索で絞り込む
            </a>
          </div>
        </section>

        <section className="mb-4 rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
          <p className="text-sm text-[#d8bd7a]">料理について</p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d8d0bf] sm:text-base sm:leading-8">
            {foodProfile.description}
          </p>
          {foodProfile.cookingTime || foodProfile.servings ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#bdb5a5]">
              {foodProfile.cookingTime ? (
                <span className="rounded-full border border-[#f8f0df]/12 px-3 py-1">
                  目安時間: {foodProfile.cookingTime}
                </span>
              ) : null}
              {foodProfile.servings ? (
                <span className="rounded-full border border-[#f8f0df]/12 px-3 py-1">
                  分量: {foodProfile.servings}
                </span>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div>
            <h2 className="font-display-ja mb-4 text-3xl font-normal">
              この料理に合う日本酒
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
            {items.slice(0, 16).map((item) => (
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
                <div className="mt-3 flex flex-wrap gap-2">
                  {buildSakeFeatureTags(item, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[#f8f0df]/12 px-3 py-1 text-xs text-[#d8d0bf]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-7 text-[#d8d0bf]">
                  {buildSakeListSummary(item, food.name)}
                </p>
                <div className="mt-4 rounded-lg border border-[#f8f0df]/10 bg-[#020814]/45 p-3">
                  <p className="text-xs text-[#d8bd7a]">なぜ合う？</p>
                  <p className="mt-2 text-sm leading-7 text-[#d8d0bf]">
                    {buildPairingReason(item, food.name)}
                  </p>
                </div>
                <p className="mt-4 text-xs text-[#bdb5a5]">
                  {buildYoiCopy(item)} / {item.temperature.join("、")}
                </p>
              </a>
            ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">今夜の気分</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {nights.map((night) => (
                  <a
                    key={night}
                    href={`/night/${toPathSegment(night)}`}
                    className="rounded-full border border-[#f8f0df]/12 px-3 py-1.5 text-sm text-[#d8d0bf] transition hover:border-[#d8bd7a]/50 hover:text-[#fff8e9]"
                  >
                    {night}
                  </a>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">味わいの傾向</h2>
              <p className="mt-4 text-sm leading-7 text-[#d8d0bf]">
                {tastes.join("、")}
              </p>
            </div>
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">料理カテゴリ</h2>
              <p className="mt-4 text-sm leading-7 text-[#d8d0bf]">
                {categories.join("、")}
              </p>
            </div>
            <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
              <h2 className="font-display-ja text-2xl font-normal">ほかの料理を探す</h2>
              <div className="mt-4 grid gap-2">
                {relatedFoods.map((name) => (
                  <a
                    key={name}
                    href={`/food/${toPathSegment(name)}`}
                    className="text-sm leading-7 text-[#d8d0bf] transition hover:text-[#fff8e9]"
                  >
                    {name}
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </section>

        {recipeLinks.length > 0 ? (
          <section className="mt-6 rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
            <p className="text-sm text-[#d8bd7a]">作り方を見る</p>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#d8d0bf]">
              外部レシピサイトで、この料理の作り方を確認できます。ペアリングを決めたあと、買い物や下ごしらえの確認に使えます。
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {recipeLinks.map((link) => (
                <TrackedExternalLink
                  key={link.href}
                  href={link.href}
                  event="recipe_click"
                  parameters={{
                    food_id: food.name,
                    provider: link.provider,
                    source_page: "food_detail",
                  }}
                  className="rounded-full border border-[#d8bd7a]/30 px-3 py-2 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
                >
                  {link.label}
                </TrackedExternalLink>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
