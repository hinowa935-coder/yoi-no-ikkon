# 宵の一献

日本酒と家庭料理のペアリングを、料理・銘柄・産地・味わい・今夜の気分から探せるNext.jsアプリです。

## Discovery Experience v1

ローカル実装は固定済みDB v1の492商品を使用します。本番への反映は行っていません。

- `/`：今夜の気分・料理・日本酒の3入口と日替わり提案
- `/discover`、`/nights/[slug]`：夜 → 食べたい方向 → 家庭料理 → おすすめ三本
- `/food`、`/food/[slug]`：料理の逆引き
- `/search`：従来の検索・絞り込み
- `/sake/[slug]`：料理を先に紹介する商品詳細
- `/ochoko`：わたしのおちょこ（端末保存）

商品/SKUの固定データは `docs/sake-db-v1/catalog.json` です。公開用の軽量ビューは次の手順で再生成します。別SKUへ置き換わった旧商品から、料理・味わい・温度・お気に入りは引き継ぎません。

```bash
node scripts/prepare-discovery-data.mjs
node --test scripts/*.test.mjs
npm run build
```

WindowsでのNext.js 16の書き出しでは、先読みデータのファイル名に区切りの不一致が生じることがあります。`postbuild` が既存ファイルを残したまま互換名を自動生成します。手動のコピーや修正は不要です。

過去の503商品の研究テストは `src/data/legacySiteData.js` の保存時点を検査し、492商品の実際の読み込み・旧ID移行・推薦・出典は `scripts/discovery.test.mjs` で別途検査します。

静的書き出しを維持しています。日替わり提案は初期HTMLの内容から始め、読み込み後に日本時間の日付で切り替わります。

公開URL: https://yoi-no-ikkon.vercel.app/

## ローカルで確認

```bash
npm install
npm run dev
```

起動した画面は開いたままにし、表示されたローカルURLをブラウザで開きます。今回の確認用URLは `http://127.0.0.1:3100/` です。起動をやり直す場合は、表示されたポート番号を確認してください。

詳細な検証結果・代表5経路・残課題は `docs/discovery-v1/report.md` にあります。公開用ファイルのブラウザ検証は、ビルド後に以下で実行できます。

```powershell
$env:DISCOVERY_STATIC_PREVIEW = '1'
node scripts/verify-discovery-browser.mjs
node scripts/audit-discovery.mjs
```

検証用の静的サーバーは検証終了時に自動で停止します。本番公開は行いません。

## 公開用に書き出す

```bash
npm run build
```

ビルド後、`out/` フォルダに公開用ファイルが作られます。

## 公開先

おすすめはVercelです。GitHubにこのフォルダをアップして、Vercelでそのリポジトリを選ぶと公開できます。

Vercelを使わない場合も、`out/` フォルダを静的サイトとして公開できるサービスにアップできます。
