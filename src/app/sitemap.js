import {
  SITE_URL,
  getFoodOptions,
  getNightOptions,
  toPathSegment,
  visibleSakePairings,
} from "../data/siteData";

export default function sitemap() {
  const now = new Date();

  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    ...visibleSakePairings.map((item) => ({
      url: `${SITE_URL}/sake/${item.id}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    ...getNightOptions().map((night) => ({
      url: `${SITE_URL}/night/${toPathSegment(night)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    })),
    ...getFoodOptions().map((food) => ({
      url: `${SITE_URL}/food/${toPathSegment(food)}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    })),
  ];
}
