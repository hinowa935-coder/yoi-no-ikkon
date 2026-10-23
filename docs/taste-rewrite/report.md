# 日本酒「味わい」説明 全件品質改善

確認日: 2026-10-23（日本時間）

本番反映前。

## 範囲と判断

本番sitemapと全詳細ページからACTIVE 484件を再集計。既存の説明関数は最大2特徴しか出さず、43件は分類・原料・蔵名のみへ縮退していました。詳細専用の編集データと安全なReactテキスト表示を加え、検索カード・検索値・推薦入力から分離しました。元の酒DB/Verified/料理/肴/夜/温度/購入/画像/PWA/CSP/配色は変更しません。メタ説明・JSON-LDにも詳細と同じ文をSSRします。

- 既存値単位の根拠を再利用する改稿と、今回当該本文を新規に個別確認した18件を区別。
- 694URLの取得確認は641URLが本文可読。HTTP成功だけをSKU同定や全claim確認に読み替えない。
- claims.mode=retained_value_evidenceのverifiedAtは以前の確認日を維持。checkedAt/sourceStatusは今回のURL取得状態であり新規Verified化ではありません。
- 新規claimも購入案内のCOMMERCIAL_MATCHやレビュー由来ではなく、当該商品の本文と仕様を読み合わせ。Verified・flavorProfileへは書き戻していません。
- 2〜5要素を原則とし、情報が足りない場合は文字数や3文を埋めない。入口→中盤→後口の時間順序・酸や苦味の因果は根拠がある場合だけ。
- 単一語から香味を補わず、米・酵母・分類・日本酒度・酸度から味を推測しません。
- SOURCE_WEAKや短文が残ることは隠さず、104件は現行維持、25件は味を創作せず中立の参照案内。商品自体を降格/非公開にしていません。
- 「上品」等の曖昧語しかないときは、香りの強弱や甘味の軽さへ勝手に置き換えません。

## 57項目

1. **ACTIVE酒数**: 484

2. **旧味わい文あり**: 484

3. **旧味わい文なし**: 0

4. **GENERIC**: 438

5. **TOO_SHORT**: 446

6. **CLASSIFICATION_BASED**: 43

7. **UNSUPPORTED_SPECIFICITY**: 0

8. **REPETITIVE**: 46

9. **GOOD**: 1

10. **公式source**: 313

11. **蔵元EC**: 42

12. **専門酒販source**: 65

13. **楽天商品説明**: 36

14. **その他source**: 4

15. **source不足**: 25

16. **説明の版・同定保留**: 7

17. **REWRITTEN**: 354

18. **MINOR_EDIT**: 0

19. **UNCHANGED_GOOD**: 1

20. **HELD**: 129

21. **具体的香味削除**: 新しい比喩は追加せず、出典不足の表示を25件で中立案内へ。原文の具体的果実名の無根拠判定は0件。田酒のとろり/辛口等の争点は本文に採らず別監査に記録。

22. **分類だけの説明削除**: 43

23. **汎用表現改善**: 335

24. **完全一致 Before/After**: `{"before":{"groups":12,"products":46,"pairs":128},"after":{"groups":11,"products":22,"pairs":11}}`

25. **高類似 Before/After**: `{"before":29,"after":38,"threshold":0.8}`

26. **source付き説明**: 459

27. **公式source比率**: 77.56%（1つ以上の公式値根拠を含む説明）

28. **楽天補助source比率**: 7.84%

29. **HIGH**: 355

30. **MEDIUM**: 104

31. **LOW / HELD**: `{"low":25,"held":129}`

32. **禁止表現残存**: 0

33. **unsupported具体表現残存**: 0

34. **購入リンク維持**: true

35. **商品画像維持**: true

36. **おちょこ維持**: 未完了

37. **合う料理維持**: true

38. **土地の肴維持**: true

39. **こんな夜に維持**: true

40. **share維持**: 未完了

41. **recommendation logic変更**: false

42. **320px**: 未完了

43. **360px**: 未完了

44. **375px**: 未完了

45. **390px**: 未完了

46. **430px**: 未完了

47. **1280px**: 未完了

48. **tests**: `{"name":"tests","exitCode":0,"passed":true,"durationMs":16832,"tests":208}`

49. **typecheck**: `{"name":"typecheck","exitCode":0,"passed":true,"durationMs":15910}`

50. **lint**: `{"name":"lint","exitCode":0,"passed":true,"durationMs":702}`

51. **build**: `{"startedAt":"2026-10-23T04:08:29.155Z","checkedAt":"2026-10-23T04:11:14.318Z","rows":[{"name":"webpack","exitCode":0,"passed":true,"durationMs":161870},{"name":"postbuild","exitCode":0,"passed":true,"durationMs":3291}],"passed":true}`

52. **secret scan**: `{"checkedAt":"2026-10-23T04:24:56.710Z","scan":{"scannedFiles":9006,"unreadableFiles":0,"findings":[],"passed":true,"configuredValuesChecked":["applicationId","accessKey","affiliateId"],"limitation":null},"envIgnored":true,"envTracked":false,"changedExistingSourceFiles":["src/app/sake/[slug]/page.jsx"],"protectedFiles":167,"itemsUnchanged":true,"recommendationUnchanged":true,"cspUnchanged":true,"dependenciesUnchanged":true,"passed":true}`

53. **production deploy**: 未完了

54. **全ACTIVEページ**: 未完了

55. **実機iPhone**: 未確認。WebKitエミュレーションとは区別。

56. **実機Android**: 未確認。PC Chromium確認とは区別。

57. **残課題**: 104件は根拠が限定的で現行文を維持、25件は香味を創作せず中立案内。WebKit先読み/PWA起動警告は生ログを別記。新しい酒・料理・リンク・画像・score・温度は変更していない。

## 変更前後の自動検出

```json
{
  "before": {
    "GENERIC": 438,
    "TOO_SHORT": 446,
    "CLASSIFICATION_BASED": 43,
    "UNSUPPORTED_SPECIFICITY": 0,
    "REPETITIVE": 46,
    "SOURCE_WEAK": 43,
    "GOOD": 1
  },
  "after": {
    "GENERIC": 113,
    "TOO_SHORT": 357,
    "CLASSIFICATION_BASED": 0,
    "UNSUPPORTED_SPECIFICITY": 0,
    "REPETITIVE": 22,
    "SOURCE_WEAK": 25,
    "GOOD": 95
  }
}
```

GENERIC等は機械検出の候補区分であり、修正義務や官能の正確さの証明ではありません。短文は35字未満。完全一致と高類似は別集計。source自体が同じ特徴しか示さない場合は類似を許容し、言い換えのために新しい味を作りません。

## 別監査・保留の例

- 義侠 純米原酒60%: 公式は生酒ありと案内。販売候補は1500k等の仕込表記があり、元登録との処理・版対応が確定しないので味を横流ししない。
- 勝駒 純米吟醸: 楽天本文に五百万石・純米の説明があり、純米吟醸の商品情報への混入が疑われる。公式は基本スペックのみ。
- 月山 純米酒: 公式同ページの芳醇辛口は別商品。登録の「純米」には温度以外の香味情報が乏しく、転用しない。
- 寿喜心 山田錦35％ 純米大吟醸: 楽天本文が純米吟醸と記載し、登録の山田錦35%純米大吟醸と矛盾。説明を転用しない。
- ロ万 純米吟醸 一回火入れ（2025BY）: 年度指定2025BY。現行公式シリーズや購入者レビューから別BYの味を補完しない。
- 而今 特別純米 火入: 公式は味を特上雄町純米大吟醸のみ説明。別酒・生酒混在の定番記事から流用しない。
- 義侠 縁（えにし）: 公式は3年以上、店舗は2年以上の熟成と記載。旧版が混じる可能性があり、熟成香・味の数値を統合しない。

- 田酒の甘味欄に「とろりとした甘味・辛口」が併記。今回は商品データやタグを変更せず、本文は口当たり・旨味・後味の直接根拠に限定。
- 寿喜心の販売本文の純米吟醸/登録の純米大吟醸の相違や、而今の特上雄町大吟醸と雄町純米吟醸は別物として保留。購入リンクは勝手に置換していません。

## QAの限界

本番機能確認: false。通常ブラウザの厳密console無警告: undefined、PWA: undefined。先読み取消と既存起動警告を生記録から消さず、一般のJS例外や表示・遷移・保存の失敗とは分離します。実機は未確認です。

## 全商品

### 1. 能古見 特別純米酒

ID: nogomi-tokubetsu-junmai

旧: ほのかに香る吟醸香。米の旨みも楽しめる一本です。

新: 吟醸香はほのか。米の旨みが感じられ、後口にはキレと余韻が残ります。

判定: REWRITTEN / MEDIUM

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://sakeshop-hisaya.com/shopdetail/000000000119/

### 2. 七田 純米

ID: shichida-junmai

旧: 米由来の旨味を、軽やかな味わいで楽しめます。

新: 米由来の旨味があり、飲み心地は軽やか。旨味と軽さを一緒に楽しめる味わいです。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://tenzan.co.jp/product/shichida-jyunmai/

### 3. 古伊万里 前 純米吟醸

ID: koimari-saki

旧: 純米吟醸酒です。

新: みずみずしい口当たりに、ほどよい甘みを伴う旨み。口に含むにつれ酸味と穏やかな渋みが現れ、味わいに奥行きが生まれます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/hasegawasaketen/1007034/

### 4. 東一 純米吟醸

ID: azumaichi-junmai-ginjo

旧: 香りは穏やか。米の旨味を楽しめる酒です。

新: 香りは穏やかです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://azumaichi.com/top/products/seishu/

### 5. 鍋島 純米吟醸 山田錦

ID: nabeshima-junmai-ginjo

旧: 穏やかな吟醸香が特徴。のど越しは爽やかです。

新: 吟醸香は穏やかで、のど越しは爽やかです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenomy.jp/sake/TST0000007779/

### 6. 天吹 純米吟醸 いちご酵母 生

ID: amabuki-flower-yeast

旧: 豊かな香りを楽しめます。旨みのあるふくらみも、このお酒の特徴です。

新: 香りは豊かで、飲み口は軽やかです。ふくらみのある旨みとみずみずしい甘みがあり、きれいな酸味も感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://www.amabuki.co.jp/sake/000162.php

### 7. 純米東長

ID: azumacho-junmai

旧: 芳醇な香りを楽しめます。米の旨味も、このお酒の特徴です。

新: 芳醇な香りです。米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.azumacho.co.jp/products/junmai_azumacho.html

### 8. 庭のうぐいす 純米吟醸

ID: niwa-no-uguisu-junmai-ginjo

旧: フレッシュな味わいの一本。甘みと酸味も感じられます。

新: フレッシュな味わいです。甘みと酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niwanouguisu.com/products/

### 9. 三井の寿 純米吟醸 +14 大辛口

ID: miinokotobuki-junmai-ginjo

旧: 大辛口の味わいとキレを楽しめる一本。

新: 大辛口の味わいです。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenomy.jp/sake/TST0000003066/

### 10. ちえびじん 純米酒

ID: chiebijin-junmai

旧: 芳醇な香りがあり、芳醇な甘みも感じられます。

新: 芳醇な香りと甘みが感じられます。のど越しにはキレがあります。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://chiebijin.com/2024/12/10/chiebijin_jyunmai/

### 11. れいざん純米酒

ID: reizan-junmai

旧: やわらかな辛口と、キレを楽しめる一本。

新: やわらかな辛口の味わいです。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yoka-mall.com/front/commodity/013443hc/r3/

### 12. 清酒 薩州正宗 純米酒

ID: sasshu-masamune-junmai

旧: 濃厚な旨口の味わいがあり、米の香りも感じられます。

新: 米の香りで、濃厚な旨口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hamadasyuzou.co.jp/kinzan/products/sasshu_masamune.html

### 13. 新政 亜麻猫

ID: amaneko-white-koji

旧: 白麹由来の個性的な酸味を楽しめます。

新: 白麹由来の個性的な酸味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://takekuma.co.jp/store/item/item-seisyu/aramasa-4710

### 14. 田酒 特別純米酒

ID: denshu-tokubetsu-junmai

旧: 米の旨味を楽しめます。軽妙な口当たりも、このお酒の特徴です。

新: 軽妙な口当たりで、米の旨味が感じられます。後味はすっきりとしています。

判定: REWRITTEN / MEDIUM

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://kojima.ocnk.net/product/53

### 15. 陸奥八仙 赤ラベル 特別純米（火入）

ID: mutsu-hassen-red-label

旧: 果実のような華やかな香りと、旨味と酸味のバランスを楽しめる一本。

新: 果実を思わせる華やかな香りで、口当たりはまろやか。旨味と酸味が調和した味わいです。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://mutsu8000.com/product/%E9%99%B8%E5%A5%A5%E5%85%AB%E4%BB%99-%E8%B5%A4%E3%83%A9%E3%83%99%E3%83%AB-%E7%89%B9%E5%88%A5%E7%B4%94%E7%B1%B3%EF%BC%88%E7%81%AB%E5%85%A5%EF%BC%89/

### 16. AKABU 純米酒

ID: akabu-junmai

旧: 米の旨味と柑橘系の酸味。それぞれの味わいを楽しめます。

新: 米の旨味と柑橘系の酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.akabu1.com/gallery/

### 17. 南部美人 特別純米酒

ID: nanbu-bijin-tokubetsu-junmai

旧: やさしい果実香が特徴。米の旨味も楽しめます。

新: やさしい果実香です。米の旨味が感じられます。後味はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nanbubijin.co.jp/sake/nihonshu/tokubetsu-junmai/tokubetsu_junmaishu/

### 18. 山本 Pure Black ピュアブラック

ID: yamamoto-pure-black

旧: 秋田酒こまちを使った一本。

新: 香りは控えめ。柑橘を思わせるジューシーな酸味があり、後口は鋭く切れる味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/tanbo-sabun/sake579/

### 19. 雪の茅舎 純米吟醸

ID: yuki-no-bosha-junmai-ginjo

旧: ふくよかな味わいを感じる一本。ほどよい香りも楽しめます。

新: ほどよい香りで、味わいにはふくらみがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yukinobosha.jp/products/

### 20. 一白水成 特別純米酒

ID: ippaku-suissei-tokubetsu-junmai

旧: 果実香があり、米の旨味も感じられます。

新: 果実香です。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fukurokuju.jp/products/

### 21. 冩樂 純米吟醸

ID: sharaku-junmai-ginjo

旧: 米の旨味があり、甘みと酸味の調和も楽しめます。

新: 米の旨味に、調和した甘みと酸味。ほのかに香る余韻も感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://miyaizumi.co.jp/sake/

### 22. 会津中将 純米酒

ID: aizu-chujo-junmai

旧: 濃醇な味わいを楽しめます。

新: 濃醇な味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tsurunoe.com/products-list / https://www.tsurunoe.com/products/3

### 23. 伯楽星 特別純米

ID: hakurakusei-tokubetsu-junmai

旧: メロンやバナナを思わせる香りを楽しめます。キレも、このお酒の特徴です。

新: メロンやバナナを思わせる香りです。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niizawa-brewery.co.jp/item/167/

### 24. 乾坤一 特別純米辛口

ID: kenkonichi-tokubetsu-junmai

旧: 飲み飽きしない味わいが特徴の一本。

新: 飲み飽きしない味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://kenkonichi.com/products/item/

### 25. 出羽桜 桜花吟醸酒

ID: dewazakura-oka-ginjo

旧: フルーティな吟醸香が特徴。爽快な味わいも楽しめます。

新: フルーティな吟醸香が特徴。爽快な味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.dewazakura.co.jp/item/cat03/oka.html

### 26. 特別本醸造 八海山

ID: hakkaisan-tokubetsu-honjozo

旧: やわらかな口当たりを楽しめます。

新: やわらかな口当たりを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hakkaisan.co.jp/sake/honjyozo/

### 27. 久保田 千寿

ID: kubota-senju

旧: 淡麗な味わいに、穏やかな香り。

新: 香りは穏やかで、味わいは淡麗です。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.asahi-shuzo.co.jp/kubota/senjyu/

### 28. 越乃寒梅 白ラベル

ID: koshino-kanbai-white-label

旧: なめらかな味わいが特徴の一本。

新: なめらかな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://koshinokanbai.co.jp/products/whitelabel

### 29. 〆張鶴 月

ID: shimeharitsuru-tsuki

旧: 本醸造酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 30. 村祐 黒 純米大吟醸 無濾過本生

ID: murayu-kuro

旧: 純米大吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 既存専門店本文は季節性のみ。楽天で見つかった具体的な香味は購入者レビューなので採らない。

根拠: 採用可能な官能情報なし

### 31. 尾瀬の雪どけ 純米大吟醸生詰

ID: oze-no-yukidoke-junmai-daiginjo

旧: フレッシュな味わいが特徴の一本。

新: フレッシュな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://ozeyuki.raku-uru.jp/item-detail/406709

### 32. 御慶事 純米吟醸 雄町

ID: gokeiji-junmai-ginjo

旧: 雄町を使った純米吟醸酒。

新: 香りは穏やかで、果実を思わせるジューシーな飲み心地。甘みと酸味が調和した味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/hasegawasaketen/1004356/

### 33. 真澄 辛口生一本

ID: masumi-karakuchi-kiippon

旧: 辛口の味わいを楽しめます。やわらかな甘みも、このお酒の特徴です。

新: 味わいは辛口です。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.masumi.co.jp/product/karakuchiki-ippon/

### 34. 夜明け前 生一本

ID: yoakemae-tatsuno-junmai

旧: フルーティーな味わいを楽しめます。

新: フルーティーな味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://yoakemae-ono.com/products/785/

### 35. 梵・ゴールド

ID: born-gold

旧: 芳醇な旨口の味わいを楽しめます。

新: 芳醇な旨口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.born.co.jp/product/gold/

### 36. 常山 純米辛口〝超〟

ID: jozan-junmai

旧: シャープな飲み口を感じる一本。柔らかい米の旨味も楽しめます。

新: シャープな飲み口です。柔らかい米の旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://jozan.co.jp/product/detail.php?id=1

### 37. 手取川 山廃仕込 純米酒

ID: tedorigawa-yamahai-junmai

旧: 冷酒や常温ではフルーティーな香りを。燗では穏やかでやさしい旨味を楽しめます。

新: 冷酒や常温では、フルーティーな香りとほのかな酸味。燗にすると、穏やかでやさしい旨味と酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://tedorigawa.com/item/item-category/tedorigawa/

### 38. 菊姫 山廃純米

ID: kikuhime-yamahai-junmai

旧: ナッツやカラメルを思わせる芳醇な香りを楽しめます。米のたっぷりとした旨味も、このお酒の特徴です。

新: ナッツやカラメルを思わせる芳醇な香り。濃醇でコクがあり、たっぷりとした米の旨味と力強い酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://www.kikuhime.co.jp/products/%E5%B1%B1%E5%BB%83%E7%B4%94%E7%B1%B3/

### 39. 天狗舞 山廃純米大吟醸

ID: tengumai-yamahai-junmai

旧: 芳醇な味わいを楽しめます。

新: 芳醇な味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tengumai.co.jp/products/daiginjo/33.html

### 40. 満寿泉 純米吟醸

ID: masuizumi-junmai-ginjo

旧: きれいな後口とキレが特徴の一本。

新: きれいな後口とキレが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.masuizumi.co.jp/

### 41. 勝駒 純米酒

ID: kachikoma-junmai

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 42. 醸し人九平次 山田錦 EAU DU DÉSIR

ID: kamoshibito-kuheiji-eau-du-desir

旧: 熟した果実の旨味が特徴。味わいの重なりも楽しめます。

新: 熟した果実の旨味と、味わいを支える酸味。重なりのある味わいを感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://kuheiji.co.jp/kamoshibito/desir-et-sauvage/

### 43. 義侠 純米原酒60%

ID: gikyo-tokubetsu-junmai

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 公式は生酒ありと案内。販売候補は1500k等の仕込表記があり、元登録との処理・版対応が確定しないので味を横流ししない。

根拠: 採用可能な官能情報なし

### 44. 蓬莱泉 純米吟醸 和

ID: houraisen-wa-junmai-ginjo

旧: やわらかな甘みと爽やかな酸味を楽しめる酒。

新: やわらかな甘みと、爽やかな酸味を感じます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://netshop.houraisen.co.jp/products/detail/70

### 45. 作 雅乃智

ID: zaku-miyabi-no-tomo

旧: 華やかな香りを楽しめます。なめらかな味わいも、このお酒の特徴です。

新: 香りは華やかで、なめらかな飲み心地です。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://seizaburo.jp/zaku/products/miyabi/

### 46. 菊水ふなぐち

ID: kikusui-funaguchi-honjozo-nama-genshu-standard

旧: フレッシュな果実のような香りが特徴。しっかりとした旨みも楽しめます。

新: フレッシュな果実のような香りです。しっかりとした旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kikusui-sake.com/home/jp/products/funaguchi/

### 47. 磯自慢 特別本醸造

ID: iso-jiman-honjozo

旧: 吟醸香が特徴。まるい味わいも楽しめます。

新: 吟醸香が特徴。まるい味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.kakinuma-tokyo.co.jp/products/isojiman-sake005

### 48. 開運 特別純米

ID: kaiun-tokubetsu-junmai

旧: コクと、スッキリとキレのよい後口を楽しめる一本。

新: コクと、スッキリとキレのよい後口を楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://kaiunsake.com/item/3446.html

### 49. 梅乃宿 純米

ID: umenoyado-junmai

旧: フレッシュな香りとジューシーな味わいが特徴の酒。

新: フレッシュな香りです。爽やかな余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.umenoyado.com/products/junmai/

### 50. 玉乃光 純米吟醸 酒魂

ID: tamanohikari-junmai-ginjo-shukon-standard

旧: 米の旨味と酸味が特徴の酒。

新: 米の旨味と酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://tamanohikari.co.jp/products/231.html

### 51. 紀土 KID 純米吟醸

ID: kid-junmai-ginjo

旧: 青りんごの香りを楽しめます。軽快な味わいも、このお酒の特徴です。

新: 青りんごの香りで、軽快な飲み心地です。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sake-kagiya.com/view/item/000000000110?category_page_id=ct19

### 52. 雨後の月 純米吟醸

ID: ugonotsuki-junmai-ginjo

旧: やわらかな口当たりを感じる一本。米の旨味も楽しめます。

新: やわらかな口当たりです。米の旨味、甘みと酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tajima-ya.net/ugonotsuki/

### 53. 賀茂金秀 特別純米

ID: kamo-kinshu-tokubetsu-junmai

旧: フレッシュな味わいが特徴の一本。

新: フレッシュな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.kamokin.com/line_up/regular.html

### 54. 獺祭 純米大吟醸45

ID: dassai-45

旧: 華やかな香りの一本。米由来の繊細な甘みも楽しめます。

新: 香りは華やかです。米由来の繊細な甘みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://dassai.com/product/main/45.html

### 55. Ohmine 3粒 山田錦

ID: ohmine-three-grain

旧: 穏やかなグリーンの香りが特徴。ジューシーな味わいも楽しめます。

新: 穏やかなグリーンの香り。ジューシーな飲み心地で、甘酸っぱさも感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://store.ohmine.jp/products/137165036

### 56. 酔鯨 特別純米酒

ID: suigei-tokubetsu-junmai

旧: 米の旨味があり、キレも感じられます。

新: 控えめな香りです。米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://suigei.co.jp/collection/564.html

### 57. 廣戸川 特別純米

ID: hirotogawa-tokubetsu-junmai

旧: 夢の香を使った特別純米酒。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 58. 天美 純米吟醸

ID: tenbi-junmai-ginjo

旧: 白ぶどうの甘みを感じる一本。爽やかな酸味も楽しめます。

新: 白ぶどうの甘みと爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://choshusake.com/products/ginjojunmai

### 59. 土田生もと

ID: tsuchida-kimoto

旧: クリアな後味が特徴の一本。

新: クリアな後味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://cart.homare.biz/i/S0013

### 60. 日日 山田錦

ID: nichinichi-yamada-nishiki

旧: 上品な旨味を楽しめます。

新: 上品な旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://sake.inc/products/nichinichi-yamadanishiki

### 61. WHITE 射美

ID: ibi-white

旧: すっきりとした芳醇な味わい、クエン酸による甘酸っぱさが特徴の酒。

新: 芳醇でありながら、すっきりした味わいです。甘酸っぱい味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sugiharasake.jp/product/

### 62. 勝駒 純米吟醸

ID: kachikoma-modern-premium

旧: 純米吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 楽天本文に五百万石・純米の説明があり、純米吟醸の商品情報への混入が疑われる。公式は基本スペックのみ。

根拠: 採用可能な官能情報なし

### 63. 十四代 大極上諸白 龍の落とし子

ID: juyondai-modern-premium

旧: みずみずしい立ち香と爽やかな含み香を感じる一本。淡麗な味わいも楽しめます。

新: みずみずしい立ち香と爽やかな含み香で、味わいは淡麗です。優しい甘味があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenomy.jp/sake/TST0000049848/

### 64. 獺祭 純米大吟醸 磨き二割三分

ID: dassai-23

旧: 華やかな上立ち香が特徴。蜂蜜のような甘みも楽しめます。

新: 華やかな上立ち香です。蜂蜜のような甘みがあります。キレと長く続く余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://dassai.com/product/main/23.html

### 65. 男山 生酛純米

ID: otokoyama-kimoto-junmai

旧: 芳醇な味わいが特徴の一本。

新: 芳醇な味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.otokoyama.com/lineup/category01/

### 66. 国士無双 純米酒

ID: kokushi-muso-junmai

旧: コクがあり、まろやかな味わいも感じられます。

新: 口に含むとまろやかです。コクがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.takasagoshuzo-store.com/view/category/kokushimusou

### 67. 福司 純米酒

ID: fukutsukasa-junmai

旧: 芳醇な味わいを楽しめます。

新: 芳醇な味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.fukutsukasa.jp/product/?ctg=ctg11

### 68. 北の勝 大海

ID: kita-no-katsu-taikai

旧: 口当たりのよさとすっきりしたのど越しが特徴の酒。

新: 口当たりのよさとすっきりしたのど越しが特徴の酒。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.kitanokatsu.jp/

### 69. 郷宝 特別純米 壱火 磨き五割五分

ID: gohou-junmai

旧: 柔らかな旨味を感じる一本。軽快な味わいも楽しめます。

新: 軽快な飲み心地です。柔らかな旨味があります。後味はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://gohhou.stores.jp/items/656c99e668911919d88f2b77

### 70. 八甲田おろし 特別純米酒 華吹雪 超辛口

ID: hato-masamune-tw2kq6

旧: 米のふくよかな味わいと、キレの良いスッキリとした辛口を楽しめる一本。

新: 米のふくよかな味わいと辛口の味わいが感じられます。すっきりとした辛口で、後味にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hatomasa.jp/line-up

### 71. 桃川 純米酒

ID: momokawa-tw2kq6

旧: 純米酒です。

新: まろやかな飲み心地で、米の旨味が感じられます。コクも楽しめる味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/primeliquars/645/

### 72. あさ開 純米酒 黄ラベル

ID: asahibaki-iaxjez

旧: 柔らかく豊かな香りが特徴。米の旨味も楽しめます。

新: 柔らかく豊かな香りです。米の旨味とさわやかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.asabiraki-net.jp/item/206/

### 73. kikunotsukasa innocent 40

ID: kiku-no-tsukasa-iaxjez

旧: 華やかな香りを感じる一本。濃厚さとすっきりした飲み口も楽しめます。

新: 香りは華やかで、濃厚さとすっきりした飲み口です。甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kikunotsukasa.jp/innocent/

### 74. 浜千鳥 純米酒

ID: hamachidori-iaxjez

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 75. 純米酒 月の輪

ID: tsuki-no-wa-iaxjez

旧: 旨味が特徴。すっきりしたキレも楽しめます。

新: 旨味を感じます。すっきりしたキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tsukinowa-iwate.com/wakasaya/detail9.html

### 76. あたごのまつ 特別純米

ID: atago-no-matsu-i3yhce

旧: メロンや白桃を思わせる香りを感じる一本。爽やかな酸味も楽しめます。

新: メロンや白桃を思わせる香りです。爽やかな酸味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niizawa-brewery.co.jp/item/173/

### 77. 純米酒 浦霞

ID: urakasumi-i3yhce

旧: 米の旨味と酸味の調和を楽しめます。

新: 米の旨味と酸味の調和を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.urakasumi.com/items/junmai/

### 78. 墨廼江 特別純米酒 青ラベル

ID: suminoe-i3yhce

旧: 穏やかな香りがあり、米の旨味も感じられます。

新: 香りは穏やかです。米の旨味が感じられます。後口はきれよく切れます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hasegawasaketen.com/eshop/products/detail/1959

### 79. 宮寒梅 純米吟醸

ID: miyakanbai-i3yhce

旧: 熟した果実を思わせる華やかな香りとやや豊潤で柔らかな味わいが特徴の酒。

新: 熟した果実を思わせる華やかな香りで、やや豊潤で柔らかな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://miyagisake.jp/sake/17017/

### 80. 純米吟醸 まんさくの花

ID: mansaku-no-hana-o23n5c

旧: 穏やかな香りと米の旨味が特徴の酒。

新: 香りは穏やかです。米の旨味と心地よい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://hinomaru-sake.com/item/junmaiginjo-mansaku

### 81. くどき上手 純米大吟醸

ID: kudoki-jozu-i9diua

旧: 華やかでフルーティーな香りとやさしくマイルドな味わいが特徴の酒。

新: 華やかでフルーティーな香りで、やさしくマイルドな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kigawaya.com/sake/kudoki/jyundai.html

### 82. 上喜元 純米吟醸 超辛

ID: jokigen-i9diua

旧: すっきりした味わいが特徴。超辛口の味わいも楽しめます。

新: すっきりした味わいです。超辛口の味わいです。キレのある味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jokigen.com/products/1

### 83. 山形正宗 純米吟醸 雄町

ID: yamagata-masamune-i9diua

旧: 豊かな旨味が特徴の一本。

新: 豊かな旨味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://yamagata-masamune.jp/item-detail/1113660

### 84. 初孫 光輝2236 生酛純米大吟醸

ID: hatsumago-i9diua

旧: 純米大吟醸酒です。

新: 華やかな香りに、透き通るような伸びのある旨み。全体の印象はすっきりしています。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://isobe-sake.com/products/hatsumago_kouki

### 85. 大七 純米生酛

ID: daishichi-junmai-kimoto-standard

旧: ふくらみのある旨味が特徴の一本。

新: ふくらみのある旨味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.daishichi.com/sake/junmaikimoto.html

### 86. 渡舟 純米大吟醸

ID: wataribune-pwohce

旧: 豊かな香りが特徴の一本。

新: 豊かな香りが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.huchuhomare.com/product/items/

### 87. 大那 特別純米 生酛造り（火入れ）

ID: daina-kjnkdk

旧: 穏やかな旨みが特徴の一本。

新: 穏やかな旨みが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://kikunosato-sake.com/product/

### 88. 七水 純米大吟醸45

ID: shichisui-kjnkdk

旧: ほのかな果実系の香りが特徴。上品でやさしい旨みも楽しめます。

新: ほのかな果実系の香りで、すっきりした味わいです。上品でやさしい旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://toratora.co.jp/?p=1032

### 89. 水芭蕉 純米吟醸

ID: mizubasho-p7oucs

旧: 凝縮した米の旨味を楽しめます。

新: 凝縮した米の旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.mizubasho.jp/item_category/fullyear/

### 90. 流輝 純米吟醸 無ろ過生 山田錦

ID: ruka-p7oucs

旧: 優しい吟醸香を楽しめます。甘味も、このお酒の特徴です。

新: 優しい吟醸香です。甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://matsuya-sakebrewery.jp/product/ruka-1/

### 91. 谷川岳 超辛純米

ID: tanigawadake-p7oucs

旧: 辛口の味わいが特徴。米の旨味も楽しめます。

新: 米の旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tanigawadake.jp/item_category/fullyear/

### 92. 上善如水 純米吟醸

ID: jozen-mizunogotoshi-junmai-ginjo-standard

旧: 華やかな香りを楽しめます。まろやかな旨味も、このお酒の特徴です。

新: 香りは華やかで、軽快な飲み心地です。まろやかな旨味があります。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/jozen/102315/

### 93. 大吟醸 越後桜

ID: echigozakura-daiginjo-standard

旧: 華やかな香りを感じる一本。スッキリとした味わいも楽しめます。

新: 香りは華やかで、スッキリとした味わいです。やや辛口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.echigozakura.co.jp/echigosakura.html

### 94. 甲子 純米吟醸 はなやか 匠の香

ID: kinoene-gg3q4p

旧: フルーティーな味わいと爽やかな酸味が特徴の酒。

新: 爽やかな酸味とガス感が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.iinumahonke.co.jp/lp/hanayaka

### 95. 太平山 純米大吟醸 天巧

ID: taiheizan-tenko-junmai-daiginjo-standard

旧: 中口の味わいを楽しめます。

新: 中口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://shop.kodamajozo.jp/products/detail.php?product_id=3337

### 96. 木戸泉 純米醍醐

ID: kidoizumi-gg3q4p

旧: 米の旨味と、豊かな酸味を楽しめる一本。

新: 米の旨味と豊かな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kidoizumi.jp/products/junmai-daigo1800/

### 97. 屋守 純米無調整 中取り火入れ

ID: okunokami-kflfjg

旧: 和梨やメロンを思わせる穏やかな香り。燗にすると旨味も楽しめます。

新: 和梨やメロンを思わせる穏やかな香りで、甘味と控えめなほろ苦さがあります。後口はすっきり。燗では旨味が伸びていきます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://shop.kanda-toshimaya.co.jp/shop/products/OKN-JM-NT-HIRE-720

### 98. 金婚 純米吟醸 江戸酒王子

ID: kinkon-kflfjg

旧: 柑橘系の香りを楽しめます。甘みと酸味のバランスも、このお酒の特徴です。

新: 柑橘系の香りです。甘みと酸味が重なります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.kanda-toshimaya.co.jp/shop/products/KIN-STD-JG-EDO-720 / https://www.toshimaya.co.jp/products/%E9%87%91%E5%A9%9A-%E7%B4%94%E7%B1%B3%E5%90%9F%E9%86%B8-%E6%B1%9F%E6%88%B8%E9%85%92%E7%8E%8B%E5%AD%90-1800ml.html

### 99. 澤乃井 純米本地酒

ID: sawanoi-kflfjg

旧: コクを感じる一本。さっぱりした後味も楽しめます。

新: コクを感じる一本。さっぱりした後味も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sawanoi-sake.com/item/item-623/

### 100. 純米吟醸 嘉泉

ID: kasen-kflfjg

旧: 果実や百合、ライムの皮を思わせる香りを楽しめます。米由来の旨みも、このお酒の特徴です。

新: 果実や百合、ライムの皮を思わせる香りで、絹のようになめらかな口当たりです。米由来の旨みと米由来の甘みが感じられます。ほろ苦さを伴う長い余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tamurashuzojo.com/product/detail/E00114103

### 101. 多満自慢 純米大吟醸

ID: tamajiman-kflfjg

旧: 花や熟した果実のような香りを感じる一本。ふくよかで奥深い旨味も楽しめます。

新: 花や熟した果実のような香りで、クリアで端正な味わい、滑らかな舌触りです。ふくよかで奥深い旨味があります。心地よい余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://tamajiman.com/SHOP/S-101-1.html

### 102. いづみ橋 楽風舞 純米吟醸

ID: izumibashi-nz2hmwijh

旧: 果実香を感じる一本。さらりとした飲み口も楽しめます。

新: 果実香です。やさしい甘酸味があります。すっきりした余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://izumibashi.com/product/izumibashi_raku_fumai/

### 103. 残草蓬莱 特別純米

ID: zarusou-hourai-nz2hmwijh

旧: 燗で感じるしっかりした旨味と、柔らかな酸味を楽しめる一本。

新: 辛口の味わいに、柔らかな酸味。燗ではほどよい甘みと、しっかりとした旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://oyatakashi-shuzo.com/product/150/

### 104. 松みどり 純米吟醸 S.tokyo

ID: matsu-midori-nz2hmwijh

旧: ほんのり甘口の酒。爽やかな酸味も楽しめます。

新: なめらかな飲み心地です。ほんのり甘口の味わいと爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.matsumidori.jp/products-2/s-tokyo/

### 105. 純米酒 箱根山

ID: hakoneyama-nz2hmwijh

旧: ふくよかな味わいと、キレを楽しめる一本。

新: 味わいにはふくらみがあります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hakoneyama.co.jp/products/junmai-hakoneyama.html

### 106. 純米吟醸立山

ID: tateyama-i4si9d

旧: 豊かな旨味を感じる一本。芳醇な味わいも楽しめます。

新: 芳醇な味わいです。豊かな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sake-tateyama.com/product_category/tateyama720-jyung/

### 107. 銀盤 超特撰 米の芯

ID: ginban-chotokusen-komenoshin-standard-v1

旧: 芳醇なふくみ香を楽しめます。まろやかさも、このお酒の特徴です。

新: 芳醇なふくみ香です。淡麗な辛口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ginban.co.jp/archives/products_category/cat01

### 108. 常きげん 山廃純米

ID: jokigen-ishikawa-nozijh

旧: 鋭いキレと、コクを楽しめる一本。

新: コクとやや辛口の味わいが感じられます。鋭いキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://jokigen.co.jp/products/yamahaishikomishu/

### 109. 加賀鳶 純米吟醸

ID: kagatobi-nozijh

旧: 華やかな香りが特徴。ふくらむ米の旨味も楽しめます。

新: 香りは華やかで、透明感のある味わいです。ふくらむ米の旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fukumitsuya.co.jp/sake/kagatobi/

### 110. 一本義 辛爽系 純米吟醸

ID: ippongi-o0ffit

旧: 新緑を思わせる香りが特徴。みずみずしい口当たりも楽しめます。

新: 新緑を思わせる香りで、みずみずしい口当たりです。ほのかな甘みから辛口へ移る味わいと上品で爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ippongi.co.jp/product/content/61

### 111. 花垣 山廃純米

ID: hanagaki-o0ffit

旧: 濃厚な甘みが特徴の一本。

新: 濃厚な甘みが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://hanagaki-store.com/collections/nihonshu/products/hanagaki-yamahaijunmai

### 112. 純米吟醸 無上盃

ID: mushohai-junmai-ginjo-standard

旧: 米の旨みが特徴。すっきりとした口当たりも楽しめます。

新: 米の旨みが感じられます。すっきりとした口当たりです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://nara-toyosawa.myshopify.com/products/%E6%9C%9F%E9%96%93%E9%99%90%E5%AE%9A-%E5%A4%8F%E3%81%AE%E7%84%A1%E4%B8%8A%E7%9B%83-%E3%82%B3%E3%83%94%E3%83%BC

### 113. 春鶯囀 純米吟醸 冨嶽

ID: shunnoten-i9dko8

旧: やや華やかな香りを楽しめます。豊かで深い味わいも、このお酒の特徴です。

新: やや華やかな香りで、豊かで深い味わいです。中口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.shunnoten.co.jp/shop/products/detail/7

### 114. 黄桜 生もと山廃 特別純米酒 山田錦

ID: kizakura-yamahai-tokubetsu-junmai-yamadanishiki-standard

旧: 気品ある香りがあり、力強い旨味も感じられます。

新: 気品ある香りです。力強い旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kizakura-shop.com/view/item/000000000243

### 115. 甲斐の開運 純米吟醸

ID: kai-no-kaiun-i9dko8

旧: 柔らかな芳香と果実のような香りを楽しめます。透き通った味わいも、このお酒の特徴です。

新: 柔らかな芳香と果実のような香りで、透き通った味わいです。中口からやや辛口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kainokaiun-webshop.easy-myshop.jp/c-item-detail?ic=001055

### 116. 太冠 吟醸純米

ID: taikan-i9dko8

旧: 上品な吟醸香が特徴。柔らかい口当たりと、やや濃醇な味わいも楽しめます。

新: 上品な吟醸香で、柔らかい口当たりと、やや濃醇な味わいです。やや甘口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.taikan-y.co.jp/shop/products/detail/10

### 117. 百春 純米上撰

ID: hyakushun-junmai-josen-standard

旧: やや辛口の味わいが特徴。すっきりした味わいも楽しめます。

新: やや辛口の味わいです。すっきりした味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kuramoto-kosaka.com/products/junmai/products11.html

### 118. 三千盛 純米大吟醸 業物／Wazamono

ID: michisakari-ia8tng

旧: 落ち着いた吟醸香が特徴。柔らかな旨みも楽しめます。

新: 落ち着いた吟醸香です。柔らかな旨みがあります。爽やかな後味とキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.michisakari.com/product/archives/50

### 119. 純米吟醸 二兎 山田錦五十五

ID: nito-j6jnol

旧: 甘みと酸味のバランスが特徴。ミネラル感もあります。

新: 甘みと酸味のバランスが特徴。ミネラル感もあります。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://014.co.jp/product/nito/

### 120. 天下錦 純米吟醸 MK-1 無濾過 火入

ID: tenkanishiki-fexsst

旧: 穏やかなバナナを思わせる香りと心地よい旨味が特徴の酒。

新: 穏やかなバナナを思わせる香りで、さらりと軽い飲み口です。心地よい旨味と甘みのある軽快な味わいが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://jizake-mie.jp/SHOP/tenka-jungin-720.html

### 121. 松の司 純米吟醸

ID: matsu-no-tsukasa-lvvrsw

旧: 柔らかく爽やかな香りがあり、味わいのバランスも感じられます。

新: 柔らかく爽やかな香りがあり、味わいのバランスも感じられます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.matsunotsukasa.com/product/junmai_ginjo/

### 122. 喜楽長 純米吟醸

ID: kirakucho-lvvrsw

旧: 穏やかな吟醸香と、柔らかな旨味を楽しめる一本。

新: 吟醸香は穏やかです。柔らかな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kirakucho.com/product/34

### 123. 英勲 純米酒

ID: eikun-kyoto-fjg

旧: すっきりした味わいが特徴の一本。

新: すっきりした味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://moromine.shop-pro.jp/?cbid=674225&csid=0&mode=cate

### 124. 月の桂 純米大吟醸 祝40

ID: tsuki-no-katsura-fjg

旧: なめらかな味わいといちじくの香りが特徴の酒。

新: いちじくの香りで、なめらかな飲み心地です。コクがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://tsukinokatsura.co.jp/iwai/

### 125. 呉春 池田酒

ID: goshun-hlztnu

旧: すっきりとまろやかさのある味わいを楽しめます。

新: すっきりとまろやかさのある味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hyotan.co.jp/cnt/sake/gosyn.html

### 126. かたの桜 純米吟醸

ID: katano-sakura-hlztnu

旧: 中口の味わいと、ほどよい酸味を楽しめる一本。

新: なめらかな飲み心地です。ほどよい酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.katanosakura.com/item/a023/

### 127. 天野酒 純米大吟醸 天游

ID: amanosake-hlztnu

旧: 旨味のある味わいと芳醇な味わいが特徴の酒。

新: 芳醇な味わいです。旨味のある味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://store.amanosake.com/products/detail/14

### 128. 瑞穂黒松剣菱

ID: kenbishi-g39ip7

旧: コクを感じる一本。キレも楽しめます。

新: コクがあります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kenbishi.co.jp/product/sake4/

### 129. 菊正宗 純米樽酒

ID: kiku-masamune-g39ip7

旧: 杉の香りと辛口の味わいが特徴の酒。

新: 杉の香りです。旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kikumasamune.co.jp/products/taru/334_juntaru_1_8.html

### 130. 白鶴 純米大吟醸

ID: hakutsuru-g39ip7

旧: 豊かで華やかな香りがあり、ふくらみのある味わいも感じられます。

新: 豊かで華やかな香りで、ふくらみのある味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hakutsuru.co.jp/product/sake/daiginjo/05702.html

### 131. 春鹿 純米超辛口

ID: harushika-hmwprj

旧: 超辛口の味わいが特徴。コクとキレも楽しめます。

新: 超辛口の味わいです。コクとキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.harushika.com/fs/harushika/type03/gd11

### 132. 純米酒 黒牛

ID: kuroushi-gp8l70i9d

旧: 米の旨味を感じる一本。やわらかな香りも楽しめます。

新: やわらかな香りです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kuroushi.co.jp/products/kuroushi

### 133. 純米吟醸 南方

ID: minakata-gp8l70i9d

旧: 白ワインのような香りが特徴。キレのよさも楽しめます。

新: 白ワインのような香りです。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://sekaiitto.com/items/6006b17fbbb683649e2087d6

### 134. 千代むすび 純米大吟醸 強力50

ID: chiyomusubi-uzpgk6

旧: ふくよかな味わいが特徴の一本。

新: ふくよかな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.chiyomusubi.co.jp/products/detail/356

### 135. 諏訪泉 純米酒

ID: suwaizumi-uzpgk6

旧: 軽やかですっきりした口当たり。ほどよい旨味も楽しめます。

新: 軽やかで、すっきりした口当たりです。程よい旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://suwaizumi.info/ja/document/img/pdf_jyunmaishu_720.pdf

### 136. 加賀鶴 純米酒 上撰

ID: kagatsuru-junmai-josen-standard

旧: 米の旨みとマイルドな味わいが特徴の酒。

新: コクのあるマイルドな味わいです。米の旨みが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kagatsuru.com/?pid=111129050

### 137. 月山 純米酒

ID: gassan-id2kl5

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 公式同ページの芳醇辛口は別商品。登録の「純米」には温度以外の香味情報が乏しく、転用しない。

根拠: 採用可能な官能情報なし

### 138. 燦然 山廃純米 雄町

ID: sanzen-iapi9d

旧: ふくよかな旨味と爽やかな酸味が特徴の酒。

新: ふくよかな旨味があります。爽やかな酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kikuchishuzo.co.jp/product/

### 139. 神心 純米吟醸 瓶囲い

ID: kamikokoro-iapi9d

旧: きれいな米の旨味があり、淡麗な旨口の味わいも感じられます。

新: 淡麗な旨口の味わいです。きれいな米の旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kamikokoro.co.jp/kamikokoro.html

### 140. 富久長 八反草 純米吟醸

ID: fukucho-io3id2

旧: 旨味と柔らかな口当たりが特徴の酒。

新: 柔らかな口当たりで、フレッシュな味わいです。旨味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://fukucho.jp/collections/classics/products/hattanso-junmaiginjo

### 141. 原田 純米吟醸

ID: harada-i9dgkj

旧: 華やかな吟醸香があり、フルーティーな味わいも感じられます。

新: 華やかな吟醸香があり、フルーティーな味わいも感じられます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://hatsumomidi.co.jp/ja/item/junmaiginjo.html

### 142. 鳴門鯛 純米大吟醸 寿

ID: narutotai-iwjid2

旧: 芳醇な旨味を感じる一本。きめ細かな酸味も楽しめます。

新: 上品な果実香です。芳醇な旨味ときめ細かな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.narutotai-sake.jp/SHOP/11854junmaidaiginjo720.html

### 143. 御殿桜 純米大吟醸酒（原酒）

ID: gotenzakura-iwjid2

旧: 純米大吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 144. 金陵濃藍 純米吟醸

ID: kinryo-uc9ijh

旧: 中口の味わいを感じる一本。爽やかな果実香も楽しめます。

新: 爽やかな果実香で、なめらかな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nishino-kinryo.co.jp/store/products/detail.php?product_id=129

### 145. 土佐鶴 本醸辛口

ID: tosatsuru-honzo-karakuchi-standard

旧: さわやかな香りを楽しめます。切れ味も、このお酒の特徴です。

新: さわやかな香りです。味わいは辛口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tosatsuru.jp/i/NH-605

### 146. 讃岐くらうでぃ

ID: sanuki-cloudy-uc9ijh

旧: 甘酸っぱい味わいが特徴の一本。

新: 甘酸っぱい味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://kawatsuru.com/product/product20/

### 147. 山丹正宗 しずく媛 純米吟醸

ID: yamatan-masamune-j6jhwb

旧: フルーティーな味わいが特徴の一本。

新: フルーティーな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.yamatan.jp/?pid=18326784

### 148. 梅錦 純米大吟醸

ID: umenishiki-j6jhwb

旧: 芳醇な甘口の味わいと、バランスのよい味わいを楽しめる一本。

新: 芳醇な甘口の味わいと、バランスのよい味わいを楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.umenishiki.com/lineup/412/

### 149. 京ひな 純米吟醸

ID: kyohina-j6jhwb

旧: 米のコクと旨みが特徴。さっぱりとした飲み口も楽しめます。

新: さっぱりとした飲み口です。米のコクと旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.sakaroku-syuzo.co.jp/c-item-detail?ic=255000

### 150. 寿喜心 山田錦35％ 純米大吟醸

ID: sukigokoro-j6jhwb

旧: 山田錦を使った純米大吟醸酒。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 楽天本文が純米吟醸と記載し、登録の山田錦35%純米大吟醸と矛盾。説明を転用しない。

根拠: 採用可能な官能情報なし

### 151. 美丈夫 純麗たまラベル

ID: bijofu-ul4nol

旧: 控えめな柑橘系吟醸香と、米のふくらみと柔らかさを楽しめる一本。

新: 柑橘を思わせる控えめな吟醸香。米のふくらみと柔らかさがあり、キュンとした酸味も感じられます。後口はシャープに切れます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://bijofu.jp/tamalabel.html

### 152. 土佐しらぎく 高育酒８０号

ID: tosa-shiragiku-ul4nol

旧: バナナを思わせる甘い香りがあり、軽やかですっきりした味わいも感じられます。

新: バナナを思わせる甘い香りで、軽やかですっきりした味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tosashiragiku.com/brand.html

### 153. 繁桝 純米大吟醸40

ID: shigemasu-o0fiap

旧: 華やかな香りがあり、ふくよかな米の旨味も感じられます。

新: 香りは華やかです。ふくよかな米の旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shigemasu.co.jp/product/junmaidaiginjo40/

### 154. 旭菊 大地 特別純米酒

ID: asahigiku-o0fiap

旧: 特別純米酒です。

新: 穏やかで爽やかな香り。口に含むと、米のふくよかな味わいがじんわりと感じられます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/kimijimaya-online/1005455/

### 155. 純米 杵の川

ID: kinokawa-tividq

旧: 穏やかな香りが特徴。しっかりした押し味も楽しめます。

新: 香りは穏やかです。甘味と酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kinokawa.co.jp/products/sake/655.html/

### 156. 香露 特別純米

ID: koro-mfekdo

旧: 芳醇な香りがあり、酸味も感じられます。

新: 芳醇な香りです。酸味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kumamotoken-shuzoukenkyusho.com/

### 157. 芳醇純米酒 瑞鷹

ID: zuiyo-mfekdo

旧: 調和のとれた旨味を楽しめます。芳醇な味わいも、このお酒の特徴です。

新: 芳醇な味わいです。旨味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.zuiyo.co.jp/products/nihonshu/38/

### 158. 通潤 純米吟醸酒 蝉

ID: tsujun-semi-junmai-ginjo-standard

旧: 穏やかな吟醸香が特徴。柔らかな口当たりも楽しめます。

新: 吟醸香は穏やかで、柔らかな口当たりです。味わいは辛口です。後味はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.tuzyun.com/shopdetail/002000000004/002/O/recommend/

### 159. 西の関 手造り純米酒

ID: nishinoseki-hlzg7a

旧: 優しい旨味を楽しめます。

新: 優しい旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nishinoseki.com/product/tezukurijunmai/

### 160. 和香牡丹 八蝶 山田錦

ID: wakabotan-hlzg7a

旧: バナナやメロン、白い花を思わせる香りがあり、米の旨味も感じられます。

新: バナナやメロン、白い花を思わせる香りです。米の旨味と上品な甘味と丸みのある酸味が感じられます。ほどよい余韻とすっきりした後味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sanwa-shurui.co.jp/factory/karashima/product/154.html

### 161. 八鹿 純米大吟醸（金）

ID: yatsushika-hlzg7a

旧: 米の旨味と、深くふくよかな味わいを楽しめる一本。

新: 深くふくよかな味わいです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yatsushika-club.com/SHOP/YA810.html

### 162. 純米大吟醸 千羽鶴

ID: senbazuru-hlzg7a

旧: 純米大吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 163. 千徳 純米酒

ID: sentoku-i3yidq

旧: 米の旨味が特徴。飲みごたえも楽しめます。

新: 米の旨味が特徴。飲みごたえも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.miyazaki-sake.or.jp/nobeokahyuga/sentoku.html

### 164. 純米まなぐ凧

ID: ranman-junmai-managudako-standard

旧: やさしい旨みが特徴。酸味も楽しめます。

新: やさしい旨みと酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/bisyuranman/10000090/

### 165. 大吟醸 登喜一

ID: ayanishiki-i3yidq

旧: 華やかな吟醸香があり、すっきりした口当たりと芳醇な味わいも感じられます。

新: 華やかな吟醸香で、すっきりした口当たりと芳醇な味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.unkai.co.jp/product/items/archives/31

### 166. 吟醸酒 はなかぐら

ID: hanakagura-i3yidq

旧: 淡麗ですっきりした味わいを楽しめます。適度な酸味も、このお酒の特徴です。

新: 淡麗ですっきりした味わいです。辛口の味わいと適度な酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenomy.jp/sake/TST0000047057/

### 167. 天賦 純米大吟醸

ID: tenbu-vb3g28id2

旧: 洋梨やアカシア、セルフィーユを思わせる香りと米の甘み、旨味、酸味の調和が特徴の酒。

新: 洋梨やアカシア、セルフィーユを思わせる香りで、滑らかで透明感のある味わいです。甘みと酸味が重なります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nishi-shuzo.co.jp/tenbu/products/

### 168. 清酒 薩州正宗 純米吟醸酒

ID: satsumaji-vb3g28id2

旧: 華やかな香りが特徴。すっきりした味わいも楽しめます。

新: 香りは華やかで、すっきりした味わいです。甘口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hamadasyuzou.co.jp/kinzan/products/sasshu_masamune_ginjyo.html

### 169. 天賦 純米吟醸

ID: tenbu-junmai-daiginjo

旧: 花やバナナを思わせる香りが特徴。柔らかな米の旨味も楽しめます。

新: 花やバナナを思わせる香りです。柔らかな米の旨味と優しい甘味と控えめな酸味が感じられます。後味はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nishi-shuzo.co.jp/tenbu/products/

### 170. 純米 大雪乃蔵

ID: taisetsunokura-junmai-standard

旧: すっきりしたキレ、爽やかなあと口が特徴の一本。

新: すっきりしたキレ、爽やかなあと口が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.oenon.jp/product/sake/junmai/junmai-taisetsunokura.html

### 171. 田酒 特別純米酒 山廃仕込

ID: denshu-tokubetsu-junmai-1

旧: 青リンゴを思わせる含み香が特徴。厚みのある旨味も楽しめます。

新: 青リンゴを思わせる含み香で、軽快な飲み心地です。厚みのある旨味とほどよい酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.minobe-sake.com/SHOP/densyu000055.html

### 172. 豊盃 純米吟醸 豊盃米

ID: houhai-junmai-ginjo-3

旧: エレガントな香りを感じる一本。繊細な甘味も楽しめます。

新: エレガントな香りです。繊細な甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://houhai.co.jp/product/

### 173. 賀茂鶴 超特撰特等酒

ID: kamotsuru-chotokusem-tokuto-tokubetsu-honjozo

旧: ふくよかな香りがあり、濃醇な旨味も感じられます。

新: ふくよかな香りです。濃醇な旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.kamotsuru.jp/SHOP/tokutou1800.html

### 174. 秀よし 純米酒

ID: hideyoshi-junmai-standard

旧: 麹の風味を感じる一本。淡麗で味にふくらみも楽しめます。

新: 麹の風味を感じる一本。淡麗で味にふくらみも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hideyoshi.co.jp/product-standard/

### 175. あさ開 蔵埠頭COLOR 純米酒

ID: asahibaki-iaxjez-3

旧: なめらかな旨味が特徴。ほどよい酸味も楽しめます。

新: なめらかな旨味とほどよい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.asabiraki-net.jp/item/210/

### 176. 伯楽星 純米吟醸

ID: hakurakusei-tokubetsu-junmai-1

旧: 洋梨やパッションフルーツを思わせる香りが特徴。軽快な味わいも楽しめます。

新: 洋梨やパッションフルーツを思わせる香りで、軽快な飲み心地です。柑橘を思わせる爽やかな酸味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niizawa-brewery.co.jp/item/169/

### 177. 新政 No.6 S-type

ID: aramasa-junmai-1

旧: ふくよかな味わいを楽しめます。キレも、このお酒の特徴です。

新: 味わいにはふくらみがあります。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://takekuma.co.jp/store/item/item-seisyu/aramasa-4517

### 178. 飛露喜 純米大吟醸

ID: hiroki-tokubetsu-junmai-1

旧: ほんのりとした果実香と、みずみずしいフレッシュな味わいを楽しめる一本。

新: ほんのりとした果実香で、みずみずしいフレッシュな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://takekuma.co.jp/store/item/item-seisyu/hiroki-2129

### 179. 一ノ蔵 特別純米酒 辛口

ID: ichinokura-tokubetsu-junmai-karakuchi

旧: 穏やかで甘やかな熟成由来の芳香が特徴。米の旨味も楽しめます。

新: 穏やかで甘やかな熟成由来の芳香です。米の旨味とほどよい酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ichinokura.co.jp/pickup-product/jyunkara

### 180. 田友 特別純米

ID: denyu-tokubetsu-junmai-standard

旧: 米本来の膨らむ旨味が特徴の一本。

新: 米本来の膨らむ旨味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://hatsuume.co.jp/products/denyu-tokubetsu-junmai/

### 181. 神亀 純米清酒

ID: shinkame-hdomtl-3

旧: 熟成によるふっくらした旨味を感じる一本。キレも楽しめます。

新: 深味とコクがあります。熟成によるふっくらした旨味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shinkame.co.jp/2021/06/23/shinkame-junmai-seishu-1800ml/

### 182. 亀甲花菱 槽口瓶封じ純米無濾過生原酒

ID: kikko-hanabishi-hdomtl-4

旧: 開けたてはフレッシュな味わい。開栓後には、落ち着いた旨味が増していきます。

新: 開けたてはフレッシュな味わい。開栓後には、落ち着いた旨味が増していきます。

判定: UNCHANGED_GOOD / MEDIUM

理由: 現行文が具体的で根拠のある変化を伝えているため維持。

根拠: https://www.sugiura.biz/product/34

### 183. 甲子 純米 うまから 磨き八割

ID: kinoene-gg3q4p-2

旧: 米の旨味を楽しめます。酸の効いた飲み口も、このお酒の特徴です。

新: 米の旨味と酸の効いた飲み口と微かな発泡感が感じられます。キレのある飲み口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.iinumahonke.co.jp/lp/umakara

### 184. 金婚 純米酒

ID: kinkon-kflfjg-2

旧: 米本来の旨みがあり、すっきりした飲み口も感じられます。

新: すっきりした飲み口です。米本来の旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.toshimaya.co.jp/products/%E9%87%91%E5%A9%9A-%E7%B4%94%E7%B1%B3%E9%85%92.html

### 185. 特別本醸造 嘉泉

ID: kasen-kflfjg-4

旧: ナッツやバニラを思わせる熟成香とふくよかな旨みが特徴の酒。

新: ナッツやバニラを思わせる熟成香で、まろやかな口当たりです。ふくよかな旨みがあります。凛としたキレと奥深い余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tamurashuzojo.com/product/detail/E00116203

### 186. 純米大吟醸 八海山 雪室貯蔵三年

ID: hakkaisan-tokubetsu-honjozo-1

旧: まろやかな味わいを楽しめます。

新: まろやかな味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hakkaisan.co.jp/sake/yukimurocyozousyu/

### 187. 久保田 萬寿

ID: kubota-senju-2

旧: 華やかな香りを楽しめます。旨味、甘み、酸味の調和も、このお酒の特徴です。

新: 香りは華やかで、重厚で深みのある口当たりです。甘みと酸味が重なります。心地よい余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.asahi-shuzo.co.jp/kubota/manjyu/

### 188. 三笑楽 純米酒

ID: sanshoraku-junmai-standard

旧: 麹の豊かな香りと、程良い酸味を楽しめる一本。

新: 麹の豊かな香りです。程良い酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sansyouraku.jp/products/cn5/product04.html

### 189. 勝駒 大吟醸

ID: kachikoma-junmai-3

旧: 大吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 190. 純米吟醸 幻の瀧

ID: maboroshi-no-taki-junmai-ginjo-standard

旧: 酸味から米の旨味へと、味わいが広がる純米吟醸。冷やしても、燗にしても楽しめます。

新: 米の旨味と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://mabotaki.co.jp/product/stan/stan_05/

### 191. 天狗舞 山廃仕込純米酒

ID: tengumai-yamahai-junmai-3

旧: 濃厚な香味と、酸味を楽しめる一本。

新: 濃厚な香味と、酸味を楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://tengumai.jp/SHOP/TG-001.html

### 192. 常きげん 山廃吟醸

ID: jokigen-ishikawa-nozijh-4

旧: キレが特徴。コクも楽しめます。

新: コクと辛口の味わいが感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://jokigen.co.jp/products/yamahaishikomishu/

### 193. 黒龍 純米大吟醸

ID: kokuryu-junmai-ginjo-1

旧: 上品でふくらみのある味わいが特徴の一本。

新: 上品でふくらみのある味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nipponnosake.com/sake/kokuryu/kokuryu_jd.html

### 194. 梵・純粋

ID: born-gold-2

旧: 腰のある味わいが特徴の一本。

新: 腰のある味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.born.co.jp/product/junsui/

### 195. 一本義 辛口 純米酒

ID: ippongi-o0ffit-4

旧: チェリーを思わせるほのかな香りがあり、クリアな旨味も感じられます。

新: チェリーを思わせるほのかな香りで、みずみずしい口当たりと押し味です。クリアな旨味と辛口の味わいと爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ippongi.co.jp/product/content/60

### 196. 純米大吟醸 廻（めぐり）

ID: hanagaki-o0ffit-5

旧: 純米大吟醸酒です。

新: メロンを思わせる穏やかな香りと、ほのかな甘み。飲み心地はシャープで軽やかで、後口はすっきりしています。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/sanoyajizake/ns110021/

### 197. 七賢 純米大吟醸 白心

ID: shichiken-i9dko8-1

旧: 重厚感のある味わいが特徴の一本。

新: 重厚感のある味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sake-shichiken.co.jp/products/hakushin

### 198. 春鶯囀 純米吟醸

ID: shunnoten-i9dko8-2

旧: ほのかに甘く華やかな香りがあり、しっかりした旨味も感じられます。

新: ほのかに甘く華やかな香りで、飲み心地は軽やかです。しっかりした旨味とやや甘口の味わいと程よい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.shunnoten.co.jp/shop/products/detail/11

### 199. 純米吟醸 谷櫻

ID: tanizakura-i9dko8-3

旧: 米の旨味が特徴。自然でなめらかな口当たりも楽しめます。

新: 自然でなめらかな口当たりです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tanizakura.com/shopdetail/001000000006/

### 200. 真澄 真朱 AKA 山廃純米吟醸

ID: masumi-karakuchi-kiippon-1

旧: 乳製品を思わせるほのかな香りが特徴。深みのある味わいも楽しめます。

新: 乳製品を思わせるほのかな香りで、深みのある味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.masumi.co.jp/prodact/aka/

### 201. 川中島 純米 にごり酒

ID: kawanakajima-genmai-junmai-ginjo-4

旧: 米本来の旨味があり、とろりとした濃厚な飲み口も感じられます。

新: とろりとした濃厚な飲み口です。米本来の旨味と優しい甘味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shusen.jp/goods

### 202. 國盛 純米吟醸 半田郷 酵母1801

ID: kunizakari-handago-junmai-ginjo-1801

旧: 華やかな吟醸香とやわらかな味わいが特徴の酒。

新: 華やかな吟醸香で、やわらかな味わいです。上品な甘みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nakanoshuzou.jp/feature/handago/pc/

### 203. 開運 純米吟醸 山田錦

ID: kaiun-tokubetsu-junmai-2

旧: 優しい果実香を感じる一本。お米由来の旨みも楽しめます。

新: 優しい果実香です。お米由来の旨みがあります。軽い甘味がスッと消えるキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kaiunsake.com/item/3418.html

### 204. 紫の英君 純米吟醸 山田錦

ID: eikun-junmai-ginjo-4

旧: 華やかでフルーティーな吟醸香、甘みと旨味のある味わいが特徴の酒。

新: 華やかでフルーティーな吟醸香です。甘みと旨味のある味わいです。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://eikun.co.jp/product/murasaki-eikun/

### 205. 醸し人九平次 別誂

ID: kamoshibito-kuheiji-eau-du-desir-1

旧: 飲み始めに感じる旨味と、なめらかで重なりのある味わいを楽しめる一本。

新: なめらかで重なりのある味わいです。飲み始めに感じる旨味と上品な酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kuheiji.co.jp/kamoshibito/collection/

### 206. 五橋 純米酒

ID: gokyo-junmai-standard

旧: 上品で控えめな吟醸様香と、柔らかで軽快な口当たりを楽しめる一本。

新: 上品で控えめな吟醸様香で、柔らかで軽快な口当たりです。やや高めの酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.gokyo.shop/view/item/000000000025

### 207. 作 玄乃智

ID: zaku-miyabi-no-tomo-2

旧: 青リンゴのようなフレッシュな香りがあり、豊かな味わいも感じられます。

新: 青リンゴのようなフレッシュな香りで、豊かな味わいです。米の優しい甘みとキレのある酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://seizaburo.jp/zaku/products/gen/

### 208. 不老泉 山廃仕込 特別純米 原酒 参年熟成（赤ラベル）

ID: furosen-lvvrsw-1

旧: 香ばしい香りを感じる一本。濃醇な味わいも楽しめます。

新: 香ばしい香りで、濃醇な味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://furosen.com/?p=809

### 209. 七本鎗 純米 玉栄

ID: shichihonyari-lvvrsw-2

旧: 米のふくよかな旨味を楽しめます。

新: 米のふくよかな旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.7yari.co.jp/product/04/

### 210. 喜楽長 ゆる燗

ID: kirakucho-lvvrsw-4

旧: 喜多酒造株式会社が醸す一本。

新: ぬる燗で、ほどよい旨味がやわらかに広がります。深みがありながら、やさしく感じられる味わいです。

判定: REWRITTEN / HIGH

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://kirakucho.com/product/36

### 211. 澤屋まつもと 純米酒

ID: sawaya-matsumoto-shuhari-1

旧: 滑らかな味わいが特徴の一本。

新: 滑らかな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://matsumotoshuzo.com/sawaya/junmaishu-720ml/

### 212. 日日 秋津山田錦

ID: nichinichi-yamada-nishiki-3

旧: 力強い旨味と、余韻を楽しめる一本。

新: 力強い旨味と、余韻を楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://sake.inc/products/nichinichi-akitsuyamadanishiki

### 213. 呉春 特吟

ID: goshun-hlztnu-2

旧: 吟醸酒です。

新: 香りは穏やか。口に含むと、ゆったりと広がる味わいを感じられます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/b-liquors/gosyun-tokugin/

### 214. 奥播磨 山廃純米 スタンダード

ID: okuharima-yamahai-junmai-1

旧: 株式会社 下村酒造店が醸す一本。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 215. 仙介 特別純米

ID: sensuke-junmai-ginjo-3

旧: 芳醇な香りが特徴の一本。

新: 芳醇な香りが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.izumisyuzou.co.jp/products/junmai-shu/%E4%BB%99%E4%BB%8B%E3%80%80%E7%89%B9%E5%88%A5%E7%B4%94%E7%B1%B3/

### 216. 純米吟醸 醉心稲穂

ID: suishin-inaho-junmai-ginjo-standard

旧: 心地よい香りがあり、米の旨味も感じられます。

新: 心地よい香りで、キメ細やかな味わいです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.suishinsake.co.jp/3037 / https://suishinyamane.com/item-detail/1179996

### 217. あらごしゆず

ID: umenoyado-junmai-3

旧: ゆず特有の爽やかな風味と口当たりのよさが特徴の酒。

新: ゆず特有の爽やかな風味と口当たりのよさが特徴の酒。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.umenoyado.com/products/aragoshi-yuzu/

### 218. 上撰 白雪 純米酒

ID: shirayuki-josen-junmai-standard

旧: おだやかな香りと、やわらかな口当たりを楽しめる一本。

新: おだやかな香りで、やわらかな口当たりです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://konishi.co.jp/product/junmai/

### 219. 紀土 純米酒

ID: kid-junmai-ginjo-1

旧: 軽快なキレが特徴の一本。

新: 軽快なキレが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sake-kagiya.com/view/item/000000000065

### 220. 車坂 純米酒

ID: kurumazaka-gp8l70i9d-3

旧: 円熟した旨味が特徴。優しい口当たりも楽しめます。

新: 優しい口当たりです。円熟した旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://nihonsyu-nihonjyou.co.jp/sake/kurumazaka/

### 221. 千代むすび しゅわっと空

ID: chiyomusubi-uzpgk6-3

旧: 爽やかな微発泡感が特徴。グレープフルーツを思わせる苦味も楽しめます。

新: 爽やかな微発泡感が特徴。グレープフルーツを思わせる苦味も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.chiyomusubi.co.jp/products/detail/192

### 222. 鷹勇 純米にごり酒 火入れ

ID: takaisami-uzpgk6-4

旧: 芳醇な香りが特徴。米の旨味も楽しめます。

新: 芳醇な香りで、コクがあります。米の旨味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakaya1.com/SHOP/nta015.html?mode=detail

### 223. 李白 特別純米酒

ID: rihaku-id2kl5-2

旧: コクを感じる一本。キレも楽しめます。

新: コクがあります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://rihaku.co.jp/products/%E6%9D%8E%E7%99%BD-%E7%89%B9%E5%88%A5%E7%B4%94%E7%B1%B3%E9%85%92/

### 224. 燦然 純米吟醸 山田錦

ID: sanzen-iapi9d-1

旧: フルーティーな香りがあり、マイルドな味わいも感じられます。

新: フルーティーな香りで、マイルドな味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kikuchishuzo.co.jp/product/sanzen_junmaiginjou/

### 225. 大典白菊 純米大吟醸 雄町

ID: taiten-shiragiku-iapi9d-5

旧: 柔らかな香りと、ふくよかな味わいを楽しめる一本。

新: 柔らかな香りで、味わいにはふくらみがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shiragiku-shop.com/items/5ef94bc5ec8fd35b562a0b7e

### 226. 雨後の月 山田錦 特別純米

ID: ugonotsuki-junmai-ginjo-1

旧: 穏やかな香りを楽しめます。旨味も、このお酒の特徴です。

新: 香りは穏やかで、透明感のあるきれいな味わいです。旨味を感じます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ikenosaketen.shop/shopdetail/000000003159/

### 227. 賀茂金秀 純米吟醸 雄町

ID: kamo-kinshu-tokubetsu-junmai-2

旧: 軽やかな香りがあり、深い味わいも感じられます。

新: 軽やかな香りで、深い味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kamokin.com/line_up/regular.html

### 228. 富久長 海風土 Seafood 純米

ID: fukucho-io3id2-4

旧: 軽快な味わいを感じる一本。レモンを思わせるすっきりした酸味も楽しめます。

新: 軽快な飲み心地です。レモンを思わせるすっきりした酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://fukucho.jp/products/seafood

### 229. 獺祭 純米大吟醸 磨き三割九分

ID: dassai-45-1

旧: 華やかな上立ち香を楽しめます。きれいな甘味も、このお酒の特徴です。

新: 華やかな上立ち香です。きれいな甘味があります。長い余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://dassai.com/product/main/39.html

### 230. 超特撰 惣花 純米吟醸

ID: nihonsakari-souhana-junmai-ginjo-standard

旧: 甘と酸と辛と苦と渋の五味が調和と、やや甘口の味わいを楽しめる一本。

新: 甘と酸と辛と苦と渋の五味が調和と、やや甘口の味わいを楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nihonsakari.co.jp/products/p/327

### 231. 金陵月白 吟醸

ID: kinryo-uc9ijh-3

旧: 落ち着いた果実香を感じる一本。穏やかな旨味も楽しめます。

新: 落ち着いた果実香です。穏やかな旨味とマイルドな甘味と穏やかな酸味が感じられます。心地よい余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nishino-kinryo.co.jp/store/products/detail.php?product_id=136

### 232. 綾菊 純米大吟醸

ID: ayakiku-uc9ijh-4

旧: まろやかで気品ある香味を感じる一本。キメの細かい酸味も楽しめます。

新: まろやかで気品ある香味を感じる一本。キメの細かい酸味も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.ayakiku.com/?pid=171026743

### 233. 石鎚 純米吟醸 緑ラベル

ID: ishizuchi-junmai-ginjo-1

旧: 純米吟醸酒です。

新: 旨味にふくらみがあり、酸には張りを感じます。ゆったりとした、飲みごたえのある味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/ehimekatayama/isidutimidori720/

### 234. 山丹正宗 純米大吟醸 松山三井

ID: yamatan-masamune-j6jhwb-2

旧: 穏やかで上品な吟醸香と軽やかな米の旨味が特徴の酒。

新: 穏やかで上品な吟醸香で、すっきりした淡麗な味わいです。軽やかな米の旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yamatan.jp/?pid=55777137

### 235. 京ひな 一刀両断 純米大吟醸辛口

ID: kyohina-j6jhwb-5

旧: 米の甘味を楽しめます。キレる後口も、このお酒の特徴です。

新: 米の甘味があります。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.sakaroku-syuzo.co.jp/c-item-detail?ic=250000

### 236. 美丈夫 舞

ID: bijofu-ul4nol-3

旧: しずく媛を使った純米大吟醸酒。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 237. 三井の寿 純米吟醸 ＋14 大辛口

ID: miinokotobuki-junmai-ginjo-4

旧: すっきりした味わいと、ドライな辛口を楽しめる一本。

新: すっきりした味わいです。ドライな辛口があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakaya-kurihara.jp/item/2015ho-3087/

### 238. 能古見 純米吟醸

ID: nogomi-tokubetsu-junmai-1

旧: メロンやバナナを思わせる果実香を楽しめます。濃醇な味わいも、このお酒の特徴です。

新: メロンやバナナを思わせる果実香で、濃醇な味わいです。甘口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nogomi.co.jp/introduction.html

### 239. よこやま 純米吟醸 SILVER7 無濾過生原酒

ID: yokoyama-tividq-2

旧: マスカットを思わせる香りを楽しめます。ジューシーな甘味も、このお酒の特徴です。

新: マスカットを思わせる香りで、フレッシュな味わいと発泡感です。ジューシーな甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.omoyashuzo.com/product.html

### 240. 沢の鶴 純米酒 山田錦

ID: sawanotsuru-junmai-yamadanishiki-standard

旧: 穏やかな香りと米の旨味が特徴の酒。

新: 香りは穏やかです。米の旨味とやや辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sawanotsuru.co.jp/c/nihonshu/junmai/gd117

### 241. 純米大吟醸 我山

ID: gazan-junmai-daiginjo-standard

旧: 芳醇な香りと、米の旨味を楽しめる一本。

新: 芳醇な香りです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tsurumi-jp.com/products/

### 242. 奥の松 特別純米

ID: okunomatsu-tokubetsu-junmai-standard

旧: おだやかな香りと深いうまみが特徴の酒。

新: おだやかな香りと深いうまみが特徴の酒。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.okunomatsu.co.jp/product-page/junmai-13210

### 243. 男山 復古酒

ID: otokoyama-fukkoshu

旧: 甘みの強い味わいを楽しめます。濃厚な味わいも、このお酒の特徴です。

新: 濃厚な味わいです。甘みの強い味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.otokoyama.com/lineup/category03/

### 244. 楯野川 純米大吟醸 清流

ID: tatenokawa-seiryu

旧: 穏やかな香りが特徴。軽い飲み口も楽しめます。

新: 香りは穏やかで、軽い飲み口です。やや甘口の味わいです。後口はスッキリしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.tatenokawa.com/shop/products/4511802017302

### 245. 楯野川 純米大吟醸 急流

ID: tatenokawa-kyuryu

旧: 純米大吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 246. しぜんしゅ 純米原酒

ID: niida-shizenshu-junmai-genshu

旧: 米の旨味を感じる一本。甘みと酸味も楽しめます。

新: 米の旨味、甘みと酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niida1711.shop/items/5b0ce9715f786674d6001556

### 247. 群馬泉 山廃純米

ID: gunmaizumi-yamahai-junmai

旧: 米のうま味があり、キレの良い酸味も感じられます。

新: 米の旨味とキレの良い酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.shimaokasyuzo.com/products/

### 248. 春鹿 純米超辛口

ID: harushika-chokarakuchi-junmai

旧: 穏やかな香りを楽しめます。まろやかな口当たりも、このお酒の特徴です。

新: 香りは穏やかで、まろやかな口当たりです。超辛口の味わいです。凛としたキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.harushika.com/item/ / https://www.harushika.com/fs/harushika/gd13

### 249. 純米無濾過原酒 十右衛門

ID: kinkon-juemon-junmai-muroka-genshu

旧: まろやかな味わいが特徴の一本。

新: まろやかな味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.toshimaya.co.jp/products/%E7%B4%94%E7%B1%B3%E7%84%A1%E6%BF%BE%E9%81%8E%E5%8E%9F%E9%85%92-%E5%8D%81%E5%8F%B3%E8%A1%9B%E9%96%80%EF%BC%88%E3%81%98%E3%82%85%E3%81%86%E3%81%88%E3%82%82%E3%82%93%EF%BC%89.html

### 250. 大山 特別純米酒 十水

ID: ohyama-tokubetsu-junmai-tomizu-standard

旧: コクのある濃醇な味わいと、酸味との調和を楽しめる一本。

新: コクのある濃醇な味わいと、酸味との調和を楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sake-ohyama.co.jp/prefecture/

### 251. 和楽互尊 純米吟醸

ID: warakugoson-junmai-ginjo-standard

旧: おだやかな吟醸香、すっきりとした純米の旨みが特徴の酒。

新: おだやかな吟醸香で、ふくらみがあります。すっきりとした純米の旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ikeura-shuzo.com/product-list

### 252. 寒北斗 特別純米

ID: kanhokuto-tokubetsu-junmai

旧: 穏やかな飲み口と、やさしい香りを楽しめる一本。

新: やさしい香りで、穏やかな飲み口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kanhokuto.com/products/products-24/

### 253. 飛良泉 山廃純米酒（特別純米酒）

ID: hiraizumi-yamahai-tokubetsu-junmai-v1

旧: ふくらみのある味わいが特徴。快い酸味も楽しめます。

新: ふくらみのある味わいです。快い酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hiraizumi.co.jp/item/

### 254. 飛良泉 熟成山廃純米酒

ID: hiraizumi-jukusei-yamahai-junmai-v1

旧: 旨みを感じる一本。野性味のある酸も楽しめます。

新: 旨みを感じる一本。野性味のある酸も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hiraizumi.co.jp/item/

### 255. 杜の蔵 純米酒

ID: morinokura-junmai-v1

旧: 香味は控えめ。なめらかでふくらみのある、軽やかな味わいです。

新: 香味は控えめ。なめらかでふくらみのある、軽やかな味わいです。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.morinokura.co.jp/products/sake/category_junmai.html

### 256. 独楽蔵 悠（はるか）五年 純米古酒

ID: komagura-haruka-gonen-junmai-koshu-v1

旧: 独特の熟成香と豊かな旨みが特徴の酒。

新: 独特の熟成香です。豊かな旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.morinokura.co.jp/products/sake/category_junmai.html

### 257. 金滴 純米吟醸

ID: kinteki-junmai-ginjo-v1

旧: 豊かな旨味と、さらりとした咽喉こしを楽しめる一本。

新: 豊かな旨味とやや辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kinteki.shop/items/61bef6cc7d278d583b2dfe3a

### 258. 辛口特別純米酒 千曲錦

ID: chikumanishiki-karakuchi-tokubetsu-junmai-v1

旧: 米の旨味を楽しめます。濃醇で深い味わいも、このお酒の特徴です。

新: 濃醇で深い味わいです。米の旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.chikumanishiki.com/products/chikumanishiki.php

### 259. 石鎚 純米吟醸 山田錦50

ID: ishizuchi-junmai-ginjo-yamadanishiki50-v1

旧: 幅のある深い味わいが特徴の一本。

新: 幅のある深い味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.ishizuchi.co.jp/

### 260. 千歳鶴 純米吟醸 きたしずく

ID: chitosetsuru-junmai-ginjo-kitashizuku-v1

旧: 純米吟醸酒です。

新: 爽やかな香りに、みずみずしい甘みと酸味。口に含んだときの、甘酸っぱい印象を楽しめる味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/moriwaki/kk1s4902363174809/

### 261. 澤屋まつもと 守破離 五百万石

ID: sawaya-matsumoto-shuhari-gohyakumangoku-v1

旧: 松本酒造株式会社が醸す一本。

新: 香りはほのかで、すっきりとした淡麗な飲み心地。後口はきれよく切れます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/meishu-honpo/49961/

### 262. 天賦 純米酒

ID: tenbu-junmai-v1

旧: 熟したバナナやアプリコットを思わせる果実味が特徴の一本。

新: 熟したバナナやアプリコットを思わせる果実味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nishi-shuzo.co.jp/tenbu/products/

### 263. 雁木 ひとつび 純米

ID: ganki-hitotsubi-junmai-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 264. 楽器正宗 本醸造 中取り

ID: gakki-masamune-honjozo-nakadori-v1

旧: 甘みと酸味のバランスが特徴の一本。

新: 甘みと酸味のバランスが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.daikichi-sizengo.co.jp/%E6%A5%BD%E5%99%A8%E6%AD%A3%E5%AE%97/

### 265. 自然郷 特別純米

ID: shizengo-tokubetsu-junmai-v1

旧: フルーティな香りが特徴。米の旨みも楽しめます。

新: フルーティな香りで、口に含むとまろやかです。米の旨みが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.daikichi-sizengo.co.jp/%E8%87%AA%E7%84%B6%E9%83%B7/%E8%87%AA%E7%84%B6%E9%83%B7/

### 266. 豊盃 特別純米酒

ID: houhai-tokubetsu-junmai-v1

旧: 落ち着きのある香りがあり、優しい味わいも感じられます。

新: 落ち着きのある香りで、優しい味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://houhai.co.jp/product/

### 267. 二兎 純米吟醸 山田錦五十五

ID: nito-junmai-ginjo-yamadanishiki55-v1

旧: 甘みと酸味のバランスがあり、ミネラル感も感じられます。

新: 甘みと酸味のバランスがあり、ミネラル感も感じられます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://014.co.jp/product/nito/

### 268. 英君 特別純米酒 誉富士

ID: eikun-tokubetsu-junmai-homarefuji-v1

旧: 穏やかな吟醸香が特徴。米の旨味も楽しめます。

新: 吟醸香は穏やかです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://eikun.co.jp/product/tokubetu-junmai-homarefuji/

### 269. 武勇 辛口純米酒

ID: buyu-karakuchi-junmai-v1

旧: 骨太で複雑な味わいを楽しめます。

新: 骨太で複雑な味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://buyu.jp/item/

### 270. 国稀 特別純米

ID: kunimare-tokubetsu-junmai-standard

旧: 米の旨味と、スッキリとした飲み口を楽しめる一本。

新: 飲み口はすっきり。米の旨味も感じられる味わいです。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://www.kunimare.co.jp/online_shop/products/detail/25

### 271. 男山 国芳乃名取酒

ID: otokoyama-kuniyoshinona-v1

旧: かすかな酸味があり、シャープな切れ味も感じられます。

新: 大辛口の味わいとかすかな酸味が感じられます。シャープなキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.otokoyama.com/lineup/category01/

### 272. 初御代 本醸造

ID: hatsumiyo-honjozo-v1

旧: やさしい香りを感じる一本。淡麗な味わいも楽しめます。

新: やさしい香りで、味わいは淡麗です。キレのある飲み口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.unkai.co.jp/product/items/archives/29

### 273. 来福 純米吟醸 山田錦 火入れ

ID: raifuku-junmai-ginjo-yamadanishiki-hiire-v1

旧: 穏やかな吟醸香が特徴。甘みと酸味のバランスも楽しめます。

新: 吟醸香は穏やかです。甘みと酸味が重なります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://raifuku.co.jp/list/list-junmai/

### 274. 玉川 特別純米酒

ID: tamagawa-tokubetsu-junmai-v1

旧: 旨味が特徴。キレも楽しめます。

新: 旨味を感じます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sake-tamagawa.com/prd_post/var05/

### 275. 刈穂 山廃純米超辛口

ID: kariho-yamahai-junmai-chokarakuchi-v1

旧: きめ細やかに凝縮された旨味があり、大辛口の味わいも感じられます。

新: きめ細やかに凝縮された旨味と大辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.igeta.jp/shopdetail/000000000029/ct7/page1/recommend/

### 276. ロ万 純米吟醸 一回火入れ（2025BY）

ID: roman-junmai-ginjo-ichikai-hiire-2025by-v1

旧: 純米吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 年度指定2025BY。現行公式シリーズや購入者レビューから別BYの味を補完しない。

根拠: 採用可能な官能情報なし

### 277. 三千櫻 純米 Rclass

ID: michizakura-junmai-rclass-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式は純米Rclassと普通酒Rclassの共通説明。飲み飽きないという評価だけでは酸や旨味を足せない。

根拠: 採用可能な官能情報なし

### 278. 鳳凰美田 剱 辛口純米酒 火入

ID: hououbiden-tsurugi-hiire-v1

旧: 米の甘みとキレのある後味が特徴の酒。

新: 米の甘みがあります。キレのある後味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.biz.hououbiden.jp/regular.html

### 279. 白真弓 特別純米 ひだほまれ

ID: shiramayumi-tokubetsu-junmai-hidahomare-standard

旧: 落ち着いた香りと米の旨味が特徴の酒。

新: 落ち着いた香りです。米の旨味とやや辛口の味わいとほのかな酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yancha.com/shop/junmai03.html

### 280. 森嶋 美山錦 純米吟醸 瓶燗火入

ID: morishima-miyamanishiki-junmai-ginjo-hiire-v1

旧: 控え目な吟醸香と、若々しい米の旨みを楽しめる一本。

新: 控え目な吟醸香です。若々しい米の旨みと爽快な酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://morishima-sake.jp/ja/morishima.html

### 281. 大信州 手の内 生詰

ID: daishinshu-tenouchi-namazume-v1

旧: 軽快な味わいが特徴の一本。

新: 軽快な味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.daishinsyu.com/products

### 282. 特別純米 飛切り

ID: tenryo-tobikiri-tokubetsu-junmai

旧: ほのかな熟成香を感じる一本。旨味も楽しめます。

新: ほのかな熟成香です。旨味と酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tenryou.co.jp/product/58

### 283. 姿 特別純米酒 斬れすがた

ID: sugata-kire-tokubetsu-junmai-v1

旧: 飯沼銘醸株式会社が醸す一本。

新: シャープでみずみずしい口当たり。飲み心地は軽めで透明感があり、余韻もきれよく切れます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/s-wine/18531/

### 284. 司牡丹 仁淀ブルー

ID: tsukasabotan-niyodo-blue-junmai-standard

旧: ナチュラルな香りが特徴。淡麗辛口も楽しめます。

新: ナチュラルな香りで、淡麗な辛口の味わいです。さらりとしたキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tsukasabotan.co.jp/standard/niyodoblue.html

### 285. 仙介 超辛口純米吟醸原酒・一火

ID: sensuke-chokarakuchi-junmai-ginjo-genshu-ichibi-v1

旧: ほのかな米の旨味が特徴。スッキリした切れ味も楽しめます。

新: 透明感のある飲み心地です。ほのかな米の旨味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.izumisyuzou.co.jp/products/junmai-ginjo-shu/%E4%BB%99%E4%BB%8B%E3%80%80%E8%B6%85%E8%BE%9B%E5%8F%A3%E7%B4%94%E7%B1%B3%E5%90%9F%E9%86%B8%E5%8E%9F%E9%85%92%E3%83%BB%E4%B8%80%E7%81%AB/

### 286. 御湖鶴 純米吟醸 ひとごこち 火入れ

ID: mikotsuru-junmai-ginjo-hitogokochi-hiire-v1

旧: まろやかでふくらみのある味わいが特徴の一本。

新: まろやかでふくらみのある味わいで、フレッシュな味わいです。ガス感があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.mikotsuru.com/product/hitogokochi_burned/

### 287. 純米吟醸 両関

ID: ryozeki-junmai-ginjo-v1

旧: 柔らかく優しい香りと、スッキリした味わいを楽しめる一本。

新: 柔らかく優しい香りで、スッキリした味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ryozeki.co.jp/shohin.html

### 288. 半蔵 特別純米酒 辛口

ID: hanzo-tokubetsu-junmai-karakuchi-v1

旧: 株式会社大田酒造が醸す一本。

新: 香りは穏やか。米の旨味をしっかり感じられる味わいです。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/auc-matsusen/n398-1/

### 289. 八咫笹一 純米大吟醸

ID: sasaichi-yata-junmai-daiginjo-v1

旧: 上品で芳醇な旨みを楽しめます。

新: 上品で芳醇な旨みを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sasaichi.com/shopdetail/000000000272/ct31/page1/recommend/

### 290. 六十餘洲 純米吟醸 山田錦

ID: rokujuyoshu-junmai-ginjo-yamadanishiki-v1

旧: 穏やかな吟醸香の酒。旨味と酸味の調和も楽しめます。

新: 吟醸香は穏やかで、旨味と酸味が重なります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://rokujuyoshu.com/product/

### 291. 金松白鷹 特別純米

ID: hakutaka-kinmatsu-tokubetsu-junmai

旧: 米の旨味を楽しめます。力強い飲み口も、このお酒の特徴です。

新: 力強い飲み口です。米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://hakutaka.jp/item.html

### 292. 福鶴 純米吟醸酒

ID: fukutsuru-junmai-ginjo-v1

旧: 米本来の旨味が特徴。爽やかな味わいも楽しめます。

新: 米本来の旨味が特徴。爽やかな味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://fukudashuzo.base.shop/items/71024917

### 293. 白隠正宗 辛口純米酒

ID: hakuinmasamune-karakuchi-junmai-standard

旧: 辛口の味わいを楽しめます。

新: 辛口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hakuinmasamune.com/

### 294. よこやま 純米吟醸 SILVER7 生詰

ID: yokoyama-silver7-namazume-v1

旧: マスカットを思わせる香りと、ジューシーな甘みを楽しめる一本。

新: マスカットを思わせる香りで、フレッシュな味わいです。ジューシーな甘みと微発泡感が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.omoyashuzo.com/product.html

### 295. 六十餘洲 にごり酒

ID: rokujuyoshu-tividq-3

旧: しっかりとした旨味、すっきりとした飲み口が特徴の酒。

新: すっきりとした飲み口です。しっかりとした旨味、ほのかな甘味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://rokujuyoshu.com/product/

### 296. 西の関 純米吟醸 美吟

ID: nishinoseki-junmai-ginjo-bigin-v1

旧: 吟醸香が特徴。旨味も楽しめます。

新: 吟醸香が特徴。旨味も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nishinoseki.com/product/junginshu/

### 297. 初亀 純米吟醸 からからべっぴん

ID: hatsukame-karakara-beppin-v1

旧: 控えめな酸味を楽しめます。超辛口の味わいも、このお酒の特徴です。

新: 超辛口の味わいと控えめな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hatsukame.jp/product/karakara.html

### 298. 和香牡丹 八蝶 ヒノヒカリ

ID: wakabotan-hatcho-hinohikari-v1

旧: リンゴやパッションフルーツを思わせる香りが特徴。フルーティーな味わいも楽しめます。

新: リンゴやパッションフルーツを思わせる香りです。甘みと酸味と微発泡感が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.sanwa-shurui.co.jp/shopdetail/000000000248/sake/page1/recommend/

### 299. 羽根屋 純吟 煌火 生原酒

ID: haneya-kirabi-nama-genshu-v1

旧: 純米吟醸酒です。

新: 華やかな香りに、まろやかな舌ざわり。ほどよい甘味と旨みが感じられる、きれいな飲み口です。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/shiraiya/10002041/

### 300. 黒兜 Green Label 純米吟醸

ID: kurokabuto-green-label-v1

旧: 洋ナシやリンゴを思わせる味わいがあり、爽やかな酸味も感じられます。

新: 洋ナシやリンゴを思わせる味わいです。やや辛口の味わいと爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop-ikekame.com/products/%E7%B4%94%E7%B1%B3%E5%90%9F%E9%86%B8%E9%BB%92%E5%85%9C%E5%A4%A2%E4%B8%80%E7%8C%AE

### 301. 小左衛門 純米吟醸 備前雄町 火入

ID: kozaemon-bizen-omachi-hiire-v1

旧: 柔らかな旨みが特徴。キレのよさも楽しめます。

新: なめらかな飲み心地です。柔らかな旨みと酸味が感じられます。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kozaemon.jp/menu/853558

### 302. 美冨久 山廃純米吟醸 いぎん純聖

ID: mifuku-yamahai-junmai-ginjo-iginjunsei-standard

旧: フルーティーな吟醸香が特徴。米の旨味も楽しめます。

新: フルーティーな吟醸香で、コクと深みがあります。米の旨味と中口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://mifuku-shop.jp/SHOP/118.html

### 303. 吉野杉の樽酒

ID: choryo-yoshinosugi-tarusake-standard

旧: 杉の清々しい香りを感じる一本。旨みも楽しめます。

新: 杉の清々しい香りです。旨みを感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.choryo.co.jp/?pid=157239009

### 304. 御代櫻 純米吟醸 Leaf

ID: miyozakura-leaf-junmai-ginjo-v1

旧: 華やかな吟醸香と柔らかな甘味が特徴の酒。

新: 華やかな吟醸香です。柔らかな甘味と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://miyozakura.co.jp/miyozakura/557-2.html

### 305. 不動 一度火入れ 純米大吟醸

ID: fudo-ichido-hiire-junmai-daiginjo-v1

旧: まろやかな味わいを楽しめます。

新: まろやかな味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.nabedana.co.jp/posts/item/%E4%B8%8D%E5%8B%95-%E4%B8%80%E5%BA%A6%E7%81%AB%E5%85%A5%E3%82%8C-%E7%B4%94%E7%B1%B3%E5%A4%A7%E5%90%9F%E9%86%B8/

### 306. 帝松 吟醸出世酒 社長の酒

ID: mikadomatsu-shacho-no-sake-v1

旧: 上品な香りを感じる一本。旨みも楽しめます。

新: 香りは上品。旨みがあり、酸味との調和も感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://www.mikadomatsu.com/item/

### 307. 二世古 純米吟醸 彗星 火入

ID: niseko-suisei-junmai-ginjo-hiire-v1

旧: 控えめな香りを感じる一本。すっきりした味わいも楽しめます。

新: 控えめな香りを感じる一本。すっきりした味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://ontable.jp/shopdetail/000000000041/

### 308. 丹澤山 秀峰

ID: tanzawasan-shuho-v1

旧: 柔らかな味わいと後口のキレが特徴の酒。

新: 柔らかな味わいです。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kawanishiya.stores.jp/items/5f3a3cded3f1672af1abd1a7

### 309. 残草蓬莱 純米 緑ラベル

ID: zaru-so-hourai-junmai-green-v1

旧: 柑橘系の含み香を楽しめます。最初に感じる米の甘味も、このお酒の特徴です。

新: 柑橘系の含み香です。最初に感じる米の甘味と酸味が感じられます。後口はドライです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://oyatakashi-shuzo.com/product/151/

### 310. 相模灘 特別純米 辛口 火入れ

ID: sagaminada-tokubetsu-junmai-karakuchi-hiire-v1

旧: 辛口の味わいを楽しめます。

新: 辛口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tsukui.ne.jp/kubota/products/detail/pg214.html

### 311. 御前酒 純米 美作

ID: gozenshu-junmai-mimasaka-v1

旧: 穏やかな香りが特徴。雄町米の旨みも楽しめます。

新: 香りは穏やかです。雄町米の旨みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.gozenshu.co.jp/SHOP/tuji-008.html

### 312. 御前酒 純米吟醸 如意山 雄町

ID: gozenshu-junmai-ginjo-nyoisan-omachi-v1

旧: 上品で華やかな香りがあり、ふくよかな旨味も感じられます。

新: 上品で華やかな香りです。ふくよかな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.gozenshu.co.jp/SHOP/tuji-203.html

### 313. 志太泉 純米吟醸 焼津酒米研究会

ID: shidaizumi-junmai-ginjo-yaizu-shumai-2026-v1

旧: 爽やかな柑橘系の吟醸香があり、味わいの透明感も感じられます。

新: 爽やかな柑橘系の吟醸香で、透明感のある飲み心地です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shidaizumi.com/sake/R07BY/yaizu2026.pdf

### 314. 川鶴 純米オオセト

ID: kawatsuru-junmai-ooseto-hiire-v1

旧: 熟したメロンやリンゴを思わせる上品な果実香と骨太な米の旨味が特徴の酒。

新: 熟したメロンやリンゴを思わせる上品な果実香です。骨太な米の旨味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kawatsuru.com/product/product02/

### 315. 梅錦 つうの酒

ID: umenishiki-ginjo-tsuunosake-v1

旧: なめらかな口当たりと透明感が特徴。甘さを抑えた、ドライな味わいです。

新: なめらかな口当たりと透明感です。甘さが抑えられたドライな味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.umenishiki.com/lineup/170/

### 316. 豊の秋 純米吟醸 松江づくし

ID: toyonoaki-junmai-ginjo-matsuezukushi-standard

旧: やわらかな吟香が特徴。しっかりとした芯のある旨味も楽しめます。

新: やわらかな吟香です。しっかりとした芯のある旨味、やや辛口の味わいが感じられます。後口はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.toyonoaki.com/product/603/

### 317. 赤磐雄町 純米大吟醸

ID: akaiwaomachi-junmai-daiginjo-standard-v1

旧: 雄町米の旨味を楽しめます。

新: 雄町米の旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://sakehitosuji.thebase.in/items/27058415

### 318. 日榮 純米吟醸 石川門

ID: nichiei-junmai-ginjo-ishikawamon-standard

旧: やわらかな含み香と、深い旨みを楽しめる一本。

新: やわらかな含み香です。深い旨みと程よい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nakamura-shuzou.co.jp/view/item/000000000029

### 319. 金盃 純米酒 横綱

ID: kinpai-junmai-yokozuna-standard

旧: 米の旨みとまろやかな味わいが特徴の酒。

新: 口に含むとまろやかです。米の旨みが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/auc-kinpai/00300020/

### 320. 酔鯨 純米大吟醸 兵庫山田錦50%

ID: suigei-junmai-daiginjo-hyogo-yamadanishiki50-v1

旧: 軽やかな吟醸香と、上品な旨みを楽しめる一本。

新: 軽やかな吟醸香です。上品な旨みとキレの良い辛口が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://suigei.co.jp/collection/501.html

### 321. 伊予賀儀屋 無濾過 純米 赤ラベル

ID: iyo-kagiya-junmai-aka-label-v1

旧: 米の旨味を残した軽快な味わいを楽しめます。

新: 軽快な飲み心地です。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.seiryosyuzo.com/brands/standard

### 322. 成龍然 特別純米 The Plains

ID: seiryozen-tokubetsu-junmai-the-plains-v1

旧: 優しいお米の旨みと、後口のキレを楽しめる一本。

新: 優しいお米の旨みがあります。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.seiryosyuzo.com/blog/6011

### 323. 庭のうぐいす 特別純米

ID: niwanouguisu-tokubetsu-junmai-standard-v1

旧: 口当たりは軽く、味わいは深い酒。ドライな味わいも楽しめます。

新: 軽い口当たりと深い味わいで、フレッシュな味わいです。ドライな飲み口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niwanouguisu.com/products/

### 324. 庭のうぐいす 純米吟醸 ぬるはだ

ID: niwanouguisu-junmai-ginjo-nuruhada-v1

旧: しっかりとした酸味と、しっかりとした甘みを楽しめる一本。

新: しっかりとした甘み、しっかりとした酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://niwanouguisu.com/products/

### 325. 天賦 純米吟醸 羽前酒未来

ID: tenbu-junmai-ginjo-uzen-sakemirai-v1

旧: 芳醇なメロンを思わせる上品な香りを楽しめます。濃厚な旨味も、このお酒の特徴です。

新: 芳醇なメロンを思わせる上品な香りです。濃厚な旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nishi-shuzo.co.jp/tenbu/products/

### 326. 鷹来屋 辛口 特別純米酒

ID: takakiya-karakuchi-tokubetsu-junmai-v1

旧: さらりとした飲み口と、旨味、キレを楽しめます。辛口の味わいも、このお酒の特徴です。

新: 旨味と辛口の味わいが感じられます。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenokimata.jp/item/sake/387

### 327. 蜻蛉 特別純米酒

ID: tonbo-tokubetsu-junmai-standard-v1

旧: 米の旨味と、すっきりした味わいを楽しめる一本。

新: 米の旨味と、すっきりした味わいを楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tomozoe-honten.co.jp/view/item/000000000114

### 328. 北の錦 特別純米酒 まる田

ID: kitanonishiki-maruta-tokubetsu-junmai-v1

旧: 力強い米の旨味と濃厚な味わいが特徴の酒。

新: 濃厚な飲み心地に、力強い米の旨味。酸味との調和も感じられます。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://kitanonishik.official.ec/items/13254699

### 329. 正雪 純米吟醸 山田錦

ID: shosetsu-junmai-ginjo-yamadanishiki-standard-v1

旧: 果実の香りと、しっとりとした味わいを楽しめる一本。

新: 果実の香りで、しっとりとした味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nipponnosake.com/kura/shousetsu/sake.html

### 330. 富翁 純米吟醸 祇園小町

ID: tomio-gion-komachi-junmai-ginjo-standard

旧: やわらかな口あたりを楽しめます。

新: やわらかな口あたりを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tomio-sake.co.jp/post_product/sake202/

### 331. 蓬莱泉 純米大吟醸 美

ID: houraisen-bi-junmai-daiginjo-standard-v1

旧: 華やかな香りを感じる一本。まろやかな口当たりも楽しめます。

新: 香りは華やかで、まろやかな口当たりです。やや甘口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://netshop.houraisen.co.jp/products/detail/68

### 332. 瀧自慢 辛口純米 滝水流

ID: takijiman-hayase-karakuchi-junmai-v1

旧: すっきりとしたキレの良い味わいを楽しめます。辛口の味わいも、このお酒の特徴です。

新: 味わいは辛口です。すっきりとしたキレの良い味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.takijiman.jp/?cat=4

### 333. 風の森 秋津穂657

ID: kazenomori-akitsuho-657-standard-v1

旧: 瓜や洋梨のような香りを感じる一本。複雑な味わいも楽しめます。

新: 瓜や洋梨のような香りで、複雑な味わいです。甘みが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://yucho-sake.jp/product/kazenomori/

### 334. 亀齢 辛口純米 八拾 火入れ

ID: kirei-karakuchi-junmai-hachiju-hiire-v1

旧: 米の旨味があり、微細な酸味も感じられます。

新: 米の旨味と微細な酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sake-nozaki.jp/product/1029

### 335. 南部美人 純米大吟醸 酒未来

ID: nanbubijin-junmai-daiginjo-sakemirai-standard-v1

旧: 上品な吟醸香と、すっきりとした酸味を楽しめる一本。

新: 上品な吟醸香です。すっきりとした酸味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nanbubijin.jp/shopdetail/000000000073/

### 336. 宗玄 能登乃国 純米酒

ID: sogen-notonokuni-junmai-standard-v1

旧: なめらかな喉ごしを楽しめます。

新: なめらかな喉ごしを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://kanazawaumano.jp/sougen.html

### 337. 宗玄 純米大吟醸 玄心

ID: sogen-genshin-junmai-daiginjo-standard-v1

旧: 優しい香りがあり、豊かな味わいも感じられます。

新: 優しい香りで、豊かな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kanazawaumano.jp/sougen.html

### 338. 宝剣 純米 緑ラベル 八反錦

ID: houken-junmai-hattannishiki-green-v1

旧: 軽快な飲み口を楽しめます。キレのよい余韻も、このお酒の特徴です。

新: 軽快な飲み口です。キレのよい余韻があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hasegawasaketen.com/eshop/products/detail/107

### 339. 宝剣 純米吟醸 八反錦

ID: houken-junmai-ginjo-hattannishiki-standard-v1

旧: 米の旨味が特徴の一本。

新: 米の旨味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.yamanaka-sake.shop/view/item/000000000263?category_page_id=ct1608

### 340. 黒龍 いっちょらい 純吟

ID: kokuryu-icchorai-jungin-standard-v1

旧: 柔らかく深い旨味が特徴。心地よいキレも楽しめます。

新: 柔らかく深い旨味があります。心地よいキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kagimoto.com/shopdetail/000000003725/

### 341. 澤乃井 純米大辛口

ID: sawanoi-junmai-daikarakuchi-standard-v1

旧: きれの良い辛口を楽しめます。辛口の味わいも、このお酒の特徴です。

新: 味わいは辛口です。キレのある辛口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sawanoi-sake.com/item/item-624/

### 342. 相模灘 純米吟醸 美山錦

ID: sagaminada-junmai-ginjo-miyamanishiki-standard-v1

旧: 爽やかな吟醸香を楽しめます。軽快な口あたりも、このお酒の特徴です。

新: 爽やかな吟醸香を楽しめます。軽快な口あたりも、このお酒の特徴です。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.tsukui.ne.jp/kubota/products/detail/pg212.html

### 343. 東洋美人 純米吟醸 50

ID: toyobijin-junmai-ginjo-50-standard-v1

旧: 青りんごのような上品な香りと、しっかりとした旨みを楽しめる一本。

新: 青りんごのような上品な香りで、柔らかいボディー感があります。しっかりとした旨み、熟した果実の甘みが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hasegawasaketen.com/eshop/products/detail/2184

### 344. 天明 槽しぼり 純米火入れ オレンジ

ID: tenmei-orange-funashibori-junmai-hiire-standard-v1

旧: やわらかな旨味が特徴。ほのかな甘みも楽しめます。

新: やわらかな旨味とほのかな甘みが感じられます。軽やかなキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jizake.com/c/sake/tenmei/Sake7202_1800

### 345. HIRAN にこまる 火入れ

ID: hiran-nikomaru-hiire-standard-v1

旧: 穏やかな香りを感じる一本。にこまるの旨味も楽しめます。

新: 香りは穏やかです。にこまるの旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://mori-shuzou.jp/nihonshu/

### 346. 篠峯 純米 山田錦 超辛口 竹山 火入れ

ID: shinomine-takeyama-junmai-yamadanishiki-chokarakuchi-hiire-v1

旧: すっきりした後口と辛口の味わいが特徴の酒。

新: すっきりした後口と辛口の味わいが特徴の酒。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.abetaya.com/product/2657

### 347. 篠峯 凛々 純米吟醸 無濾過生原酒

ID: shinomine-rinrin-setoomachi-junmai-ginjo-muroka-nama-genshu-v1

旧: 新鮮でフルーティーな香りと、爽やかな甘味を楽しめる一本。

新: 新鮮でフルーティーな香りです。爽やかな甘味があります。ドライな飲み口です。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hasegawasaketen.com/eshop/products/detail/4665

### 348. 天穏 純米酒

ID: tenon-junmai-standard-ichikai-hiire-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 349. 土佐しらぎく 斬辛 特別純米

ID: tosa-shiragiku-zankara-tokubetsu-junmai-standard-v1

旧: 果実の爽やかな香りがあり、斬れの良い辛口も感じられます。

新: 果実の爽やかな香りです。味わいは辛口です。キレのある辛口の味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tosashiragiku.com/brand.html

### 350. 大関 特撰 特別純米酒 山田錦

ID: ozeki-tokusen-tokubetsu-junmai-yamadanishiki-standard

旧: まろやかな香りを感じる一本。ふくよかな旨みも楽しめます。

新: まろやかな香りです。ふくよかな旨みと芳醇辛口が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ozeki.co.jp/product/nihonshu/yamadanishiki/

### 351. 芳水 特別純米酒

ID: housui-tokubetsu-junmai-standard-v1

旧: ふくらみのある香味が特徴の一本。

新: ふくらみのある香味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://housui.com/products/

### 352. 日高見 特別純米酒 魚ラベル

ID: hitakami-sakana-label-tokubetsu-junmai-hiire-v1

旧: 微かな果実の香りを感じる一本。柔らかな旨味も楽しめます。

新: 微かな果実の香りです。柔らかな旨味があります。引き締まったキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sake-kagiya.com/view/item/000000002769

### 353. 日高見 超辛口純米酒

ID: hitakami-chokarakuchi-junmai-standard-v1

旧: 爽やかな果実様香を感じる一本。やや豊潤な味わいも楽しめます。

新: 爽やかな果実様香で、やや豊潤な味わいです。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://miyagisake.jp/sake/25005/

### 354. 乾坤一 超辛口 純米吟醸原酒 火入れ

ID: kenkonichi-chokarakuchi-junmai-ginjo-genshu-hiire-v1

旧: やさしい旨みを楽しめます。キレのよさも、このお酒の特徴です。

新: やさしい旨みと超辛口の味わいが感じられます。後口はきれよく切れます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yajima-jizake.co.jp/products/detail.php?product_id=12999

### 355. 純米吟醸 梅美人 さくらひめ酵母

ID: umebijin-junmai-ginjo-sakurahime-standard

旧: 甘味と酸味のバランスを楽しめます。果物感のある甘味も、このお酒の特徴です。

新: 果物を思わせる甘みがあり、酸味と調和した味わいです。

判定: REWRITTEN / HIGH

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://umebijin.official.ec/items/73209182

### 356. 大典白菊 純米 白菊

ID: taiten-shiragiku-junmai-shiragiku-standard-v1

旧: 米の旨みを楽しめます。

新: 米の旨みを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://shiragiku-shop.com/items/5f9a42afda019c3057b87d15

### 357. 惣誉 生酛仕込 特別純米

ID: sohomare-kimoto-tokubetsu-junmai

旧: 密度の高い旨み、しっかりとした酸味が特徴の酒。

新: コクがあります。密度の高い旨み、甘み、しっかりとした酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://sohomare.co.jp/lineup03.php

### 358. 蓬莱 純米吟醸 家伝手造り

ID: hourai-junmai-ginjo-kaden-tezukuri-v1

旧: お米本来の香りが特徴の一本。

新: お米本来の香りが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.watanabeshuzouten.com/c/sake/jyunmai_gingyo/kaden1800

### 359. 川中島 特別純米酒

ID: kawanakajima-tokubetsu-junmai-standard-v1

旧: 柔らかさとコクと、キレを楽しめる一本。

新: 柔らかさとコクがあります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shusen.jp/goods.html

### 360. 喜楽里 純米 原酒（火入れ）

ID: kirari-junmai-genshu-hiire-standard-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 361. 高千代 からくち純米 美山錦 +19 火入れ

ID: takachiyo-karakuchi-junmai-miyamanishiki-plus19-hiire-v1

旧: 米の旨味が特徴。キレも楽しめます。

新: 米の旨味と超辛口の味わいが感じられます。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.maidoyasaketen.com/products/1678

### 362. 特別純米 花洛 辛口原酒

ID: shoutoku-karaku-tokubetsu-junmai-karakuchi-genshu-standard

旧: すっきりとした酸味を楽しめます。辛口の味わいも、このお酒の特徴です。

新: 辛口の味わい、すっきりとした酸味が感じられます。後口はきれよく切れます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shoutoku-shop.com/?pid=183305815

### 363. 而今 特別純米 火入

ID: jikon-tokubetsu-junmai-hiire-standard-v1

旧: 特別純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 公式は味を特上雄町純米大吟醸のみ説明。別酒・生酒混在の定番記事から流用しない。

根拠: 採用可能な官能情報なし

### 364. 而今 純米吟醸 山田錦 火入

ID: jikon-junmai-ginjo-yamadanishiki-hiire-standard-v1

旧: 純米吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式に当該SKUの味の説明なし。楽天には酒米一般論と長期熟成在庫の可能性があり、現行の味と断定しない。

根拠: 採用可能な官能情報なし

### 365. 而今 純米吟醸 雄町 火入

ID: jikon-junmai-ginjo-omachi-hiire-standard-v1

旧: 純米吟醸酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式の深い味わい・滑らかさは特上雄町純米大吟醸の説明であり、雄町純米吟醸へ転用しない。

根拠: 採用可能な官能情報なし

### 366. 寒菊 OCEAN99 橙海 Arrival 無濾過一度火入原酒

ID: kankiku-ocean99-toumi-arrival-hiire-v1

旧: 純米吟醸酒です。

新: 飲み心地は軽やかで、味わいには深みがあります。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://order.isego.net/product.php?id=7770

### 367. 嘉泉 特別本醸造 幻の酒

ID: kasen-maboroshi-no-sake-tokubetsu-honjozo-standard-v1

旧: 旨味が特徴の一本。

新: 旨味が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.e-mark-iishina.metro.tokyo.lg.jp/foods/detail/id%3D165

### 368. 義侠 縁（えにし）

ID: gikyo-enishi-junmai-aged-blend-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_IDENTITY_UNCLEAR / LOW

理由: 公式は3年以上、店舗は2年以上の熟成と記載。旧版が混じる可能性があり、熟成香・味の数値を統合しない。

根拠: 採用可能な官能情報なし

### 369. 播州一献 純米 超辛口 火入れ

ID: banshu-ikkon-junmai-chokarakuchi-hiire-v1

旧: 滑らかな後味を感じる一本。辛口の味わいも楽しめます。

新: 滑らかな後味を感じる一本。辛口の味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.yajima-jizake.co.jp/products/detail.php?product_id=7336

### 370. 秋鹿 純米 山田錦 稲穂ラベル

ID: akishika-junmai-inaho-yamadanishiki-75-v1

旧: 力強い米の旨味と辛口の味わいが特徴の酒。

新: 力強い米の旨味と辛口の味わいが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kagimoto.com/shopdetail/000000003721/

### 371. 秋鹿 山廃純米 山田錦 無濾過原酒 火入れ

ID: akishika-yamahai-junmai-yamadanishiki-70-muroka-genshu-hiire-v1

旧: 純米酒です。

新: 米の旨味を感じられる辛口の味わい。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://shopping.kimijimaya.co.jp/view/item/000000002432

### 372. 長珍 特別純米酒（ゴールドラベル）

ID: chochin-tokubetsu-junmai-gold-standard-v1

旧: 深みのある味わいが特徴の一本。

新: 深みのある味わいです。味わいは辛口です。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sakenokimata.jp/item/sake/323

### 373. 仙禽 クラシック 弐式（オリガラミ）火入れ

ID: senkin-classic-nishiki-origarami-hiire-v1

旧: やわらかな口当たりを感じる一本。酸味も楽しめます。

新: やわらかな口当たりです。酸味を感じます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jizake.com/c/sake/senkin/ns180048

### 374. 仙禽 モダン 壱式（火入れ）

ID: senkin-modern-ichishiki-hiire-v1

旧: ボリューム感と厚みを楽しめます。

新: ボリューム感と厚みを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://shop.inomotosaketen.jp/view/item/000000000764?category_page_id=ct43

### 375. 仙禽 レトロ 壱式（火入れ）

ID: senkin-retro-ichishiki-hiire-v1

旧: 甘酸っぱい味わいを感じる一本。キレのある後味も楽しめます。

新: 甘酸っぱい味わいです。キレのある後味があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.inomotosaketen.jp/view/item/000000000773

### 376. 悦凱陣 手造り純米 火入れ

ID: yorokobi-gaijin-tezukuri-junmai-hiire-standard-v1

旧: 凝縮された旨みがあり、酸味も感じられます。

新: 凝縮された旨みと酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.shichikura.com/item/3067-3068/

### 377. 新政 No.6 R-type

ID: aramasa-no6-r-type-nama-standard-v1

旧: 旨味を楽しめます。

新: 旨味を楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://takekuma.co.jp/store/item/item-seisyu/aramasa-4543

### 378. 新政 天鵞絨（ヴィリジアン）

ID: aramasa-viridian-hiire-standard-v1

旧: 味わいに厚みのある酒。余韻も楽しめます。

新: 味わいに厚みのある酒。余韻も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://takekuma.co.jp/store/item/item-seisyu/aramasa-4259

### 379. 結ゆい 純米吟醸 超辛口（来福酒造醸造）

ID: yui-omachi-junmai-ginjo-chokarakuchi-raifuku-v1

旧: 超辛口の味わいを楽しめます。

新: 超辛口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://sake-y.net/shopdetail/000000006298/

### 380. 屋守 純米吟醸 無調整 生

ID: okunokami-junmai-ginjo-muchosei-nama-v1

旧: 華やかでフルーティーな香りを楽しめます。軽やかな口当たりも、このお酒の特徴です。

新: 華やかでフルーティーな香りで、軽やかな口当たりです。ほのかな甘みがあります。キレがよくクリアな後口があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.kanda-toshimaya.co.jp/shop/products/OKN-JG-NAMA-1800

### 381. 産土 2025 山田錦 二農醸 生酒

ID: ubusuna-yamada-nishiki-ninojo-2025-nama-v1

旧: 和梨、柑橘、白桃を思わせる香りが特徴。軽快で優しい飲み口も楽しめます。

新: 和梨、柑橘、白桃を思わせる香りで、軽快で優しい飲み口です。フレッシュな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ontable.jp/shopdetail/000000001801/sake065/page1/order/

### 382. 田光 純米 槽搾り 一回瓶火入れ

ID: tabika-junmai-funashibori-ichikai-hiire-v1

旧: 穏やかな米の香りを感じる一本。自然な旨みも楽しめます。

新: 穏やかな米の香りで、口に含むとまろやかです。自然な旨みがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yamatoya-e.com/SHOP/tabika30560.html

### 383. 亀齢 萬事酒盃中 純米 火入れ

ID: kirei-banjisakazukinonaka-junmai-hiire-v1

旧: ほどよい旨みを感じる一本。控えめな甘さも楽しめます。

新: ほどよい旨みと辛口の味わいが感じられます。キレのある辛口の味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/sakeroman/kirei_005/

### 384. WAKAZE THE CLASSIC（山形製造）

ID: wakaze-the-classic-yamagata-v1

旧: ボディ感がありながら、飲み心地は軽い酒。酸味のニュアンスも楽しめます。

新: ボディ感と軽い飲み心地があります。酸味のニュアンスがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.wakaze-store.com/collections/the-classic/products/the-classic-jp

### 385. 北安大國 純米酒 七十％精米

ID: hokuan-daikoku-junmai70-v1

旧: コクのある味わいを楽しめます。甘みと酸味のバランスも、このお酒の特徴です。

新: コクのある味わいです。甘みと酸味が重なります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://hokuan.shop/items/617b60fb3303783935c4a672

### 386. 作田 特別純米酒 特別契約栽培米

ID: sakuta-tokubetsu-junmai-keiyaku-v1

旧: 米の旨みを楽しめます。ふわりとした甘みも、このお酒の特徴です。

新: 飲み心地は軽やかです。米の旨み、ふわりとした甘みが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://morishou.co.jp/product.html

### 387. 瓢太閤 吟醸 阿波山田錦

ID: hisagotaiko-ginjo-awa-yamadanishiki-standard

旧: 華やかな香りとなめらかな喉ごしが特徴の酒。

新: 香りは華やかです。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://nissin-shurui.com/?pid=36864911

### 388. 稲とアガベ DOBUROKU 6号酵母

ID: ine-to-agave-doburoku6-v1

旧: 稲とアガベ株式会社が醸す一本。

新: 米のつぶつぶした食感と、ミルキーで力強い甘旨味。微発泡感があり、酸味とほのかな苦味が後口を引き締めます。

判定: REWRITTEN / MEDIUM

理由: 当該商品の現行本文を個別照合し、確認できた官能表現のみ編集。

根拠: https://item.rakuten.co.jp/sake-mie/inetodobu6-500/

### 389. 呉春 本丸 本醸造

ID: goshun-honmaru-honjozo-v1

旧: しっとり穏やかな口当たりが特徴の一本。

新: しっとり穏やかな口当たりが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.kagataya.net/shopdetail/000000000198/

### 390. 瑞鷹 本醸造 超辛口

ID: zuiyo-honjozo-chokarakuchi-v1

旧: 超辛口の味わいを楽しめます。

新: 超辛口の味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.zuiyo.co.jp/products/nihonshu/43/

### 391. 鳴門鯛 純米 巴

ID: narutotai-junmai-tomoe-v1

旧: ふくよかな香りを感じる一本。幅のある米の旨味も楽しめます。

新: ふくよかな香りで、口に含むとまろやかです。幅のある米の旨味と軽やかな酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.narutotai-sake.jp/SHOP/13008_13007_13006_tomoejm.html

### 392. 鳳麟 純米大吟醸

ID: gekkeikan-horin-junmai-daiginjo-standard

旧: マスカットのような香りがあり、上品な甘みも感じられます。

新: マスカットのような香りです。上品な甘みがあります。芳醇な余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.gekkeikan.co.jp/products/type01/horin_daiginjo/

### 393. 純米吟醸 東の麓 山形セレクション

ID: azumanofumoto-junmai-ginjo-yamagata-selection-v1

旧: 穏やかな香りを楽しめます。柔らかい口当たりも、このお酒の特徴です。

新: 香りは穏やかで、柔らかい口当たりです。後口はスッキリしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://azumanofumoto.stores.jp/items/6995193de7836e0069217b4a

### 394. 越乃景虎 純米酒

ID: koshino-kagetora-junmai-standard-v1

旧: 優しい香りを感じる一本。米の旨味も楽しめます。

新: 優しい香りで、口に含むとまろやかです。米の旨味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/syuraku-shop/11811/ / https://www.sakesake.com/item/kurabetu1/19/1-19-5.html

### 395. 純米吟醸 蔵王

ID: zao-junmai-ginjo-catalog-v1

旧: 果実の香りが特徴。旨味も楽しめます。

新: 果実の香りで、やわらかい口当たりです。旨味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://zaoshuzo-shop.com/items/619235977d5d8118e1b63095

### 396. 長久 特撰 本醸造

ID: chokyu-tokusen-honjozo-catalog-v1

旧: 旨味が特徴。ふくらみも楽しめます。

新: ふくらみがあります。旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nakano-group.co.jp/product/nihonshu01/

### 397. 鮎正宗 本醸造

ID: ayumasamune-honjozo-catalog-v1

旧: まろやかな旨味とすっきりした口当たりが特徴の酒。

新: すっきりした口当たりです。まろやかな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ayumasamune.com/product/index.html

### 398. 千代の光 真 特別本醸造

ID: chiyonohikari-shin-tokubetsu-honjozo-catalog-v1

旧: 米の旨味が特徴。淡麗な味わいも楽しめます。

新: 味わいは淡麗です。米の旨味と辛口の味わいが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hachimanya.com/product/14

### 399. 一人娘 さやか 特別本醸造

ID: hitorimusume-sayaka-tokubetsu-honjozo-catalog-v1

旧: 軽快な味わいを感じる一本。超辛口の味わいも楽しめます。

新: 軽快な飲み心地です。超辛口の味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/kuranosuke/3372/

### 400. 脇田屋 特別本醸造

ID: wakitaya-tokubetsu-honjozo-catalog-v1

旧: 淡麗な味わいがあり、辛口の味わいも感じられます。

新: 味わいは淡麗です。味わいは辛口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.izu-bandai.com/pages/wakitaya-tokubetsu-honjyouzo.html

### 401. 天神囃子 特別本醸造

ID: tenjinbayashi-tokubetsu-honjozo-catalog-v1

旧: 芳香と、旨味を楽しめる一本。

新: 芳香です。旨味を感じます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/koshino-sakekura/nt-76/

### 402. 越路吹雪 秋あがり 純米吟醸 2026

ID: koshijifubuki-akiagari-2026-catalog-v1

旧: 豊かな旨味と、やわらかい口当たりを楽しめる一本。

新: やわらかい口当たりです。豊かな旨味とやや辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.takano-shuzo.co.jp/items/103804777

### 403. 官兵衛 しぼりたて 生貯蔵酒

ID: kanbe-shiboritate-namachozo-catalog-v1

旧: ほのかな甘味が特徴。清涼感も楽しめます。

新: さらりとした口当たりです。ほのかな甘味があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.okm-grp.co.jp/product/4969333000506

### 404. 北鹿 秋田華匠 にごり酒

ID: hokushika-akita-kasho-nigori-catalog-v1

旧: 甘口の味わいがあり、すっきりした味わいも感じられます。

新: 甘口の味わいがあり、すっきりした味わいも感じられます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://item.rakuten.co.jp/lw-hana/113964/

### 405. 越乃八豊 おりがらみ

ID: koshino-happo-origarami-catalog-v1

旧: 華やかな香りがあり、やや辛口の味わいも感じられます。

新: 香りは華やかです。やや辛口の味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/echigo/113006/

### 406. 末廣 山廃純米吟醸

ID: suehiro-yamahai-junmai-ginjo-catalog-v1

旧: 瑞々しい吟醸香が特徴。柔らかな米の旨味も楽しめます。

新: 瑞々しい吟醸香です。柔らかな米の旨味があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/hamadaya/1907041824/

### 407. 開春 生酛山口 純米原酒 火入れ

ID: kaishun-kimoto-yamaguchi-hiire-genshu-catalog-v1

旧: 純米酒です。

新: （味わい情報は保留。中立の参照案内のみ表示）

判定: HELD_NO_SOURCE / LOW

理由: 公式・既存専門店・当該楽天ページで商品単位の具体的な香味根拠が不足。分類やスペックから創作せず案内文に縮退。

根拠: 採用可能な官能情報なし

### 408. うとうと 純米酒

ID: utouto-junmai-catalog-v1

旧: 淡麗な味わいが特徴。米の甘味も楽しめます。

新: 味わいは淡麗です。米の甘味があります。後味はすっきりしています。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.yuumeikan.com/product/19

### 409. きらい 銀 純米大吟醸

ID: kirai-gin-junmai-daiginjo-180-catalog-v1

旧: 上品な香りと、やさしい口当たりを楽しめる一本。

新: 上品な香りで、やさしい口当たりです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://gin-sato.jp/smp/item/kirai-gin.html

### 410. 桂月 超辛口 特別純米酒60

ID: keigetsu-extra-dry-tokubetsu-junmai60-catalog-v1

旧: 米の旨味とふくらみが特徴の酒。

新: ふくらみがあります。米の旨味とすっきり辛口が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.keigetsu.co.jp/products/p_karakuchi60

### 411. 八鶴 純米吟醸

ID: hachitsuru-junmai-ginjo-catalog-v1

旧: 上品な香りを楽しめます。ふくよかな旨味も、このお酒の特徴です。

新: 上品な香りです。ふくよかな旨味があります。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/cepdor/hatiturujyunnmai/

### 412. 咲耶美 純米吟醸 直汲生原酒 14号酵母 R7BY

ID: sakuyabi14-junmai-ginjo-jikagumi-r7by-catalog-v1

旧: メロンを思わせる果実の香りと、フレッシュな味わいを楽しめる一本。

新: メロンを思わせる果実の香りで、フレッシュな味わいです。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://yoshouten.com/?pid=142192908

### 413. 利根川育ち 純米吟醸

ID: tonegawa-sodachi-junmai-ginjo-catalog-v1

旧: 香りを感じる一本。まろやかな味も楽しめます。

新: 香りを感じる一本。まろやかな味も楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://item.rakuten.co.jp/heartful/tonegawa-1800/

### 414. 五人娘 純米酒

ID: gonin-musume-junmai-catalog-v1

旧: 旨味が特徴。酸味も楽しめます。

新: 旨味とやわらかな米の甘味と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.teradahonke.co.jp/c/all/sake/gd18

### 415. 盛升 特別純米酒

ID: sakari-masu-tokubetsu-junmai-catalog-v1

旧: 米の旨味とキレが特徴の酒。

新: 米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.koganeishuzou.com/esp/prd1012.html

### 416. 北雪 越淡麗 光 遠心分離 純米大吟醸

ID: hokusetsu-hikari-centrifuge-junmai-daiginjo-catalog-v1

旧: 華やかな香りと、ふくらみを楽しめる一本。

新: 香りは華やかで、ふくらみがあります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://sake-hokusetsu.com//enshinbunri/

### 417. 純米辛口 姨捨正宗

ID: obasute-masamune-junmai-karakuchi-catalog-v1

旧: 米の旨味と軽快な味わいが特徴の酒。

新: 軽快な飲み心地です。米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.obasute.co.jp/?p=1942

### 418. 純米大吟醸 笑いじょうご

ID: waraijogo-junmai-daiginjo-catalog-v1

旧: 上品な香りと、やわらかな米の旨味を楽しめる一本。

新: 上品な香りです。やわらかな米の旨味とやや辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://nikishuzou.official.ec/items/114813084

### 419. 純米大吟醸 八海山

ID: hakkaisan-jd-lineup-v1

旧: 上品な甘味と、キレを楽しめる一本。

新: 透明感のある飲み心地です。上品な甘味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hakkaisan.co.jp/sake/junmaidaiginjo45/

### 420. 大吟醸 八海山

ID: hakkaisan-daiginjo-lineup-v1

旧: まろやかな味わいが特徴。上品な甘味も楽しめます。

新: 口に含むとまろやかです。上品な甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hakkaisan.co.jp/sake/daiginjo45/

### 421. 清酒 八海山

ID: hakkaisan-seishu-lineup-v1

旧: 淡麗な味わいが特徴の一本。

新: 淡麗な味わいが特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hakkaisan.co.jp/sake/regular/

### 422. 真澄 漆黒 KURO

ID: masumi-kuro-lineup-v1

旧: 旨味と酸味が特徴の酒。

新: 旨味と淡麗辛口と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.masumi.co.jp/product/kuro

### 423. 真澄 白妙 SHIRO

ID: masumi-shiro-lineup-v1

旧: 米の旨味があり、軽快な味わいも感じられます。

新: 軽快な飲み心地です。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.masumi.co.jp/product/shiro

### 424. 真澄 茅色 KAYA

ID: masumi-kaya-lineup-v1

旧: 米の旨味が特徴。酸味も楽しめます。

新: 米の旨味と酸味が感じられます。丸みのある余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.masumi.co.jp/product/kaya

### 425. 一ノ蔵 無鑑査本醸造 辛口

ID: ichinokura-mukansa-karakuchi-lineup-v1

旧: 穏やかな香りと、すっきりした後味を楽しめる一本。

新: 香りは穏やかです。後味はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ec.ichinokura.co.jp/products/mukansakara

### 426. 一ノ蔵 無鑑査本醸造 超辛口

ID: ichinokura-mukansa-chokarakuchi-lineup-v1

旧: 超辛口の味わいがあり、キレも感じられます。

新: 超辛口の味わいです。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ec.ichinokura.co.jp/products/mukansachoukara

### 427. 一ノ蔵 ひめぜん

ID: ichinokura-himezen-lineup-v1

旧: 爽やかな酸味と極甘口が特徴の酒。

新: やわらかな甘味と爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ec.ichinokura.co.jp/products/himezen

### 428. からくち 浦霞

ID: urakasumi-karakuchi-lineup-v1

旧: ほのかな香りと、辛口の味わいを楽しめる一本。

新: ほのかな香りです。味わいは辛口です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.urakasumi.com/items/karakuchi/

### 429. 大七 皆伝

ID: daishichi-kaiden-lineup-v1

旧: 熟成感が特徴の一本。

新: 熟成感が特徴の一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.daishichi.com/sake/kaiden.html

### 430. 大七 箕輪門

ID: daishichi-minowamon-lineup-v1

旧: 芳しい香りがあり、すっきりした味わいも感じられます。

新: 芳しい香りで、なめらかな飲み心地です。後口はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.daishichi.com/sake/minowamon.html

### 431. 出羽桜 一耕

ID: dewazakura-ichiko-lineup-v1

旧: 米の旨味を感じる一本。まろやかな味わいも楽しめます。

新: 口に含むとまろやかです。米の旨味と爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.dewazakura.co.jp/item/cat06/ikko.html

### 432. 出羽桜 つや姫

ID: dewazakura-tsuyahime-lineup-v1

旧: 果実の香り（洋梨のような香り）を感じる一本。上品な甘味も楽しめます。

新: 洋梨のような香りです。上品な甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.dewazakura.co.jp/item/cat04/tuyahime.html

### 433. 一ノ蔵 発泡清酒 すず音

ID: ichinokura-suzune-lineup-v1

旧: やわらかな甘酸っぱさと、米のやさしい味わいを楽しめる一本。

新: やわらかな甘酸っぱさと、米のやさしい味わいを楽しめる一本。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://ec.ichinokura.co.jp/products/suzune

### 434. 本仕込 浦霞

ID: urakasumi-honshikomi-lineup-v1

旧: 爽やかな香りがあり、さっぱりした後味も感じられます。

新: 爽やかな香りがあり、さっぱりした後味も感じられます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.urakasumi.com/items/honjikomi/

### 435. 菊水の辛口

ID: kikusui-karakuchi-lineup-v1

旧: 旨味を感じる一本。辛口の味わいも楽しめます。

新: 旨味と辛口の味わいが感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kikusui-sake.com/home/jp/products/p005/

### 436. 菊水の純米酒

ID: kikusui-junmai-lineup-v1

旧: 米の旨味があり、酸味も感じられます。

新: コクがあります。米の旨味と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://kikusui-sake.com/home/jp/products/p006/

### 437. 酔鯨 純米吟醸 吟麗

ID: suigei-ginrei-lineup-v1

旧: 吟醸香が特徴。旨味も楽しめます。

新: 旨味を感じます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://suigei.co.jp/collection/558.html

### 438. 酔鯨 純米吟醸 高育54号

ID: suigei-koiku54-lineup-v1

旧: ほのかな吟醸香を楽しめます。米の旨味も、このお酒の特徴です。

新: 吟醸香はほのかです。米の旨味と柑橘系の酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://suigei.co.jp/collection/505.html

### 439. 天狗舞 旨醇

ID: tengumai-umajun-lineup-v1

旧: 旨味を楽しめます。酸味も、このお酒の特徴です。

新: 旨味と酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.tengumai.co.jp/products/junmai/133.html

### 440. 南部美人 純米吟醸

ID: nanbubijin-jg-lineup-v1

旧: 吟醸香と、やさしい甘味を楽しめる一本。

新: やさしい甘味があります。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nanbubijin.jp/shopdetail/000000000014/ct7/page1/price/

### 441. 南部美人 純米大吟醸

ID: nanbubijin-jd-lineup-v1

旧: 華やかな吟醸香を楽しめます。濃密な味わいも、このお酒の特徴です。

新: 華やかな吟醸香で、濃密な味わいです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.nanbubijin.jp/shopdetail/000000000002/ct6/page1/price/

### 442. 白鶴 大吟醸

ID: hakutsuru-daiginjo-lineup-v1

旧: りんごのような香りと、味わいの透明感を楽しめる一本。

新: りんごのような香りで、透明感のある飲み心地です。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hakutsuru.co.jp/product/sake/daiginjo/03836.html

### 443. 菊正宗 純米大吟醸 KAHO 嘉宝

ID: kikumasamune-kaho-lineup-v1

旧: コクが特徴。穏やかな酸味も楽しめます。

新: コクがあります。穏やかな酸味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kikumasamune.co.jp/products/kaho/

### 444. 加賀鳶 極寒純米 辛口

ID: kagatobi-gokkan-lineup-v1

旧: 米の旨味と、軽快な味わいを楽しめる一本。

新: 軽快な飲み心地です。米の旨味が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fukumitsuya.co.jp/sake/kagatobi/

### 445. 加賀鳶 山廃純米 超辛口

ID: kagatobi-yamahai-lineup-v1

旧: 酸味を感じる一本。超辛口の味わいも楽しめます。

新: 超辛口の味わいと酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fukumitsuya.co.jp/sake/kagatobi/

### 446. 黒帯 悠々 特別純米

ID: kuroobi-yuyu-lineup-v1

旧: 芳醇な旨味と辛口の味わいが特徴の酒。

新: 芳醇な旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fukumitsuya.co.jp/sake/kuroobi/

### 447. 奥の松 あだたら吟醸

ID: okunomatsu-adatara-lineup-v1

旧: バランスのとれた味を感じる一本。辛口の味わいも楽しめます。

新: バランスのとれた味を感じる一本。辛口の味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.okunomatsu.co.jp/product-page/ginjo11205 / https://item.rakuten.co.jp/ihei/21207/

### 448. 遊佐 純米吟醸

ID: okunomatsu-jg-lineup-v1

旧: 爽やかな香りと、旨味を楽しめる一本。

新: 爽やかな香りです。旨味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.okunomatsu.co.jp/product-page/yusa

### 449. 上善如水 純米大吟醸

ID: jozen-jd-lineup-v1

旧: 華やかな香りが特徴。味わいの深みも楽しめます。

新: 香りは華やかで、味わいに深みがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jozen.co.jp/top/items/item.asp?o=10808

### 450. 湊屋藤助 純米大吟醸

ID: minatoya-tosuke-lineup-v1

旧: 穏やかな香りとコクが特徴の酒。

新: 香りは穏やかで、コクがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jozen.co.jp/top/items/item.asp?o=10830

### 451. 濃醇 魚沼 純米

ID: uonuma-junmai-lineup-v1

旧: 穏やかな香りと米の旨味が特徴の酒。

新: 香りは穏やかで、濃厚な味わいです。米の旨味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jozen.co.jp/top/items/item.asp?o=10847

### 452. 大関 SWEET MOMENT 極上の甘口

ID: ozeki-gokuama-lineup-v1

旧: 穏やかな吟醸香とコクが特徴の酒。

新: 吟醸香は穏やかで、コクがあります。濃厚な甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ozeki.co.jp/product/nihonshu/sweetmomentgokuama/

### 453. 大関 上撰 辛丹波

ID: ozeki-karatanba-lineup-v1

旧: 旨味と淡麗辛口が特徴の酒。

新: 旨味と淡麗辛口が感じられます。後口にはキレがあります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ozeki.co.jp/product/nihonshu/karatanba_josen/

### 454. 月桂冠 にごり酒

ID: gekkeikan-nigori-lineup-v1

旧: フルーティーな香りを楽しめます。爽やかな酸味も、このお酒の特徴です。

新: フルーティーな香りです。やさしい甘味と爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.gekkeikan.co.jp/products/type06/nigori/

### 455. 松竹梅白壁蔵 澪

ID: mio-sparkling-lineup-v1

旧: 果実の香り（マスカットのような香り）が特徴。やさしい甘味も楽しめます。

新: マスカットのような香りです。やさしい甘味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.takarashuzo.co.jp/tkr-shohin/cmn_p_detail.php?p_prodid=3888

### 456. 純米吟醸 浦霞禅

ID: urakasumi-zen-lineup-v1

旧: 穏やかな果実香と旨味が特徴の酒。

新: 穏やかな果実香で、フレッシュな味わいです。旨味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.urakasumi.com/items/urakasumizen/

### 457. 賀茂鶴 純米吟醸 一滴入魂

ID: kamotsuru-jg-lineup-v1

旧: 穏やかな香りが特徴。やわらかな口当たりも楽しめます。

新: 香りは穏やかで、やわらかな口当たりです。酸味を感じます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://shop.kamotsuru.jp/SHOP/itteki720.html

### 458. 超特撰 惣花 純米大吟醸

ID: nihonsakari-daiginjo-lineup-v1

旧: 華やかな香りを楽しめます。ほのかな甘味も、このお酒の特徴です。

新: 香りは華やかです。ほのかな甘味があります。長い余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://ssl.nihonsakari.co.jp/souhana/

### 459. 東一 純米大吟醸

ID: azumaichi-jd-lineup-v1

旧: 果実の香りと柔らかな旨味が特徴の酒。

新: 果実の香りで、口に含むとまろやかです。柔らかな旨味があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://azumaichi.com/top/products/seishu/

### 460. 光栄菊 特別純米 清海 Sukai 火入れ

ID: koeigiku-sukai-hiire-current-v1

旧: 柑橘系の香りがあり、酸味も感じられます。

新: 柑橘系の香りです。酸味を感じます。後味はすっきりしています。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.hasegawasaketen.com/eshop/products/detail/17836

### 461. 万齢 特別純米 超辛口

ID: manrei-chokarakuchi-tokubetsu-junmai-current-v1

旧: 旨味と辛口の味わいが特徴の酒。

新: 旨味と辛口の味わいが感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.manrei.jp/nihonshu/

### 462. 基峰鶴 純米酒

ID: kihotsuru-junmai-current-v1

旧: やわらかな旨味を感じる一本。爽やかな酸味も楽しめます。

新: やわらかな旨味と爽やかな酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kihotsuru.com/%E7%B4%94%E7%B1%B3%E9%85%92

### 463. 松の寿 純米吟醸 雄町 無濾過 火入れ

ID: matsunokotobuki-omachi-hiire-current-v1

旧: 穏やかな香りが特徴。ふくらみのある旨味も楽しめます。

新: 香りは穏やかです。ふくらみのある旨味と軽快な酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.jizake.com/c/sake/matsui/ns460005m00

### 464. 黒部峡 純米吟醸55

ID: kurobekyo-junmai-ginjo55-current-v1

旧: 豊かな味わいを楽しめます。

新: 豊かな味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.hayashisyuzo.com/brand/

### 465. 福祝 山田錦50％磨き 純米吟醸

ID: fukuiwai-yamada50-junmai-ginjo-current-v1

旧: 吟醸香を楽しめます。淡麗辛口も、このお酒の特徴です。

新: 淡麗な辛口の味わいです。後口はすっきりしています。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/sake-makino/10008-09-8207-1/

### 466. 奥 十年低温熟成 純米吟醸原酒

ID: oku-ten-year-junmai-ginjo-genshu-current-v1

旧: 華やかな香りが特徴。まろやかな味わいも楽しめます。

新: 香りは華やかで、口に含むとまろやかです。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.sonnoh.co.jp/item/03165/

### 467. 大賀 純米吟醸 辛口 朝日米

ID: ohga-asahi-junmai-ginjo-current-v1

旧: 淡麗な味わいを感じる一本。辛口の味わいも楽しめます。

新: 味わいは淡麗です。味わいは辛口です。後口はすっきりしています。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.ogashuzo.com/brands/ohga/

### 468. 龍勢 無垢の系譜 -雄町-

ID: ryusei-muku-omachi-kimoto-current-v1

旧: 旨味と、力強い味わいを楽しめる一本。

新: 力強い味わいです。旨味と甘味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.fujiishuzou.com/products/muku

### 469. 亀萬 にごり原酒

ID: kameman-nigori-genshu-current-v1

旧: コクがあり、ほどよい酸味も感じられます。

新: コクがあります。米の甘味とほどよい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.kameman.co.jp/products/detail.php?product_id=89

### 470. 日置桜 特醸純米酒

ID: hiokizakura-tokujo-junmai-omachi-current-v1

旧: 黒糖を思わせる香りがあり、甘味も感じられます。

新: 黒糖を思わせる香りです。甘味があります。長い余韻があります。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://hiokizakura.jp/sake/sake_general

### 471. 信州亀齢 純米吟醸 稲倉の棚田産ひとごこち

ID: shinshu-kirei-inakura-hitogokochi-junmai-ginjo-current-v1

旧: 爽やかな香りを感じる一本。軽快な口当たりも楽しめます。

新: 爽やかな香りで、軽快な口当たりです。甘味と酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/sake-ichibun/10007456/

### 472. 亀泉 純米吟醸原酒 高育63号 ひやおろし

ID: kameizumi-kouiku63-hiyaoroshi-current-v1

旧: バナナやメロンのような香りとふくらみのある旨味が特徴の酒。

新: バナナやメロンのような香りです。ふくらみのある旨味があります。シャープなキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/kishuuitibanya/ns-225/

### 473. 十勝 特別純米 彗星

ID: tokachi-tokubetsu-junmai-suisei-current-v1

旧: キレを楽しめます。

新: キレを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://shop.kamikawa-taisetsu.co.jp/shopdetail/000000000311/

### 474. あべ シルバー 火入れ

ID: abe-silver-hiire-current-v1

旧: やさしい旨味と、軽やかな味わいを楽しめる一本。

新: 飲み心地は軽やかです。やさしい旨味とほどよい酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/e-wine/dw196/

### 475. 七本鎗 無農薬純米 無有 1800ml

ID: shichihonyari-muu-1800-current-v1

旧: 優しさと柔らかさのある味わいを楽しめます。

新: 優しさと柔らかさのある味わいを楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://7yari.co.jp/product/102/

### 476. 萩乃露 特別純米 十水仕込 雨垂れ石を穿つ 火入れ

ID: haginotsuyu-amadare-tomizu-hiire-current-v1

旧: 爽やかな味わいが特徴。濃密な味わいも楽しめます。

新: 爽やかな味わいが特徴。濃密な味わいも楽しめます。

判定: HELD_INSUFFICIENT_DETAIL / HIGH

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.haginotsuyu.co.jp/amadare

### 477. 花陽浴 純米大吟醸 越後五百万石 無濾過生原酒 1800ml

ID: hanaabi-gohyakumangoku-muroka-namagenshu-1800-current-v1

旧: 豊かな果実感のある香りを楽しめます。甘さは控えめも、このお酒の特徴です。

新: 豊かな果実感のある香りを楽しめます。甘さは控えめも、このお酒の特徴です。

判定: HELD_INSUFFICIENT_DETAIL / MEDIUM

理由: 固有の根拠はあるが、情報を増やせない一特徴・曖昧な質感・温度条件等を無理に言い換えない。現行文を維持。

根拠: https://www.sakenomy.jp/sake/TST0000042113/

### 478. 彩來 純米吟醸 生詰

ID: sara-junmai-ginjo-namazume-current-v1

旧: マスカットを思わせる吟醸香を楽しめます。米の甘味も、このお酒の特徴です。

新: マスカットを思わせる吟醸香と、米の甘味。酸が後口を引き締めます。

判定: REWRITTEN / MEDIUM

理由: 既存の値単位の根拠を読み合わせ、商品ごとに個別編集。

根拠: https://item.rakuten.co.jp/yamasake/5775/

### 479. みむろ杉 木桶菩提もと 自社田山田錦

ID: mimurosugi-kioke-bodaimoto-jishaden-current-v1

旧: 白桃のような柔らかな香りを感じる一本。じわりと広がる旨味も楽しめます。

新: 白桃のような柔らかな香りです。じわりと広がる旨味、力強い酸味が感じられます。長い余韻があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/bisyugakou/ms010-n72/

### 480. 田中六五 純米酒 火入れ 1800ml

ID: tanaka65-hiire-1800-current-v1

旧: 麹の穏やかな香りを感じる一本。しっかりとした旨味も楽しめます。

新: 麹の穏やかな香りで、味わいにはふくらみがあります。しっかりとした旨味、酸味が感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/hasegawasaketen/1008344/

### 481. shirakiku 特別純米 銀シャリ 火入れ

ID: shirakiku-ginshari-tokubetsu-junmai-current-v1

旧: 程よい酸味を楽しめます。辛口の味わいも、このお酒の特徴です。

新: 辛口の味わいと程よい酸味が感じられます。

判定: REWRITTEN / HIGH

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://sake-shirakiku.jp/products/silver

### 482. 神蔵 純米吟醸 野条穂 無濾過・無加水・生酒

ID: kagura-nojoho-junmai-ginjo-nama-current-v1

旧: 白ブドウやパイナップルのような香りがあり、米の旨味も感じられます。

新: 白ブドウやパイナップルのような香りです。米の旨味と辛口の味わいが感じられます。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/hoshigulf/4530731780033/

### 483. 栄光冨士 日乃輪 純米大吟醸 無濾過生原酒 2026

ID: eikofuji-hinowa-muroka-nama-2026-current-v1

旧: 華やかな香りと、滑らかな口当たりを楽しめる一本。

新: 香りは華やかで、滑らかな口当たりです。濃醇な米の甘味があります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://www.haruyama-sake.com/SHOP/YG090101072136.html

### 484. 車坂 山廃純米酒 秋あがり 2019BY

ID: kurumazaka-yamahai-akiagari-2019by-current-v1

旧: 円熟した旨味が特徴。キレも楽しめます。

新: 円熟した旨味と酸味が感じられます。後口にはキレがあります。

判定: REWRITTEN / MEDIUM

理由: 484件の原文・候補文を読み合わせたうえで、確認済みの香味語の正規化規則を適用。時間順序・酸の役割等を付け足さない。

根拠: https://item.rakuten.co.jp/kishuuitibanya/ns-604/
