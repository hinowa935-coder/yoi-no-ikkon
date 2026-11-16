# 正式切替の前後で行うこと

正式URLは `https://yoi-no-ikkon.netlify.app/`。正式素材はGitHubへ保存せず、原本付きローカル隔離環境からのみ本番用static outputを作る。

## 公開前

1. **GA4**：対象ウェブストリームは指定された測定IDと一致。DebugViewまたはRealtimeで6種のイベントを確認し、送信HTTP 204だけを受信確認とは扱わない。
2. **楽天正式素材**：branch deployなど未登録ホストでは配信しない。登録済み主URL用の本番outputだけに399画像・387 Affiliateの原本をmaterializeする。
3. **実機**：少なくとも1台でTOP→料理→酒→この土地の肴→楽天→戻るを確認。おちょこ・スクロール・下部ナビ・折り畳み、PWA追加・起動・再読み込みを確認する。
4. **期限**：`expiry-batches.json` の期限・予定日を確認。期限内の正常素材だけで切り替え、validUntilだけを延期しない。

## 本番build

本番buildはGitHub上のpublic materialでは作らない。原本付きの新しい隔離ディレクトリで、以下の条件を満たして実行する。

- `AFFILIATE_ENABLED=true`
- `AFFILIATE_REGISTERED_SITE=https://yoi-no-ikkon.netlify.app/`
- `AFFILIATE_RAKUTEN_ENABLED=true`
- `AFFILIATE_RAKUTEN_ROUTE=rakuten`
- `NETLIFY_MIGRATION_STAGE=production`
- `NETLIFY_PRODUCTION_CUTOVER_APPROVED=true`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-P83M4NJFCK`

`NETLIFY=true` のGit-hosted buildではproduction cutoverを拒否する。正式素材を含む本番outputはローカルで検証後、同じ `out` をNetlify productionへ直接deployする。

## 本番outputの必須確認

- ACTIVE 484
- 正式画像 399前後
- Affiliate direct 387前後
- Normal direct 3前後
- Search 94前後
- None 0
- `Affiliate + Normal + Search = 484`
- expired approval露出 0
- Vercel runtime approval 0
- `_headers` に `X-Robots-Tag: noindex` がない
- `robots.txt` がAllow + Netlify sitemap
- canonical / OG / share / sitemap がNetlify
- build / typecheck / lint / secret scan 成功

## 公開後

1. Netlify主URLでトップ、料理、酒詳細、正式画像、Affiliate、検索fallback、PWA、GA4をsmoke testする。
2. Search ConsoleでNetlify URL-prefixを追加し、`/sitemap.xml` を送信。トップと代表の酒・料理詳細をURL検査する。
3. Instagram `@yoi_no_ikkon`、X、その他プロフィール・リンク集の旧URLをNetlifyへ変更する。
4. Vercelは切り戻し用に維持し、Netlifyが数日安定してから停止判断する。
