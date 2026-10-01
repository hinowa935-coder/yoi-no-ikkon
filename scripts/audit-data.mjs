import { extraSakePairings } from "../src/data/extraSakePairings.js";
import { reviewPairingProduct } from "../src/data/sakePairingReview.js";
import { sakePairings } from "../src/data/sakePairings.js";

const baseVisible = sakePairings.filter((item) => item.prefecture !== "沖縄県");
const visible = baseVisible.concat(extraSakePairings).map(reviewPairingProduct);

function unique(values) {
  return new Set(values.filter(Boolean));
}

function duplicates(items, key) {
  const counts = new Map();
  for (const item of items) {
    const value = item[key];
    if (!value) continue;
    counts.set(value, (counts.get(value) || 0) + 1);
  }
  return Array.from(counts.entries()).filter(([, count]) => count > 1);
}

function malformedUrls(items) {
  const fields = ["officialUrl", "instagramUrl", "productUrl", "webSearchUrl"];
  const errors = [];

  for (const item of items) {
    for (const field of fields) {
      const value = item[field];
      if (!value) continue;
      try {
        new URL(value);
      } catch {
        errors.push({ id: item.id, field, value });
      }
    }
  }

  return errors;
}

function missingRequired(items) {
  return items.filter(
    (item) =>
      !item.id ||
      !item.sake ||
      !item.brewery ||
      !item.prefecture ||
      !item.region ||
      !item.nightType ||
      !item.dishes?.length ||
      !item.moods?.length ||
      !item.taste?.length,
  );
}

const dishes = visible.flatMap((item) => item.dishes || []);
const report = {
  sourceOfTruth: "src/data/siteData.js -> visibleSakePairings",
  rawSakePairings: sakePairings.length,
  visibleBaseWithoutOkinawa: baseVisible.length,
  extraPairings: extraSakePairings.length,
  visibleTotal: visible.length,
  duplicateIds: duplicates(visible, "id"),
  duplicateProductNames: duplicates(visible, "productName"),
  duplicateSakeNames: duplicates(visible, "sake"),
  breweries: unique(visible.map((item) => item.brewery)).size,
  prefectures: unique(visible.map((item) => item.prefecture)).size,
  regions: unique(visible.map((item) => item.region)).size,
  dishLinks: dishes.length,
  uniqueDishes: unique(dishes).size,
  dishCategories: unique(visible.flatMap((item) => item.dishCategories || [])).size,
  tastes: unique(visible.flatMap((item) => item.taste || [])).size,
  styles: unique(visible.flatMap((item) => item.style || [])).size,
  moods: unique(visible.flatMap((item) => item.moods || [])).size,
  nightTags: unique(visible.map((item) => item.nightType)).size,
  temperatures: unique(visible.flatMap((item) => item.temperature || [])).size,
  malformedUrls: malformedUrls(visible),
  missingRequired: missingRequired(visible),
};

console.log(JSON.stringify(report, null, 2));

if (
  report.duplicateIds.length ||
  report.malformedUrls.length ||
  report.missingRequired.length
) {
  process.exitCode = 1;
}
