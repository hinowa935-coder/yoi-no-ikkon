# 「この土地の肴」全国47都道府県化・追加審査

確認日: 2026-10-23（日本時間）

本番反映前。

## Source of Truth

今回の本番再取得ではACTIVE 484本・欠損県0・master 67品・表示65品・255酒・352組。指示書の22品/179組は過去の参考値であり、すでに公開済みの全国化を巻き戻しません。既存67品・67offer・352組をレコードハッシュで保存し、味わい説明・Verified・日本酒DB・推薦・UI・PWA・CSPはそのままです。

## 調査と境界

- 本文の都道府県列挙は46件ですが、「47すべて」を優先し沖縄も含めました。沖縄は酒0本のため表示を作りません。
- 47県の既存291候補と地域資料を再利用。未検索217候補をQPS1以下で追加探索。既存74検索は24時間以内のキャッシュであり、商品同定や現行在庫承認とは区別。限定した補助検索6回を別記。
- 計368地域資料URLを再取得し362件が本文可読。取得失敗を新規確認済みにはせず、過去の検証根拠は確認日を維持。
- 13食品を重点照合。12品を採用、丸焼き鯖1品はタイトル200g/仕様約350gの食い違いが現行UIにも残り保留。数合わせで80品へ増やしません。
- 正式画像は楽天公式作成画面で発行した原文HTMLのみ。守口漬のランキング表示入り画像は公式画像選択から別画像へ再発行し、URL/画像は加工していません。
- 三重の丸干しは内臓除去タイプを新IDで明記。内臓つきの苦味は流用せず、北海道原料と熊野加工の文化を区別。広島菜の浅漬け/本漬け、千枚漬け/乳酸発酵、完成料理/調理素材も区別しました。
- 新しい酒質根拠は既存の値単位Verifiedまたは最新味わい監査の値単位claimを引用。説明文から味を再推測せず、25本の情報不足商品へ新しい組み合わせは付与していません。
- 26組は2つ以上の直接香味軸を確認し、26文を個別編集。未編集の自動差し込み文は公開せずHELD。公式推奨・実飲の断定ではなく全件mediumの編集提案です。
- 既存の料理との重複、max3、同県条件、同一理由文を検査。味の根拠や編集理由が足りない場合は0件を維持。愛知の守口漬などはmasterを用意しても無理に酒へ付けません。

## 集計

```json
{
  "checkedAt": "2026-10-23T08:45:30.592Z",
  "baseline": {
    "active": 484,
    "missingPrefecture": 0,
    "master": 67,
    "displaySpecialties": 65,
    "displaySake": 255,
    "pairings": 352
  },
  "researchPrefectures": 47,
  "candidates": 315,
  "accepted": 79,
  "held": 236,
  "rejected": 0,
  "master": 79,
  "addedMaster": 12,
  "retainedMaster": 67,
  "changedExisting": 0,
  "canonicalMerges": 0,
  "displaySpecialties": 75,
  "displaySake": 266,
  "coverage": 54.96,
  "pairings": 378,
  "addedPairings": 26,
  "high": 0,
  "medium": 378,
  "low": 0,
  "displayCounts": {
    "0": 218,
    "1": 164,
    "2": 92,
    "3": 10
  },
  "editorial": 378,
  "official": 0,
  "community": 0,
  "displayPrefectures": 45,
  "mostDisplayed": [
    {
      "specialtyId": "kanzuri-shuto",
      "name": "かんずり酒盗",
      "prefecture": "新潟県",
      "displaySake": 22
    },
    {
      "specialtyId": "tochio-aburaage",
      "name": "栃尾の油揚げ",
      "prefecture": "新潟県",
      "displaySake": 18
    },
    {
      "specialtyId": "sasa-kamaboko",
      "name": "笹かまぼこ",
      "prefecture": "宮城県",
      "displaySake": 11
    },
    {
      "specialtyId": "fugu-nukazuke",
      "name": "ふぐの子糠漬け",
      "prefecture": "石川県",
      "displaySake": 11
    },
    {
      "specialtyId": "matsumae-zuke",
      "name": "松前漬け",
      "prefecture": "北海道",
      "displaySake": 11
    }
  ],
  "newDuplicateReasons": 0,
  "officialCreatives": 79,
  "formalImages": 79,
  "retrievedRegionalSources": 368,
  "readableRegionalSources": 362,
  "newApiRequests": 223,
  "reusedApiSearches": 74,
  "minObservedApiIntervalMs": 1201,
  "production": false,
  "qaPassed": false
}
```

候補のHELD理由: `{"SKU_IMAGE_AND_PAIRING_NOT_APPROVED":113,"NO_CANDIDATE_IN_BOUNDED_SEARCH":112,"DIFFERENT_PREPARATION_NOT_SILENTLY_MERGED":4,"QUANTITY_CONTRADICTION":1,"NO_ACTIVE_SAKE_AND_NO_APPROVED_CREATIVE":5,"NO_APPROVED_AVAILABLE_HOUSEHOLD_PRODUCT":1}`

REJECTは候補食品単位の件数です。返礼品・グッズ・業務用・混合セットなどの商品検索結果の除外数と混同しません。検索0件も地域食品の不存在とは判定しません。

## 47都道府県

|都道府県|酒|候補|master|表示肴|保留|除外|表示酒|組|率|
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
|北海道|15|7|3|2|4|0|12|18|80%|
|青森県|9|6|1|1|5|0|5|5|55.56%|
|岩手県|10|7|1|1|6|0|7|7|70%|
|宮城県|19|9|4|4|5|0|14|28|73.68%|
|秋田県|17|7|3|3|4|0|15|22|88.24%|
|山形県|14|6|3|3|3|0|7|8|50%|
|福島県|16|6|2|2|4|0|12|19|75%|
|茨城県|7|6|1|1|5|0|2|2|28.57%|
|栃木県|9|7|2|2|5|0|4|6|44.44%|
|群馬県|8|7|1|1|6|0|3|3|37.5%|
|埼玉県|5|6|1|1|5|0|3|3|60%|
|千葉県|7|6|2|2|4|0|3|3|42.86%|
|東京都|11|6|2|2|4|0|9|9|81.82%|
|神奈川県|9|6|1|1|5|0|3|3|33.33%|
|新潟県|29|8|3|3|5|0|22|46|75.86%|
|富山県|10|9|3|3|6|0|3|6|30%|
|石川県|15|7|2|2|5|0|12|21|80%|
|福井県|9|7|2|2|5|0|7|12|77.78%|
|山梨県|7|6|2|2|4|0|4|5|57.14%|
|長野県|14|6|1|1|5|0|8|8|57.14%|
|岐阜県|9|6|1|1|5|0|5|5|55.56%|
|静岡県|10|7|1|1|6|0|3|3|30%|
|愛知県|12|7|1|0|6|0|0|0|0%|
|三重県|9|8|1|1|7|0|2|2|22.22%|
|滋賀県|8|6|3|1|3|0|1|1|12.5%|
|京都府|16|6|3|3|3|0|9|11|56.25%|
|大阪府|7|6|1|1|5|0|2|2|28.57%|
|兵庫県|19|6|1|1|5|0|8|8|42.11%|
|奈良県|10|7|1|1|6|0|4|4|40%|
|和歌山県|8|6|2|2|4|0|4|7|50%|
|鳥取県|5|6|1|1|5|0|2|2|40%|
|島根県|5|8|1|1|7|0|2|2|40%|
|岡山県|8|6|1|1|5|0|3|3|37.5%|
|広島県|14|7|2|2|5|0|8|9|57.14%|
|山口県|9|7|1|1|6|0|2|2|22.22%|
|徳島県|6|8|1|1|7|0|3|3|50%|
|香川県|7|7|2|2|5|0|5|6|71.43%|
|愛媛県|12|6|2|2|4|0|6|11|50%|
|高知県|12|8|2|2|6|0|11|20|91.67%|
|福岡県|14|6|1|1|5|0|2|2|14.29%|
|佐賀県|12|9|3|3|6|0|11|19|91.67%|
|長崎県|7|6|1|1|5|0|5|5|71.43%|
|熊本県|7|6|2|2|4|0|4|6|57.14%|
|大分県|8|6|2|2|4|0|5|7|62.5%|
|宮崎県|4|7|1|1|6|0|1|1|25%|
|鹿児島県|6|6|1|1|5|0|3|3|50%|
|沖縄県|0|6|0|0|6|0|0|0|対象酒なし|

## 重点13品

- 小田原かまぼこ / 神奈川県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 白1本・260g
- 守口漬 / 愛知県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 100g・1袋
- さんまの丸干し（内臓除去） / 三重県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 5本入り・冷凍、加熱用
- 瀬高の高菜漬け / 福岡県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 250g・1袋
- しそ巻き / 宮城県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 1串3巻×5串・130g
- しょうゆの実 / 山形県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 200g・1袋
- ゆで落花生 / 千葉県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / おおまさり400g・冷凍
- 鮭の焼漬け / 新潟県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 4〜10切から選択（1パック2切・約150g）
- 丸焼き鯖 / 福井県: HELD / QUANTITY_CONTRADICTION / タイトル200g・仕様約350g（1本）の不一致が、現行販売画面でも解消できない。正式画像は取得できたが公開しない。
- えび豆 / 滋賀県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 100g・1袋
- 広島菜漬 / 広島県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 本醸漬かき醤油300g・1袋
- ハタハタ寿し / 秋田県: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 切りずし400g・冷凍
- 千枚漬け / 京都府: ACCEPTED / REGION_RETAIL_ISSUED_IMAGE_REVIEWED / 100g・1袋

## 重複・偏り

既存理由の完全一致グループ 58 → 58。新規26組内の完全一致は0。同県全酒に同一セットとなる県は 0、prefecture-audit.jsonへ記録。既存関係を勝手に改稿せず、同県だけを根拠に新規配布していません。

## QA

- tests/typecheck/lint: `{"checkedAt":"2026-10-23T08:38:41.452Z","rows":[{"name":"tests","exitCode":0,"passed":true,"durationMs":17040,"tests":214},{"name":"typecheck","exitCode":0,"passed":true,"durationMs":2481},{"name":"lint","exitCode":0,"passed":true,"durationMs":413}],"passed":true}`
- build: `{"checkedAt":"2026-10-23T08:29:22.126Z","rows":[{"name":"webpack","exitCode":0,"passed":true,"durationMs":175710},{"name":"postbuild","exitCode":0,"passed":true,"durationMs":3279}],"passed":true}`
- security: `{"checkedAt":"2026-10-23T08:38:03.997Z","scan":{"scannedFiles":9017,"unreadableFiles":0,"findings":[],"passed":true,"configuredValuesChecked":["applicationId","accessKey","affiliateId"],"limitation":null},"envIgnored":true,"envTracked":false,"sourceChanges":["src/commerce/localSakana.json","src/specialties/master.json","src/specialties/pairings.json"],"protectedFiles":167,"tasteUnchanged":true,"sakeDatabaseUnchanged":true,"purchasesAndImagesForSakeUnchanged":true,"uiUnchanged":true,"cspUnchanged":true,"dependenciesUnchanged":true,"passed":true}`
- production: `null`
- 全ACTIVE: 未完了
- 全画像/対象ページ: 未完了
- 6幅・7地域以上・操作確認: 未完了
- PWA: `null`
- 実機iPhone/Androidは未確認。WebKitやChromiumの検証と区別。既知の先読み取消/起動警告を抹消せず、再現状況をQA生記録に残します。

## 残課題

HELD候補は食品としての価値を否定するものではなく、正式画像・通常商品・個別酒質・編集理由が未承認です。master79品のうち表示0のものは数合わせで配布せず保持。価格・評価・ランキングを推薦に用いず、新しい一覧/地図/検索/保存機能を追加していません。Phase 3へ進まず停止します。

## 指定72項目の提出

|番号|項目|結果|
|---:|---|---|
|1|開始ACTIVE酒数|484|
|2|prefecture欠損|0|
|3|開始master|67|
|4|開始表示specialty|65|
|5|開始肴表示酒|255|
|6|開始pairing|352|
|7|調査完了都道府県数|47|
|8|47県完了有無|完了（公開47県という意味ではない）|
|9|candidate総数|315|
|10|採用候補|79|
|11|HELD|236|
|12|REJECT|0|
|13|REJECT理由内訳|食品候補のREJECTは0。商品単位の除外は24〜27を参照|
|14|県別candidate数|prefectures.csv / 下記47県表|
|15|最終master|79|
|16|最終表示specialty|75|
|17|新規specialty|12|
|18|既存維持|67|
|19|既存変更|0|
|20|canonical merge|0（調理法・食品と完成料理を勝手に統合しない）|
|21|楽天確認数|291食品検索（74再利用＋217新規）＋6補助検索。重点13商品の現行ページ・正式画像を審査。既存67offerは根拠日付を維持|
|22|通常購入可能|新規12/12を現行販売UIで確認。既存67/67は保存済み承認を維持、79を全件新規在庫確認したとは扱わない|
|23|正式画像あり|79（既存67＋新規12。重点発行13のうち保留1は非公開）|
|24|ふるさと納税除外|640 URL / 検索取得内の明記商品。食品候補の除外数ではない|
|25|bulk除外|70 URL / 業務用等が商品名に明記されたもののみ。量だけで推測しない|
|26|gift-only除外|未確定。giftの語だけで専用品と断定しない。新規採用12には専用ギフトを選んでいない|
|27|identity不明|重点審査1（丸焼き鯖の200g/350g不一致）。未精査検索結果の全件数を推測しない|
|28|HELD commerce|食品HELD 236。重点商品審査HELD 1。販売不存在とは断定しない|
|29|肴表示酒数|266|
|30|全ACTIVE coverage|266/484 = 54.96%|
|31|pairing総数|378|
|32|high|0|
|33|medium|378|
|34|low非表示|0|
|35|1品表示酒|164|
|36|2品表示酒|92|
|37|3品表示酒|10|
|38|0品酒|218|
|39|editorialPairing|378|
|40|officialPairing|0|
|41|communityPairing|0|
|42|specialty別表示回数|pairing-distribution.json|
|43|最大偏重specialty|かんずり酒盗 / 22酒|
|44|duplicate reason|新規26組の完全一致0。既存の一致はduplicate-reasons.jsonに保存し無断改稿しない|
|45|47都道府県全項目|prefecture-audit.json / prefectures.csv / 下表。沖縄ACTIVE0、愛知は個別酒質不足で未表示|
|46|section位置維持|未完了 / 料理→土地の肴→夜。アプリソース変更なし|
|47|summary仕様|未完了 / 最大3・閉時0画像・0件section非表示|
|48|price非表示|維持。新規price UI追加なし|
|49|rating非表示|維持。評価を取得・推薦に利用しない|
|50|ranking非表示|維持。新規守口漬は公式画像選択から順位バッジなし画像を再発行|
|51|affiliate表記|未完了 / CTAごとの広告表記、sponsored・noopener|
|52|320px|未完了|
|53|360px|未完了|
|54|375px|未完了|
|55|390px|未完了|
|56|430px|未完了|
|57|1280px|未完了|
|58|accessibility|未完了 / Enter・Space・aria・44px・フォーカス・幅|
|59|tests|成功 / 214件|
|60|typecheck|成功|
|61|lint|成功|
|62|build|成功 / Webpack＋postbuild。既知Turbopack問題の再調査は範囲外|
|63|code / syntax|成功 / JSON構造・source diff・node --check|
|64|secret scan|成功 / 実秘密値・env追跡・公開出力。CSP/依存変更なし|
|65|production deploy|未反映|
|66|全ACTIVEページ|未完了|
|67|specialty対象全ページ|未完了|
|68|PWA確認|未完了 / WebKit＋Chromium、旧→新、同一ID保存・再読込|
|69|PWA警告|未完了|
|70|実機iPhone|未確認。WebKit幅検証と区別|
|71|実機Android|未確認。Chromium幅検証と区別|
|72|残課題|HELD食品・公式在庫や画像の変化・情報不足25酒・実機確認。既存352理由の一部は短い特徴引用を含むが保存指示を優先し無断改稿なし。Phase 3へ進まない|

回帰確認: 未完了。新規12商品UI確認: 成功。既存在庫は過去の確認日と区別します。性能計測はperformance.json参照。実測HTML/JSON容量のみで、Core Web VitalsやJSバンドル容量の改善は主張しません。
