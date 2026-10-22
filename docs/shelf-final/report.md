# 残fallback・正式画像 最終仕上げ

ローカル反映・公開前確認。production完了はまだ宣言しない。

## 結論

- production開始値を実測: 499本 / 直リンク468 / 正式画像465 / fallback31。
- 差分3本ではなく、直リンクのみ5本と画像のみ2本がある。対象はA29・B2・C5の36本。
- 同一商品7本を救済、別SKU14本を新IDで採用。旧29本をINACTIVE化。
- 最終の通常酒棚は484本、直リンク484・正式画像484・fallback0。
- 全31本を同一SKUで回収したという意味ではない。15旧IDは救済できず保留、履歴として保持。
- 既存569商品の元レコードは一切書き換えず、購入案内の既存変更は審査済み7IDに限定。
- ACTIVE蔵元枠は352→341、都道府県46は維持。品質ゲートによる11蔵の一時的な通常掲載減少を隠さない。

## 指定44項目

| No. | 項目 | 結果 |
| --- | --- | --- |
| 1 | 開始時通常酒棚 | 499 |
| 2 | 開始時楽天直リンク | 468 |
| 3 | 開始時正式画像 | 465 |
| 4 | 開始時fallback | 31 |
| 5 | 今回対象 | 36件。未処理0件 |
| 6 | A:リンクなし＋画像なし | 29 |
| 7 | B:リンクなし＋画像あり | 2 |
| 8 | C:リンクあり＋画像なし | 5 |
| 9 | 同一SKU救済 | 7件。購入案内上COMMERCIAL_MATCHでありVerifiedの変更ではない |
| 10 | 別店舗救済 | 3件。同一SKU救済との重複集計 |
| 11 | 画像救済 | 7旧ID。14新IDとは別集計 |
| 12 | 同一銘柄replacement | 12 |
| 13 | 同一酒蔵replacement | 2 |
| 14 | candidate replacement | 0 |
| 15 | 季節酒replacement | 4新SKU。上記replacement内の内数 |
| 16 | 旧商品INACTIVE | 29件。うち14件は新商品への差し替え、15件は公開品質未成立で保留 |
| 17 | 旧商品ARCHIVED | 0 |
| 18 | 新product ID | 14 |
| 19 | sensory再構築 | 14商品。確認できない軸はnull |
| 20 | 口コミ利用 | 0商品。Sakenomyの商品資料は口コミと区別。合意の捏造なし |
| 21 | pairing再構築 | 14商品・編集提案42件。公式料理と分離 |
| 22 | 最終通常酒棚 | 484 |
| 23 | 最終楽天直リンク | 484 |
| 24 | 最終正式画像 | 484 |
| 25 | 最終fallback | 0 |
| 26 | 通常酒棚直リンク率 | 100.00% |
| 27 | 通常酒棚正式画像率 | 100.00% |
| 28 | リンク＋画像あり | 484 |
| 29 | 旧favorite保全 | 旧IDを保持。別SKUへの自動移行なし。単体テスト・ブラウザで確認 |
| 30 | 旧URL保全 | 569既存レコード保全。旧29ページは同じURLで履歴表示・redirectなし |
| 31 | 酒蔵総数 | 352 → 341（ACTIVEの県＋法人名正規化の枠数。履歴では保持） |
| 32 | 都道府県カバー | 46 → 46 |
| 33 | candidate残数 | 50件（既存共通プール）。今回保留15旧IDの専用キューは別集計で、単純合算しない |
| 34 | tests | 173 / 173 |
| 35 | typecheck | 成功 |
| 36 | lint | 既存custom lint成功。ESLint全規則という意味ではない |
| 37 | build | 成功。Webpack。Turbopack既知問題の調査や依存更新なし |
| 38 | code check | 旧569レコードのハッシュ・対象外commerce・アプリ/PWA保護を機械検査。履歴台帳の例外はID/ファイル/前後ハッシュ完全一致のみ |
| 39 | secret scan | 成功。実値・URL/HTMLをログへ出力しない。envのignore/非追跡も検査 |
| 40 | production deployment | 公開前QA中。まだ公開完了とは扱わない |
| 41 | production QA | 未実施 |
| 42 | 実機iPhone | 未実施。WebKitのスマホ幅検証と、実機Safari/インストールPWA確認は別 |
| 43 | 実機Android | 未実施。ブラウザエミュレーションを実機確認とは扱わない |
| 44 | 残課題 | 保留15旧IDの候補品質補強。容量混在画像、製法不明、現行資料不足、単品候補なし等。AdGuard等の利用者側ブロックは既存placeholderで対応 |

## 全36件の判断

| 旧ID | 登録名 | 群 | decision | 新ID | 理由 |
| --- | --- | --- | --- | --- | --- |
| shinshu-kirei-junmai-ginjo | 信州亀齢 ひとごこち 純米吟醸 | A | REPLACED_SAME_BRAND | shinshu-kirei-inakura-hitogokochi-junmai-ginjo-current-v1 | 稲倉の棚田産を明示する別SKUとして新ID。火入れ回数・原酒・分析値は未確認のため設定しない。 |
| kaiun-tokubetsu-junmai | 開運 特別純米 | C | IMAGE_RESCUED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| kameizumi-cel24 | 亀泉 純米吟醸原酒 CEL-24 | A | REPLACED_SAME_BRAND | kameizumi-kouiku63-hiyaoroshi-current-v1 | CEL-24と異なる風鳴子・ひやおろし。保管温度を飲用温度へ転用しない。 |
| kamikawa-taisetsu-junmai | 上川大雪 特別純米 彗星 | A | REPLACED_SAME_BREWERY | tokachi-tokubetsu-junmai-suisei-current-v1 | 緑丘蔵の上川大雪とは別の碧雲蔵・十勝。米品種は販売SKU本文の彗星表記で確認し、公式の品種未記載スペックを補完しない。 |
| hatsumago-i9diua | 初孫 光輝2236 生酛純米大吟醸 | A | EXACT_RECOVERED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| abe-k34lzz | STANDARD  /  あべ | A | REPLACED_SAME_BRAND | abe-silver-hiire-current-v1 | STANDARDという総称からシルバー火入れへ別SKU。現在は特定名称の記載を外しているため、純米吟醸と推測しない。 |
| maibijin-o0ffit | 舞美人 山廃純米酒 蔵付酵母 | A | INACTIVATED | 未確認 | 同一SKUを確定できる販売先・正式素材が未成立。画像非提供・カテゴリへの移動は売切れとは断定しない。 |
| shichihonyari-lvvrsw | 七本鎗 無農薬純米 無有 | A | REPLACED_SAME_BRAND | shichihonyari-muu-1800-current-v1 | 旧登録720mlに1800ml画像を流用せず、容量を明示した新ID。 |
| haginotsuyu-lvvrsw | 萩乃露 純米吟醸 里山（火入） | A | REPLACED_SAME_BRAND | haginotsuyu-amadare-tomizu-hiire-current-v1 | 里山のこしひかり純米吟醸とは別SKU。火入れは当該販売ページ、米・精米・温度・料理カテゴリーは公式の商品欄。 |
| kurumazaka-gp8l70i9d | 車坂 山廃純米酒 | C | REPLACED_SAME_BRAND | kurumazaka-yamahai-akiagari-2019by-current-v1 | 既存の通常山廃から秋あがり2019BYへ別SKU。2026年入荷と醸造年度2019BYを分離。 |
| bentenmusume-uzpgk6 | 辨天娘 純米酒 生酛 玉栄 | A | INACTIVATED | 未確認 | 玉栄生酛と強力R2BY熟成は別SKU。後者は独立資料による当該版の補強が不足。 |
| izumo-fuji-id2kl5 | 出雲富士 手づくり純米吟醸 | A | INACTIVATED | 未確認 | 今回の清酒単品候補なし。前掛け・返礼品は採用不可。不存在・終売の断定ではない。 |
| wakamusume-i9dgkj | わかむすめ 燕子花 純米大吟醸酒 | A | INACTIVATED | 未確認 | 燕子花1800mlは旧参照容量と異なる。十二秘色火入れ候補は独立した現行SKU資料の追加確認待ち。 |
| miyoshikiku-iwjid2 | 三芳菊 等外山田錦 零 ZERO 無濾過生原酒 | A | INACTIVATED | 未確認 | おりがらみ・別シリーズと区別。取得先がカテゴリのため購入可能SKUの確定に至らない。 |
| hanaabi-junmai-daiginjo-1 | 花陽浴 純米大吟醸 越後五百万石 無濾過生 | A | REPLACED_SAME_BRAND | hanaabi-gohyakumangoku-muroka-namagenshu-1800-current-v1 | 旧720ml参照と区別し新ID。おりがらみ商品・THE PREMIUMや異なる米のレビューを混ぜない。Sakenomyの蔵元商品欄のみ利用し、口コミは検証済みに入れない。 |
| sara-hdomtl-2 | 彩來 the starry night Vesper | A | REPLACED_SAME_BRAND | sara-junmai-ginjo-namazume-current-v1 | Vesperとは別の定番火入れ生詰。生詰を生酒とは分類しない。 |
| mimurosugi-roman-series-2 | みむろ杉 ろまんシリーズ 純米吟醸 山田錦 | A | REPLACED_SAME_BRAND | mimurosugi-kioke-bodaimoto-jishaden-current-v1 | ろまん山田錦・露葉風特別純米とは別の木桶菩提もと。特定名称・精米・生火入れは未確認。 |
| taito-tokubetsu-junmai-v1 | 特別純米酒 泰斗 | A | INACTIVATED | 未確認 | 今回の単品候補なし。赤酒を清酒として採用しない。公式取得失敗を不存在扱いしない。 |
| nishinoseki-junmai-ginjo-bigin-v1 | 西の関 純米吟醸 美吟 | C | IMAGE_RESCUED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| mimurosugi-tokubetsu-junmai-tsuyuhakaze-v1 | みむろ杉 ろまんシリーズ 特別純米 辛口 露葉風 | A | INACTIVATED | 未確認 | 露葉風特別純米と木桶菩提もとは別SKU。別IDの新商品を掲載するが旧商品の同一候補とはしない。 |
| daijiro-yamada-junmai-ginjo-hiire-v1 | 大治郎 純米吟醸 山田錦 火入 | A | INACTIVATED | 未確認 | 情熱迷酒は生酒で別SKU。現行独立資料の補強を待ち候補保管。 |
| bentenmusume-junmai-yamahai-gouriki-v1 | 辨天娘 純米酒 山廃 強力 | A | INACTIVATED | 未確認 | 強力R2BYは山廃の確認がなく別SKU。単一資料を過大評価せず候補プールに残す。 |
| shiraito-70-v1 | 白糸70 | A | REPLACED_SAME_BREWERY | tanaka65-hiire-1800-current-v1 | 白糸70とは異なる山田錦65%の火入れ。予約生酒・6513・泡は別商品。 |
| kurawanka-junmai-usunigori-v1 | くらわんか 純米酒 うすにごり | B | INACTIVATED | 未確認 | 720mlうすにごりの現行単品候補を確定できず。同蔵かたの桜は独立IDのまま残す。 |
| toyonoume-yoiyoi-junmai-ginjo-v1 | 豊能梅 宵宵 純米吟醸 | A | INACTIVATED | 未確認 | 公式素材が720ml・1800mlの2本併写。容量一致の単品画像とみなさない。 |
| minami-junmai-ginjo-matsuyamamitsui-standard-v1 | 南 純米吟醸 松山三井 | B | INACTIVATED | 未確認 | 現行補強資料は松山三井50%が中心。候補販売ページ55%・度数167という誤記を含むため、その1800mlを新規の現行SKUとして確定しない。720mlの既存正式画像・旧情報は保存。 |
| biwanosasanami-matsu-junmai-daiginjo-hiire-v1 | 琵琶のささ浪 純米大吟醸 松 火入れ | A | INACTIVATED | 未確認 | 純米原酒は別分類。販売候補の生火入れが明示されず、味・画像だけで確定しない。 |
| shirakiku-vibrant-junmai-hiire-standard-v1 | shirakiku vibrant 純米 火入れ | A | REPLACED_SAME_BRAND | shirakiku-ginshari-tokubetsu-junmai-current-v1 | vibrant黒麹純米とは別SKU。公式商品欄の無濾過原酒・火入れ選択肢を確認。公式の冷やは常温として扱う。 |
| kagura-junmai-daiginjo-shiro-muroka-mukasui-nama-v1 | 神蔵 KAGURA 純米大吟醸 無濾過・無加水・生酒（白） | C | INACTIVATED | 未確認 | 白祝35%生の販売は確認できるが正式画像非提供。野条穂は別SKUとして別IDへ。 |
| kagura-junmai-daiginjo-shiro-muroka-mukasui-ichibi-v1 | 神蔵 KAGURA 純米大吟醸 無濾過・無加水・一火（白） | A | REPLACED_SAME_BRAND | kagura-nojoho-junmai-ginjo-nama-current-v1 | 白ラベルの祝35%純米大吟醸とは別SKU。公式お知らせで野条穂・無濾過無加水生を確認、味・温度・数値は当該販売店。 |
| teishu-kanpaku-karakuchi-honjozo-v1 | からくち 亭主関白 本醸造 | A | INACTIVATED | 未確認 | 単品の清酒販売候補なし。酒器・衣類等は除外。不存在の断定ではない。 |
| akishika-yamahai-junmai-yamadanishiki-70-muroka-genshu-hiire-v1 | 秋鹿 山廃純米 山田錦 無濾過原酒 火入れ | C | IMAGE_RESCUED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| eikofuji-jungetsu-junmai-standard-v1 | 栄光冨士 純月 純米酒 | A | REPLACED_SAME_BRAND | eikofuji-hinowa-muroka-nama-2026-current-v1 | 純月とは別のつや姫50%生原酒。2026年9月出荷の商品欄を使用し、旧年度-4等の値や個人レビューを混在させない。 |
| tabika-junmai-funashibori-ichikai-hiire-v1 | 田光 純米 槽搾り 一回瓶火入れ | A | EXACT_RECOVERED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| wakaze-the-classic-yamagata-v1 | WAKAZE THE CLASSIC（山形製造） | A | EXACT_RECOVERED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |
| azumanofumoto-junmai-ginjo-yamagata-selection-v1 | 純米吟醸 東の麓 山形セレクション | A | EXACT_RECOVERED | 未確認 | 同一商品を本文・容量・製法・原本ラベルから再確認。Verifiedは変更しない。 |

## 新規14SKU

| 旧ID | 新ID | 商品名 | ml | confidence | 確認済み特徴 | 温度 | 楽天通常URL | 出典 | 差分・不明点 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| shinshu-kirei-junmai-ginjo | shinshu-kirei-inakura-hitogokochi-junmai-ginjo-current-v1 | 信州亀齢 純米吟醸 稲倉の棚田産ひとごこち | 720 | medium | 爽やかな香り / 軽快 / 甘味 / 酸味 | 未確認 | https://item.rakuten.co.jp/sake-ichibun/10007456/ | https://item.rakuten.co.jp/sake-ichibun/10007456/ / https://item.rakuten.co.jp/ibaliquors/135/ / https://www.sakenomy.jp/sake/TST0000043380/ | 稲倉の棚田産を明示する別SKUとして新ID。火入れ回数・原酒・分析値は未確認のため設定しない。 |
| kameizumi-cel24 | kameizumi-kouiku63-hiyaoroshi-current-v1 | 亀泉 純米吟醸原酒 高育63号 ひやおろし | 720 | medium | フルーティな香り / ふくらみのある旨味 / キレ | 未確認 | https://item.rakuten.co.jp/kishuuitibanya/ns-225/ | https://item.rakuten.co.jp/kishuuitibanya/ns-225/ / https://www.syusendo-horiichi.co.jp/SHOP/13566.html | CEL-24と異なる風鳴子・ひやおろし。保管温度を飲用温度へ転用しない。 |
| kamikawa-taisetsu-junmai | tokachi-tokubetsu-junmai-suisei-current-v1 | 十勝 特別純米 彗星 | 720 | high | キレ | 未確認 | https://item.rakuten.co.jp/mighty-liquors/10005345/ | https://shop.kamikawa-taisetsu.co.jp/shopdetail/000000000311/ / https://item.rakuten.co.jp/mighty-liquors/10005345/ | 緑丘蔵の上川大雪とは別の碧雲蔵・十勝。米品種は販売SKU本文の彗星表記で確認し、公式の品種未記載スペックを補完しない。 |
| abe-k34lzz | abe-silver-hiire-current-v1 | あべ シルバー 火入れ | 720 | medium | ほどよい酸味 / やさしい旨味 / 軽やか | 未確認 | https://item.rakuten.co.jp/e-wine/dw196/ | https://item.rakuten.co.jp/e-wine/dw196/ / https://www.kanese.com/SHOP/16458.html | STANDARDという総称からシルバー火入れへ別SKU。現在は特定名称の記載を外しているため、純米吟醸と推測しない。 |
| shichihonyari-lvvrsw | shichihonyari-muu-1800-current-v1 | 七本鎗 無農薬純米 無有 1800ml | 1800 | high | やわらかな味わい | 未確認 | https://item.rakuten.co.jp/hasegawasaketen/1003410/ | https://7yari.co.jp/product/102/ / https://item.rakuten.co.jp/hasegawasaketen/1003410/ | 旧登録720mlに1800ml画像を流用せず、容量を明示した新ID。 |
| haginotsuyu-lvvrsw | haginotsuyu-amadare-tomizu-hiire-current-v1 | 萩乃露 特別純米 十水仕込 雨垂れ石を穿つ 火入れ | 720 | high | 濃密な味わい / 爽やか / 食中酒向き | 冷酒 / 常温 / 燗酒 | https://item.rakuten.co.jp/tokuriya/8848/ | https://www.haginotsuyu.co.jp/amadare / https://item.rakuten.co.jp/tokuriya/8848/ | 里山のこしひかり純米吟醸とは別SKU。火入れは当該販売ページ、米・精米・温度・料理カテゴリーは公式の商品欄。 |
| hanaabi-junmai-daiginjo-1 | hanaabi-gohyakumangoku-muroka-namagenshu-1800-current-v1 | 花陽浴 純米大吟醸 越後五百万石 無濾過生原酒 1800ml | 1800 | medium | 果実を思わせる香り / 甘さ控えめ | 花冷え / 涼冷え | https://item.rakuten.co.jp/mighty-liquors/sa103013/ | https://www.sakenomy.jp/sake/TST0000042113/ / https://item.rakuten.co.jp/mighty-liquors/sa103013/ | 旧720ml参照と区別し新ID。おりがらみ商品・THE PREMIUMや異なる米のレビューを混ぜない。Sakenomyの蔵元商品欄のみ利用し、口コミは検証済みに入れない。 |
| sara-hdomtl-2 | sara-junmai-ginjo-namazume-current-v1 | 彩來 純米吟醸 生詰 | 720 | medium | マスカットを思わせる香り / 米の甘味 / キレ | 未確認 | https://item.rakuten.co.jp/yamasake/5775/ | https://item.rakuten.co.jp/yamasake/5775/ / https://item.rakuten.co.jp/mashidayahonten/6002/ / https://www.icheers.tw/iCheers/Sake/WineDetail/wine_detail/40772 | Vesperとは別の定番火入れ生詰。生詰を生酒とは分類しない。 |
| mimurosugi-roman-series-2 | mimurosugi-kioke-bodaimoto-jishaden-current-v1 | みむろ杉 木桶菩提もと 自社田山田錦 | 720 | medium | 白桃を思わせる香り / 旨味 / 酸味 / 長い余韻 | 未確認 | https://item.rakuten.co.jp/bisyugakou/ms010-n72/ | https://item.rakuten.co.jp/bisyugakou/ms010-n72/ / https://www.imanaka-sakeshop.com/shopdetail/000000005277/4/page8/order/ | ろまん山田錦・露葉風特別純米とは別の木桶菩提もと。特定名称・精米・生火入れは未確認。 |
| shiraito-70-v1 | tanaka65-hiire-1800-current-v1 | 田中六五 純米酒 火入れ 1800ml | 1800 | medium | 穏やかな香り / 旨味 / 酸味 / ふくよか | 未確認 | https://item.rakuten.co.jp/hasegawasaketen/1008344/ | https://item.rakuten.co.jp/hasegawasaketen/1008344/ / https://ontable.jp/shopdetail/000000002640/ | 白糸70とは異なる山田錦65%の火入れ。予約生酒・6513・泡は別商品。 |
| shirakiku-vibrant-junmai-hiire-standard-v1 | shirakiku-ginshari-tokubetsu-junmai-current-v1 | shirakiku 特別純米 銀シャリ 火入れ | 720 | high | 辛口 / 酸味 / 食中酒向き | 常温 / 燗酒 | https://item.rakuten.co.jp/sakayainoue/4525892180129/ | https://sake-shirakiku.jp/products/silver / https://item.rakuten.co.jp/sakayainoue/4525892180129/ | vibrant黒麹純米とは別SKU。公式商品欄の無濾過原酒・火入れ選択肢を確認。公式の冷やは常温として扱う。 |
| kagura-junmai-daiginjo-shiro-muroka-mukasui-ichibi-v1 | kagura-nojoho-junmai-ginjo-nama-current-v1 | 神蔵 純米吟醸 野条穂 無濾過・無加水・生酒 | 720 | medium | フルーティな香り / 辛口 / 米の旨味 | 冷酒 / 常温 / 燗酒 | https://item.rakuten.co.jp/hoshigulf/4530731780033/ | https://item.rakuten.co.jp/hoshigulf/4530731780033/ / https://matsuishuzo.com/?mode=f5 | 白ラベルの祝35%純米大吟醸とは別SKU。公式お知らせで野条穂・無濾過無加水生を確認、味・温度・数値は当該販売店。 |
| eikofuji-jungetsu-junmai-standard-v1 | eikofuji-hinowa-muroka-nama-2026-current-v1 | 栄光冨士 日乃輪 純米大吟醸 無濾過生原酒 2026 | 720 | medium | 華やかな香り / なめらか / 米の甘味 | 未確認 | https://item.rakuten.co.jp/maruishi/10006801/ | https://www.haruyama-sake.com/SHOP/YG090101072136.html / https://item.rakuten.co.jp/maruishi/10006801/ | 純月とは別のつや姫50%生原酒。2026年9月出荷の商品欄を使用し、旧年度-4等の値や個人レビューを混在させない。 |
| kurumazaka-gp8l70i9d | kurumazaka-yamahai-akiagari-2019by-current-v1 | 車坂 山廃純米酒 秋あがり 2019BY | 720 | medium | 熟成感 / 旨味 / 酸味 / キレ | 未確認 | https://item.rakuten.co.jp/kishuuitibanya/ns-604/ | https://item.rakuten.co.jp/kishuuitibanya/ns-604/ / https://item.rakuten.co.jp/auc-8848-jizake/4903235326012/ / https://nihonsyu-nihonjyou.co.jp/news/20260820/ | 既存の通常山廃から秋あがり2019BYへ別SKU。2026年入荷と醸造年度2019BYを分離。 |

料理の編集提案・night evidence・値単位の出典はnew-product-plans.json、実データはcatalogAdditions.jsonを参照。公式推奨は雨垂れの濃い料理カテゴリーと銀シャリの寿司。その他の具体的献立は編集提案。口コミは0件であり、単一レビューからsensoryConsensusを作成していない。

## 採用の注意点

- 南の1800ml候補は55%表記・度数167という誤記に対し、現行補強資料に50%があり、採用案から除外。誤記を推測補正しない。
- 豊能梅の公式素材は720ml/1800mlを併写。単一容量の画像として使わない。
- 一部店舗は販売中でも正式画像ツールでは非提供。画像を無断取得・URL改変して補わない。
- 同じ楽天ドメインの別店舗2件だけでは、既存の公開ゲート上の独立ソース条件を満たさないため、蔵元・専門資料で追加照合。基準自体を緩めていない。
- 直接取得がtimeoutだった萩乃露公式と酒泉洞堀一は、web.openで本文を実読。取得方法と失敗履歴を別記録し、HTTP成功を捏造していない。
- 銀シャリの無濾過/原酒の出典2項目を、記載のない小売ではなく実際に明記する公式へ訂正。同じ正式素材をデータ指紋へ再結合し、リンク・画像原本は無改変。
- 旧登録に本体容量未設定のものは、購入案内レコードの選択容量を明示。未知の本体容量を既知として書き換えず、異なる既知容量は新IDに分離。
- 同一SKUの復旧もCOMMERCIAL_MATCH。EXACT/Verifiedへの自動昇格ではない。
- 東の麓は取寄せ受注の販売ページ。購入受付可能と即納在庫は区別し、恒久的な在庫を保証しない。

## QA・保護

| 確認 | 状態 |
| --- | --- |
| WebKit 320/360/375/390/430 + Chrome 1280 | 成功 |
| 変更21IDの正式リンク・240/80px素材 | 成功 |
| 購入操作を伴わないブラウザ遷移 | 成功 |
| SW制御下の検索戻り・保存・再読込 | 成功 |
| 旧URL/metadata/sitemap・CSP・内部リンク | 成功 |
| 最終在庫再取得（API結果のみではない） | 成功 |
| 本番全ACTIVE再集計 | 未実施 |

既存デザイン、PWA、推薦スコア、検索UI、温度3分類、詳細温度の後半配置を変更していない。price/commission/レビュー数/星/楽天順位を推薦へ加点しない。週次巡回・自動公開は無効のまま、季節ごとの手動棚卸しを維持。

## 保存物

- baseline-production.json / baseline-inventory.json / cohort.json: 開始点
- discovery.json / merchant-audit.json: API探索と実ページ確認。失敗と在庫切れは分離
- decisions.json / decisions.csv: 全36判断、未処理0
- new-product-plans.json / new-product-sources.json / web-source-verifications.json: 別SKUの根拠
- held-candidates.json: 保留15旧IDと採用していない候補
- link-validation.json / stock-recheck.json: 正式素材・遷移・購入受付
- browser-local.json / pwa-local.json / http-local.json / internal-links.json / security.json / code-checks.json / build.json: QA
- deployment.json / production-summary.json / final-production.json: 公開後に確定

楽天URLは通常の個別商品URLのみ掲載。秘密値・私有アフィリエイトURL・正式HTML原本はレポートに転載しない。
