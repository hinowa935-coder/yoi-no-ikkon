export const discoveryNights = [
  { id: "after-work", name: "仕事を頑張った夜", description: "今日の自分に、おつかれさまを。", moods: ["疲れた夜", "週末"] },
  { id: "quiet", name: "ひとり静かな夜", description: "自分のペースで、ひと皿と一杯。", moods: ["一人飲み", "静かな晩酌"] },
  { id: "rain", name: "雨の夜", description: "雨音を聞きながら、今日は家でゆっくり。", moods: ["雨の日", "静かな晩酌"] },
  { id: "cold", name: "寒い夜", description: "湯気のそばで、ゆっくりあたたまる。", moods: ["あたたまりたい"], warm: true },
  { id: "treat", name: "少し贅沢したい夜", description: "お気に入りの器を出す、そんな夜に。", moods: ["祝い", "週末"] },
  { id: "together", name: "誰かとゆっくり話したい夜", description: "話の続きを、食卓で。", moods: ["家族の食卓", "友人と飲む"] },
  { id: "just-one", name: "軽く一杯だけの夜", description: "小さなひと皿で、今日に区切りを。", moods: ["軽く飲みたい"] },
  { id: "dinner", name: "しっかり食べて飲みたい夜", description: "主菜をひとつ。今夜は、ちゃんと晩ごはん。", moods: ["しっかり食べたい"] },
  { id: "ordinary", name: "なんでもない夜", description: "特別なことはなくても、一杯あるとうれしい。", moods: ["静かな晩酌", "家族の食卓"] },
];

export const foodDirections = [
  { id: "warm", name: "あたたかいもの" },
  { id: "fresh", name: "さっぱりしたもの" },
  { id: "hearty", name: "しっかり食べたい" },
  { id: "small", name: "つまむくらいでいい" },
];

// Food attributes are editorial descriptions of existing home dishes, not sake facts.
export const discoveryDishes = [
  { name: "肉じゃが", directions: ["warm", "hearty"], method: "煮物", flavor: "甘辛い煮汁", rich: true },
  { name: "湯豆腐", directions: ["warm", "small"], method: "鍋物", flavor: "豆腐とだしの穏やかな味", delicate: true },
  { name: "鯖の味噌煮", directions: ["warm", "hearty"], method: "煮魚", flavor: "味噌のコク", rich: true },
  { name: "白菜と豚肉の重ね煮", directions: ["warm", "hearty"], method: "煮物", flavor: "白菜の甘みと豚肉の旨味", rich: true },
  { name: "茶碗蒸し", directions: ["warm", "small"], method: "蒸し物", flavor: "卵とだしのやさしい味", delicate: true },
  { name: "豆腐のきのこあん", directions: ["warm", "small"], method: "煮物", flavor: "きのことだしの旨味", rich: true },
  { name: "冷奴", directions: ["fresh", "small"], method: "豆腐料理", flavor: "豆腐と薬味のさっぱりした味", delicate: true },
  { name: "きゅうりとわかめの酢の物", directions: ["fresh", "small"], method: "酢の物", flavor: "酢のほどよい酸味", vinegar: true },
  { name: "豚しゃぶサラダ", directions: ["fresh", "hearty"], method: "サラダ", flavor: "豚肉と野菜の軽い口当たり", delicate: true },
  { name: "蒸し鶏のねぎだれ", directions: ["fresh", "hearty"], method: "蒸し物", flavor: "鶏肉の旨味とねぎの香り", delicate: true },
  { name: "トマトと大葉の冷奴", directions: ["fresh", "small"], method: "豆腐料理", flavor: "トマトの酸味と大葉の香り", vinegar: true },
  { name: "鯛の昆布じめ", directions: ["fresh", "small"], method: "刺身", flavor: "白身魚と昆布の繊細な旨味", delicate: true },
  { name: "鶏の唐揚げ", directions: ["hearty"], method: "揚げ物", flavor: "鶏肉の旨味と衣の香ばしさ", oily: true, rich: true },
  { name: "豚の生姜焼き", directions: ["hearty"], method: "焼き物", flavor: "甘辛いタレと生姜の香り", rich: true },
  { name: "焼き餃子", directions: ["hearty"], method: "焼き物", flavor: "肉の旨味と焼き目の香ばしさ", oily: true, rich: true },
  { name: "鶏の照り焼き", directions: ["hearty"], method: "焼き物", flavor: "甘辛いタレ", rich: true },
  { name: "ぶりの照り焼き", directions: ["hearty"], method: "焼き魚", flavor: "魚の脂と甘辛いタレ", oily: true, rich: true },
  { name: "なす味噌炒め", directions: ["hearty"], method: "炒め物", flavor: "味噌のコク", oily: true, rich: true },
  { name: "だし巻き卵", directions: ["small", "warm"], method: "焼き物", flavor: "卵とだしのやさしい味", delicate: true },
  { name: "枝豆", directions: ["small", "fresh"], method: "茹で物", flavor: "豆の甘みと塩気", delicate: true },
  { name: "焼きしいたけ", directions: ["small", "warm"], method: "焼き物", flavor: "きのこの旨味と香ばしさ", rich: true },
  { name: "きゅうりの浅漬け", directions: ["small", "fresh"], method: "漬物", flavor: "野菜の軽い塩味", delicate: true },
  { name: "ほうれん草のおひたし", directions: ["small", "fresh"], method: "おひたし", flavor: "青菜とだしの穏やかな味", delicate: true },
  { name: "焼き厚揚げ", directions: ["small", "warm"], method: "焼き物", flavor: "大豆の旨味と香ばしさ", rich: true },
];
