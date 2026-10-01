# 宵の一献 公開手順メモ

最終更新: 2026-10-02

## いま起きている問題

このPCでは `git-remote-https.exe` がクラッシュすることがあり、HTTPS remote への `git push` が不安定です。

そのため、今後は次の順で公開します。

1. Codex/GitHub連携APIでGitHubへ反映する
2. VercelのGit連携で自動デプロイされるのを確認する
3. 手動でpushする必要がある場合は、HTTPSではなくSSH remoteを使う

## やらない方がよいコマンド

```powershell
git -c http.sslBackend=openssl push origin main
```

このコマンドは環境によって `git-remote-https.exe` のクラッシュを誘発します。

## 現在の推奨remote

```powershell
git remote set-url origin git@github.com:hinowa935-coder/yoi-no-ikkon.git
```

SSHキーがGitHubに登録されていれば、以後は次で公開できます。

```powershell
git push origin main
```

## SSHキーが未設定の場合

GitHubの `Settings > SSH and GPG keys` に公開鍵を登録してから使います。

秘密鍵は絶対に共有しません。Codex側で無断生成もしません。必要な場合は、ユーザーの明示許可を得てから作業します。

## Codex側の安全な代替手段

Git pushが壊れる場合でも、CodexのGitHub連携APIで次のように反映できます。

- 新規ファイルはGitHub Contents APIで作成
- 既存ファイルは現在のblob SHAを取得して更新
- Vercel deploymentsで最新コミットの `READY` を確認

今回のPhase 1反映はこの方法で行いました。
