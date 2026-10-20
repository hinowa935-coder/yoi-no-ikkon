# Historical fallback 現行商品更新レポート

確認日: 2026-10-20T13:46:59.725Z

## 結論

114旧IDを再審査し69件を回収/棚整理、45件をWAITINGとして保全。新SKU11件を新IDで作成、旧32件のみINACTIVE化。新しい別商品を古いIDやお気に入りへすり替えていません。ACTIVEは520→499。総DBは558→569で、古い558レコードは全てハッシュ一致です。

楽天公式ツールから元のリンク/画像HTMLを取得し、28件を購入案内上COMMERCIAL_MATCHとして追加しました。画像URLの改変・ローカルコピー・広告ブロッカー回避は行っていません。既存の画面・推薦・検索温度3分類・詳細後半の温度表示・PWAは変更していません。

## 指定48項目

| No. | 項目 | 結果 |
| --- | --- | --- |
| 1 | historical対象 | 114件。過去140審査から実反映26IDを除外し、現行productionと照合 |
| 2 | 開始時解決済み | 0件（この114件内）。サイト全体では既存直リンク441・画像438を保護 |
| 3 | 今回処理 | 114件、未処理0件。検索・比較したことと、採用できたことを区別 |
| 4 | 同一商品救済 | 17件。購入案内上COMMERCIAL_MATCH。EXACT/Verifiedの科学的仕様同一性には昇格しない |
| 5 | 別店舗救済 | 13件（17回収のうち、初回取得上位店舗と異なる採用URL。全て再取得した正式クリエイティブ） |
| 6 | 同ブランド別SKUへ整理 | 40旧ID |
| 7 | 同蔵別ブランド/商品へ整理 | 12旧ID |
| 8 | 他蔵候補へ整理 | 0件 |
| 9 | 新規の季節SKU | 0件。奥の十年低温熟成は限定熟成設計で、季節棚への自動循環対象にしない |
| 10 | 今回INACTIVE | 32旧ID（元からINACTIVEだった対象はその状態を維持） |
| 11 | 今回ARCHIVED | 0件 |
| 12 | WAITING_FOR_REPLACEMENT | 45件。45件のうちACTIVEのものはfallbackを維持。未解決を解決実績へ算入しない |
| 13 | 未同定・不十分 | 45件は商品/版/画像/官能の公開条件が未完。全ての商品の存在自体が未確認という意味ではない |
| 14 | 購入可能確認 | 59採用先ID（新規28と既存採用先の和集合）。確認時の状態であり継続在庫保証ではない |
| 15 | 正式直リンク追加 | 28商品 |
| 16 | 正式画像追加 | 28商品。既存438画像はそのまま |
| 17 | ブラウザ画像 | 新規28商品をWebKit390pxとChrome1280pxで全件naturalWidth/naturalHeight>0、320/360/375/430pxで代表4商品ずつ確認 |
| 18 | 容量対応 | 28商品。正式原文HTML・URLを改変せず同容量へ対応 |
| 19 | 官能情報再構築 | 11新SKU。旧商品の官能を転用せず、蔵元/専門小売の出典を値ごとに保存 |
| 20 | community使用 | 0商品。Sakenomyの商品資料は個人口コミと区別 |
| 21 | community consensus | 0件。未確認値は全てnullで、数件の口コミを多数意見と扱わない |
| 22 | ペアリング再構築 | 11新SKU、編集提案33件。公式料理・編集料理を分離。旧52商品の料理は移植しない |
| 23 | 新ID | 11件。13旧ID→11新ID、別途39旧IDは既存の独立した同蔵商品へ棚を整理 |
| 24 | 旧お気に入り | 旧ID保持、別SKUへの自動移行なし。ブラウザと単体テストで確認 |
| 25 | 旧URL | 既存558レコード保持。旧ページは同じIDで200、別SKUへのリダイレクトなし |
| 26 | 開始ACTIVE | 520 |
| 27 | 最終ACTIVE | 499 |
| 28 | 開始直リンク | 441 ACTIVE / 441全DB |
| 29 | 最終直リンク | 468 ACTIVE / 469全DB |
| 30 | 開始正式画像 | 438 ACTIVE / 438全DB |
| 31 | 最終正式画像 | 465 ACTIVE / 466全DB |
| 32 | ACTIVE直リンク率 | 93.79%（468/499） |
| 33 | ACTIVE画像率 | 93.19%（465/499） |
| 34 | ACTIVE両方 | 463件 / 92.79% |
| 35 | ACTIVE fallback | 79 → 31 |
| 36 | 蔵元枠 | 348 → 352（県＋法人名正規化。同名異県は統合しない） |
| 37 | 都道府県 | 46 → 46 |
| 38 | 既存候補プール残 | 50件。別途historical専用保留キュー45旧IDを保存。両者の件数は合算せず、未承認候補はACTIVEへ算入しない |
| 39 | tests | 153 / 153成功 |
| 40 | typecheck | 成功 |
| 41 | lint | 既存custom lint成功（ESLint全規則の実行という意味ではない） |
| 42 | build | Webpack production build・postbuild成功。Turbopack既知問題の調査/依存更新なし |
| 43 | 秘密情報 | 静的出力・src・scripts・運用データ・報告書の検査成功。既存commerce/承認保護、.env.local未追跡・除外確認 |
| 44 | deployment | ローカルQA合格。本番反映はこれから。反映後production-summary.jsonで確定 |
| 45 | production QA | 未実施。ローカル合格と本番確認を混同しない |
| 46 | 実機iPhone | 未実施。WebKitエミュレーションを実機テストと扱わない。AdGuard等による外部広告画像遮断は迂回しない |
| 47 | 実機Android | 未実施。デスクトップChromeを実機Androidと扱わない |
| 48 | 残課題 | 45件の公開条件未充足、ACTIVE fallback31件。完全100%には到達していない。未取得や年齢確認画面を調査済みと扱わず、下記個別理由を保持 |

## 新SKU11件

| 新ID / 正式商品名 | 容量 | confidence | 根拠URL | 補足 |
| --- | --- | --- | --- | --- |
| koeigiku-sukai-hiire-current-v1 / 光栄菊 特別純米 清海 Sukai 火入れ | 1800ml | medium | https://www.hasegawasaketen.com/eshop/products/detail/17836 / https://item.rakuten.co.jp/auc-chitashige/37040502/ / https://www.mashidaya.co.jp/SHOP/7445.html | 清海の生酒とは別SKU。別店舗の画像メタデータに他商品名があり、知多繁の正式単品画像を選択。精米60/70・度数の資料差は混ぜず、今回の数値は未設定。 |
| manrei-chokarakuchi-tokubetsu-junmai-current-v1 / 万齢 特別純米 超辛口 | 1800ml | high | https://www.manrei.jp/nihonshu/ / https://item.rakuten.co.jp/izumiya-sake/211498/ |  |
| kihotsuru-junmai-current-v1 / 基峰鶴 純米酒 | 720ml | high | https://www.kihotsuru.com/%E7%B4%94%E7%B1%B3%E9%85%92 / https://item.rakuten.co.jp/sagamarche/100673/ |  |
| matsunokotobuki-omachi-hiire-current-v1 / 松の寿 純米吟醸 雄町 無濾過 火入れ | 720ml | medium | https://www.jizake.com/c/sake/matsui/ns460005m00 / https://item.rakuten.co.jp/sakeroman/10002305/ / https://sakeroman.com/products/matsunokotobuki-junmaiginjo-omachi | 旧商品の五百万石と異なる雄町シリーズ。別資料の16/17度、分析値、BYを混成せず数値未設定。 |
| kurobekyo-junmai-ginjo55-current-v1 / 黒部峡 純米吟醸55 | 720ml | high | https://www.hayashisyuzo.com/brand/ / https://item.rakuten.co.jp/kurumayasaketen/4983866315654/ | 林の美山錦から黒部峡へ別ブランド・別SKUで変更。商品名の55だけから分析値を補完せず、原料米と温度も未確認。 |
| fukuiwai-yamada50-junmai-ginjo-current-v1 / 福祝 山田錦50％磨き 純米吟醸 | 1800ml | high | https://fukuiwai.com/item/i305 / https://item.rakuten.co.jp/sake-makino/10008-09-8207-1/ / https://www.sakenomy.jp/sake/TST0000007109/ | APPLESAKEとは別SKU。720ml×2本選択を含む店舗は避け1800ml単品を採用。公式16度、小売16〜17度は差分として分離。Sakenomyの料理提案は公式推奨に転記しない。 |
| oku-ten-year-junmai-ginjo-genshu-current-v1 / 奥 十年低温熟成 純米吟醸原酒 | 720ml | high | https://www.sonnoh.co.jp/item/03165/ / https://item.rakuten.co.jp/auc-8848-jizake/oku-10/ | 全量にごり生酒とは別SKU。十年熟成は年ごとの醸造BYを特定する意味ではない。公式の冷やは常温として扱い、冷蔵保管と推奨飲用温度を混同しない。 |
| ohga-asahi-junmai-ginjo-current-v1 / 大賀 純米吟醸 辛口 朝日米 | 1800ml | high | https://www.ogashuzo.com/brands/ohga/ / https://item.rakuten.co.jp/hasegawasaketen/1011873/ | 玉出泉とは別銘柄の朝日米シリーズ。保管のクール便指定だけから飲用温度を作らない。 |
| ryusei-muku-omachi-kimoto-current-v1 / 龍勢 無垢の系譜 -雄町- | 1800ml | high | https://www.fujiishuzou.com/products/muku / https://item.rakuten.co.jp/ichiishop/8274212/ | 熟成純米65%の商品とは別の、無垢の系譜60%の現行SKU。旧商品の熟成香や料理をコピーしない。 |
| kameman-nigori-genshu-current-v1 / 亀萬 にごり原酒 | 720ml | high | https://www.kameman.co.jp/products/detail.php?product_id=89 / https://item.rakuten.co.jp/landb-ikedasakaya/10000045/ | PLUS 9辛口純米とは別SKU。公式がにごり原酒とするため、純米分類や生/火入れを推測しない。ロック・ソーダ割りは別途公式推奨として記録。 |
| hiokizakura-tokujo-junmai-omachi-current-v1 / 日置桜 特醸純米酒 | 720ml | high | https://hiokizakura.jp/sake/sake_general / https://item.rakuten.co.jp/gottuou/1520601/ | 旧生酛強力・生酛玉栄とは別SKU。小売本文冒頭の純米吟醸という混入文より、公式商品欄・現物ラベル・販売タイトルと成分表の純米を優先。小売日本酒度+11.5は差分として残し、公式+9.5と混成しない。 |

味・温度・米・精米・アルコール・分類のうち、直接確認できない値は空のままです。清海と松の寿は専門酒販情報を主根拠とするmediumで、公式未取得をhighと扱いません。黒部峡の名前に55が含まれていても精米歩合へ自動転記していません。亀萬にごり原酒は、純米/非純米・生/火入れを名称だけで補完していません。

## 重要な差異・画像除外

- 産土: 購入先の出荷時期と登録の2025年表記の完全一致は保証しない。二農醸の購入案内として採用し、既存Verifiedは変更していない。最初の候補の穂増五農醸画像は除外し、別店舗の二農醸画像を採用。
- 清海: 最初の候補店の画像に他銘柄/他版が混在していたため除外。別店舗の清海1800mlの正式クリエイティブを採用。
- 日置桜: 小売本文の純米吟醸表記と商品名/仕様表/公式の特醸純米が不一致。公式に従い純米として新SKUを作成し、矛盾した表記を転載していない。
- 福祝: Sakenomyの具体的料理情報は公式推奨へ移さず、公式ペアリングと別扱い。
- 龍力: 正式画像/販売は確認できても公式ページ本文が年齢確認のみだったため、本文取得成功と扱わず保留。
- 豊能梅宵宵: 2容量共通の二本画像で容量固有の対応が未完。画像を切り抜いたりURLを加工せず保留。

## 調査範囲と限界

99蔵元グループ検索、114商品別検索と一部の別名検索、取得候補の販売ページ・公式既存Evidenceの再利用を実施。APIは1秒以上の間隔で実行し、失敗と0件を分離しました。1検索の上位30候補という取得範囲であり、インターネット全体の網羅や楽天不存在を保証する調査ではありません。採用28商品は追加でラベル・容量・商品属性・正式HTML・直リンクと画像配信を確認。残る45件は公開条件未完としており、単に検索処理を終えたことを「商品同定完了」と数えていません。

既存の独立商品39件を使う棚整理は、新SKU39件の追加ではありません。旧商品の特徴・料理を引き継いだという意味でもありません。新商品11件については新しい官能/出典/編集料理/夜対応を保存しています。

## 未解決45件

| 旧ID | 旧商品名 | 理由 |
| --- | --- | --- |
| shinshu-kirei-junmai-ginjo | 信州亀齢 ひとごこち 純米吟醸 | 稲倉の棚田産ひとごこちの候補は実販売を確認。登録の一般版との対応、生/火入れとラベルの独立照合が未完了。棚田版を無断で同一扱いしない。 |
| kameizumi-cel24 | 亀泉 純米吟醸原酒 CEL-24 | CEL-24の追加2店舗は実ページで購入不可。予約入荷分を現在庫と数えず、高育63号ひやおろしは別SKUとして候補に残す。 |
| kamikawa-taisetsu-junmai | 上川大雪 特別純米 彗星 | 十勝・彗星と吟風生酒が混在。緑丘蔵の登録と十勝の醸造拠点・シリーズの対応を確定せず、同一商品のリンクにしない。 |
| hatsumago-i9diua | 初孫 光輝2236 生酛純米大吟醸 | 祥瑞・魔斬の単品は発見。光輝2236とは別シリーズで、新SKUの官能・正式画像・料理を揃えた公開審査が未完了。 |
| sara-hdomtl | 彩來 特別純米 無ろ過生原酒 花澄み | 花澄みと朝涼みは別季節版。通常純米吟醸も別SKU。既存INACTIVEを維持し、新商品の確認前に旧データを転用しない。 |
| edo-kaijo-kflfjg | 純米吟醸原酒 江戸開城 Sustainable Sake Project | 山田錦の単品は販売中。Sustainable Sake Projectと山田錦単独SKUの設計対応が未確定。別SKUとしての情報・画像の仕上げが必要。 |
| abe-k34lzz | STANDARD  /  あべ | STANDARDという登録に対してシルバー火入れとVEGAが候補。シリーズを一意に対応付けられず、既存の味を流用した更新をしない。 |
| maibijin-o0ffit | 舞美人 山廃純米酒 蔵付酵母 | ひやおろし720mlの公式と販売を確認。小売の総本数10と単品説明の不整合、通常山廃との差があり、正式画像・販売単位の最終審査が残る。 |
| haginotsuyu-lvvrsw | 萩乃露 純米吟醸 里山（火入） | 里山の生酒、渡船の生酒、雨垂れ石を穿つを確認。登録は里山火入れであり別製法・シリーズのため、新レコードの審査が必要。 |
| rikyubai-hlztnu | 利休梅 静香 純米吟醸 | 正式銘柄・蔵元の探索を行ったが、今回の検索には植物の利休梅も混入。植物は除外し、採用可能な清酒単品と正式画像を確定できていない。 |
| tatsuriki-g39ip7 | 播磨鶴 純米吟醸 無濾過原酒 | 龍力・特別純米生もと仕込みの実販売と正式画像は確認。公式商品本文は年齢確認画面のみで未読。二次資料の官能照合も未完了として候補保持。 |
| okura-hmwprj | 大倉 山廃特別純米 雄町70（本生） | 現行候補は備前朝日60%・直汲み生原酒。登録は雄町70%本生で別米シリーズ。新SKUとしての独立資料と正式画像審査が必要。 |
| bentenmusume-uzpgk6 | 辨天娘 純米酒 生酛 玉栄 | 強力R2BY熟成と五百万石の単品は存在。生酛玉栄とは別米・別設計で、新商品の根拠と料理・夜の再構築を完了していない。 |
| sanin-togo-uzpgk6 | 山陰東郷 純米大吟醸 | ブランド検索と商品検索で採用可能な現行単品を確定できなかった。楽天不存在・終売とは断定せず、元のINACTIVEを維持。 |
| jujiasahi-id2kl5 | 十旭日 生酛純米 改良雄町 | 純米大吟醸と五百万石70%熟成を確認。改良雄町生酛とは異なるため、別SKUの官能・画像を揃えるまで採用しない。 |
| izumo-fuji-id2kl5 | 出雲富士 手づくり純米吟醸 | 今回の取得候補には前掛け等が含まれ、清酒単品として採用しない。返礼品も除外し、現行通常商品の直リンク・正式画像を未確定として保持。 |
| tagaji-iapi9d | 裏多賀治 純米大吟醸朝日 無濾過生原酒 | 多賀治の朝日無濾過生原酒は販売中。裏多賀治と通常品・直汲みの関係が未確定で、プレス違いを無視して旧商品へリンクしない。 |
| wakamusume-i9dgkj | わかむすめ 燕子花 純米大吟醸酒 | 燕子花の1800ml候補を発見したが登録側の参照容量は720ml。紅の匂・月草は別SKUで、画像・容量・現行ラベルの確定が残る。 |
| miyoshikiku-iwjid2 | 三芳菊 等外山田錦 零 ZERO 無濾過生原酒 | 零ZERO等外山田錦の現行単品を今回の取得範囲では確定できなかった。他シリーズへ無断リンクせず、代替の公開品質確認を継続対象とする。 |
| imakomachi-iwjid2 | 今小町 純米吟醸 山笑 | 山笑の単品を検索したが採用可能な現在庫と正式画像の組を確定できなかった。売切れや不存在と断定しない。 |
| hanaabi-junmai-daiginjo-1 | 花陽浴 純米大吟醸 越後五百万石 無濾過生 | 五百万石の通常品1800mlとおりがらみ1800mlを確認。登録参照容量720mlとは異なり、別おり設計も除外。適切な容量画像が未確定。 |
| sara-hdomtl-2 | 彩來 the starry night Vesper | 通常彩來純米吟醸は販売中だがVesperとは別シリーズ。新SKUの独立した情報・正式画像・料理を揃えるまでは元レコードを変えない。 |
| naruka-gg3q4p-4 | 鳴海 純米大吟醸 直詰め生 総の舞50 | 総の舞50・直詰め生の採用可能単品を今回の検索で確定できなかった。別米や別製法を同一扱いせず、既存INACTIVE維持。 |
| shinshu-kirei-junmai-ginjo-2 | 信州亀齢 稲倉の棚田 ひとごこち 純米吟醸 生 | 棚田ひとごこち候補はあるが製造年月だけから生酒版を保証しない。火入れとの差を確定できず、既存INACTIVE維持。 |
| mimurosugi-roman-series-2 | みむろ杉 ろまんシリーズ 純米吟醸 山田錦 | 山田錦純米吟醸の別店舗ページを追加探索したが取得失敗。失敗を売切れとせず、露葉風へ変更された生おりがらみ商品は別SKUとして除外。 |
| rashomon-gp8l70i9d-4 | 羅生門 無濾過たれくち 純米大吟醸生原酒 | たれくち生原酒の現行単品・正式画像を一意に確定できなかった。通常大吟醸と混同せず、既存INACTIVEを維持。 |
| taito-tokubetsu-junmai-v1 | 特別純米酒 泰斗 | 千代の園への別名探索も実施。取得された赤酒は特別純米の代わりにしない。清酒の適切な代替SKUと正式画像が未確定。 |
| bojimaya-junmai-ginjo-muroka-nama-v1 | 房島屋 純米吟醸無ろ過生酒 | 純米7号超辛口の単品は販売中。純米吟醸無ろ過生酒とは分類・設計が異なり、新SKUの独立根拠と画像審査が残る。 |
| mimurosugi-tokubetsu-junmai-tsuyuhakaze-v1 | みむろ杉 ろまんシリーズ 特別純米 辛口 露葉風 | 露葉風の特別純米辛口を確定できず。露葉風のおりがらみ純米吟醸は分類・原酒・にごり設計が異なるため同一扱いしない。 |
| daijiro-yamada-junmai-ginjo-hiire-v1 | 大治郎 純米吟醸 山田錦 火入 | 山田錦の情熱迷酒・よび酒の生酒を確認。火入れの登録へ生酒を付けず、新SKUの根拠と画像の準備が必要。 |
| bentenmusume-junmai-yamahai-gouriki-v1 | 辨天娘 純米酒 山廃 強力 | 強力R2BY熟成・五百万石は存在するが、山廃の根拠を省略して同じ商品にしない。代替は新SKUとして審査が必要。 |
| shiraito-70-v1 | 白糸70 | 田中六五6513・6513泡は別シリーズで、通常生酒には予約商品もある。白糸70の名義を使って別設計をリンクしない。 |
| toyonoume-yoiyoi-junmai-ginjo-v1 | 豊能梅 宵宵 純米吟醸 | 宵宵の現在庫は選択式ページで確認。正式クリエイティブが720/1800mlの二本共通画像のため、容量を一意に対応させた画像が未確定。別県同名の高木酒造とは統合しない。 |
| biwanosasanami-matsu-junmai-daiginjo-hiire-v1 | 琵琶のささ浪 純米大吟醸 松 火入れ | 竹ラベル・純米原酒・生酒は松火入れと別SKU。名入れ木箱商品も優先せず、標準単品の新SKU審査を未完了として保持。 |
| shirakiku-vibrant-junmai-hiire-standard-v1 | shirakiku vibrant 純米 火入れ | からくれなゐ・銀シャリはvibrantとは別シリーズ。生/火入れ・原酒・秋仕様を分け、新レコードの正式画像と官能の照合待ち。 |
| ouroku-ryu-tokubetsu-honjozo-honnama-v1 | 王祿 特別本醸造 流 本生 | 王祿/王禄表記違いでも探索。流本生の現行単品を確定できず、別銘柄・別蔵の同音商品を採用しない。 |
| garyubai-junmai-daiginjo-gohyakumangoku45-fukurotsuri-v1 | 臥龍梅 純米大吟醸 五百万石45 袋吊り | 山田錦35袋吊り・山田錦45・開壜十里香は販売中。五百万石45袋吊りとは使用米シリーズ・設計が異なるため別SKUの審査待ち。 |
| kagura-junmai-daiginjo-shiro-muroka-mukasui-ichibi-v1 | 神蔵 KAGURA 純米大吟醸 無濾過・無加水・一火（白） | 京の輝き・野条穂などの生酒を確認。一火の登録へ生酒を付けず、米シリーズと製法を分けた新SKU審査が必要。 |
| teishu-kanpaku-karakuchi-honjozo-v1 | からくち 亭主関白 本醸造 | 町田酒造での探索も実施。亭主関白の衣類・ブリキ看板等は除外。群馬の蔵元と清酒単品の根拠を揃えた購入先は未確定。 |
| eikofuji-jungetsu-junmai-standard-v1 | 栄光冨士 純月 純米酒 | スネークアイ・アルケミスト・日乃輪等は販売中。純月の純米酒と純米大吟醸の限定生原酒を同一扱いせず、新商品として審査待ち。 |
| kamonishiki-nifudazake-kisuisen-binhiire-v1 | 加茂錦 荷札酒 黄水仙 純米大吟醸 瓶火入れ | 黄水仙720mlの候補はあるが元の参照容量1800mlとの整理が残る。備前雄町生や酒未来は別SKUとして分離。 |
| tabika-junmai-funashibori-ichikai-hiire-v1 | 田光 純米 槽搾り 一回瓶火入れ | 雄町火入れと備前雄町/出羽燦々の生原酒を確認。純米槽搾り一回火入れと分類・使用米シリーズ・製法を混同せず、新SKU審査待ち。 |
| wakaze-the-classic-yamagata-v1 | WAKAZE THE CLASSIC（山形製造） | THE CLASSICの単品候補を確認したが、山形製造とフランス製造の切り分けが不足。ゆずスパークリングも別商品で除外。 |
| librom-mint-craft-sake-v1 | LIBROM Mint | LIBROM単独でも検索したがトレーディングカード等が混入。ミントのクラフトサケ単品と正式画像を確定できず、既存INACTIVE維持。 |
| azumanofumoto-junmai-ginjo-yamagata-selection-v1 | 純米吟醸 東の麓 山形セレクション | なんどでも・出羽の里・大銀杏は販売中。山形セレクションとの対応を未確定とし、別シリーズの根拠を旧商品へ流用しない。 |

## 保全と再現資料

- adjudications.json / adjudications.csv: 全114旧ID、検索、商品/画像根拠、理由、旧新対応、旧ページ/お気に入り保全。
- remaining.json / data/catalog-operations/historical-replacement-queue.json: 45保留。自動公開無効、公開済みと扱わない。
- new-product-plans.json: 新11SKUの値単位Evidence・編集料理・未知値・night根拠。
- link-validation.json: 新規28先のPC/スマホ転送と元の画像URL応答確認。購入・カート操作なし。
- browser-local.json / http-local.json / internal-links.json: 表示、戻る、検索、旧商品、画像、sitemapと内部リンク。
- historical-fallback-batch.json: 元558レコードのハッシュ、対象のみのcommerce差分ハッシュ、ライフサイクル変更。テスト免除は明示したレコード/ハッシュのみ。別ID・別ファイル・改ざんは回帰テストで拒否。
- production-summary.json / deployment.json / browser-production.json / http-production.json: 本番反映後に確定保存。

## 次に残る作業

45保留のうち、現在庫と代替商品自体が見つかったものから、独立した新SKU資料・正式容量画像・官能を完成させる余地があります。売切れ・不存在・終売の断定はしません。本Phaseで自動継続や定期公開の仕組みは追加せず、完了後停止します。
