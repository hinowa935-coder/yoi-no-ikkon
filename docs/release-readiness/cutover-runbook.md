# 正式切替の前後で行うこと

今回の作業は公開前の隔離版まで。Netlifyの主URL、Vercel、楽天の媒体登録、GA4設定、Search Console、SNSはいずれも変更していない。通常の正規URLは `https://yoi-no-ikkon.netlify.app/`。

## 承認前

1. **GA4**：対象ウェブストリームは指定された測定IDと一致。DebugViewまたはRealtimeで6種のイベントを確認し、送信の成功だけで受信済みとは扱わない。検証は任意の計測許可を尊重する。 [GoogleのDebugView手順](https://support.google.com/analytics/answer/7201382?hl=ja)
2. **検証配信**：ドラフトの別ホストは正式な楽天登録媒体と一致することを確認できていない。登録済みの主URLを更新する場合と、別ホストに検証版を出す場合を混同しない。楽天素材を未確認の媒体へ配布しない。 [楽天掲載サイト登録](https://affiliate.faq.rakuten.net/detail/000009890)、[Netlifyのドラフトと本番配信](https://docs.netlify.com/api-and-cli-guides/cli-guides/get-started-with-cli/)
3. **実機**：少なくとも1台でTOP→料理→酒→この土地の肴→楽天→戻るを確認。おちょこ・スクロール・下部ナビ・折り畳み、PWA追加・起動・再読み込みを確認。Instagram内ブラウザは別記録。古いホストと新しいホストの保存領域は別なので、既存のおちょこが勝手に移ったとは案内しない。
4. **期限**：`expiry-batches.json` の期限・予定日を確認。期限内の正常な素材だけで切り替え、次回確認日を日付だけで延期しない。

## 明示承認後のみ

1. 登録済み主URLで配信する出力のCommerce・robots・canonical・共有を最終確認してから、正式切替とインデックス制限解除を行う。
2. Search ConsoleではNetlifyのURLプレフィックス `https://yoi-no-ikkon.netlify.app/` を追加し、運営者のアカウントで所有権を確認。公開後に `/sitemap.xml` を送信し、トップと代表の酒・料理詳細をURL検査する。今回は登録操作・送信をしていない。 [プロパティ追加](https://support.google.com/webmasters/answer/34592?hl=ja)、[URL検査](https://support.google.com/webmasters/answer/9012289?hl=ja)
3. Instagram `@yoi_no_ikkon` のプロフィール、Xのプロフィール、その他プロフィール・リンク集、固定投稿、予約投稿テンプレートを点検し、旧URLを書き換える。Instagramの計測用は `/?utm_source=instagram&utm_medium=social`。プロフィールや投稿はまだ変更していない。
4. Netlify正式公開、Commerce、GA4、実機、Search Console、SNS変更がすべて確認でき、数日間安定してから旧Vercelの扱いを決める。それまでは停止・削除・転送ルール追加を行わない。旧ホストのURLや保存データを必要とする人への案内も先に整える。
