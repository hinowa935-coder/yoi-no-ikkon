// Presentation only: keep the original facts and their evidence in the catalog.
const replacements = {
  "フルーティ": "フルーティーな味わい", "フルーティー": "フルーティーな味わい",
  "ジューシー": "ジューシーな味わい", "フレッシュ": "フレッシュな味わい",
  "芳醇": "芳醇な味わい", "濃醇": "濃醇な味わい", "濃厚": "濃厚な味わい",
  "淡麗": "淡麗な味わい", "ふくよか": "ふくよかな味わい",
  "まろやか": "まろやかな味わい", "マイルド": "マイルドな味わい",
  "やや豊潤": "やや豊潤な味わい", "柔らか": "柔らかな味わい",
  "柔らかい": "柔らかい味わい", "柔らかさ": "柔らかな味わい",
  "軽やか": "軽やかな味わい", "軽快": "軽快な味わい",
  "ライト": "軽い飲み口", "とても軽快": "軽快な味わい",
  "ドライ": "ドライな味わい", "辛口タイプ": "辛口の味わい",
  "すっきり": "すっきりした味わい", "スッキリ": "すっきりした味わい",
  "さっぱり": "さっぱりした味わい", "爽やか": "爽やかな味わい",
  "爽快": "爽快な味わい", "さらり": "さらりとした飲み口",
  "なめらか": "なめらかな味わい", "華やか": "華やかな味わい",
  "厚み": "味わいの厚み", "深み": "味わいの深み",
  "コク": "コク", "酸": "酸味", "香り高い": "香り",
  "重厚感": "味わいの重厚感", "重層的": "味わいの重なり",
  "透明感": "味わいの透明感", "複雑味": "複雑な味わい",
  "バランス": "味わいのバランス", "バランスの良さ": "味わいのバランス",
  "味のバランス": "味わいのバランス", "バランスの良い味": "バランスのよい味わい",
  "甘酸のバランス": "甘みと酸味のバランス", "酸味との調和": "酸味との調和",
  "甘酸": "甘みと酸味",
  "甘酸っぱい": "甘酸っぱい味わい",
  "味わい深い": "深い味わい", "コクのある": "コクのある味わい",
  "キレ": "キレ", "キレがある": "キレ", "キレがよい": "キレのよさ",
  "キレが良い": "キレのよさ", "キレ味が良い": "キレのよさ",
  "キレ味抜群": "キレのよさ", "とてもキレがある": "キレ",
  "キレの良さ": "キレのよさ", "スパッとキレ": "キレ",
  "後キレがよい": "後口のキレ", "後キレの良さ": "後口のキレ",
  "きれいに切れる": "キレ", "後味がすっと切れる": "後味のキレ",
  "後口はドライ": "ドライな後口", "後味すっきり": "すっきりした後味",
  "旨味のアタック": "飲み始めに感じる旨味", "米の旨味に重点": "米の旨味",
  "巾のある米の旨味": "幅のある米の旨味", "透過性が高く力強い旨味": "力強い旨味",
  "米の旨味をしっかり感じる": "しっかりした米の旨味",
  "米の旨さ": "米の旨味", "米の旨みが凝縮した味わい": "凝縮した米の旨味",
  "旨味があり飲み口が軽い": "旨味のある軽い飲み口",
  "旨味・甘味・酸味の調和": "旨味、甘み、酸味の調和",
  "米の甘味・旨味・酸味の調和": "米の甘み、旨味、酸味の調和",
  "甘味と酸味が調和": "甘みと酸味の調和",
  "甘味と酸味のバランスが良い": "甘みと酸味のバランス",
  "酸と旨みのバランスが良い": "酸味と旨味のバランス",
  "酸味・旨味とのバランス": "酸味と旨味のバランス",
  "酸味が全体を支える": "味わいを支える酸味", "酸味を低く抑えた": "控えめな酸味",
  "微かに酸を感じる": "かすかな酸味", "やや甘": "やや甘口の味わい",
  "甘さをほとんど感じない": "甘さをほとんど感じない味わい",
  "甘さ控えめ": "控えめな甘さ", "甘く軽快": "甘みのある軽快な味わい",
  "とろりとした甘味・辛口": "とろりとした甘みと辛口の味わい",
  "初めのほのかな甘味から辛口へ変化": "ほのかな甘みから辛口へ移る味わい",
  "中口・やや辛口": "中口からやや辛口の味わい",
  "濃醇・コク豊か": "濃醇でコクのある味わい",
  "濃厚旨口": "濃厚な旨口の味わい", "芳醇旨口": "芳醇な旨口の味わい",
  "淡麗旨口": "淡麗な旨口の味わい", "芳醇甘口": "芳醇な甘口の味わい",
  "濃醇辛口": "濃醇な辛口の味わい", "甘旨口": "甘みと旨味のある味わい",
  "旨口": "旨味のある味わい", "中口": "中口の味わい",
  "甘口": "甘口の味わい", "辛口": "辛口の味わい",
  "大辛口": "大辛口の味わい", "超辛口": "超辛口の味わい", "超甘口": "甘みの強い味わい",
  "やや辛口": "やや辛口の味わい", "やや甘口": "やや甘口の味わい",
  "ほんのり甘口": "ほんのり甘口の味わい",
  "綺麗でキレがある": "きれいな後口とキレ",
  "やわらかく味幅がある": "やわらかく幅のある味わい",
  "濃醇で味わい深い": "濃醇で深い味わい",
  "旨味と酸味が調和": "旨味と酸味の調和",
  "軽い口当たりながら味わい深い": "軽い口当たりと深い味わい",
  "深み・軽やかさ・複雑さ・繊細さ": "深みと軽やかさ",
  "のど越し爽やかな清涼感": "爽やかなのど越し",
  "香味の主張が控えめ": "控えめな香味",
  "すぱっと切れた後に広がる余韻": "キレと、その後に残る余韻",
  "美しい余韻": "余韻", "厚みのある仕立て": "厚みのある味わい",
  "余韻のある仕立て": "余韻", "馥郁たる香り": "豊かな香り",
  "柔らかい口当たり・やや濃醇": "柔らかい口当たりと、やや濃醇な味わい",
  "なめらかな口当たり、透明感": "なめらかな口当たりと透明感",
  "なめらかな口当たり・ボリューム感": "なめらかな口当たりとボリューム感",
  "優しい口当たり、ボリューム感": "やさしい口当たりとボリューム感",
  "ほのかなチェリー様の香り": "チェリーを思わせるほのかな香り",
  "すっきりしてさらりとした飲み口、旨みとキレ": "さらりとした飲み口と、旨味、キレ",
  "燗でしっかりとした旨味": "燗で感じるしっかりした旨味",
  "燗で穏やかで優しい旨味": "燗で感じる穏やかでやさしい旨味",
  "燗酒で旨味が伸びる": "燗で楽しめる旨味",
  "開栓後に落ち着いた旨味が増す": "開栓後に増す落ち着いた旨味",
  "辛口。燗では程よい甘み": "辛口の味わいと、燗で感じるほどよい甘み",
  "熟したバナナ、アプリコット、オレンジ、イチジクの果実味": "熟したバナナやアプリコットを思わせる果実味",
  "やや豊潤・やや柔らかい": "やや豊潤で柔らかな味わい",
  "柔らかな中にもコク": "柔らかさとコク",
  "口当たりがよい": "口当たりのよさ", "口当たりが良い": "口当たりのよさ",
  "軽やかですっきり": "軽やかですっきりした味わい",
  "飲みやすくすっきり": "飲みやすい、すっきりした味わい",
  "すっきり、まろやか": "すっきりとまろやかさのある味わい",
  "滑らかで重層的": "なめらかで重なりのある味わい",
  "やさしくマイルド": "やさしくマイルドな味わい",
  "優しくまろやか": "やさしくまろやかな味わい",
  "まろやかでふくらみがある": "まろやかでふくらみのある味わい",
  "なめらかでふっくら、軽やか": "なめらかでふくらみのある、軽やかな味わい",
  "洗練爽快": "爽快な味わい", "すっきり淡麗": "すっきりした淡麗な味わい",
  "純米らしいコク": "コク", "生酒らしい旨味": "旨味",
  "雄町米ならではの旨味": "雄町米の旨味", "山田錦らしい甘み": "山田錦の甘み",
  "オレンジ・シナモン風味": "オレンジやシナモンを思わせる風味",
  "メロン・バナナ香": "メロンやバナナを思わせる香り",
  "マスカット・メロンの香り": "マスカットやメロンを思わせる香り",
  "ナッツ・カラメル香": "ナッツやカラメルを思わせる香り",
  "穏やかな香り。和梨・メロンを思わせる果実香": "和梨やメロンを思わせる穏やかな香り",
  "冷・常温でフルーティー": "冷酒や常温で感じるフルーティーな香り",
  "冷・常温でほのかな酸、燗で優しい酸味": "冷酒や常温ではほのかに、燗ではやさしく感じる酸味",
  "瑞々しい立ち香・爽やかな含み香": "みずみずしい立ち香と爽やかな含み香",
  "ほのかに甘い香り・華やか": "ほのかに甘く華やかな香り",
  "フレッシュで発泡感がある": "フレッシュな味わいと発泡感",
  "飲みやすい": "飲みやすさ", "飲み飽きしない": "飲み飽きしない味わい",
};
const fieldWords = { aroma: "香り", sweetness: "甘み", acidity: "酸味", umami: "旨味", body: "味わい", finish: "後味" };
const aromaReplacements = {
  "フルーティ": "フルーティーな香り", "豊か": "豊かな香り", "穏やか": "穏やかな香り",
  "香り高い": "香り", "花のように香り高い": "花を思わせる香り",
  "やや華やか": "やや華やかな香り", "上品で華やか": "上品で華やかな香り",
  "柔らかく爽やか": "柔らかく爽やかな香り", "華やか・フルーティ": "華やかでフルーティーな香り",
  "メロン・白桃": "メロンや白桃を思わせる香り",
  "洋梨・パッションフルーツ": "洋梨やパッションフルーツを思わせる香り",
  "洋ナシの果実を思わせる": "洋梨を思わせる香り",
  "リンゴやパッションフルーツを思わせる": "リンゴやパッションフルーツを思わせる香り",
  "スモークナッツ、バニラ、炊き立ての米、熟したザラメを思わせる熟成香": "ナッツやバニラを思わせる熟成香",
  "杏、クローブ、炒ったアーモンド、ほのかなヨードやアニスを思わせる香り": "杏やクローブ、アーモンドを思わせる香り",
  "乳製品・米・白い果肉の果実・ミネラルを思わせる香り": "乳製品や白い果肉の果実を思わせる香り",
  "果実香、百合、ライムピール、ローストナッツのニュアンス": "果実や百合、ライムの皮を思わせる香り",
  "乾燥ナツメグ、干し草、ヨーグルトを思わせる香り": "ナツメグやヨーグルトを思わせる香り",
};

export function naturalTasteTerm(value, field = "") {
  if (typeof value !== "string" || !value.trim()) return "";
  const text = value.trim();
  if (field === "aroma" && aromaReplacements[text]) return aromaReplacements[text];
  if (replacements[text]) return replacements[text];
  if (/紹介|公式|蔵元|商品説明|資料|記載|によると|とのこと|とされ|と案内|と説明|謳/.test(text)) return "";
  // Do not guess how an unfamiliar predicate should be attached to a noun.
  if (/[。]|伸びる$|増す$|広がる$|消える$|抜ける$/.test(text)) return "";
  if (/味|み|さ|香|香り|感|口|越し|ごし|キレ|こし|ふくらみ|バランス|調和|甘口|辛口|中口|余韻|透明感|とろみ$/.test(text) && text.length <= 42)
    return text.replaceAll("・", "と");
  if (fieldWords[field] && /ある$|高い$/.test(text)) return `${text}${fieldWords[field]}`;
  return "";
}

function evidenceFor(research, field, value) {
  return field.startsWith("flavorProfile.")
    ? (research.fieldEvidence || []).filter(e => e.field === field && [e.value].flat().includes(value) && e.sourceUrl && e.verifiedAt)
    : (research.featureEvidence || []).filter(e => e.feature === value && e.sourceUrl && e.verifiedAt);
}
function featureGroup(text, field) {
  if (/香/.test(text) || field === "aroma") return "aroma";
  if (/旨み|旨味|コク/.test(text) || field === "umami") return "umami";
  if (/酸/.test(text) || field === "acidity") return "acidity";
  if (/甘/.test(text) || field === "sweetness") return "sweetness";
  if (/キレ|後味|後口|余韻/.test(text) || field === "finish") return "finish";
  return "body";
}
function hash(id) {
  return Array.from(id).reduce((sum, c) => sum + c.codePointAt(0), 0);
}

// Individually edited passages are used only while their exact supporting facts match.
const passages = {
  "nogomi-tokubetsu-junmai": { values: ["ほのかな吟醸香", "米の旨み"], text: "ほのかに香る吟醸香。米の旨みも楽しめる一本です。" },
  "shichida-junmai": { values: ["米由来の旨味", "軽やかな味わい"], text: "米由来の旨味を、軽やかな味わいで楽しめます。" },
  "azumaichi-junmai-ginjo": { values: ["穏やかな香り", "米の旨味"], text: "香りは穏やか。米の旨味を楽しめる酒です。" },
  "nabeshima-junmai-ginjo": { values: ["穏やかな吟醸香", "のど越し爽やかな清涼感"], text: "穏やかな吟醸香が特徴。のど越しは爽やかです。" },
  "koeigiku-snow-crescent": { values: ["梨やバナナを思わせる果実香", "ジューシーな旨味"], text: "梨やバナナを思わせる香り。ジューシーな旨味を楽しめます。" },
  "niwa-no-uguisu-junmai-ginjo": { values: ["フレッシュ", "甘みと酸味"], text: "フレッシュな味わいの一本。甘みと酸味も感じられます。" },
  "miinokotobuki-junmai-ginjo": { values: ["キレ", "大辛口"], text: "大辛口の味わいとキレを楽しめる一本。" },
  "akabu-junmai": { values: ["米の旨味", "柑橘系の酸味"], text: "米の旨味と柑橘系の酸味。それぞれの味わいを楽しめます。" },
  "sharaku-junmai-ginjo": { values: ["米の旨味", "甘味と酸味が調和"], text: "米の旨味があり、甘みと酸味の調和も楽しめます。" },
  "kubota-senju": { values: ["淡麗", "穏やかな香り"], text: "淡麗な味わいに、穏やかな香り。" },
  "tedorigawa-yamahai-junmai": { values: ["冷・常温でフルーティー", "燗で穏やかで優しい旨味"], text: "冷酒や常温ではフルーティーな香りを。燗では穏やかでやさしい旨味を楽しめます。" },
  "kamoshibito-kuheiji-eau-du-desir": { values: ["熟した果実の旨味", "重層的"], text: "熟した果実の旨味が特徴。味わいの重なりも楽しめます。" },
  "houraisen-wa-junmai-ginjo": { values: ["やわらかな甘味", "爽やかな酸味"], text: "やわらかな甘みと爽やかな酸味を楽しめる酒。" },
  "dassai-45": { values: ["華やかな香り", "米由来の繊細な甘み"], text: "華やかな香りの一本。米由来の繊細な甘みも楽しめます。" },
  "kameizumi-cel24": { values: ["強く立つ香り", "酸味と甘味のバランス"], text: "香りが強く立つ酒。酸味と甘みのバランスも楽しめます。" },
  "koeigiku-gekkou": { values: ["パイナップルや南国果実を思わせる香り", "酸味・旨味とのバランス"], text: "パイナップルなどの南国果実を思わせる香り。酸味と旨味のバランスを楽しめます。" },
  "fukuiwai-gg3q4p": { values: ["白ワインのような甘味", "白ワインのような酸味"], text: "白ワインを思わせる甘みと酸味が特徴。" },
  "urakasumi-i3yhce": { values: ["米の旨味", "酸味との調和"], text: "米の旨味と酸味の調和を楽しめます。" },
  "okunokami-kflfjg": { values: ["穏やかな香り。和梨・メロンを思わせる果実香", "燗酒で旨味が伸びる"], text: "和梨やメロンを思わせる穏やかな香り。燗にすると旨味も楽しめます。" },
  "kikko-hanabishi-hdomtl-4": { values: ["開栓後に落ち着いた旨味が増す", "開けたてのフレッシュな味わい"], text: "開けたてはフレッシュな味わい。開栓後には、落ち着いた旨味が増していきます。" },
  "matsu-midori-nz2hmwijh": { values: ["ほんのり甘口", "爽やかな酸味"], text: "ほんのり甘口の酒。爽やかな酸味も楽しめます。" },
  "nito-j6jnol": { values: ["甘酸のバランス", "ミネラル感"], text: "甘みと酸味のバランスが特徴。ミネラル感もあります。" },
  "suwaizumi-uzpgk6": { values: ["程よい旨味", "軽やかで、すっきりした口当たり"], text: "軽やかですっきりした口当たり。ほどよい旨味も楽しめます。" },
  "sara-hdomtl-2": { values: ["マスカット・メロンを思わせる香り", "シャープな酸味"], text: "マスカットやメロンを思わせる香りと、シャープな酸味が特徴。" },
  "tatsuriki-g39ip7-4": { values: ["甘さをほとんど感じない", "すぱっと切れた後に広がる余韻"], text: "甘さをほとんど感じない酒。キレのあとに続く余韻も楽しめます。" },
  "morinokura-junmai-v1": { values: ["香味の主張が控えめ", "なめらかでふっくら、軽やか"], text: "香味は控えめ。なめらかでふくらみのある、軽やかな味わいです。" },
  "rokujuyoshu-junmai-ginjo-yamadanishiki-v1": { values: ["穏やかな吟醸香", "旨味と酸味が調和"], text: "穏やかな吟醸香の酒。旨味と酸味の調和も楽しめます。" },
  "umenishiki-ginjo-tsuunosake-v1": { values: ["なめらかな口当たり、透明感", "甘さが抑えられたドライな味わい"], text: "なめらかな口当たりと透明感が特徴。甘さを抑えた、ドライな味わいです。" },
  "niwanouguisu-tokubetsu-junmai-standard-v1": { values: ["軽い口当たりながら味わい深い", "ドライ"], text: "口当たりは軽く、味わいは深い酒。ドライな味わいも楽しめます。" },
  "kawanakajima-tokubetsu-junmai-standard-v1": { values: ["柔らかな中にもコク", "後キレがよい"], text: "柔らかさとコクを楽しめます。後口にキレのある一本。" },
  "aramasa-viridian-hiire-standard-v1": { values: ["厚みのある仕立て", "余韻のある仕立て"], text: "味わいに厚みのある酒。余韻も楽しめます。" },
  "wakaze-the-classic-yamagata-v1": { values: ["ボディ感と軽い飲み心地", "酸味のニュアンス"], text: "ボディ感がありながら、飲み心地は軽い酒。酸味のニュアンスも楽しめます。" },
};
export function buildSakeIntroduction(item) {
  const research = item.sakeResearch;
  const candidates = [];
  const add = (value, field, axis = "") => {
    const term = naturalTasteTerm(value, axis);
    const evidence = evidenceFor(research, field, value);
    if (term && evidence.length) candidates.push({ term, field, value, group: featureGroup(term, axis), evidence });
  };
  for (const axis of ["aroma", "umami", "body", "acidity", "sweetness", "finish", "freshness", "aging"])
    for (const value of [research.flavorProfile?.[axis]].flat().filter(Boolean)) add(value, `flavorProfile.${axis}`, axis);
  const nonTasteTags = new Set([...(research.specs?.riceVariety || []), "夢の香", "佐香錦", "棚田のこしひかり", "秋田酒こまち", "雄町", "美山錦", "吟風", "山田錦"]);
  for (const value of research.verifiedFeatureTags || []) if (!nonTasteTags.has(value)) add(value, "verifiedFeatureTags");
  const unique = candidates.filter((c, i) => candidates.findIndex(v => v.term === c.term) === i);
  const first = unique[0];
  const second = unique.find(c => c.group !== first?.group && c.term !== first?.term && !c.term.includes(first?.term) && !first?.term.includes(c.term));
  const selected = [first, second].filter(Boolean);
  const variant = hash(item.id) % 6;
  const segments = [];
  if (selected.length === 2) {
    const [a, b] = selected;
    const conjunction = /と/.test(a.term) || /と/.test(b.term) ? "、" : "と";
    const forms = [
      `${a.term}と、${b.term}を楽しめる一本。`,
      `${a.term}が特徴。${b.term}も楽しめます。`,
      `${a.term}があり、${b.term}も感じられます。`,
      `${a.term}を楽しめます。${b.term}も、このお酒の特徴です。`,
      `${a.term}${conjunction}${b.term}が特徴の酒。`,
      `${a.term}を感じる一本。${b.term}も楽しめます。`,
    ];
    const passage = passages[item.id];
    const individual = passage && passage.values.every((value, index) => selected[index]?.value === value);
    segments.push({ text: individual ? passage.text : forms[variant], facts: selected, individuallyEdited: Boolean(individual) });
  } else if (first) {
    segments.push({ text: variant % 2 ? `${first.term}が特徴の一本。` : `${first.term}を楽しめます。`, facts: selected });
  } else {
    const classification = research.classification?.tokuteiMeishoshu;
    const rice = (research.specs?.riceVariety || []).find(value => evidenceFor(research, "verifiedFeatureTags", value).length);
    const facts = classification ? [{ field: "classification.tokuteiMeishoshu", value: classification }] : [];
    if (rice) {
      facts.unshift({ field: "verifiedFeatureTags", value: rice, evidence: evidenceFor(research, "verifiedFeatureTags", rice) });
      segments.push({ text: `${rice}を使った${classification || "一本"}。`, facts });
    } else if (classification) {
      segments.push({ text: `${classification}です。`, facts });
    } else if (item.brewery) {
      segments.push({ text: `${item.brewery}が醸す一本。`, facts: [{ field: "identity.brewery", value: item.brewery }] });
    }
  }
  return { text: segments.map(s => s.text).join(""), segments, kind: first ? "taste" : segments.length ? "identityOnly" : "none", featureCount: selected.length };
}
