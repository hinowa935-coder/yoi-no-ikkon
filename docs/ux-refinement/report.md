# UI / UX 全体整理 Phase

確認日時: 2026-10-20T08:43:55.281Z

本番反映前。完了として扱わない。

## 35項目

|番号|項目|結果|
|---|---|---|
|1|変更画面|日本酒検索・共通日本酒カード・日本酒詳細・料理検索・おちょこ。トップとナビは既存の良い導線を維持|
|2|検索UI|キーワード＋3飲み方＋絞り込み。検索語クリア。native dialogをスマホ下部sheet／PC中央panelに使用|
|3|温度検索|新しい操作は冷酒／常温／熱燗の3択。変更前の飲み方selectは22選択肢。内部temperature dataは完全保持|
|4|詳細温度|3分類→出典にある細かな温度名→既存の数値範囲。熱燗分類はぬる燗等も含むと注記し50℃を捏造しない|
|5|filter第一階層|味わい5択・香り3択・飲み口2択・飲み方3択・都道府県select|
|6|専門条件|種類・料理・夜の気分・従来の味わい条件をさらに細かく選ぶへ。原料米／精米歩合の専用検索は元々なかったため新設せず、詳細に全値保持|
|7|選択中chip|キーワード、味、香り、飲み口、温度、都道府県等を個別解除。すべて解除も表示|
|8|結果件数|520本を母数にリアルタイム更新。sheetの下部CTAはN本を見る。別の適用待ちstateを作らない|
|9|0件UI|条件を減らす提案＋リセット。外すと見つかる場合のみ正確な件数付き緩和案を最大3件。料理検索にもリセット|
|10|検索状態保持|既存URL query・sessionStorage・history.stateの設計を再利用。新aroma/bodyもURLへ。旧詳細温度URLは精度を落とさず保持|
|11|scroll位置|ローカル／本番確認結果待ち|
|12|検索結果カード|画像、酒名、短いcatch、最大3tag、蔵元／県、おちょこ、詳細。詳細スペック・全料理の展開は詳細ページへ|
|13|日本酒詳細|酒名→蔵元／県→画像→短いcatch→味・飲み方→購入→蔵元→料理・夜→詳しい酒情報・出典→共有|
|14|スペック|前半の表を後半の詳しい酒情報へ移動。Verified全タグ、編集タグ、全項目、温度、出典、実飲情報は保持|
|15|料理UI|酒詳細は最初6件、その先はほかの料理を見る。料理検索のclearと0件resetを追加。レシピ・料理データは変更なし|
|16|夜UI|既存の適性順・季節判定・最大3件表示を維持。夜taxonomy／推薦計算は変更なし|
|17|トップ|気分・料理・日本酒の3入口が既に明確なので配置・世界観は維持。About／ホーム画面／共有は下部の補助導線|
|18|おちょこ|共通カード整理。空表示に一献を探す。保存済みでも検索・Discoverへ戻れる|
|19|navigation|現行の現在地表示・safe-area対応を維持。URLやメニュー構造を変えない|
|20|bottom nav|新設や5項目化をせず、既存の今夜・探す・おちょこの3項目を採用継続。320pxで窮屈にしない|
|21|accessibility|native modal＋Tab循環補助、Escape、close、focus復帰、背景scroll抑止、44px tap、aria-pressed＋check、live件数、reduced motion|
|22|performance|新しい依存0。既存検索stateを再利用。filter結果はuseMemo、0件時だけ緩和件数を計算。カードは実anchorをCSSで拡張しJS擬似navigationを使わない|
|23|320px QA|本番待ち|
|24|390px QA|本番待ち|
|25|1280px QA|本番待ち|
|26|tests|144|
|27|typecheck|成功|
|28|lint|成功（既存custom parser検査、ESLintではない）|
|29|build|成功（Webpack）|
|30|secret scan|成功・秘密値出力なし|
|31|production deployment|未実施|
|32|production QA|未実施|
|33|実機iPhone|未確認。WebKitのモバイル想定と区別|
|34|実機Android|未確認。Chromiumモバイル想定と区別|
|35|残課題|実端末のキーボード／共有シート／PWA初回起動は保証しない。既存PWA起動時の通信中断警告は別記。未知の味を生成・補完しない|

## 実装・データ保護

新たな味の数値や官能評価は作成しない。検索用の香り／飲み口のグルーピングは既存profile・taste・裏付けタグにある語だけを参照し、未知は一致扱いしない。穏やかな酸味を穏やかな香りへ流用しない。ほのかな吟醸香だけでは華やかへ分類しない。商品DB、Verified、温度の詳細データ、推薦、購入URL・正式画像・承認、PWA基盤、共有・ホーム画面案内、依存関係の保護対象21ファイルをハッシュ確認。

絞り込みは編集即時反映方式。閉じる／N本を見るは同じ検索状態を使い、別のdraftや戻る用stateを増やさない。sheet自体のためにbrowser historyを追加せず、ページの戻るを妨げない。native dialogのinert／Escape／focusを使い、WebKitのTab端点に循環補助を追加した。背景scrollは開いている間だけ抑止し、閉じるかunmountしたら元へ戻す。

カードは見出しの本物のリンクをCSSで広げる。favoriteと正式楽天creativeは上の独立tap領域を保持し、divのonClickやnested anchorにはしない。正式HTML・画像URLを加工しない。購入リンクを新規生成・再照合しない。

## Before / After

変更前は公開サイトの390/1280pxを実ブラウザ確認。before-browser.jsonとbefore-*-search/filters/detail/home/ochoko.pngを保存。変更後はlocal/production-*-search/filters/detail.png。比較の要点は温度22選択肢→3分類、inline filter→sheet、一覧の補助情報を詳細へ、詳細前半のspec表を後半へ、0件からの復帰操作。

## 発見した問題と修正

- WebKitのTab端点でフォーカスがシート外へ抜ける動作を検出。native modalに端点循環を補った。
- iPhone想定でnative検索クリアと独自Xが重なったため、searchbox roleと検索keyboard指定を持つtext入力＋独自clearへ統一。
- Chromiumでは詳細遷移直後、旧検索画面のscroll listenerがまだ残り、詳細の先頭位置0を検索の保存位置へ書いていた。scroll-diagnostic-before.jsonに記録。保存時にpathname・queryの一致を必須にし、スクロール位置1217→詳細0→戻る1217をscroll-diagnostic.jsonで確認。新たなstate保存方式は追加しない。
- 100文字の非改行検索語のchipが幅746pxになったためmax-widthと折り返しを指定。320pxで幅280pxに収まり、短い画面568pxでもsheetと下部CTAが収まることをbounds-probe.jsonで確認。
- Escape後のReact cleanupとリンク名末尾矢印を考慮して試験側の待機・role selectorを修正。失敗した試行もbrowser-local-*-attempt.jsonへ保存。

RSC通信の警告は無条件に無視しない。ページのrequestfailedでcancelled/ERR_ABORTEDが対応するもの、または既に表示を終えた別routeの__next*.txtに限り、同一オリジンの再取得200・RSC型・本文ありを確認して別記する。現在のrouteの未確認失敗・一般JS取得エラー・HTTP失敗・ユーザー操作の失敗は完了判定に残す。

## 運用

本番確認後の記録はローカル報告書に追記し、記録だけで不要な再デプロイをしない。次のPhase、新規商品調査、API再取得、自動監視は開始しない。
