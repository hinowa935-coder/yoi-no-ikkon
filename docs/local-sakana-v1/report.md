# この土地の肴 — Phase 0.5 + 1.0
確認日: 2026-10-22 / source production commit: 1f3f021a32d8697b5daab32018f05e27ad2f6e40

実装: 県欠損9件を補正。22食品・181編集ペアリングを107酒へ限定表示。本番反映は未完了。

## 必須64項目
| # | 項目 | 結果 |
|---|---|---|
| 1 | 開始時ACTIVE | 484 |
| 2 | prefecture欠損 | 9 |
| 3 | 補正数 | 9 |
| 4 | 未解決数 | 0 |
| 5 | 変更ID | 下表9件。ID・URL・favorite参照は維持 |
| 6 | before / after | null → 下表の県。top-level prefectureだけ変更 |
| 7 | official source | 各行にURL・sourceType・checkedAt、同蔵10登録も確認 |
| 8 | 補正後都道府県数 | 46 |
| 9 | 補正後県別ACTIVE | 後掲46県表 |
| 10 | 検索filter QA | 9補正IDを県filter＋商品名で画面確認 |
| 11 | favorite保全 | 484ID・fingerprint不変。実ボタン保存・戻る・再読込を検証 |
| 12 | 旧URL保全 | 484 ACTIVE詳細、旧アーカイブ・redirect設定不変。内部リンク監査参照 |
| 13 | 対象県 | 新潟県、宮城県、秋田県、石川県、北海道、佐賀県、高知県、富山県、福井県 |
| 14 | 対象酒数 | 138 |
| 15 | 調査候補 | 27 |
| 16 | 採用specialty | 22 |
| 17 | REJECT | 0 |
| 18 | HELD | 5 |
| 19 | 保留理由 | 原産/加工地不足・仕様不明・内容量不足・返礼品/詰合せ中心。下表参照 |
| 20 | 地域性source確認 | 採用22食品。HTTP本文とWeb本文を区別し、取得失敗/PDF未読だけのsourceを公開master根拠から除外 |
| 21 | 楽天現行商品 | 22 |
| 22 | 正式画像 | 22 |
| 23 | 通常購入可能 | 22 |
| 24 | ふるさと納税除外 | 128個の重複除外済みAPI候補（specialty数とは別） |
| 25 | bulk除外 | 0個の重複除外済みAPI候補（分類済み取得範囲） |
| 26 | match対象酒数 | 138 |
| 27 | section表示酒 | 107 |
| 28 | 0件・section非表示 | 31 |
| 29 | 1品 | 33 |
| 30 | 2品 | 74 |
| 31 | 3品 | 0 |
| 32 | high pairing | 0 |
| 33 | medium pairing | 181 |
| 34 | low非表示 | low採用0。根拠不足/非重複の適合食品不足31酒を保留 |
| 35 | pairing reason | 181 |
| 36 | food重複対応 | 16候補を初期表示6料理との重複で除外。折り畳み内は文脈が異なるため維持 |
| 37 | section位置 | 合う料理 → この土地の肴 → こんな夜に → 共有 |
| 38 | カード構成 | 原本画像・地域・食品説明・SKU別編集理由・購入先・食品source |
| 39 | 列数 | 767px以下1列、PC2列。固定244px画像枠で原本画像を加工しない |
| 40 | CTA | 楽天で見てみる ↗ |
| 41 | affiliate表記 | sectionに広告を明記。リンクrel sponsored/nofollow。編集提案を公式推奨と区別 |
| 42 | 価格非表示 | なし |
| 43 | ランキング非表示 | 星/レビュー件数/SALE/ポイント表示なし |
| 44 | 320px | 成功 / 本番未完了 |
| 45 | 360px | 成功 / 本番未完了 |
| 46 | 375px | 成功 / 本番未完了 |
| 47 | 390px | 成功 / 本番未完了 |
| 48 | 430px | 成功 / 本番未完了 |
| 49 | 1280px | 成功 / 本番未完了 |
| 50 | accessibility | 見出し階層・named CTA・44px以上のCTA・keyboard focus・折り畳み操作を検査。提供画像HTMLは改変せず、別途名前付きCTAを用意。実機スクリーンリーダー未検証 |
| 51 | performance | 390/1280px各3回の比較で初期resource数28→28、肴画像は初期0リクエスト。CLSは390px 0.234→0.234、1280px 0.097→0.097で悪化なし。ただし既存モバイルCLSは良好水準ではない。LCPはlab参考値でネットワーク条件が異なるため改善効果とは断定しない。 |
| 52 | analytics | specialty_impression / specialty_click / specialty_rakuten_click。酒ID・食品ID・県・store・entrySourceのみ。URL/個人情報なし |
| 53 | tests | 188件 成功 |
| 54 | typecheck | 成功 |
| 55 | lint | 成功（既存構文検査） |
| 56 | build | 成功 / Webpack。生成JSON形式の修正後に再実行済み。Windows権限制限で失敗した通常実行とは分離 |
| 57 | code check | 既存3ファイルの許可差分・9record prefectureのみ・値/HTML/hash/URL/期限/在庫/低confidenceゲートを検査 |
| 58 | secret scan | 成功 / 実設定値・URLエンコード・base64照合、.env.local除外/非追跡 |
| 59 | production deployment | 未完了 |
| 60 | production QA | 未完了 |
| 61 | 実機iPhone | 未実施。WebKitエミュレーションを実機確認とは扱わない |
| 62 | 実機Android | 未実施。デスクトップChromeも実機確認とは扱わない |
| 63 | 既存WebKit warning | 以前のRSC先読みwarningは比較元資料を維持。今回の未変更本番同経路probeは0件。ローカルpreviewだけの先読み警告・本番の警告数を別記（browser JSON） |
| 64 | 残課題 | HELD5食品・表示保留31酒・実機端末/VoiceOver・季節棚卸し時の在庫/許諾/期限再確認。自動巡回/自動公開は追加していない 既存モバイルCLS 0.234は今回悪化させていないが別途改善余地。 |

## 都道府県補正（9件）
| ID | 商品 | 蔵元 | before → after | 根拠 |
|---|---|---|---|---|
| kamoshibito-kuheiji-eau-du-desir | 醸し人九平次 山田錦 EAU DU DÉSIR | 萬乗醸造 | null → 愛知県 | [breweryOfficial](https://kuheiji.co.jp/about/) |
| kaiun-tokubetsu-junmai | 開運 特別純米 | 土井酒造場 | null → 静岡県 | [breweryOfficial](https://kaiunsake.com/company) |
| daina-kjnkdk | 大那 特別純米 生酛造り（火入れ） | 菊の里酒造 | null → 栃木県 | [breweryOfficial](https://kikunosato-sake.com/company/) |
| shichisui-kjnkdk | 七水 純米大吟醸45 | 虎屋本店 | null → 栃木県 | [breweryOfficial](https://toratora.co.jp/?page_id=36) |
| ruka-p7oucs | 流輝 純米吟醸 無ろ過生 山田錦 | 松屋酒造 | null → 群馬県 | [breweryOfficial](https://matsuya-sakebrewery.jp/about/) |
| michisakari-ia8tng | 三千盛 純米大吟醸 業物／Wazamono | 株式会社三千盛 | null → 岐阜県 | [breweryOfficial](https://www.michisakari.com/corp.html) |
| kaiun-tokubetsu-junmai-2 | 開運 純米吟醸 山田錦 | 土井酒造場 | null → 静岡県 | [breweryOfficial](https://kaiunsake.com/company) |
| eikun-junmai-ginjo-4 | 紫の英君 純米吟醸 山田錦 | 英君酒造株式会社 | null → 静岡県 | [prefecturalGovernment](https://fujinokuni.shokunomiyako-shizuoka.pref.shizuoka.jp/culture/article/1793) |
| kamoshibito-kuheiji-eau-du-desir-1 | 醸し人九平次 別誂 | 萬乗醸造 | null → 愛知県 | [breweryOfficial](https://kuheiji.co.jp/about/) |

阿部酒造「あべ」は開始時点ですでに新潟県のため変更なし。元の参考10IDを固定値にせず、実測9欠損を補正。県未設定/設定済みの同蔵キーが統合されたためbreweryKey件数341→340。酒蔵や商品を削除した結果ではない。

## 9地域の限定表示
| 地域 | ACTIVE酒 | 食品 | section表示酒 | pairing |
|---|---|---|---|---|
| 新潟県 | 29 | 2 | 23 | 41 |
| 宮城県 | 19 | 3 | 14 | 25 |
| 秋田県 | 17 | 2 | 13 | 18 |
| 石川県 | 15 | 2 | 12 | 21 |
| 北海道 | 15 | 3 | 12 | 18 |
| 佐賀県 | 12 | 3 | 11 | 19 |
| 高知県 | 12 | 2 | 11 | 20 |
| 富山県 | 10 | 3 | 3 | 6 |
| 福井県 | 9 | 2 | 8 | 13 |

## 採用食品と通常購入URL
| 食品 | 地域 | 量 | 販売店 | 現行通常URL |
|---|---|---|---|---|
| 栃尾の油揚げ | 新潟県 長岡・栃尾 | 5枚 | 新潟県公式ショップ 新潟直送計画 | [単品ページ](https://item.rakuten.co.jp/niigata-shop/0148-001-02/) |
| かんずり酒盗 | 新潟県 妙高 | 80g | 謙信笹だんご本舗くさのや | [単品ページ](https://item.rakuten.co.jp/auc-kusanoya/kanzurisyu/) |
| 笹かまぼこ | 宮城県 仙台・閖上 | 4枚 | 笹かまぼこの佐々直 楽天市場店 | [単品ページ](https://item.rakuten.co.jp/sasanao-sasanao/item-13/) |
| ほや珍味 | 宮城県 石巻 | 30g | 魚問屋 鯖陣 | [単品ページ](https://item.rakuten.co.jp/auc-de-mer/10180302/) |
| 牡蠣オイル漬け | 宮城県 石巻 | 115g | にっぽん津々浦々 | [単品ページ](https://item.rakuten.co.jp/tsutsu-uraura/kinoya-kaki115-3s/) |
| いぶりがっこ | 秋田県 秋田 | 100g | おつけもの 千住金久 | [単品ページ](https://item.rakuten.co.jp/1010kanekyu/1001/) |
| ぎばさ | 秋田県 男鹿 | 200g | TUCANO 楽天市場店 | [単品ページ](https://item.rakuten.co.jp/tucano/10000977-1/) |
| かぶら寿し | 石川県 金沢 | 約3枚 | 創業150年 金沢:四十萬谷本舗 | [単品ページ](https://item.rakuten.co.jp/kabura/kabura-1112/) |
| ふぐの子糠漬け | 石川県 石川 | 100g | 安新 楽天市場店 | [単品ページ](https://item.rakuten.co.jp/yasushin/fugunoko-nuka01/) |
| 松前漬け | 北海道 道南・松前 | 500g | 小樽・海産物専門店小町商店 | [単品ページ](https://item.rakuten.co.jp/otaru/10000012/) |
| 鮭とば | 北海道 北海道 | 80g | 北の町から | [単品ページ](https://item.rakuten.co.jp/kitanomachi/saketoba_100g/) |
| いかめし | 北海道 森町 | 140g・2尾 | 北海道銘菓 センカランド | [単品ページ](https://item.rakuten.co.jp/senka-land/4582102770105/) |
| 佐賀の焼海苔 | 佐賀県 佐賀・有明海 | 全形15枚 | 九州唐津ひもの鯨海産物の岩本商店 | [単品ページ](https://item.rakuten.co.jp/karatsu-iwamoto/yakinori-01/) |
| 呼子いか一夜干し | 佐賀県 唐津・呼子 | 1枚 | 呼子萬坊 楽天市場店 | [単品ページ](https://item.rakuten.co.jp/yobuko-manbou/50003/) |
| いかしゅうまい | 佐賀県 唐津・呼子 | 8個入×2箱 | 呼子萬坊 楽天市場店 | [単品ページ](https://item.rakuten.co.jp/yobuko-manbou/10000003/) |
| 酒盗 | 高知県 土佐 | 120g | 高知の地酒 土佐美味 | [単品ページ](https://item.rakuten.co.jp/auc-tosauma/syutou_karakuchi/) |
| かつお生節 | 高知県 土佐 | 約250g・1本 | 森徳蔵楽天市場店 | [単品ページ](https://item.rakuten.co.jp/moritokuzo/takeuchi-namabushi-01/) |
| ほたるいか沖漬け | 富山県 滑川 | 200g | 生鮮食品直送便 | [単品ページ](https://item.rakuten.co.jp/shokuhin-chokusou/62011925/) |
| 白えび素干し | 富山県 富山湾 | 12g | 浜浦水産んまいちゃ便楽天市場店 | [単品ページ](https://item.rakuten.co.jp/hamaura/shiraebi_suboshi-mon/) |
| ほたるいか素干し | 富山県 富山湾 | 47g | 浜浦水産んまいちゃ便楽天市場店 | [単品ページ](https://item.rakuten.co.jp/hamaura/hotaruika_suboshi2-mon/) |
| へしこ | 福井県 福井 | 10枚 | 越前田村屋 | [単品ページ](https://item.rakuten.co.jp/echizengani/t05-02/) |
| 小鯛ささ漬け | 福井県 若狭・小浜 | 180g・1樽 | G-Call 食通の定番 お取り寄せ | [単品ページ](https://item.rakuten.co.jp/g-callshop/43915/) |

正式画像は楽天のログイン済みリンク作成UIが発行した240×240 image-only HTMLをそのまま使用。ダウンロード/再ホスト/切抜き/URL書換えなし。画像・購入リンク・食品・ペアリングは別レイヤー。API検索27回、最短間隔1200ms、APIエラー0。API availability=1だけでは公開せず、現行ページの単品IDとpurchaseEnabled/soldOutも全22件確認。

笹かまの初回店舗はAPI上販売可でも実ページが改装中へ転送。採用を取りやめ、同じ食品の佐々直4枚パッケージへ変更。first-pass監査は保存。単品が現行購入可能であることを再確認した。

## 保留食品
- 鮭の酒びたし: NO_RETAIL_SINGLE。今回の永徳を含む検索では返礼品・惣菜詰合せが中心。食品の存在は確認。単品の継続調査を要する。
- ハタハタ干物: IDENTITY_UNCLEAR。現行候補の原料産地・加工地と公式地域資料の対応を確定していない。不漁情報もあり数量を埋めない。
- こんかいわし: QUANTITY_UNCONFIRMED。単品候補はあるが現行販売ページの内容量を本文・取得資料で確認できない。
- うつぼの珍味: IDENTITY_UNCLEAR。加工の異なるたたき・生カット等が混在。今回の小皿向け保存珍味としての版を確定していない。
- 汐うに: NOT_LOCAL_ENOUGH。採用予定候補の販売説明に韓国製造を明記。福井加工品として採用しない。別の通常商品を継続調査。

## 県別ACTIVE数
| 都道府県 | 補正前 | 補正後 |
|---|---|---|
| 三重県 | 9 | 9 |
| 京都府 | 16 | 16 |
| 佐賀県 | 12 | 12 |
| 兵庫県 | 19 | 19 |
| 北海道 | 15 | 15 |
| 千葉県 | 7 | 7 |
| 和歌山県 | 8 | 8 |
| 埼玉県 | 5 | 5 |
| 大分県 | 8 | 8 |
| 大阪府 | 7 | 7 |
| 奈良県 | 10 | 10 |
| 宮城県 | 19 | 19 |
| 宮崎県 | 4 | 4 |
| 富山県 | 10 | 10 |
| 山口県 | 9 | 9 |
| 山形県 | 14 | 14 |
| 山梨県 | 7 | 7 |
| 岐阜県 | 8 | 9 |
| 岡山県 | 8 | 8 |
| 岩手県 | 10 | 10 |
| 島根県 | 5 | 5 |
| 広島県 | 14 | 14 |
| 徳島県 | 6 | 6 |
| 愛媛県 | 12 | 12 |
| 愛知県 | 10 | 12 |
| 新潟県 | 29 | 29 |
| 東京都 | 11 | 11 |
| 栃木県 | 7 | 9 |
| 滋賀県 | 8 | 8 |
| 熊本県 | 7 | 7 |
| 石川県 | 15 | 15 |
| 神奈川県 | 9 | 9 |
| 福井県 | 9 | 9 |
| 福岡県 | 14 | 14 |
| 福島県 | 16 | 16 |
| 秋田県 | 17 | 17 |
| 群馬県 | 7 | 8 |
| 茨城県 | 7 | 7 |
| 長崎県 | 7 | 7 |
| 長野県 | 14 | 14 |
| 青森県 | 9 | 9 |
| 静岡県 | 7 | 10 |
| 香川県 | 7 | 7 |
| 高知県 | 12 | 12 |
| 鳥取県 | 5 | 5 |
| 鹿児島県 | 6 | 6 |

## 分離・運用方針
- 土地一致だけでは表示しない。SKUの既存verified featureと出典URL/確認日がある場合のみ味覚軸を照合。全ペアリングはeditorial / medium。公式が当該酒との組合せを推奨したとは表記しない。
- 売切れ/不明/失効/未承認はcommerceを非表示にし、食品と編集理由は残す。広告設定無効時は画像を隠し通常URLへ戻す。2027-01-22の期限は運営上の再確認期限であり、楽天が定める一律利用許諾期限という意味ではない。
- 季節棚卸しで現行ページ・通常購入・画像原本・媒体登録・許諾・期限を再確認する。掲載後の在庫変動をリアルタイム保証しない。
- 既存Verified/spec/推薦score/料理/夜/購入/おちょこ/PWA/共有/旧URL/CSP/依存は変更なし。DB変更は県9件のみ。新規ルートなし。
- 既存の内容固定テストは、承認された3ファイルと9県補正の完全一致hashだけ通す狭いchainへ更新。無制限の許可リスト化や検査削除はしていない。

## 公式根拠・画像利用
- [楽天アフィリエイトガイドライン](https://affiliate.rakuten.co.jp/guideline/rule/) — 原本HTML/画像URLの加工をせずに利用。
- [楽天Webサービス利用規約](https://webservice.rakuten.co.jp/guide/rule) / [市場商品検索API](https://webservice.rakuten.co.jp/documentation/ichiba-item-search) — 登録済み本番サイト、既存認証、QPS上限内の調査。
- 食品文化の一次資料・producer資料と現行販売SKUの量/産地/加工地は別記録。別メーカーの資料を当該販売SKUのspecへ流用していない。
- 複数sourceのうちHTTP取得失敗・本文未読のPDFはmasterの直接根拠から除外。秋田ぎばさ/佐賀いかしゅうまいはWeb本文で確認し取得方法を明記。

## 関連資料
`prefecture-corrections.json` / `specialty-research.json` / `pairings.json` / `pairing-decisions.json` / `research-decisions.json` / `retail-first-pass.json` / `retail-validation.json` / `source-retrieval.json` / `static-audit.json` / `checks.json` / `build.json` / `security.json` / `browser-local.json` / `browser-production.json` / `http-production.json` / `pwa-production.json`。未作成資料は成功扱いしない。
