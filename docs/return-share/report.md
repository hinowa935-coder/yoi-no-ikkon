# 再訪・共有導線 改善Phase

確認日: 2026-10-20T06:43:28.518Z

本番反映前。完了とは扱わない。

## 24項目

|番号|項目|結果|
|---|---|---|
|1|トップのホーム画面案内|Aboutの下、スマホ向けの独立した控えめな案内。初期は説明を閉じる|
|2|おちょこのホーム画面案内|一覧の下に短い案内。サイト共有は重複表示しない|
|3|iPhone案内|Safariで開く→共有→ホーム画面に追加→追加。ボタン位置に固定した説明はしない|
|4|Android案内|ブラウザのメニュー→ホーム画面に追加／アプリをインストール。自動プロンプトは呼ばない|
|5|standalone非表示|display-mode: standalone／navigator.standalone。appinstalledでも表示を閉じる|
|6|一献共有の配置|商品情報・購入先・蔵元・料理・夜の後。ヒーローの旧共有ボタンは撤去|
|7|一献共有URL|https://yoi-no-ikkon.vercel.app/sake/{id}。楽天URLではない。query・hashを除去|
|8|サイト共有の配置|トップ下部、ホーム画面案内の後。巨大CTAやSNS別ボタンは置かない|
|9|サイト共有URL|https://yoi-no-ikkon.vercel.app/|
|10|Web Share API|クリックの同一操作内でnavigator.shareを呼ぶ。短いtitle/text/urlのみ|
|11|コピーfallback|非対応／技術的失敗はURLコピー。成功をrole=statusで通知。AbortErrorは無表示・コピーなし|
|12|PC対応|共有・URLコピーは表示。ホーム画面案内はUAと幅で非表示|
|13|Analytics|既存trackEventを使用。site_share_open／sake_share_open／share_link_copy／pwa_guide_open。共有件数を表示せず推薦順位にも不使用|
|14|Accessibility|44px以上のタップ領域、明確なaria-label、focus-visible、native details/summary、Escapeで閉じてsummaryへfocus、polite status|
|15|tests|136|
|16|typecheck|成功|
|17|lint|成功（既存TypeScript parser等。ESLintではない）|
|18|build|成功（Webpack）|
|19|secret scan|成功。秘密値の表示なし、.env.localはGit除外|
|20|production deployment|未実施|
|21|production QA|未実施|
|22|実機iPhone|未確認。WebKit・UA・standalone・APIモックの検証と区別する|
|23|実機Android|未確認。ChromiumのAndroid想定・APIモックと区別する|
|24|残課題|実OSの共有シート、実クリップボード、ホーム画面への実追加は自動検証で保証しない。端末・ブラウザによるメニュー差あり|

## 実装判断

ホーム画面追加はmodalではなく小さなinline disclosureを採用。主要操作や閲覧を遮らず、フォーカストラップも不要。スマホは767px以下＋iPhone/iPod/Android UAを対象とし、Androidタブレットの狭い表示は許容。PCの単なる狭幅表示では出さない。専用インストール処理や新しい永続化は追加しない。

共有には既存ShareButtonを再利用して、キャンセル・コピー・失敗状態・連打防止を補強。元の料理ページの共有文言とイベントは維持。軽量なsiteIdentityモジュールから同一の既存production定数を参照し、共有ボタンだけのために全商品DBをclientへ読み込まない。

商品DB、Verified、料理・夜推薦、購入リンク・承認、manifest、Service Worker、prefetch、保存キー、CSP、依存関係は変更しない。17ファイルのハッシュ比較をsecurity.jsonに保存。既存の未コミット報告書類は公開コミットへ混ぜない。

## 確認範囲と限界

WebKit320/360/375/390/430、Chromium1280、Android想定Chromium390。新導線・native API呼び出し・copy・cancel・技術的失敗・コピー拒否・standaloneの両判定・追加済みイベント・キーボード・保存・戻る・Discover・料理・About・ナビを確認。ブラウザ試験ではnavigator.shareとclipboardをモックし、他人への送信や端末クリップボードの上書きは行わない。OSネイティブのシート表示や実機インストールの確認とは別。

ビルド初回はWindowsの保護環境でmkdir EPERM。ソース修正や恒久的な権限緩和なしに、同じWebpackビルドを通常権限で再実行。Turbopack調査・依存更新・PWA改修は行わない。

## 参照した一次資料

- [MDN: navigator.share](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share): ユーザー操作の必要性、AbortError、非対応を確認。
- [Apple: iPhoneのSafariでウェブサイトをアプリにする](https://support.apple.com/ja-jp/guide/iphone/iphea86e5236/ios): Safariでのホーム画面追加。
- [Google: ウェブアプリを使用する](https://support.google.com/chrome/answer/9658361?co=GENIE.Platform%3DAndroid&hl=ja): Android側の案内。

調査確認日: 2026-10-20。長文転載なし。秘密値・私有URLの追加収集、購入操作、ユーザーへのメッセージ送信はなし。
