# 検索・料理導線 UI整理

確認日時: 2026-10-21T22:32:34.718Z

キーワードから、または大きな分類から探し、必要な条件だけを開く構成に整理しました。商品・料理DB、Verified、推薦、購入、PWA、既存URLとSEO設定は保持しています。

| No. | 項目 | 結果 |
| --- | --- | --- |
| 1 | 表画面の飲み方 | 独立した3ボタンを削除。キーワード→絞り込み／並び順→件数・結果へ短縮。 |
| 2 | filter内飲み方 | 冷酒・常温・熱燗を保持。詳細温度の選択肢は検索に増やさず、既存の詳細温度URLは引き続き照合可能。 |
| 3 | 飲み口→飲みごたえ | 第一階層の見出し・選択条件chipを変更。値や元の味わい情報は変えない。 |
| 4 | すっきり／軽やか | キレ・後口の「すっきり」と、ボディの「軽やか」は別述語だったため両方維持。「後口すっきり」と表示して区別。 |
| 5 | OR／AND | 同じ項目の複数選択はOR、項目間はAND。実データ全件の組合せで単一条件の和集合・積集合と比較。 |
| 6 | button height | 48px以上。チェック用の位置を確保し、選択しても幅や高さが変わらない。 |
| 7 | padding | 上下12px、右16px、左30px、最小幅86px。内容幅＋ボタン単位の折り返し。 |
| 8 | border | 通常は白系の控えめな細線。全面金色やglowは使わない。 |
| 9 | selected state | aria-pressed、チェック、金色の枠、薄い金色背景を併用。色だけに頼らない。 |
| 10 | 文字サイズ | filterは14px / line-height1.5 / medium。文字は1行。カテゴリはPC14px・スマホ13px、長い名称も1行。 |
| 11 | chip | 選択値ごとに表示・個別解除。解除で同じ項目の他の選択値を消さない。絞り込みボタンへ選択数を表示。 |
| 12 | 結果件数 | sheetと結果画面は同じ検索stateから即時算出。CTAと件数はaria-live。 |
| 13 | 0件UI | 0件の理由案内と条件を減らす提案。外すと結果が出る項目がある場合は件数付き解除ボタン。無条件時の全解除はdisabled。 |
| 14 | 検索状態保持 | 既存URL＋sessionStorageを維持し、複数値は同じquery keyを繰り返す。旧単一値URL・詳細温度・並び順・おちょこ・読込件数を保持。 |
| 15 | 料理category数 | 8 |
| 16 | category名称 | 魚・魚介 74品／肉料理 72品／野菜・豆腐 165品／焼く・炒める 69品／揚げもの 28品／煮もの・鍋 61品／ごはん・麺 27品／郷土料理・つまみ 92品 |
| 17 | 全料理mapping | 296品を別のUI分類モジュールへ対応。料理DB・説明・出典・レシピ・ペアリングは変更なし。全件一覧はcategory-mapping.json。 |
| 18 | 複数category所属 | 233品。食材系と調理法／郷土性の重なりを許容。最大4分類。カテゴリ件数合計は全料理数とは別。 |
| 19 | 未分類数 | 0品。無効カテゴリ・重複IDも0。 |
| 20 | 料理の種類select | 表画面から削除。古い細分類のcategory URLは読めるように維持。 |
| 21 | すべての料理を見る | 1操作で全件モードへ。初期は一覧を出さず、検索語・カテゴリ・全件モードのいずれかがある時だけ結果表示。Discoverの全料理リンクは?all=1へ。 |
| 22 | category選択UI | スマホ2列、PC4列。既存の細線・金色アイコン・薄い選択背景の系統。選択チェックと個別解除。 |
| 23 | 料理card変更 | 既存カード・地域・アイコン・短い説明・2行clampを維持。料理データを編集しない。 |
| 24 | browser back状態 | 料理はq/category/all/countをURLへ保持、既存検索と同方式でsessionStorageへスクロールを保存。詳細→戻る・再読込を確認。 |
| 25 | 320px QA | WebKitで成功。overflow、文字幅、タップ領域、sheet、各導線を確認。 |
| 26 | 390px QA | WebKitとAndroid想定Chromeで成功。 |
| 27 | 430px QA | WebKitで成功。360px・375pxも同じ項目を確認。 |
| 28 | 1280px QA | Chromeで成功。 |
| 29 | accessibility | native dialog・fieldset/legend・aria-pressed・チェック・状態通知・focus-visibleを使用。Tabトラップ、Escapeと戻りフォーカスを確認。 |
| 30 | tests | 162件成功 |
| 31 | typecheck | 成功 |
| 32 | lint | 既存custom lint成功（ESLintではない） |
| 33 | build | Webpack production build / postbuild成功。最初の制限環境ではWindows mkdir EPERM、同一処理を必要権限で再実行して成功。Turbopackや依存関係は変更しない。 |
| 34 | secret scan | 成功。.env.localはGit除外・未追跡。値は報告・ログへ出力しない。 |
| 35 | production deployment | ローカル確認後に既存Vercel Git連携で反映。 |
| 36 | production QA | 未完了 |
| 37 | 実機iPhone | 未実施。WebKitスマホ幅検証は実機Safari・実機PWAと同じではない。 |
| 38 | 実機Android | 未実施。Android想定Chrome検証は実機確認ではない。 |
| 39 | 残課題 | 実機PWAでの確認は未実施。料理カテゴリは既存名・分類・地域に基づくナビゲーション用分類であり、食材情報や公式ペアリングの根拠には流用しない。 |

## 変更前後

日本酒結果一覧の上端（ページ座標）: 390px幅: 572.671875px → 454.890625px、1280px幅: 639.78125px → 530.390625px。

before / after / production の390px・1280pxスクリーンショット: search（検索上部）、sheet（絞り込み）、food（料理初期）、category（カテゴリ選択後）。320px・430pxはedges画像も保存。カテゴリ選択時だけ結果見出しへ移動してフォーカスし、入力中や戻る復元時は移動しません。

## 分類の確認

296品を読み合わせ、部分一致の「いぶりがっこ→魚」、厚揚げ／油揚げを食材として使う煮物→揚げもの、いかそうめん→麺、柿の葉寿司→野菜、ナムル→炒めもの等を除外しました。既存の主な食材や説明で確認できる郷土料理も対応し、元の料理分類の誤記を推薦側へ波及させず、UI側だけで補正しています。

料理一覧はURLの全件モードで維持し、JavaScript無効時もnoscriptで既存の全料理detailリンクを出力。metadata・canonical・sitemap・料理詳細URLは変更していません。

## WebKitの既存先読みメッセージ

変更前の本番でも、高速な画面移動でNextのRSC先読みのaccess controlメッセージとLoad request cancelledが再現し、HTTPエラーは0、遷移先は正常でした（network-baseline.json）。これは新規のCSP許可ではありません。検証では生のメッセージを保存し、同型のWebKit RSCメッセージで取消通信が併発するものだけknownPrefetchWarningsへ分離します。一般のJS例外、遷移・状態・表示の失敗、内部HTTPエラーは成功扱いしません。CSP・依存関係・全体のprefetch設定は変更していません。

ローカル通常操作: 成功、既存型メッセージ 11件。実機での再現有無は未確認です。

## 保護・検証資料

protected-data.json: 元データ・commerce・料理/日本酒詳細・PWA等のハッシュ。料理詳細の全件リンク1箇所だけは /food → /food?all=1 の許可差分を逆正規化し、それ以外が同一であることを検査しています。category-mapping.json: 全296品の対応。browser-local.json / browser-production.json: 実操作。static-local.json / static-production.json: JavaScript無効時の296リンク。http-local.json / http-production.json: 公開経路と非公開404。code-checks.json / build.json / security.json / internal-links.json: 品質結果。

Baseline: 4bce5edef7954b2dd1fece920edc38dacdb187d4

先読み警告の追加検証: prefetch-probe-local.json / prefetch-probe-production.json。通常操作は全項目成功・内部HTTPエラー0を必須とし、警告URLを同じ画面幅のWebKitでRSCヘッダー付き再取得して成功したものだけ既存警告として扱います。元のエラーメッセージはerrorsに保持し、警告なしの実行へ見せかけていません。
