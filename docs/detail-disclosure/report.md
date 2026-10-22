# 日本酒詳細ページ アコーディオン再設計

確認日時: 2026-10-22T14:08:35.325Z

## 1. 変更前section順

酒名・画像 → 味わい → 詳しい酒情報（閉）→ 購入先（開）→ 出典（閉）→ 料理（開）→ この土地の肴（開・存在時）→ 夜 → 共有。

## 2. 変更後section順

酒名・画像 → 味わい → 詳しい酒情報 → 購入先 → 蔵元・商品情報の出典 → 合う料理 → この土地の肴（存在時）→ こんな夜に → 共有。並び順自体は維持し、情報の開き方を整理。

## 3. accordion化したsection

詳しい酒情報・購入先・出典・合う料理・この土地の肴。購入先、料理、肴の3つを新たに折りたたみ。

## 4. 常時表示section

酒名・蔵元・商品画像・味わい/香り/飲みごたえ・おちょこ保存・こんな夜に・この一献を、誰かにも。

## 5. 詳しい酒情報summary

既存表示値の特定名称と精米歩合。30文字を超える等の場合は「酒質・原料米・温度を見る」。新たな酒質情報は生成しない。

## 6. 購入先summary

実際に表示する購入データのdestinationTypeがproduct_pageであるものを集計。「楽天の商品ページあり」「楽天ほか商品ページあり」等。検索結果/取扱店一覧のみは「販売店・購入先を探す」。在庫ありを断定しない。

## 7. 出典summary

「蔵元・参考資料を見る」。蔵元・商品出典・味わいの参考情報の本文と全リンクは内部に維持。

## 8. 料理summary

代表料理名のみ。最大3件、長い場合は22文字を目安に2件/1件へ削減。表示しない残りを「ほかN品」として正確に表示。理由は内部だけ。

## 9. 土地の肴summary

存在する肴の名前のみ。料理と同じ長さ制御。正式画像・説明・地域・編集ペアリング・購入先は内部に維持。

## 10. default open / closed

5種類すべて初期closed。defaultOpenの共通APIあり。夜と共有は折りたたまない。

## 11. 料理代表名の最大件数

3件。長い名前を無理に3件詰めず、残数を調整。

## 12. specialty代表名の最大件数

3件。現行表示データの上限も3件を維持。

## 13. 0件section

購入先が0件なら非表示。編集料理と公式料理の両方が0件なら料理枠を非表示。公式料理のみ存在する場合はそれを保持。肴0件はsectionごと非表示。酒情報は従来hasSpecs条件を維持。削除したのは空の料理準備中案内だけで、料理データは無変更。

## 14. 共通component

DetailAccordionを拡張。title / summary / children / defaultOpen / id / sakeId / section。summary生成は別の純粋関数detailDisclosure.jsに分離。

## 15. accessibility

button、type=button、aria-expanded、aria-controls、titleのaria-labelledby、summaryのaria-describedby、unique panel IDs、h2→h3、focus ring、全行タップ、76px以上のヘッダー、reduced motion。全内容はSSRに保持しhiddenで表示だけ切り替える。

## 16. keyboard QA

Enterで展開、Spaceで閉じる、focus ring、ARIA連動を6幅で確認。

## 17. multiple open QA

複数の全パネルを同時に開き、1つ閉じても購入先など他の開いた状態が保持されることを確認。不要な入れ子料理accordionは廃止し、全料理カードを一段で表示。

## 18. 320px

WebKit: 1商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 19. 360px

WebKit: 1商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 20. 375px

WebKit: 1商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 21. 390px

WebKit: 8商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 22. 430px

WebKit: 1商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 23. 1280px

Chromium: 8商品ケース / 開閉・回帰成功。summaryは最大2行、chevron保持、横はみ出しなし。

## 24. 購入link維持

全484件のSSRで変更前後のリンク先・rel・target・順序を完全比較。空料理枠の/food案内1本のみ非表示例外。楽天→Amazon→その他の優先順位・normal fallback・広告/仕様差異注記を変更していない。

## 25. affiliate tracking維持

既存affiliate_clickを実クリックで確認。購入処理自体は無変更。新規detail_accordion_open/closeにはsakeId/section/entrySourceのみ。外部リンクの遷移先は同一バイト比較、購入やカート操作は未実施。

## 26. 料理推薦維持

料理DB、理由、推薦関数、点数はbaselineハッシュ一致。展開時に全カードと公式ペアリングを維持。

## 27. night推薦維持

夜データ、点数、季節表示、リンクを無変更。実クリックして戻る確認を実施。

## 28. temperature維持

飲み方・詳細温度は詳しい酒情報の内部に一度だけ。既存のServingGuideと元データを無変更。

## 29. favorite維持

おちょこ追加→一覧表示を6幅で確認。PWA再読み込み後の保存保持はPWA報告を参照。商品ID・localStorage仕様・既存お気に入りを変更しない。

## 30. share維持

Web Share / clipboard / cancel silentの既存テストを維持。PCでは実際のコピー内容が当該日本酒の正規本番URLであることを確認。

## 31. tests

193件 / 成功。summary生成、0件、長文、純粋な表示変更、厳密な変更許可ハッシュ検査を追加。旧構造のみを要求する2テストを新要件に更新。

## 32. typecheck

成功

## 33. lint

成功

## 34. build

成功。既存Webpack build + postbuild。初回はWindows EPERMで停止したが、正規の権限承認を経た最終ビルドは成功。依存更新やTurbopack問題の調査はしていない。

## 35. code check

手動diffレビュー + 自動回帰。code-review.json参照。独立した第三者レビューではない。元データ・commerce・PWA・検索・保存・共有の保護対象はハッシュ一致。

## 36. secret scan

成功。実際の楽天秘密値・エンコード形をソース/出力HTML/新規レポートで検査。.env.local除外・未追跡、CSP/依存/環境設定は無変更。

## 37. production deployment

QA通過。本番反映処理待ち。

## 38. production QA

未実施 / 公開後確認待ち。HTTP全商品: 未実施 / 公開後確認待ち。PWA更新前後: 警告・失敗あり（詳細は対応JSON）。現行PWA単独: 未実施 / 公開後確認待ち。詳細は各JSONに記録。

## 39. WebKit warning状況

通常ブラウザ local既知警告2・blocking0、production既知警告未確認・blocking未確認。公開前の未変更サイトで初回PWA起動時のpolicy navigation cancellation、Script-load、RSC警告を再現しpwa-bootstrap-attempt.jsonに保存。自動controllerchange reloadとの検証競合を避けて再準備。これを今回の新規不具合や解消済み問題とは扱わない。PWA更新後の警告は別報告。

## 40. 実機iPhone確認

未実施。WebKitエミュレーションとService Worker検証は実機確認とは別。

## 41. 実機Android確認

未実施。ChromiumとService Worker検証は実機確認とは別。

## 42. 残課題

実機確認、既存WebKit起動警告の独立調査、公開後の開閉率/購入クリック率の観察。既存の公式発行画像HTMLの空altは加工せず維持し、別の名前付きCTAを提供。今回これらを解消済みとはしない。

## 証跡

- baseline.json / source-changes.json
- checks.json / build.json / code-review.json / security.json
- static-audit.json（484 ACTIVE詳細）
- browser-local.json / browser-production.json
- pwa-bootstrap-attempt.json / pwa-before.json / pwa-upgrade.json / pwa-current.json
- production-http.json / deployment.json
