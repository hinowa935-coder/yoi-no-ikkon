import test from "node:test";
import assert from "node:assert/strict";
import { INTERNAL_COPY, publicTags, publicSourceName, publicSpecText } from "../src/data/publicDisplay.js";
import { displaySpec } from "../src/data/specDisplay.js";
import { visibleSakePairings, buildSakeVerifiedTags, buildSakeEditorialTags, buildSakeFeatureTags } from "../src/data/siteData.js";

test("internal tags never become verified or editorial display tags", () => {
  const item = { catalogVersion: "v1", sakeResearch: { verifiedFeatureTags: ["旨味", "needsIdentification", "調査済み", "SKU未確認"], editorialTags: ["食中酒向き", "要商品詳細確認", "次回調査"] } };
  assert.deepEqual(buildSakeVerifiedTags(item), ["旨味"]);
  assert.deepEqual(buildSakeEditorialTags(item), ["食中酒向き"]);
  assert.deepEqual(buildSakeFeatureTags(item), ["旨味", "食中酒向き"]);
  assert.deepEqual(publicTags(["confidence", "Phase 3", "featureEvidence", "", null]), []);
});
test("remove research notes without filling missing specs or role values", () => {
  assert.equal(displaySpec("掛米50%（麹米は本文未取得）"), "掛米50%");
  assert.equal(displaySpec({ kake: 50, koji: null }, "%"), "掛米: 50%");
  assert.equal(displaySpec("愛媛県酵母（名称未取得）"), "愛媛県酵母");
  assert.equal(displaySpec("国産（地域詳細未記載）"), "国産");
  assert.equal(displaySpec("柔らかな軟水（対象商品本文）"), "柔らかな軟水");
  assert.equal(displaySpec("要商品詳細確認"), "");
  assert.equal(displaySpec(null), "");
});
test("official modifiers and uncertainty in actual values remain", () => {
  assert.equal(displaySpec("14度以上15度未満"), "14度以上15度未満");
  assert.equal(displaySpec("冷酒（△）"), "冷酒（△）");
  assert.equal(displaySpec("米（国産）、米こうじ（国産米）"), "米（国産）、米こうじ（国産米）");
  assert.equal(displaySpec({ minC: 40, maxC: 45, label: "ぬる燗" }), "ぬる燗：40〜45℃");
  assert.equal(displaySpec(["五百万石", "他（品種不明）"]), "五百万石、他");
  assert.equal(publicSpecText("本文80%。原料米欄は五百万石(68%)・ふさこがね(80%)と併記（麹米・掛米の役割未掲載）"), "80%（原料米別の表記：五百万石68%・ふさこがね80%）");
});
test("research source aliases use a truthful site label without changing URL", () => {
  const source = { name: "平和酒造 補足・探索資料", url: "https://www.heiwashuzou.co.jp/" };
  const before = JSON.stringify(source);
  assert.equal(publicSourceName(source), "heiwashuzou.co.jp");
  assert.equal(JSON.stringify(source), before);
  assert.equal(publicSourceName({ name: "公式カタログ", url: "https://example.com/catalog.pdf" }), "公式カタログ");
});
test("all 492 products: public tags, specs and source labels have no internal notes", () => {
  assert.equal(visibleSakePairings.length, 492);
  for (const item of visibleSakePairings) {
    const before = JSON.stringify(item);
    for (const tag of [...buildSakeVerifiedTags(item), ...buildSakeEditorialTags(item), ...buildSakeFeatureTags(item)]) assert.doesNotMatch(tag, INTERNAL_COPY, item.id);
    for (const value of Object.values(item.sakeResearch.specs)) assert.doesNotMatch(displaySpec(value), INTERNAL_COPY, item.id);
    for (const source of item.sakeResearch.sources) assert.doesNotMatch(publicSourceName(source), INTERNAL_COPY, item.id);
    assert.equal(JSON.stringify(item), before, item.id);
  }
});
