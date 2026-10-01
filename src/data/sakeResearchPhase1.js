const verifiedAt = "2026-10-02";

const emptyResearch = {
  classification: {
    sakeType: "日本酒",
    tokuteiMeishoshu: null,
    junmai: null,
    nonJunmai: null,
    nama: null,
    hiire: null,
    nigori: null,
    sparkling: null,
    genshu: null,
    muroka: null,
    kimoto: null,
    yamahai: null,
  },
  specs: {
    riceVariety: [],
    riceOrigin: null,
    polishingRatio: null,
    alcoholPercentage: null,
    nihonshudo: null,
    acidity: null,
    aminoAcidValue: null,
    yeast: null,
    waterSource: null,
  },
  flavorProfile: {
    sweetness: null,
    aroma: null,
    umami: null,
    acidity: null,
    body: null,
    finish: null,
  },
  featureTags: [],
  aromaNotes: [],
  tasteNotes: [],
  servingTemperatures: [],
  recommendedTemperatureRange: [],
  officialPairings: [],
  yoiPairings: [],
  mealCompatibility: null,
  beginnerFriendly: null,
  season: null,
  seasonalLimited: null,
  limitedDistribution: null,
  breweryLimited: null,
  discontinued: null,
  needsIdentification: false,
  sources: [],
  lastVerifiedAt: verifiedAt,
  dataConfidence: "low",
  shortDescription: "",
};

function research(item) {
  return {
    ...emptyResearch,
    ...item,
    identity: {
      brandName: item.identity?.brandName || item.sake || null,
      productName: item.identity?.productName || item.sake || null,
      brewery: item.identity?.brewery || item.brewery || null,
      prefecture: item.identity?.prefecture || item.prefecture || null,
      officialProductUrl: item.identity?.officialProductUrl || null,
      officialBrandUrl: item.identity?.officialBrandUrl || null,
    },
    classification: {
      ...emptyResearch.classification,
      ...(item.classification || {}),
    },
    specs: {
      ...emptyResearch.specs,
      ...(item.specs || {}),
    },
    flavorProfile: {
      ...emptyResearch.flavorProfile,
      ...(item.flavorProfile || {}),
    },
    lastVerifiedAt: item.lastVerifiedAt || verifiedAt,
  };
}

export const sakeResearchPhase1 = [
  research({
    id: "shichida-junmai",
    identity: {
      brandName: "七田",
      productName: "七田 純米",
      brewery: "天山酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://tenzan.co.jp/product/shichida-jyunmai/",
    },
    classification: {
      tokuteiMeishoshu: "純米酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦", "レイホウ"],
      polishingRatio: "65%",
      alcoholPercentage: "16度",
    },
    flavorProfile: {
      sweetness: "中庸",
      aroma: "穏やか",
      umami: "中程度",
      acidity: "中程度",
      body: "中程度",
      finish: "軽快",
    },
    featureTags: ["米の旨味", "食中酒向き", "冷酒向き", "燗向き"],
    tasteNotes: ["軽やか", "米由来の旨味", "万能型"],
    servingTemperatures: ["冷酒", "ぬる燗"],
    recommendedTemperatureRange: ["10〜15℃", "38〜42℃"],
    officialPairings: ["肉じゃが", "豚の角煮"],
    mealCompatibility: "幅広い家庭料理",
    beginnerFriendly: true,
    limitedDistribution: true,
    dataConfidence: "high",
    shortDescription:
      "軽やかさと米由来の旨味を両立した純米酒。肉じゃがや豚の角煮など、甘辛い家庭料理に合わせやすい一本です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "天山酒造 七田 純米",
        url: "https://tenzan.co.jp/product/shichida-jyunmai/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "azumaichi-junmai-ginjo",
    identity: {
      brandName: "東一",
      productName: "東一 純米吟醸",
      brewery: "五町田酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://azumaichi.com/top/products/seishu/",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
      polishingRatio: "58%",
      alcoholPercentage: "16度",
    },
    flavorProfile: {
      sweetness: "中庸",
      aroma: "穏やか",
      umami: "中程度",
      acidity: "穏やか",
      body: "中程度",
      finish: "なめらか",
    },
    featureTags: ["穏やかな香り", "米の旨味", "食中酒向き", "ぬる燗も可"],
    aromaNotes: ["穏やか"],
    tasteNotes: ["米の旨味", "料理に寄り添う"],
    servingTemperatures: ["冷酒", "常温", "ぬる燗"],
    recommendedTemperatureRange: ["冷やして〜ぬる燗"],
    officialPairings: ["山菜", "キノコの天ぷら", "豚肉のロースト"],
    mealCompatibility: "食事全般",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "穏やかな香りと米の旨味があり、料理の前に出すぎない純米吟醸。焼き物や揚げ物にも静かに寄り添います。",
    sources: [
      {
        type: "breweryOfficial",
        name: "五町田酒造 東一 商品紹介",
        url: "https://azumaichi.com/top/products/seishu/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "azumacho-junmai",
    identity: {
      brandName: "東長",
      productName: "純米東長",
      brewery: "瀬頭酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.azumacho.co.jp/products/list.html",
    },
    classification: {
      tokuteiMeishoshu: "純米酒",
      junmai: true,
    },
    specs: {
      nihonshudo: "-4.6（過去10年平均）",
    },
    flavorProfile: {
      sweetness: "やや甘口寄り",
      umami: "中程度",
      body: "中程度",
      finish: "やわらか",
    },
    featureTags: ["やわらか", "純米", "晩酌向き", "食中酒向き"],
    tasteNotes: ["丸み", "旨味", "穏やか"],
    servingTemperatures: ["常温", "燗酒"],
    mealCompatibility: "晩ごはん向き",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "純米東長として公式ラインナップに確認できる晩酌向きの一本。やわらかい旨味を中心に、普段の食卓へ合わせたい酒です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "瀬頭酒造 商品リスト",
        url: "https://www.azumacho.co.jp/products/list.html",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "amabuki-flower-yeast",
    identity: {
      brandName: "天吹",
      productName: "天吹 純米吟醸 いちご酵母 生",
      brewery: "天吹酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.amabuki.co.jp/sake/000162.php",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
      nama: true,
    },
    specs: {
      riceVariety: ["雄町"],
      polishingRatio: "55%",
      yeast: "いちご酵母",
    },
    flavorProfile: {
      sweetness: "やや甘口",
      aroma: "豊か",
      umami: "中程度",
      acidity: "きれい",
      body: "軽め",
      finish: "爽やか",
    },
    featureTags: ["フルーティ", "爽やかな甘さ", "きれいな酸", "生酒"],
    aromaNotes: ["いちごを思わせる香り"],
    tasteNotes: ["みずみずしい甘み", "軽やかな飲み口", "旨味と酸味のバランス"],
    servingTemperatures: ["冷酒", "常温"],
    recommendedTemperatureRange: ["5〜15℃", "20〜25℃"],
    officialPairings: ["いちご"],
    mealCompatibility: "軽めの前菜や甘酸っぱい料理",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "いちご酵母由来の華やかさと、みずみずしい甘みが魅力。軽い酸があるので、冷やして食前にも楽しみやすい一本です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "天吹酒造 商品紹介",
        url: "https://www.amabuki.co.jp/sake/000162.php",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "manrei-junmai",
    identity: {
      brandName: "万齢",
      productName: "万齢 純米酒",
      brewery: "小松酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.manrei.jp/nihonshu/",
    },
    classification: {
      tokuteiMeishoshu: "純米酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
      riceOrigin: "佐賀県唐津市相知産",
      polishingRatio: "68%",
      alcoholPercentage: "15度",
    },
    flavorProfile: {
      sweetness: "中庸",
      aroma: "穏やか",
      umami: "しっかり",
      body: "中程度",
      finish: "落ち着き",
    },
    featureTags: ["米の旨味", "燗向き", "落ち着き", "晩酌向き"],
    tasteNotes: ["純米らしい旨味", "落ち着いた飲み口"],
    servingTemperatures: ["冷酒", "常温", "ぬる燗"],
    mealCompatibility: "煮物や焼き物",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "地元相知産の山田錦を使った、落ち着きのある純米酒。常温やぬる燗で、煮物や焼き物の旨味を受け止めます。",
    sources: [
      {
        type: "breweryOfficial",
        name: "小松酒造 日本酒",
        url: "https://www.manrei.jp/nihonshu/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "kihotsuru-junmai-ginjo",
    identity: {
      brandName: "基峰鶴",
      productName: "基峰鶴 純米吟醸 山田錦",
      brewery: "基山商店",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.kihotsuru.com/%E5%B1%B1%E7%94%B0%E9%8C%A6",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
    },
    flavorProfile: {
      sweetness: "やや甘みあり",
      aroma: "フルーティ",
      umami: "シルキー",
      acidity: "穏やか",
      body: "軽め",
      finish: "すっきり",
    },
    featureTags: ["フルーティ", "シルキーな旨味", "軽やか", "すっきり"],
    aromaNotes: ["爽やか"],
    tasteNotes: ["山田錦らしい甘み", "抑えられた酸味", "すっきりした後味"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの魚料理や野菜料理",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "爽やかでフルーティな口当たりに、シルキーな旨味が続く純米吟醸。軽い魚料理や野菜のおかずに合わせやすい一本です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "基山商店 純米吟醸山田錦",
        url: "https://www.kihotsuru.com/%E5%B1%B1%E7%94%B0%E9%8C%A6",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "nabeshima-junmai-ginjo",
    identity: {
      brandName: "鍋島",
      productName: "鍋島 純米吟醸 山田錦",
      brewery: "富久千代酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.nabeshima.biz/sake.html",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
    },
    flavorProfile: {
      aroma: "中程度",
      umami: "中程度",
      body: "中程度",
      finish: "きれい",
    },
    featureTags: ["純米吟醸", "山田錦", "きれいな旨味", "食中酒向き"],
    tasteNotes: ["やわらかな旨味", "上品な余韻"],
    mealCompatibility: "幅広い家庭料理",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "公式ラインナップで確認できる山田錦の純米吟醸。詳細スペックは未取得のため、上品な食中酒として控えめに扱います。",
    sources: [
      {
        type: "breweryOfficial",
        name: "富久千代酒造 商品ラインナップ",
        url: "https://www.nabeshima.biz/sake.html",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "koimari-saki",
    identity: {
      brandName: "古伊万里 前",
      productName: "古伊万里 前（さき）",
      brewery: "古伊万里酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://sake-koimari.jp/products/saki/",
    },
    featureTags: ["要商品特定", "特約店限定", "食中酒向き"],
    tasteNotes: ["銘柄シリーズとして確認"],
    mealCompatibility: "商品特定後に再判定",
    limitedDistribution: true,
    needsIdentification: true,
    dataConfidence: "low",
    shortDescription:
      "現在の登録名はシリーズ名に近く、純米・純米吟醸などの商品特定が必要です。次回以降、公式情報で一本に絞って整えます。",
    sources: [
      {
        type: "breweryOfficial",
        name: "古伊万里酒造 古伊万里 前",
        url: "https://sake-koimari.jp/products/saki/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "koeigiku-snow-crescent",
    identity: {
      brandName: "光栄菊",
      productName: "光栄菊 SNOW CRESCENT 無濾過生原酒",
      brewery: "光栄菊酒造",
      prefecture: "佐賀県",
      officialBrandUrl: "https://www.instagram.com/koueigiku/",
    },
    classification: {
      nama: true,
      genshu: true,
      muroka: true,
    },
    featureTags: ["公式SNS確認", "生原酒", "無濾過", "要継続確認"],
    tasteNotes: ["商品名ベースで生原酒として扱う"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの料理",
    dataConfidence: "low",
    shortDescription:
      "公式情報は主にInstagramでの確認に留まるため、味わいの断定は避けます。生原酒らしさを前提に、冷やして楽しむ候補です。",
    sources: [
      {
        type: "officialSocial",
        name: "光栄菊酒造 公式Instagram",
        url: "https://www.instagram.com/koueigiku/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "koeigiku-gekkou",
    identity: {
      brandName: "光栄菊",
      productName: "光栄菊 月光",
      brewery: "光栄菊酒造",
      prefecture: "佐賀県",
      officialBrandUrl: "https://www.instagram.com/koueigiku/",
    },
    featureTags: ["公式SNS確認", "要継続確認", "モダン"],
    tasteNotes: ["商品名確認を優先"],
    mealCompatibility: "商品特定後に再判定",
    dataConfidence: "low",
    shortDescription:
      "蔵元の公式SNSを参照対象にしていますが、商品スペックは未確認です。現時点では表現を控えめにし、次回調査対象に残します。",
    sources: [
      {
        type: "officialSocial",
        name: "光栄菊酒造 公式Instagram",
        url: "https://www.instagram.com/koueigiku/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "miinokotobuki-junmai-ginjo",
    identity: {
      brandName: "三井の寿",
      productName: "三井の寿 純米吟醸 +14 大辛口",
      brewery: "みいの寿",
      prefecture: "福岡県",
      officialBrandUrl: "https://miinokotobuki.com/cn",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
      polishingRatio: "60%",
      nihonshudo: "+14",
      acidity: "1.8",
    },
    flavorProfile: {
      sweetness: "辛口",
      umami: "中程度",
      acidity: "中程度",
      body: "軽め",
      finish: "すっきり",
    },
    featureTags: ["大辛口", "米の旨味", "すっきり", "ぬる燗も可"],
    tasteNotes: ["辛口", "米の旨味", "キレ"],
    servingTemperatures: ["冷酒", "ぬる燗"],
    recommendedTemperatureRange: ["10℃前後", "40℃前後"],
    officialPairings: ["白身魚", "豆腐", "炊き合わせ"],
    mealCompatibility: "淡い味付けの和食",
    beginnerFriendly: false,
    dataConfidence: "medium",
    shortDescription:
      "公式ラインナップで+14大辛口を確認し、専門DBで山田錦60%と大辛口の特徴を補強。淡い和食に合わせやすい辛口です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "みいの寿 商品紹介",
        url: "https://miinokotobuki.com/cn",
        verifiedAt,
      },
      {
        type: "specialistDatabase",
        name: "Sakenomy 三井の寿 純米吟醸 +14 大辛口",
        url: "https://www.sakenomy.jp/sake/TST0000003066/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "hana-no-ka-junmai-daiginjo-1",
    identity: {
      brandName: "花の香",
      productName: "花の香 桜花 純米大吟醸",
      brewery: "花の香酒造",
      prefecture: "熊本県",
      officialProductUrl: "https://www.hananoka.co.jp/products-category/hananoka-series/",
    },
    classification: {
      tokuteiMeishoshu: "純米大吟醸酒",
      junmai: true,
    },
    specs: {
      riceVariety: ["山田錦"],
      polishingRatio: "50%",
    },
    flavorProfile: {
      aroma: "華やか",
      umami: "軽め",
      acidity: "きれい",
      body: "軽め",
      finish: "キレ",
    },
    featureTags: ["華やか", "純米大吟醸", "きれいなキレ", "軽やか"],
    aromaNotes: ["花を思わせる香り"],
    tasteNotes: ["爽やか", "キレ"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの家庭料理",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "山田錦50%の純米大吟醸。花を思わせる香りときれいなキレがあり、軽い料理に合わせると余韻が整います。",
    sources: [
      {
        type: "breweryOfficial",
        name: "花の香酒造 花の香シリーズ",
        url: "https://www.hananoka.co.jp/products-category/hananoka-series/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "ubusuna-yamada-nishiki",
    identity: {
      brandName: "産土",
      productName: "産土 山田錦",
      brewery: "花の香酒造",
      prefecture: "熊本県",
      officialProductUrl: "https://www.hananoka.co.jp/products-category/hananoka-series/",
    },
    specs: {
      riceVariety: ["山田錦"],
      yeast: "熊本9号酵母",
    },
    flavorProfile: {
      sweetness: "やや甘みあり",
      aroma: "中程度",
      umami: "中程度",
      body: "みずみずしい",
      finish: "フレッシュ",
    },
    featureTags: ["みずみずしい", "フレッシュ", "甘み", "旨味"],
    tasteNotes: ["酒の甘み", "水の質感", "新鮮な旨味"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの食卓",
    beginnerFriendly: true,
    dataConfidence: "high",
    shortDescription:
      "熊本9号酵母と山田錦による、みずみずしい甘みと新鮮な旨味の一本。冷やして、軽めの食卓に合わせたい酒です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "花の香酒造 産土 山田錦",
        url: "https://www.hananoka.co.jp/products-category/hananoka-series/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "mutsu-hassen-red-label",
    identity: {
      brandName: "陸奥八仙",
      productName: "陸奥八仙 赤ラベル 特別純米（火入）",
      brewery: "八戸酒造",
      prefecture: "青森県",
      officialProductUrl: "https://mutsu8000.com/products/",
    },
    classification: {
      tokuteiMeishoshu: "特別純米酒",
      junmai: true,
      hiire: true,
    },
    featureTags: ["特別純米", "火入れ", "フレッシュ感", "食中酒向き"],
    tasteNotes: ["商品特性は詳細ページで継続確認"],
    servingTemperatures: ["冷酒", "常温"],
    mealCompatibility: "魚料理や肉のおかず",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "公式ラインナップで赤ラベル特別純米の火入れを確認。詳細な味わいは次回確認し、現時点では食中酒寄りに控えめに扱います。",
    sources: [
      {
        type: "breweryOfficial",
        name: "八戸酒造 商品紹介",
        url: "https://mutsu8000.com/products/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "dassai-23",
    identity: {
      brandName: "獺祭",
      productName: "獺祭 純米大吟醸 磨き二割三分",
      brewery: "獺祭",
      prefecture: "山口県",
      officialProductUrl: "https://dassai.com/",
    },
    classification: {
      tokuteiMeishoshu: "純米大吟醸酒",
      junmai: true,
    },
    specs: {
      polishingRatio: "23%",
    },
    flavorProfile: {
      sweetness: "中庸",
      aroma: "華やか",
      umami: "繊細",
      body: "軽め",
      finish: "きれい",
    },
    featureTags: ["純米大吟醸", "華やか", "繊細", "初心者にも"],
    tasteNotes: ["きれい", "上品", "透明感"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの料理や食前",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "公式ラインナップにある磨き二割三分。商品名から精米23%は確認できますが、料理提案は控えめに、華やかで繊細な酒として扱います。",
    sources: [
      {
        type: "breweryOfficial",
        name: "獺祭 公式サイト 銘柄一覧",
        url: "https://dassai.com/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "dassai-45",
    identity: {
      brandName: "獺祭",
      productName: "獺祭 純米大吟醸45",
      brewery: "獺祭",
      prefecture: "山口県",
      officialProductUrl: "https://dassai.com/",
    },
    classification: {
      tokuteiMeishoshu: "純米大吟醸酒",
      junmai: true,
    },
    specs: {
      polishingRatio: "45%",
    },
    flavorProfile: {
      aroma: "華やか",
      umami: "軽め",
      body: "軽め",
      finish: "きれい",
    },
    featureTags: ["純米大吟醸", "冷酒向き", "華やか", "軽やか"],
    tasteNotes: ["上品", "飲みやすい"],
    servingTemperatures: ["冷酒"],
    mealCompatibility: "軽めの家庭料理",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "獺祭の定番として扱いやすい純米大吟醸45。公式サイトで蔵の方針とラインナップを確認し、華やかで軽い酒として整理しました。",
    sources: [
      {
        type: "breweryOfficial",
        name: "獺祭 公式サイト",
        url: "https://dassai.com/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "nogomi-tokubetsu-junmai",
    identity: {
      brandName: "能古見",
      productName: "能古見 特別純米",
      brewery: "馬場酒造場",
      prefecture: "佐賀県",
      officialBrandUrl: "https://www.nogomi.co.jp/",
    },
    classification: {
      tokuteiMeishoshu: "特別純米酒",
      junmai: true,
    },
    featureTags: ["特別純米", "佐賀の米", "食中酒向き", "要継続確認"],
    tasteNotes: ["家庭料理に寄せて再調査予定"],
    mealCompatibility: "普段の食卓",
    dataConfidence: "low",
    shortDescription:
      "蔵元公式サイトで酒造りの考え方は確認済みですが、商品詳細の取得が不足しています。味わい表現は次回調査まで控えめにします。",
    sources: [
      {
        type: "breweryOfficial",
        name: "馬場酒造場 公式サイト",
        url: "https://www.nogomi.co.jp/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "chiebijin-junmai",
    identity: {
      brandName: "ちえびじん",
      productName: "ちえびじん 純米酒",
      brewery: "中野酒造",
      prefecture: "大分県",
      officialBrandUrl: "https://chiebijin.com/",
    },
    classification: {
      tokuteiMeishoshu: "純米酒",
      junmai: true,
    },
    featureTags: ["純米", "要商品詳細確認", "食中酒向き"],
    tasteNotes: ["公式サイトの詳細確認を継続"],
    mealCompatibility: "家庭料理",
    dataConfidence: "low",
    shortDescription:
      "公式サイトは確認済みですが、商品別スペックの取得が未完了です。現時点では純米酒としての食中酒候補に留めます。",
    sources: [
      {
        type: "breweryOfficial",
        name: "中野酒造 ちえびじん公式サイト",
        url: "https://chiebijin.com/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "wakanami-junmai",
    identity: {
      brandName: "若波",
      productName: "若波 純米吟醸",
      brewery: "若波酒造",
      prefecture: "福岡県",
      officialBrandUrl: "https://www.wakanami.jp/",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    featureTags: ["純米吟醸", "要商品詳細確認", "食中酒向き"],
    tasteNotes: ["公式情報の詳細取得を継続"],
    mealCompatibility: "家庭料理",
    dataConfidence: "low",
    shortDescription:
      "既存データは純米吟醸に整理済み。公式サイトで商品詳細を再確認するまでは、味わい表現を広げすぎない方針です。",
    sources: [
      {
        type: "breweryOfficial",
        name: "若波酒造 公式サイト",
        url: "https://www.wakanami.jp/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "sharaku-junmai-ginjo",
    identity: {
      brandName: "写楽",
      productName: "写楽 純米吟醸",
      brewery: "宮泉銘醸",
      prefecture: "福島県",
      officialBrandUrl: "https://miyaizumi.co.jp/",
    },
    classification: {
      tokuteiMeishoshu: "純米吟醸酒",
      junmai: true,
    },
    featureTags: ["純米吟醸", "要商品詳細確認", "食中酒向き"],
    tasteNotes: ["季節商品差があるため継続確認"],
    mealCompatibility: "家庭料理",
    dataConfidence: "low",
    shortDescription:
      "蔵元公式サイトでは季節商品の発売時期が取扱店により異なる旨が示されています。商品詳細は継続確認し、断定表現を避けます。",
    sources: [
      {
        type: "breweryOfficial",
        name: "宮泉銘醸 公式サイト",
        url: "https://miyaizumi.co.jp/",
        verifiedAt,
      },
    ],
  }),
  research({
    id: "nabeshima-tokubetsu-junmai",
    identity: {
      brandName: "鍋島",
      productName: "鍋島 特別純米酒",
      brewery: "富久千代酒造",
      prefecture: "佐賀県",
      officialProductUrl: "https://www.nabeshima.biz/sake.html",
    },
    classification: {
      tokuteiMeishoshu: "特別純米酒",
      junmai: true,
    },
    featureTags: ["特別純米", "定番", "食中酒向き", "公式ラインナップ確認"],
    tasteNotes: ["詳細スペックは継続確認"],
    mealCompatibility: "幅広い家庭料理",
    beginnerFriendly: true,
    dataConfidence: "medium",
    shortDescription:
      "公式ラインナップで特別純米酒を確認。詳細な味わいは未取得のため、家庭料理に合わせやすい定番酒として整理しました。",
    sources: [
      {
        type: "breweryOfficial",
        name: "富久千代酒造 商品ラインナップ",
        url: "https://www.nabeshima.biz/sake.html",
        verifiedAt,
      },
    ],
  }),
];

export const sakeResearchPhase1ById = Object.fromEntries(
  sakeResearchPhase1.map((item) => [item.id, item]),
);
