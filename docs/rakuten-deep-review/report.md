# 残140 fallback 全件深掘り再審査

確認日: 2026-10-16T14:13:26.539Z
開始コミット: 2b07470051f47887c7778ab14af3a02d73755fc6
公開先: https://yoi-no-ikkon.vercel.app/

## 結論

140登録を再探索・分類し、25件の同一商品を回収、銀盤1件を同銘柄の別商品へ新IDで置換。492件・46都道府県を維持。直リンク352→378、正式画像344→370、検索fallback140→114。既存352リンク・344画像と、差し替え以外の491商品はオブジェクト同値検査で保護した。

**ローカルQA完了。本番デプロイ・本番QAは未完了で、作業は継続中。**

未回収114件を同定済み・調査完璧と扱っていない。74件は商品/現行版/公式対応等が未解決、37件は別仕様・容量・売り切れ等のため掲載を維持、3件は今回検索範囲で有効な単品候補を確認できなかった。ブランド不存在・終売の断定は0件。

## 29項目の報告

|項目|結果|
|---|---|
|1 開始fallback|140|
|2 exact SKU回収|25。公開モデルは購入案内用COMMERCIAL_MATCH。VerifiedのEXACT認定・既存仕様の書換えではない|
|3 別店舗回収|12。前回availability-reviewの最初の確認店舗と今回採用店舗が異なる同一商品。前回売り切れからの救済という限定定義は0|
|4 同銘柄商品候補あり|132登録。飲料/単品候補レベルで、同一SKU・在庫・公式同定が確認済みという意味ではない|
|5 同銘柄差し替え候補|公開条件を満たした正式案1。機械抽出の代替候補台帳は131登録だが、同一SKU未確認候補も含み、承認済み案には数えない|
|6 同銘柄差し替え実施|1: 銀盤米の芯原酒→銀盤超特撰米の芯|
|7 同蔵差し替え候補|検索上の暫定候補49登録。正式な差し替え承認案0。蔵元表記・公式商品・重複/役割の確定が残るため実績へ加算しない|
|8 同蔵差し替え実施|0|
|9 後継商品確認|0。公式の後継指定なしに名称の近さを後継と解釈しない|
|10 終売公式確認|対象140件について0|
|11 公式確認不足|43登録にOFFICIAL_CONFIRMATION_NEEDED。公式等のページ取得117登録はSKU確認数ではない|
|12 最終直リンク|378 / 492 (76.83%)|
|13 最終画像|370 / 492 (75.20%)|
|14 最終fallback|114|
|15 画像なし直リンク|8、従来の8件を維持。今回追加分は26件とも正式画像あり|
|16 屋守|登録純米吟醸無調整生を別店舗で回収。直汲み・中取り・火入れ・雄町を区別。yamori-review.md参照|
|17 未回収理由|UNRESOLVED 74 / KEEP_EXISTING_FALLBACK 37 / NO_VALID_CANDIDATE 3。各商品の具体的理由はreview-140.csvとaudit.json|
|18 archive|今回1件。旧ginban-i4si9dの固有ページ・お気に入りを保持、自動redirect/別商品へのalias・お気に入り移行なし|
|19 Amazon|新商品の独立した通常検索語へ更新。正式Associates扱いしない|
|20 蔵元リンク|新商品の公式情報URLを設定。個別購入ページと確定できないためmerchant購入先はnull/typeE、情報ページをEC扱いしない|
|21 推薦再評価|新商品の公式味わいと新規編集ペアリングで評価。温度不明は[]、公式料理は[]。旧原酒の仕様・料理・夜はコピーしない。全夜/料理方向の推薦回帰テスト成功|
|22 tests|73成功、0失敗|
|23 typecheck|成功|
|24 lint|既存99ファイル構文・競合・公開debug検査成功。ESLintではない|
|25 build|Next.js16.3.8 Webpack成功。1161生成タスク、1159HTML。既知Turbopack調査・依存更新なし|
|26 secret scan|7154ファイル時点で漏出0、読み取り失敗0。公開直前も再確認。npm audit全区分0|
|27 production deploy|未実施（作業継続中） |
|28 production QA|未実施（作業継続中）|
|29 残課題|114件の同定・版・単品販売対応、従来の画像なし8件、実機iPhone/PWAは今回未検証。WebKit検証と実機検証を混同しない|

## 調査範囲と限界

全140件に銘柄レベル検索を実行。商品名、銘柄、蔵元＋銘柄、使用米・製法・容量語を使い、雑貨等で埋まる検索には日本酒指定・蔵元単独・王祿/王禄等の表記揺れを補完。専用キャッシュ713検索、初回683 APIリクエスト＋追加30、約9174商品候補（登録間重複あり）。初回の実測最小間隔1150ms、追加も同じ1150msリミッター。認証情報・API返却の私有tracking URL・価格・画像原本ファイルは公開成果物に含めていない。

各検索はAPIの上位30件/第1ページ。楽天全店舗・全BYを網羅した在庫調査ではない。0件、HTTP失敗、銘柄候補あり、公式SKU確認、販売可能性を別状態として保存。検索順位・タイトル類似・既存の審査履歴の有無だけで採用していない。

公式の本文だけでは仙禽の商品仕様を読めなかったため、現行公式サイトにリンクされた画像資料も目視した。2024というファイル名を2026BYの証拠にはしていない。モダン壱式/レトロ壱式は火入れ版が記載される一方、クラシックのオリガラミ・ナチュール2026は未解決のまま維持した。

三次元の分類（A〜F、最終処理状態、source確認状態）を混同しない。A=25,B=62,C=1,D=5,E=44,F=3。B〜Fは公開承認を意味しない。

## 新たに反映する26件

|商品|処理|購入案内容量|楽天通常URL|
|---|---|---|---|
|屋守 純米吟醸 無調整 生|EXACT_RECOVERED|1800ml|https://item.rakuten.co.jp/jizake-watanabe/10009025/|
|純米東長|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/cocodecow/r889jz/|
|kikunotsukasa innocent 40|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/likaman/017799/|
|太冠 吟醸純米|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/fn-plaza/taikan-4-0224/|
|瑞穂黒松剣菱|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/okawa-shop/4900892015211-1/|
|和香牡丹 八蝶 山田錦|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/kinko/264651/|
|日日 秋津山田錦|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/meishu-honpo/59855/|
|車坂 純米酒|EXACT_RECOVERED|1800ml|https://item.rakuten.co.jp/auc-yumeikan/2573/|
|しぜんしゅ 純米原酒|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/azumazuru/1091464/|
|澤屋まつもと 守破離 五百万石|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/meishu-honpo/49961/|
|刈穂 山廃純米超辛口|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/omiyageakita/4970916430429/|
|大信州 手の内 生詰|EXACT_RECOVERED|1800ml|https://item.rakuten.co.jp/b-miyoshi/dai-tenouti1800/|
|六十餘洲 にごり酒|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/sake-aoihonten/im-200134/|
|和香牡丹 八蝶 ヒノヒカリ|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/kinko/264648/|
|黒兜 Green Label 純米吟醸|EXACT_RECOVERED|1800ml|https://item.rakuten.co.jp/m-sakaya/10721121/|
|美冨久 山廃純米吟醸 いぎん純聖|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/mifuku-shop/117/|
|帝松 吟醸出世酒 社長の酒|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/maruhiro-dep/751-6-0029/|
|御前酒 純米吟醸 如意山 雄町|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/gozenshu/400002/|
|風の森 秋津穂657|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/ono-sake/131791/|
|あらごしゆず|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/umenoyado/10000000/|
|黄桜 生もと山廃 特別純米酒 山田錦|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/a-price/4901410019346/|
|稲とアガベ DOBUROKU 6号酵母|EXACT_RECOVERED|500ml|https://item.rakuten.co.jp/sake-mie/inetodobu6-500/|
|金婚 純米吟醸 江戸酒王子|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/otoshuclub/8502157/|
|仙禽 モダン 壱式（火入れ）|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/e-wine/cw025/|
|仙禽 レトロ 壱式（火入れ）|EXACT_RECOVERED|720ml|https://item.rakuten.co.jp/yamasake/8129/|
|銀盤 超特撰 米の芯|SAME_BRAND_REPLACED|720ml|https://item.rakuten.co.jp/toyamanojizakeya/10000011/|

楽天通常URLと正式アフィリエイトURLは区別。正式ツールの画像のみ240/80原本をそのまま保持し、画像と購入先の商品・itemCode・容量を同一にした。画像コピー・再ホスト・画像URL加工なし。

## 銀盤の差し替え

旧: ginban-i4si9d / 銀盤純米大吟醸米の芯原酒（17%）
新: ginban-chotokusen-komenoshin-standard-v1 / 銀盤超特撰米の芯（16%）
公式: https://ginban.co.jp/archives/products_category/cat01

同じ公式ページで別々に掲載されるため、度数だけの季節差として同一商品へ統合していない。新商品は山田錦35%、16%、日本酒度+5、酸度1.0、アミノ酸1.0、低温貯蔵-2〜-5℃を商品欄から独立して記録。非公開の原酒/生/火入れ/飲用温度/熟成年数は補完しない。芳醇なふくみ香・まろやかさ・淡麗辛口に基づく新紹介文と、冷奴・焼き魚・湯豆腐の新規編集提案を作成。公式料理とは区別。

## 採用しなかった代表例

- 屋守直汲み・雄町・火入れ: 登録の八反錦純米吟醸生とは別仕様。通常純米中取りも別分類。
- 不動: 総の舞と公式美山錦を区別。美山錦候補も旧形式ページで複数商品が並ぶため単品宛先未確定。正式画像が取れても未公開。
- 太冠風林火山: 別名称。別候補のタイトル雄町/本文山田錦という内部矛盾も除外。
- 冬の月等の予約商品: API在庫フラグだけを現在出荷可能の証拠にしない。
- 王祿・今小町・LIBROM: 今回の検索で有効な楽天単品候補未確認。ブランド自体の不存在や終売を意味しない。

## リンク・画像・安全性

正式26リンクのPC/スマホUser-Agent計52遷移はHTTP200で同じ個別URL。楽天モバイルHTMLはPC用購入JSONを含まないため「JSON未取得=売り切れ」と誤判定しない。PCの同一itemIdの販売状態＋モバイルの同一宛先/商品タイトルを組み合わせ、モバイル在庫解析の未確認はそのまま記録。車坂は旧形式でも単品商品番号2573と唯一の有効購入ボタンをブラウザで確認。購入・カート操作はしていない。

画像全件の新規HEAD確認: 370/370、未確認0。全件完了。追加26件は240/80両方の配信応答を確認。CSPの許可ホストを増やさず、既存のhbbとthumbnail配信を使用。広告表記・楽天/Amazon/蔵元の順序・fallback・Analytics・PWA・About・トップUIは未変更。

ローカル画像/購入/保存/Archive確認66項目、既存導線58項目。WebKit390/375/320およびChromium1280。内部リンク19353、破損0。実機PWA・AdGuardあり環境の今回の再確認はしていない。

## 主要公式出典

- 屋守: https://shop.kanda-toshimaya.co.jp/shop/products/OKN-JG-NAMA-1800
- 銀盤: https://ginban.co.jp/archives/products_category/cat01
- 車坂: https://nihonsyu-nihonjyou.co.jp/sake/kurumazaka/
- しぜんしゅ: https://niida1711.shop/items/5b0ce9a150bbc3461c001548
- 仙禽: https://www.senkin.co.jp/ およびimg_pr_modern_2024.jpg/img_pr_retro_2024.jpg（画像欄）
- 菊の司: https://kikunotsukasa.jp/innocent/
- 八蝶山田錦: https://www.sanwa-shurui.co.jp/factory/karashima/product/154.html
- 守破離: https://matsumotoshuzo.com/sawaya/shuhari-gohyakumangoku-720ml/

全商品別の公式・その他出典・取得状態・照合理由はaudit.json。小売/公的資料を公式に見せかけないようofficialSourcesとotherSourcesを分離。HTTP200やページ取得だけをSKU検証済みとは扱わない。
