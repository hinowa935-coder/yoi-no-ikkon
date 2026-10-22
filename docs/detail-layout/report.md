# 日本酒詳細ページ 情報構成整理

実装・ローカルQA完了。本番反映はまだ未完了。

## 変更範囲

詳細ページ、専用accordion、新しい表示専用source label helper、限定CSS。既存データ・Verified・商品画像・購入リンク・料理/夜推薦・PWA・metadata生成は無変更。通常酒棚484本・直リンク484・正式画像484を維持。

## 指定29項目

| No. | 確認 | 結果 |
| --- | --- | --- |
| 1 | 最終section順 | 酒名・蔵元 → 商品画像 → 味わい → 詳しい酒情報 → 購入先 → 蔵元・商品情報の出典 → 料理 → こんな夜に → 共有 |
| 2 | 詳しい酒情報の移動 | 味わい直下・購入先直前。末尾の「酒のことをもう少し詳しく」は統合 |
| 3 | 詳しい酒情報accordion | 初期closed。見出し全体がタップ領域。見る／閉じると矢印が状態に追随 |
| 4 | 表示spec | 蔵元、都道府県、特定名称、原料米、精米歩合、アルコール度数、原材料、原料米産地、麹米／掛米、米別精米、日本酒度、酸度、アミノ酸度、酵母、仕込水、熟成、年度・版。確認済みの表示可能な項目のみ |
| 5 | 飲み方統合 | ServingGuideはspec accordion内だけ。独立した前半セクションを増設しない |
| 6 | 詳細temperature | 既存データと3分類mappingを変更せず、温度名・目安・数値範囲を表示。データなしの場合に空の温度欄を増やさない |
| 7 | 購入先位置 | 詳しい酒情報の直後。楽天→Amazon→蔵元・取扱店、PR、normal fallback、販売差異注記、Yahoo非表示を維持 |
| 8 | 出典見出し | 「蔵元・商品情報の出典を見る」に変更。初期closed |
| 9 | 蔵元情報 | 出典accordion内の先頭に酒蔵名・確認済み都道府県・既存公式サイト等。未確認の市町村・歴史・紹介文を生成しない |
| 10 | source link整理 | 既存sourceとresource linksのURL集合を保持し、URL単位で表示重複を除去。購入先とは独立した情報源リンク |
| 11 | source title短縮 | Sakenomyの商品情報、蔵元公式の商品情報、専門酒販店の商品情報等＋小さなホスト名。SEO title本文を直接表示せず、元name/URL/type/scopeは保持 |
| 12 | 料理位置 | 出典直後。既存順序・推薦理由・公式ペアリングを維持。先頭6品＋既存もっと見る |
| 13 | こんな夜に位置 | 料理の後の独立section。既存affinityと季節判定・最大3候補を維持 |
| 14 | 共有位置 | 詳細コンテンツの最後。既存「この一献を、誰かにも。」「友達にすすめる」を維持 |
| 15 | accordion accessibility | native details/summary、aria-expanded、aria-controls、ID参照、Enter/Space、focus-visible、60px以上の見出し、reduced-motionを確認 |
| 16 | 320px QA | 成功 |
| 17 | 390px QA | 成功 |
| 18 | 430px QA | 成功 |
| 19 | 1280px QA | 成功 |
| 20 | tests | 180 / 180 |
| 21 | typecheck | 成功 |
| 22 | lint | 既存custom lint成功（ESLint全規則ではない） |
| 23 | build | Webpack / postbuild成功。依存更新なし |
| 24 | secret scan | 設定済み実値検査成功。env非追跡・ignoreを確認 |
| 25 | production deployment | 公開前。完了とは扱わない |
| 26 | production QA | 公開後に確定 |
| 27 | 実機iPhone | 未実施。WebKit検証を実機確認と扱わない |
| 28 | 実機Android | 未実施。Chromium検証を実機確認と扱わない |
| 29 | 残課題 | 改修前の本番でも再現するWebKitのRSC先読みキャンセル警告。対象フローは成功。今回PWA/通信設定は変更せず、警告を隠さず別分類で保存。実機・OS共有シートは未確認 |

360px・375pxも検証成功。旧URL・INACTIVE・別商品のarchive pageを保持。

## Before / After

代表: 七田 純米。画像、フォント、購入導線は同じまま、初期closedで比較。

| engine | Before px | After px | 短縮 px |
| --- | --- | --- | --- |
| webkit | 4707 | 4389 | 318 |
| chromium | 3826 | 3462 | 364 |

- before-webkit.png / before-chromium.png
- local-webkit-closed.png / local-chromium-closed.png
- local-*-specs-open.png / local-*-sources-open.png
- 本番公開後: production-*-closed.png / production-*-specs-open.png / production-*-sources-open.png

## 回帰・根拠

- 全583商品のSSRを解析。仕様・出典が初期closedでもHTML内に存在し、Product JSON-LD、canonical、source URL集合を維持。
- 全静的ページの内部リンク20489件を検査し、リンク切れ0。
- 元データ、commerce、温度・味・料理・夜のロジック、共有/保存、PWA、設定等のバイトハッシュが不変。既存監査の保護例外は今回のpage/CSSの正確な前後ハッシュ2件だけ。別ファイル・誤ったbaseline・改変後hashは拒否するテストを追加。
- 購入ボタンから正しい楽天商品ページへ、WebKit/Chromiumで実遷移。購入・カート操作なし。
- clipboard fallbackでcanonical共有URLを確認。OS共有シートと実機インストールPWAの確認は未実施。
- React確認: client境界はnative detailsの状態表示だけ。中身はServer ComponentでSSR。新しいfetch・秘密値props・余分なglobal listenerは追加しない。

## WebKit警告の切り分け

初回2回の全画面確認は14ケースの機能確認自体が成功した一方、素早い画面遷移でRSC先読みのaccess-control警告を記録。未変更の本番と新ローカルで同じ操作を比較し、旧本番でも同型警告、キャンセルされた先読み通信、対象画面表示成功を確認した。

同型のWebKit / __next.*.txt?_rsc=… / access-controlの組み合わせだけを既知警告として別分類。その他のpageerrorは引き続き失敗。初回の失敗結果・生のerrors配列を残し、コンソール完全無警告とは報告しない。現ローカルは既知警告5件・blocking error0件。

- browser-local-attempt1.json / browser-local-attempt2.json: 元の記録
- prefetch-diagnostic.json: 未変更本番との比較
- browser-local.json: 根拠を付けた分類。機能ケースの再実行を捏造しない

## 保存物

baseline.json / source-changes.json / code-checks.json / build.json / ssr-audit.json / internal-links.json / security.json / browser-local.json / visual-local.json / chevron-local.json / retail-local.json。公開後はdeployment.json / browser-production.json / http-production.json / pwa-production.json / production-summary.jsonを保存。
