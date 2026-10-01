import { notFound } from "next/navigation";
import ShareButton from "../../components/ShareButton";
import TrackedExternalLink from "../../components/TrackedExternalLink";
import {
  SITE_NAME,
  SITE_URL,
  buildResourceLinks,
  getRelatedSake,
  getSakeById,
  polishEssay,
  toPathSegment,
  visibleSakePairings,
} from "../../../data/siteData";

export function generateStaticParams() {
  return visibleSakePairings.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const item = getSakeById(slug);
  if (!item) return {};

  const title = `${item.productName || item.sake}｜${SITE_NAME}`;
  const description = `${item.brewery}（${item.prefecture}${item.region ? `・${item.region}` : ""}）の一献。${item.nightType}に合う料理や味わい、温度帯を紹介します。`;
  const url = `${SITE_URL}/sake/${item.id}`;

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

function TagList({ title, values }) {
  return (
    <div>
      <p className="text-sm text-[#d8bd7a]">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            key={value}
            className="rounded-full border border-[#f8f0df]/12 px-3 py-1.5 text-xs text-[#d8d0bf]"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default async function SakeDetailPage({ params }) {
  const { slug } = await params;
  const item = getSakeById(slug);
  if (!item) notFound();

  const related = getRelatedSake(item);
  const resourceLinks = buildResourceLinks(item);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: item.productName || item.sake,
    brand: item.sake,
    manufacturer: item.brewery,
    category: "日本酒",
    description: polishEssay(item.essay),
    url: `${SITE_URL}/sake/${item.id}`,
    areaServed: item.prefecture,
  };

  return (
    <main className="yoi-bg min-h-screen text-[#fff8e9]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="mx-auto w-full max-w-5xl px-5 py-6 sm:px-8 lg:px-10">
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
          <p className="text-sm text-[#d8bd7a]">
            {item.prefecture} / {item.region} / {item.brewery}
          </p>
          <h1 className="font-display-ja mt-4 text-4xl font-normal leading-tight sm:text-6xl">
            {item.productName || item.sake}
          </h1>
          <p className="font-display-ja mt-6 max-w-3xl border-l border-[#d8bd7a]/50 pl-5 text-lg leading-9 text-[#fff4d8]">
            {polishEssay(item.essay)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`/night/${toPathSegment(item.nightType)}`}
              className="rounded-full border border-[#d8bd7a]/35 px-4 py-2 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
            >
              {item.nightType}
            </a>
            <ShareButton
              title={`${item.productName || item.sake}｜${SITE_NAME}`}
              text={`${item.nightType}に似合う一献。`}
              path={`/sake/${item.id}`}
              eventName="share_sake"
            />
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
            <h2 className="font-display-ja text-2xl font-normal">一献の輪郭</h2>
            <div className="mt-5 space-y-5">
              <TagList title="味わい" values={item.taste || []} />
              <TagList title="スタイル" values={item.style || []} />
              <TagList title="おすすめ温度" values={item.temperature || []} />
              <TagList title="気分" values={item.moods || []} />
            </div>
          </div>

          <div className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/82 p-5">
            <h2 className="font-display-ja text-2xl font-normal">料理から広がる夜</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.dishes.map((dish) => (
                <a
                  key={dish}
                  href={`/food/${toPathSegment(dish)}`}
                  className="rounded-full border border-[#f8f0df]/12 px-3 py-1.5 text-sm text-[#d8d0bf] transition hover:border-[#d8bd7a]/50 hover:text-[#fff8e9]"
                >
                  {dish}
                </a>
              ))}
            </div>
            <div className="mt-6">
              <p className="text-sm text-[#d8bd7a]">購入・公式情報</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {resourceLinks.map((link) => (
                  <TrackedExternalLink
                    key={link.href}
                    href={link.href}
                    parameters={{
                      product_id: item.id,
                      product_type: "sake",
                      provider: link.provider,
                      source_page: "sake_detail",
                      sake_id: item.id,
                      night_id: item.nightType,
                    }}
                    className="rounded-full border border-[#d8bd7a]/30 px-3 py-1.5 text-sm text-[#f2dfad] transition hover:border-[#d8bd7a]/70 hover:bg-[#d8bd7a]/10"
                  >
                    {link.label}
                  </TrackedExternalLink>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10">
          <h2 className="font-display-ja text-3xl font-normal">近い夜の一献</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {related.map((candidate) => (
              <a
                key={candidate.id}
                href={`/sake/${candidate.id}`}
                className="rounded-lg border border-[#f8f0df]/12 bg-[#0b1729]/70 p-4 transition hover:border-[#d8bd7a]/55 hover:bg-[#d8bd7a]/10"
              >
                <p className="text-xs text-[#d8bd7a]">{candidate.nightType}</p>
                <h3 className="font-display-ja mt-2 text-lg font-normal leading-7">
                  {candidate.productName || candidate.sake}
                </h3>
                <p className="mt-2 text-sm text-[#bdb5a5]">
                  {candidate.prefecture} / {candidate.brewery}
                </p>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
