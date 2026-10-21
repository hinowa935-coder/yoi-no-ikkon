# トップ下部・フッター UI整理

確認日時: 2026-10-21T21:25:06.432Z

## 結果

「選ぶ・読む・また使う・誰かに渡す・静かに締める」の役割を、見出しの強さ・縦線・2枚の機能カード・折りたたみで分けました。酒・料理データ、推薦・購入・共有処理、PWAの登録処理、ナビゲーションは変更していません。保護対象89ファイルのハッシュは全て一致しています。

| No. | 項目 | 結果 |
| --- | --- | --- |
| 1 | 今宵のおすすめ | 推薦データ・夜・料理・酒・URL・分析イベントは変更せず、見出しをPC28px / スマホ24px、主要CTAを金色の塗りへ。新たな枠は追加しない。 |
| 2 | About | 現在の見出し・指定2文・リンク先を維持。背景は夜のまま、箱ではなく静かなコラムとして整理。320pxでは句単位で自然に折り返す。 |
| 3 | About label | 小さな金文字「宵の一献について」を追加。 |
| 4 | About縦線 | 採用。左1pxの細い金線。横線・別背景カードは使わない。 |
| 5 | PWA card | 通常スマホ向けだけに、細い中立色の枠・透けた背景・Smartphoneアイコンを追加。文言・追加方法・Escape動作・インストール済み判定は維持。 |
| 6 | Share card | PWAと同じ小カードの系統だが別要素。既存ShareButtonと説明をそのまま使用。酒詳細の共有はカード化しない。 |
| 7 | section順序 | 今宵のおすすめ → About → PWA（対象端末のみ）→ 共有 → footer。 |
| 8 | divider | Aboutと機能案内の長い上罫線をやめ、縦線・余白・各小カードで区切る。footerの上と折りたたみの境界だけに細い線を残す。 |
| 9 | section spacing | About前はPC52px / スマホ40px。機能カード前24px、footer前PC56px / スマホ40px。隠れたPWA用の空ラッパーは作らない。 |
| 10 | footer navigation | 締めの言葉とは別のnavに3リンク。スマホは1列、PCは折り返せる横並び。ボタン化なし。 |
| 11 | 年齢注意 | 「お酒は20歳になってから。」を独立した段落へ。リンクと横並びにしない。 |
| 12 | 広告・提携block | 見出し「広告・提携について」に、既存の広告・紹介料説明と楽天利用表記を集約。Amazon表記の既存条件分岐も維持。広告の注意は折りたたみの外。 |
| 13 | Rakuten Developers credit | 原文のRakutenCreditコンポーネントを変更せず、広告・提携ブロック内へ配置。削除・単独の孤立表示なし。 |
| 14 | 注意書きaccordion | native details / summary、初期閉。既存PURCHASE_INFORMATION_NOTICEを意味・文字列とも維持して2段落へ。chevronは開閉に合わせ180度回転。 |
| 15 | bottom navとの距離 | 既存のsafe-areaとshell下余白を保持。スクロール最下部でfooterの下端と固定ナビ上端の間に18px以上（設計値20px）を確認。 |
| 16 | PWA非表示layout | PC、navigator.standalone、display-modeの各非表示条件を確認。PWAはnullを返し、About→共有は20〜40pxの自然な余白でつながる。 |
| 17 | 320px QA | WebKitで階層・折りたたみ・リンク・共有・戻る・おちょこ・固定ナビを確認。句分けにより見出し末尾だけの改行も解消。 |
| 18 | 390px QA | 重点確認。2つの機能カード、本文・見出しの強弱、footerとナビの距離を確認。WebKitとAndroid想定Chromeの両方。 |
| 19 | 430px QA | WebKitで表示・操作確認。360px / 375pxも同一項目を確認。 |
| 20 | 1280px QA | Chromeで確認。PWA案内なし、共有は小カード1枚、footerは静かなテキスト案内。 |
| 21 | accessibility | native detailsの展開状態はブラウザが提供。Enter / Spaceで開閉しsummaryへフォーカスを維持。PWAは既存Escape対応。リンクとbuttonを役割で区別し、装飾アイコンはaria-hidden。reduced-motion対応。 |
| 22 | tests | 156 / 156成功。既存の広告確認は移動先SiteFooterとShellへの組込みを両方確認するよう更新。 |
| 23 | typecheck | 成功 |
| 24 | lint | 既存custom lint成功。新規ライブラリ・依存更新なし。 |
| 25 | build | Webpack production build / postbuild成功。既知Turbopackの調査は行わない。 |
| 26 | secret scan | src / scripts / 静的出力 / 報告書を検査し成功。.env.localのGit除外と未追跡も確認。 |
| 27 | production deployment | ローカルQA済み。本番反映・確認後にproduction-summary.jsonで確定する。 |
| 28 | production QA | 未実施 |
| 29 | 実機iPhone | 未実施。WebKitの各スマホ幅とstandalone模擬は実機インストール確認ではない。 |
| 30 | 実機Android | 未実施。Android想定Chromeでの確認は実機確認ではない。 |
| 31 | 残課題 | 実機OSの共有シート・ホーム画面起動は未確認。Web Share / clipboardは安全なモックでデータ受渡しを検証し、実際のメッセージ送信・OSクリップボード変更はしていない。 |

## Before / After

- before-390-about.png / after-390-about.png: Aboutは横線の繰り返しから、ラベルと細い縦線の読み物へ。
- before-390-tools.png / after-390-tools.png: PWAは控えめな機能カードへ。共有は独立カードで、統合しない。
- before-390-footer.png / after-390-footer.png: リンク・年齢・広告・購入注意を別々の階層へ。全文注意は初期閉。
- before-1280-footer.png / after-1280-footer.png: PCの案内と静かな締め。
- after-edges-320-about.png / after-edges-430-tools.png: 最小幅の句単位の改行、広めのスマホでの余白。

footerの表示密度を下げることを優先し、単純に高さを最小化する設計にはしていません。比較時の高さは、390pxで341.3px → 575.4pxです。常時表示の法定・提携案内を読めるサイズにし、詳細だけ折りたたんでいます。

## 検証資料

browser-local.json / browser-production.json: viewport別の操作・レイアウト測定。http-local.json / http-production.json: 主要8ページと非公開パスの確認。protected-data.json: データ・推薦・commerce等の非変更確認。internal-links.json: 静的出力全ページの内部リンク。code-checks.json / build.json / security.json: 実行結果。baseline commit: 9b9b0417a411d66620e2c479ee25ffa3fa18cb60。
