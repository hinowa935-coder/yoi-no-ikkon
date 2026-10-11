export const phase21VerifiedAt = "2026-10-03";

// Values below were read from the named product section, not inferred from its name.
const detailUrls = {
  fukutsukasa: "https://www.fukutsukasa.jp/product/?no=1378795609",
  kokushi: "https://www.takasagoshuzo-store.com/view/item/000000000012?category_page_id=kokushimusou",
  aizu: "https://www.tsurunoe.com/products/3",
  niida: "https://niida1711.shop/items/5b0ce9715f786674d6001556",
  muu: "https://7yari.co.jp/product/102/",
  sanzen: "https://kikuchisakebrewery.myshopify.com/products/k0087",
  reizan: "https://www.yoka-mall.com/front/commodity/013443hc/r3/",
  kanhokuto: "https://kanhokuto.com/products/products-24/",
};

// field, value, source URL (null = the saved primary source), source meaning/locator
const corrections = {
  "fukutsukasa-junmai": {
    url: detailUrls.fukutsukasa,
    fields: [
      ["specs.polishingRatio", "60%", null, "福司純米酒の成分表・精米歩合"],
      ["specs.alcoholPercentage", "14%", null, "同表・アルコール分"],
      ["specs.nihonshudo", "+4", null, "同表・日本酒度"],
      ["specs.acidity", "1.5", null, "同表・酸度"],
    ],
  },
  "kokushi-muso-junmai": {
    url: detailUrls.kokushi,
    fields: [
      ["specs.riceOrigin", "北海道", null, "対象商品・北海道産米使用。品種は記載なし"],
      ["specs.polishingRatio", "60%", null, "対象商品の精米歩合欄"],
      ["specs.alcoholPercentage", "15度", null, "対象商品のアルコール分欄"],
      ["specs.nihonshudo", "+3", null, "対象商品の日本酒度欄"],
      ["specs.acidity", "1.4", null, "対象商品の酸度欄"],
    ],
  },
  "nanbu-bijin-tokubetsu-junmai": {
    fields: [
      ["specs.alcoholPercentage", "15度", null, "日本語の商品情報。英文の15〜16度より優先"],
      ["specs.riceOrigin", "岩手県二戸市（ぎんおとめ）", null, "二戸産ぎんおとめ。他の原料米の産地まで拡張しない"],
      ["specs.waterSource", "折爪馬仙峡の伏流水", null, "対象商品の仕込水欄"],
    ],
    notes: ["日本語の現行度数15度と英文の15〜16度が異なる。日本語を採用し、英文は他の数値の補足源として明示。年度を同一と断定しない。"],
  },
  "yamamoto-pure-black": {
    fields: [
      ["classification.tokuteiMeishoshu", null, null, "閲覧した商品仕様は使用米・精米歩合・度数。特定名称は本文で直接確認できず保留"],
      ["classification.junmai", null, null, "名称や精米歩合だけで純米吟醸と推測しない"],
    ],
    notes: ["特定名称の直接の裏付けが不足。商品・使用米・数値は同定できているが、ラベル上の特定名称は未確認。"],
  },
  "kariho-yamahai-junmai": {
    sourceCorrection: { type: "breweryOfficial", name: "秋田清酒公式オンラインショップ（超辛口は同定候補）" },
    notes: ["shop.igeta.jpは秋田清酒の公式直販。従来の酒販店名を訂正。ただし超辛口を登録商品と決めつけない。"],
  },
  "ippaku-suissei-tokubetsu-junmai": {
    fields: [["specs.riceByRole", { koji: ["吟の精"], kake: ["秋田酒こまち"] }, null, "特別純米・白ラベルの麹米／掛米欄"]],
  },
  "aizu-chujo-junmai": {
    url: detailUrls.aizu,
    confidence: "high",
    features: [
      ["濃醇", "純米酒の詳細で濃醇な味わいを説明"],
      ["すっきり", "同じ商品にすっきりした味を説明"],
      ["食中酒向き", "同じ純米酒を食中酒として推奨"],
    ],
    description: "濃醇な味わいの中にすっきりとした後味。蔵元が食中酒として勧める定番の純米酒です。",
  },
  "urakasumi-i3yhce": {
    fields: [
      ["servingTemperatures", ["冷酒", "冷や", "ぬる燗", "上燗"], null, "item-drinkのon指定のみ。ロック・熱燗は非選択"],
      ["recommendedTemperatureRange", ["5〜10℃", "15〜20℃", "40℃", "45℃"], null, "選択状態の飲み方と温度を対応づけて確認"],
      ["temperatureRecommendations", [
        { label: "冷酒", minC: 5, maxC: 10 }, { label: "冷や", minC: 15, maxC: 20 },
        { label: "ぬる燗", minC: 40, maxC: 40 }, { label: "上燗", minC: 45, maxC: 45 },
      ], null, "公式の選択マークonと各liの温度表記"],
    ],
    identificationNote: null,
  },
  "niida-shizenshu-junmai-genshu": {
    url: detailUrls.niida,
    productName: "しぜんしゅ 純米原酒",
    confidence: "high",
    fields: [
      ["classification.tokuteiMeishoshu", "純米酒", null, "現行公式の商品説明は純米原酒"],
      ["classification.junmai", true, null, "同商品の純米原酒表記"],
      ["classification.genshu", true, null, "同商品の原酒表記"],
      ["classification.kimoto", true, null, "同商品の生酛仕込み表記"],
      ["specs.polishingRatio", "85%", null, "公式直販の現行純米原酒・精米歩合。酒販店の80%を置換"],
      ["specs.alcoholPercentage", "16度", null, "同商品・アルコール度"],
      ["specs.yeast", "蔵付き酵母（酵母無添加）", null, "対象商品の生酛仕込み・酵母無添加表記"],
      ["classification.nama", null, null, "現行公式に生／火入れの明示を取得できず、旧酒販店の値を混在させない"],
      ["classification.hiire", null, null, "同上。常温発送から火入れを推測しない"],
    ],
    removeFeatures: ["濃醇", "熟成"],
    editorial: ["濃醇"],
    features: [
      ["生酛", "対象商品の仕込みに生酛と明記"],
      ["純米原酒", "対象商品の造りを純米原酒と明記"],
      ["米の旨味", "汲出し四段による米の旨味を説明"],
      ["甘みと酸味", "米の甘さと生酛由来の酸を説明"],
    ],
    description: "生酛と蔵付き酵母で醸す純米原酒。米の旨味と甘さを、酸味が引き締めます。",
    notes: ["専門店の80%・熟成・火入れ情報と、公式直販の85%を同じ現行仕様として混ぜない。変更時期・BYは不明。公式本文はWeb閲覧で取得し、直接取得は403。"],
  },
  "shinkame-hdomtl": {
    fields: [
      ["classification.aged", true, null, "神亀純米清酒の商品欄に2年以上の熟成"],
      ["specs.agingPeriod", "2年以上", null, "対象商品・熟成期間"],
    ],
  },
  "kidoizumi-gg3q4p": {
    fields: [["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "純米醍醐の原材料。原料米品種とは別に保持"]],
  },
  "izumibashi-nz2hmwijh": {
    fields: [
      ["recommendedTemperatureRange", ["10〜45℃"], null, "楽風舞の商品別推奨温度範囲"],
      ["temperatureRecommendations", [{ label: "冷酒〜燗酒", minC: 10, maxC: 45 }], null, "対象商品の飲用温度。保管温度ではない"],
    ],
  },
  "matsu-midori-nz2hmwijh": {
    fields: [["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "S.tokyoの原材料欄"]],
  },
  "tsuchida-kimoto": {
    fields: [["specs.kojiMold", "白夜", null, "R7BY土田生もとの詳細・種麹欄"]],
    notes: ["R7BYの常温便案内と成分欄の要冷蔵が併存。発送温度を飲用温度や火入れの根拠にしない。"],
  },
  "oze-no-yukidoke-junmai-daiginjo": {
    fields: [["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "純米大吟醸生詰の原材料欄"]],
    notes: ["生詰の語を生酒と同一視しない。生酒・火入れ回数は未確認。"],
  },
  "hakkaisan-tokubetsu-honjozo": {
    fields: [["specs.riceByRole", { koji: ["五百万石"], kake: ["五百万石", "トドロキワセ", "他（品種不明）"] }, null, "特別本醸造の原料米欄。麹米と掛米を分離"]],
  },
  "kubota-senju": {
    fields: [["specs.riceByRole", { koji: ["五百万石"], kake: ["五百万石"] }, null, "千寿の原料米（精米歩合）欄"]],
    notes: ["元データは吟醸・junmai=false・nonJunmai=trueで矛盾なし。温度はSVG図表で、年齢確認により視覚的な再確認は保留。"],
  },
  "koshino-kanbai-white-label": {
    fields: [
      ["classification.aged", true, null, "白ラベルの説明で6か月以上熟成と明記"],
      ["specs.agingPeriod", "6か月以上", null, "白ラベルの貯蔵説明"],
    ],
  },
  "shimeharitsuru-tsuki": {
    notes: ["公式の個別商品ページは2014年掲載。現在も公開される仕様だが、リニューアル有無・現行ラベルとの照合は未了。"],
  },
  "masumi-karakuchi-kiippon": {
    fields: [["specs.ingredients", ["米", "米こうじ"], null, "辛口生一本の原材料欄"]],
  },
  "yoakemae-tatsuno-junmai": {
    fields: [["servingTemperatures", ["冷酒"], null, "対象ページに掲載のnomi_01.pngをブラウザで視覚確認。冷酒◎、ロック△、常温・ぬる燗・熱燗×"]],
    notes: ["公式の飲み方図を視覚確認して冷酒を取得。図に数値温度はないため数値を補完しない。ロック△は最適な温度として採用しない。"],
  },
  "born-gold": {
    fields: [
      ["classification.aged", true, null, "マイナス10℃で1年まで氷温熟成した酒をブレンド"],
      ["specs.agingPeriod", "1年までの氷温熟成酒をブレンド", null, "全量を1年熟成したという意味にしない"],
      ["specs.agingTemperature", "-10℃", null, "ブレンドされる熟成酒の温度"],
      ["specs.ingredients", ["米", "米麹"], null, "商品仕様の原材料"],
      ["recommendedTemperatureRange", ["0〜10℃", "15〜20℃", "30〜40℃"], null, "おすすめは冷酒・常温・ぬる。熱の凡例は採用しない"],
      ["temperatureRecommendations", [
        { label: "冷酒", minC: 0, maxC: 10 }, { label: "常温", minC: 15, maxC: 20 },
        { label: "ぬる燗", minC: 30, maxC: 40 },
      ], null, "公式が定義した温度をそのまま使用。一般的なぬる燗温度で上書きしない"],
    ],
  },
  "kikuhime-yamahai-junmai": {
    fields: [
      ["classification.aged", true, null, "山廃純米の商品表・熟成年数1〜2年"],
      ["specs.agingPeriod", "1〜2年", null, "対象商品の熟成年数"],
    ],
  },
  "tengumai-yamahai-junmai": {
    fields: [["classification.aged", true, null, "山廃純米大吟醸の熟成による色と味を説明"]],
  },
  "takijiman-junmai": {
    fields: [["specs.riceByRole", { koji: ["山田錦（三重県産）"], kake: ["神の穂（三重県産）"] }, null, "通常純米吟醸の麹米／掛米欄。備前雄町は別商品"]],
  },
  "houraisen-wa-junmai-ginjo": {
    fields: [
      ["specs.ingredients", ["米（国産）", "米こうじ（国産米）"], null, "和の商品詳細の原材料欄"],
      ["specs.riceMaterialLabel", "麹米：酒造好適米／掛米：一般米", null, "品種ではなく原料米の区分。掛米のみ50%を掲載"],
      ["specs.polishingByRole", { koji: null, kake: 50, overall: null }, null, "麹米の歩合は記載なし。掛米50%を全量50%へ単一化しない"],
    ],
  },
  "hanagaki-o0ffit": {
    fields: [
      ["classification.aged", true, null, "山廃純米の対象商品説明で18か月以上熟成"],
      ["specs.agingPeriod", "18か月以上", null, "対象商品の熟成期間"],
      ["specs.ingredients", ["米（国産）", "米こうじ（国産米）"], null, "対象商品の原材料欄"],
    ],
  },
  "maibijin-o0ffit": {
    fields: [
      ["classification.hiire", true, null, "対象商品は火入れ山廃純米720として掲載"],
      ["classification.nama", false, null, "同商品の火入れ明記。蔵全体の説明から推測しない"],
      ["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "山廃純米酒蔵付酵母の原材料欄"],
    ],
  },
  "oku-j6jnol": {
    fields: [["specs.numericValuesAreApproximate", true, null, "全量にごり生の成分値は目安と明記"]],
  },
  "banshu-ikkon-junmai-ginjo": {
    confidence: "medium",
    notes: ["保存された公式商品URLを再取得したが接続失敗。Phase 2の根拠を保持するが今回再確認済みとは扱わない。"],
  },
  "kid-junmai-ginjo": {
    fields: [["specs.riceByRole", { koji: ["山田錦", "五百万石"], kake: ["一般米（品種不明）"] }, null, "酒専門店鍵やの通常火入れ品・使用米欄"]],
    sourceType: "trustedRetailer",
    additionalUrls: ["https://www.heiwashuzou.co.jp/"],
    notes: ["蔵元公式で現行定番の商品単位スペックを取得できず。季節品・無量山の情報を転記せず、専門店の通常火入れ品資料を維持。"],
  },
  "shichihonyari-lvvrsw": {
    url: detailUrls.muu,
    fields: [
      ["specs.riceVariety", ["玉栄"], null, "現行無有の使用米欄"],
      ["specs.riceOrigin", "滋賀県", null, "同商品の使用米産地"],
      ["specs.polishingRatio", "60%", null, "同商品の磨き欄"],
      ["specs.alcoholPercentage", "15度", null, "同商品の度数欄"],
      ["classification.tokuteiMeishoshu", "純米酒", null, "同商品の無農薬純米の造り表記"],
      ["classification.junmai", true, null, "同商品の純米の造り表記"],
    ],
    removeFeatures: ["熟成", "丸み"],
    features: [
      ["無農薬栽培米", "無有の個別ページで無農薬の玉栄を使用と説明"],
      ["柔らか", "同商品の柔らかな味を説明"],
    ],
    description: "滋賀県産の無農薬栽培玉栄を使う純米酒。優しく柔らかな味わいを蔵元が紹介しています。",
    notes: ["旧URLは404。現行公式で通常無有・無有生酛・無有熟成を別商品として確認。通常無有に一年半熟成・丸みの説明を引き継がない。"],
  },
  "haginotsuyu-lvvrsw": {
    confidence: "high",
    notes: ["通年火入れ品を生原酒と別の項目で確認。公式に度数や味の詳細がないことだけでconfidenceを下げない。"],
  },
  "katano-sakura-hlztnu": {
    fields: [["specs.polishingByRole", { koji: 50, kake: 55, overall: 53 }, null, "純米吟醸の麹米50・掛米55・精米歩合53をそれぞれ保持"]],
  },
  "kiku-masamune-g39ip7": {
    fields: [["specs.ingredients", ["米", "米こうじ"], null, "純米樽酒の原材料欄"]],
    notes: ["生酛・杉の香り等の説明は純米樽酒の商品画像altにもある。ページ本文だけで欠落と判定しない。"],
  },
  "kenbishi-g39ip7": {
    fields: [
      ["classification.aged", true, null, "瑞穂黒松剣菱は2年以上熟成の酒をブレンド"],
      ["specs.agingPeriod", "2年以上熟成した酒をブレンド", null, "同商品の貯蔵・調合説明"],
    ],
  },
  "okura-hmwprj": {
    notes: ["ページtitleは別商品だが、本文に山廃特別純米雄町70本生の独立欄がある。titleのみで誤商品と判断しない。"],
  },
  "kuroushi-gp8l70i9d": {
    notes: ["一覧ページtitleの黒牛・生ではなく、本文中の純米酒黒牛の欄を使用。カテゴリ名から生酒と推測しない。"],
  },
  "tsuki-no-katsura-fjg": {
    fields: [["specs.ingredients", ["米（国産）", "米こうじ（国産米）"], null, "祝40の原材料欄"]],
  },
  "kamo-kinshu-tokubetsu-junmai": {
    fields: [
      ["specs.ingredients", ["米（国産）", "米こうじ（国産米）"], null, "特別純米の原材料欄"],
      ["specs.riceByRole", { koji: ["赤磐雄町"], kake: ["八反錦"] }, null, "通常特別純米の麹米／掛米欄"],
    ],
  },
  "ugonotsuki-junmai-ginjo": {
    additionalUrls: ["https://www.ugonotsuki.com/", "https://ugonotsuki.official.ec/"],
    notes: ["保存した酒販店URLは接続失敗。蔵元のサイトでは商品仕様未取得、公式通販は準備中。従来の確認記録は残すが今回の公式再確認済みには含めない。"],
  },
  "ryusei-io3id2": {
    fields: [
      ["classification.aged", true, null, "熟成純米雄町の常温熟成説明"],
      ["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "熟成純米雄町の原材料欄"],
    ],
  },
  "chiyomusubi-uzpgk6": {
    notes: ["2025年2月更新の公式個別商品と公式カタログで強力・山田錦の麹米／掛米が逆。役割と単一産地を未確定のまま保持。商品名の50を精米歩合の数値根拠にしない。"],
  },
  "sanin-togo-uzpgk6": {
    fields: [["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "純米大吟醸の原材料欄"]],
  },
  "sanzen-iapi9d": {
    url: detailUrls.sanzen,
    confidence: "high",
    fields: [
      ["specs.alcoholPercentage", "15.0度以上16.0度未満", null, "公式直販の商品詳細・アルコール分"],
      ["specs.ingredients", ["米（国産）", "米こうじ（国産米）"], null, "同商品の原材料"],
      ["servingTemperatures", ["常温", "ぬる燗"], null, "お召し上がり方・室温とぬる燗に推奨マーク"],
    ],
    features: [["食中酒向き", "雄町山廃の商品詳細で食中酒として推奨"]],
    notes: ["2022年資料を転用せず、現行公式直販の対象商品から度数と温度を取得。酒音は別商品。"],
  },
  "suigei-tokubetsu-junmai": {
    fields: [
      ["servingTemperatures", ["冷酒", "常温", "ぬる燗", "熱燗"], "https://suigei.co.jp/wp/wp-content/uploads/2025/07/SUIGEIJOUNAL_25SA_s.pdf", "印刷p10（PDF6枚目）の特別純米酒を用いる温度別記事。視覚確認"],
      ["recommendedTemperatureRange", ["5〜10℃", "15〜20℃", "40〜45℃", "50〜55℃"], "https://suigei.co.jp/wp/wp-content/uploads/2025/07/SUIGEIJOUNAL_25SA_s.pdf", "冷酒・常温・ぬる燗・熱燗の4区分。熱燗が取得漏れ"],
      ["temperatureRecommendations", [
        { label: "冷酒", minC: 5, maxC: 10 }, { label: "常温", minC: 15, maxC: 20 },
        { label: "ぬる燗", minC: 40, maxC: 45 }, { label: "熱燗", minC: 50, maxC: 55 },
      ], "https://suigei.co.jp/wp/wp-content/uploads/2025/07/SUIGEIJOUNAL_25SA_s.pdf", "対象商品を明記する公式温度記事。冷蔵保存のQ&Aは別欄"],
    ],
    additionalUrls: ["https://suigei.co.jp/wp/wp-content/uploads/2026/08/SUIGEIJOUNAL_26SA_fix_s.pdf"],
    notes: ["現行商品ページの推奨アイコンは5〜10℃・10〜15℃。2025年公式記事は同商品の冷酒から熱燗までの楽しみ方を紹介する。矛盾として温度を削除せず、掲載文脈・年代を分離。2026夏秋号の主題は別商品で数値を転用しない。"],
  },
  "narutotai-iwjid2": {
    fields: [["specs.ingredients", ["米（徳島県産）", "米麹（徳島県産米）"], null, "寿の原材料欄"]],
  },
  "housui-iwjid2": {
    fields: [["servingTemperatures", ["燗酒"], "https://housui.shop-pro.jp/?pid=9168654", "通常の山廃仕込純米の商品本文で燗を推奨。数値温度は未記載"]],
    notes: ["本体サイトの役米60%という表記は原文を維持し、麹米と独断で解釈しない。別表の通常火入れ品度数範囲は15.2度と整合。"],
  },
  "kinryo-uc9ijh": {
    additionalUrls: ["https://www.nishino-kinryo.co.jp/store/user_data/packages/default/img/products/pdf/koiai.pdf"],
    notes: ["リンク先の公式PDFは商品ポスター。画像を確認したが追加の成分・温度は掲載されていない。"],
  },
  "sanuki-cloudy-uc9ijh": {
    fields: [
      ["specs.ingredients", ["米", "米こうじ", "醸造アルコール"], null, "対象商品詳細の原材料。非純米分類と整合"],
      ["specs.kojiMold", "白麹", null, "対象商品の本文に白麹使用。種麹の商品名・菌株までは推定しない"],
      ["specs.riceOrigin", "国産（地域詳細未記載）", null, "対象商品の使用米は国産米。品種・県産まで推測しない"],
      ["specs.polishingRatio", "70%", "https://kawatsuru.com/cloudy/", "対象の特設ページで70%を再確認。詳細のハイフンとは公開範囲が異なる"],
      ["servingTemperatures", ["冷酒", "ロック", "ソーダ割り"], "https://kawatsuru.com/cloudy/", "同商品の冷やしてそのまま・ロック・ソーダ割りの案内"],
    ],
    notes: ["商品詳細の精米歩合はハイフン、特設ページは70%。非掲載は70%の否定ではないので、直接裏付けのある特設ページ由来70%を維持。更新年度・現行ロットへの適用は不明と記録。", "特設ページの番外編はこの酒を使った料理の紹介。飲用時の相性と断定できないため、その料理名をofficialPairingsへ追加しない。"],
  },
  "sasshu-masamune-junmai": {
    fields: [
      ["specs.polishingRatio", "70%", "https://www.hamadasyuzou.co.jp/zhtw/products/masamune-junmai/", "同じ純米酒の公式多言語ページ・白米比率欄を再確認"],
      ["specs.ingredients", ["米（国産）", "米麹（国産米）"], "https://www.hamadasyuzou.co.jp/zhtw/products/masamune-junmai/", "同商品の原材料。品種は掲載なし"],
    ],
    notes: ["2021年の発売記事と現行日本語説明で辛口／旨口が異なる。味の説明は現行日本語の濃厚旨口を優先。歩合・原材料は同じ純米酒の公式多言語商品欄から保持し、更新年度は不明。"],
  },
  "umenishiki-j6jhwb": {
    fields: [
      ["servingTemperatures", ["冷酒", "ひや", "常温"], null, "飲み方ul.htdのchkクラスだけを採用。ぬる燗・熱燗・ロックはnot_selected"],
      ["specs.polishingByRole", { koji: 40, kake: 40, overall: null }, null, "麹米40%・掛米40%をそれぞれ保持"],
    ],
    notes: ["飲み方の選択状態をHTMLで確認。数値温度は記載されていないので設定しない。"],
  },
  "reizan-junmai": {
    url: detailUrls.reizan,
    confidence: "high",
    fields: [
      ["specs.ingredients", ["米（国産）", "米麹（国産米）"], null, "山村酒造が販売事業者として記載される公式販売の商品説明"],
      ["specs.alcoholPercentage", "15度", null, "同商品のアルコール度数"],
      ["servingTemperatures", ["冷酒", "ぬる燗"], null, "対象の定番純米酒をよく冷やして又はぬる燗と案内"],
      ["officialPairings", ["焼き物", "温物", "しっかりした味わいの料理"], null, "対象商品の相性説明。関連商品の宣伝やことほぎは含めない"],
    ],
    features: [
      ["やわらかな辛口", "対象の定番純米酒の味を柔らかな辛口と説明"],
      ["キレ", "同商品の後味のキレを説明"],
      ["食中酒向き", "対象商品は料理を邪魔しない味と説明"],
      ["晩酌向き", "対象商品を家庭での晩酌用にも提案"],
    ],
    description: "穏やかな風味とすっきりしたキレのある純米酒。焼き物や温かい料理と、冷酒・ぬる燗で楽しめます。",
    notes: ["よかもーる内の商品販売事業者は山村酒造合名会社。モールの他店舗紹介は当該商品の根拠にしない。"],
  },
  "kanhokuto-tokubetsu-junmai": {
    url: detailUrls.kanhokuto,
    confidence: "high",
    additionalUrls: ["https://kanhokuto.com/note/note-862/", "https://kanhokuto.com/note/note-422/", "https://kanhokuto.com/note/note-527/", "https://kanhokuto.com/note/note-734/"],
    pairingSources: {
      "鶏皮ポン酢": "https://kanhokuto.com/note/note-862/",
      "鮪のカマの塩焼き": "https://kanhokuto.com/note/note-422/",
      "するめ": "https://kanhokuto.com/note/note-527/",
      "鯛の皮の湯引き": "https://kanhokuto.com/note/note-527/",
      "焼きオクラ": "https://kanhokuto.com/note/note-734/",
    },
    fields: [
      ["specs.alcoholPercentage", "15度", null, "公式通常特別純米のアルコール度数"],
      ["specs.polishingRatio", "55%", null, "公式通常特別純米の精米歩合"],
      ["specs.agingPeriod", "約半年貯蔵後に調合", null, "通常特別純米の火入れ後貯蔵説明"],
      ["classification.hiire", true, null, "搾り後2〜3週間で火入れを行う通常品"],
      ["classification.nama", false, null, "同通常品の火入れ明記。生酒は別商品"],
      ["servingTemperatures", ["冷酒", "燗酒", "常温", "ぬる燗"], null, "通常品の冷・燗案内と、同ページからリンクする公式記事の常温・ぬる燗を併記"],
      ["recommendedTemperatureRange", ["40℃前後"], "https://kanhokuto.com/note/note-527/", "公式広報の記事に特別純米を40度くらいの燗で楽しむ例。一般的な適温範囲として拡張しない"],
      ["temperatureRecommendations", [{ label: "ぬる燗", minC: 40, maxC: 40, approximate: true, context: "公式広報の飲用例（2024年1月29日）" }], "https://kanhokuto.com/note/note-527/", "40度くらいという飲用例。測定仕様・確定した温度範囲ではない"],
      ["officialPairings", ["鶏皮ポン酢", "鮪のカマの塩焼き", "するめ", "鯛の皮の湯引き", "焼きオクラ"], null, "商品ページからリンクする4つの公式記事で、酒欄が寒北斗特別純米であることを確認。各料理のURLはpairingEvidenceで保持"],
    ],
    features: [
      ["穏やかな飲み口", "通常特別純米の飲み口は穏やかと説明"],
      ["やさしい香り", "同商品の香りを優しいと説明"],
      ["食中酒向き", "同商品を食中酒と明記"],
      ["冷酒・燗酒向き", "同商品は冷でも燗でもよいと説明"],
    ],
    description: "優しい香りと穏やかな飲み口の定番特別純米。火入れ後に約半年貯蔵し、冷酒でも燗でも食事に寄り添います。",
    notes: ["米の品種は専門店を出典として維持、公式の数値・火入れ・味を優先。日本酒度・酸度の酒販店差異は未解決のままnull。"],
  },
};

export const phase21ReviewNotes = corrections;

const categories = {
  純米酒: [true, false, false, false, false, false],
  特別純米酒: [true, false, false, false, false, false],
  純米吟醸酒: [true, false, false, true, false, false],
  純米大吟醸酒: [true, false, false, false, false, true],
  吟醸酒: [false, true, true, false, false, false],
  大吟醸酒: [false, true, false, false, true, false],
  本醸造酒: [false, true, false, false, false, false],
  特別本醸造酒: [false, true, false, false, false, false],
  普通酒: [false, true, false, false, false, false],
};

export function normalizedClassification(classification) {
  const result = { ginjo: null, junmaiGinjo: null, daiginjo: null, junmaiDaiginjo: null, ginjoFamily: null, daiginjoFamily: null, aged: null, ...classification };
  const values = categories[result.tokuteiMeishoshu];
  if (!values) return result;
  [result.junmai, result.nonJunmai, result.ginjo, result.junmaiGinjo, result.daiginjo, result.junmaiDaiginjo] = values;
  result.ginjoFamily = values.slice(2).some(Boolean);
  result.daiginjoFamily = values[4] || values[5];
  return result;
}

function getValue(item, field) { return field.split(".").reduce((x, k) => x?.[k], item); }
function setValue(item, field, value) {
  const keys = field.split(".");
  const key = keys.pop();
  const parent = keys.reduce((x, k) => (x[k] ??= {}), item);
  parent[key] = value;
}

function fieldProof(field, value, sourceUrl, meaning, sourceType = "breweryOfficial") {
  return { field, value, sourceUrl, sourceType, verifiedAt: phase21VerifiedAt, meaning, productScope: "product", reviewPhase: "2.1" };
}

export function applyPhase21Audit(baseline) {
  const item = structuredClone(baseline);
  const patch = corrections[item.id] || {};
  const oldUrl = item.url;
  const url = patch.url || oldUrl;
  item.auditPhase = "2.1";
  item.auditNotes = patch.notes || [];
  item.previousSourceIssues = [...(item.sourceIssues || [])];
  item.sourceIssues = [...item.auditNotes];
  item.auditChanges = [];
  if (patch.url) {
    item.url = patch.url;
    item.sourceType = "breweryOfficial";
    item.identity.officialProductUrl = patch.url;
    item.sources.push({ url: patch.url, type: "breweryOfficial", name: `${item.brewery} 商品別公式資料`, verifiedAt: phase21VerifiedAt, scope: "product" });
  }
  if (patch.productName) {
    item.productName = patch.productName;
    item.identity.productName = patch.productName;
    item.fieldEvidence.push(fieldProof("identity.productName", patch.productName, url, "公式商品名。容量はSKUの違いとして登録しない"));
  }
  if (patch.sourceCorrection) {
    item.sourceType = patch.sourceCorrection.type;
    item.sources = item.sources.map(s => s.url === oldUrl ? { ...s, ...patch.sourceCorrection } : s);
  }
  for (const additionalUrl of patch.additionalUrls || []) {
    if (!item.sources.some(s => s.url === additionalUrl)) item.sources.push({ url: additionalUrl, type: "breweryOfficial", name: `${item.brewery} 補足・探索資料`, verifiedAt: phase21VerifiedAt, scope: "supplementalReview" });
  }
  for (const [field, value, overrideUrl, meaning] of patch.fields || []) {
    const previous = getValue(item, field);
    if (JSON.stringify(previous) !== JSON.stringify(value)) item.auditChanges.push({ field, previous: previous ?? null, value, sourceUrl: overrideUrl || url, meaning });
    setValue(item, field, value);
    item.fieldEvidence = item.fieldEvidence.filter(e => e.field !== field);
    if (value != null && (!Array.isArray(value) || value.length)) item.fieldEvidence.push(fieldProof(field, value, overrideUrl || url, meaning, patch.sourceType || "breweryOfficial"));
  }
  if (Object.hasOwn(patch, "identificationNote")) item.identificationNote = patch.identificationNote;
  if (patch.description) item.shortDescription = patch.description;
  if (patch.confidence) item.dataConfidence = patch.confidence;
  const removed = patch.removeFeatures || [];
  item.featureEvidence = item.featureEvidence.filter(e => !removed.includes(e.feature));
  for (const [feature, meaning] of patch.features || []) {
    item.featureEvidence = item.featureEvidence.filter(e => e.feature !== feature);
    item.featureEvidence.push({ feature, tag: feature, sourceUrl: url, url, sourceType: "breweryOfficial", verifiedAt: phase21VerifiedAt, meaning, basis: meaning, productScope: "product", reviewPhase: "2.1" });
  }
  item.verifiedFeatureTags = item.featureEvidence.map(e => e.feature);
  item.editorialTags = [...new Set([...item.editorialTags, ...(patch.editorial || [])])];
  item.featureTags = [...item.verifiedFeatureTags, ...item.editorialTags];
  item.facts = item.featureEvidence.map(e => [e.feature, e.meaning]);

  // Only a sourced designation drives classification. "nama" and "hiire" never use this normalization.
  const before = { ...item.classification };
  item.classification = normalizedClassification(before);
  const designationProof = item.fieldEvidence.find(e => e.field === "classification.tokuteiMeishoshu");
  for (const [key, value] of Object.entries(item.classification)) {
    if (value == null || Object.hasOwn(before, key) && before[key] === value) continue;
    if (designationProof && key !== "aged") item.fieldEvidence.push({ ...designationProof, field: `classification.${key}`, value, derivation: "explicitDesignationNormalization", meaning: `${designationProof.meaning} 特定名称から意味を追加せず正規化。吟醸系の親分類はginjoFamily。` });
  }

  // Structured roles are parsed only from existing, sourced literal role labels.
  if (!item.specs.polishingByRole && item.specs.polishingRatio) {
    const value = item.specs.polishingRatio;
    const koji = /麹米\s*([0-9.]+)%/.exec(value);
    const kake = /掛米\s*([0-9.]+)%/.exec(value);
    if (koji || kake) {
      item.specs.polishingByRole = { koji: koji ? Number(koji[1]) : null, kake: kake ? Number(kake[1]) : null, overall: null };
      const proof = item.fieldEvidence.find(e => e.field === "specs.polishingRatio");
      if (proof) item.fieldEvidence.push({ ...proof, field: "specs.polishingByRole", value: item.specs.polishingByRole, derivation: "explicitRoleLabelParsing", meaning: "出典で確認した麹米・掛米の歩合を分離。未記載の歩合はnull。" });
    }
  }
  item.specs.ingredients ??= [];
  item.specs.riceByRole ??= null;
  item.specs.polishingByRole ??= null;
  item.specs.kojiMold ??= null;
  item.specs.agingPeriod ??= null;
  item.specs.agingTemperature ??= null;
  if (!item.specs.riceOrigin && item.specs.ingredients.length && item.specs.ingredients.every(s => /国産/.test(s))) {
    item.specs.riceOrigin = "国産（地域詳細未記載）";
    const proof = item.fieldEvidence.find(e => e.field === "specs.ingredients");
    if (proof) item.fieldEvidence.push({ ...proof, field: "specs.riceOrigin", value: item.specs.riceOrigin, derivation: "explicitIngredientOrigin", meaning: "原材料に国産と直接記載。国産を酒蔵所在地の県産へ読み替えない。" });
  }
  item.temperatureRecommendations ??= [];
  item.pairingEvidence = item.officialPairings.map(dish => {
    const proof = item.fieldEvidence.find(e => e.field === "officialPairings");
    // Cloudy has pairings from both its detail and dedicated page, not just the latter.
    const sourceUrl = patch.pairingSources?.[dish] || (item.id === "sanuki-cloudy-uc9ijh" && baseline.officialPairings.includes(dish) ? oldUrl : proof?.sourceUrl || url);
    return { dish, sourceUrl, sourceType: "breweryOfficial", verifiedAt: phase21VerifiedAt, productScope: "product", meaning: proof?.meaning || "対象商品の公式料理・食材提案を再確認" };
  });
  item.confidenceReason = patch.confidence === "high"
    ? "商品単位の公式資料・直接の特徴根拠を取得。記載がない数値は空欄でも評価を下げない。"
    : patch.confidence === "medium" ? "今回の公式本文再取得ができず、前回の根拠を今回確認済みとは扱わない。"
      : baseline.needsIdentification ? "商品バージョンを一意に同定できない。候補の特徴・数値は転記しない。"
        : baseline.dataConfidence === "medium" ? "商品は同定済み。第三者中心・古い掲載・商品別の裏付け不足のいずれかを監査メモで明示。"
          : "商品を公式の商品欄に同定し、特徴根拠と内部整合性を確認。";
  const unrechecked = ["https://www.sanyouhai.com/product/kaede/", "https://www.tajima-ya.net/ugonotsuki/", "https://www.7yari.co.jp/product/07/"];
  item.featureEvidence = item.featureEvidence.map(e => ({ ...e, recheckStatus: unrechecked.includes(e.sourceUrl) ? "unavailable" : "reconfirmed", recheckAttemptedAt: phase21VerifiedAt }));
  item.fieldEvidence = item.fieldEvidence.map(e => ({ ...e, recheckStatus: unrechecked.includes(e.sourceUrl) ? "unavailable" : "reconfirmed", recheckAttemptedAt: phase21VerifiedAt }));
  return item;
}
