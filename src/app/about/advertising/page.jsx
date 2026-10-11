import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import { commerceDisclosureState } from "../../../commerce/server.js";
import { AMAZON_DISCLOSURE } from "../../../commerce/providers.js";

export const metadata = { title: "運営・広告について", description: "宵の一献の商品紹介と広告掲載の方針。", alternates: { canonical: "/about/advertising" } };
export default function AdvertisingPage() {
  const state = commerceDisclosureState();
  return <DiscoveryShell>
    <section className="sake-detail-hero"><h1>運営・広告について</h1><p className="sake-detail-intro">食卓から、日本酒との出会いを。</p></section>
    <section className="detail-band"><h2>商品紹介と購入先</h2><p>宵の一献は、日本酒と家庭料理の組み合わせを紹介するサイトです。商品の販売や注文の受付は行っていません。</p>
      <p>{state.active ? "当サイトにはアフィリエイトリンクが含まれます。リンクを通じた購入により、運営者に紹介料が入る場合があります。" : "現在、アフィリエイトリンクは掲載していません。今後掲載する場合は、購入先のリンク付近に広告であることを表示します。"}</p>
      {state.amazon && <p>{AMAZON_DISCLOSURE}</p>}
      <p>紹介料のために当サイトが商品価格へ料金を上乗せすることはありません。実際の販売価格・送料・割引は購入先の条件によります。</p>
    </section>
    <section className="detail-band"><h2>購入前にご確認ください</h2><p>価格・在庫・容量・製造年度・商品仕様は、リンク先の商品情報で最終確認をお願いします。画像と実際のラベルが異なる場合もあります。</p><p>お酒は20歳になってから。20歳未満の方の飲酒は法律で禁止されています。</p></section>
    <section className="detail-band"><h2>紹介内容について</h2><p>商品情報は蔵元や商品資料をもとに掲載しています。料理との組み合わせには、宵の一献による提案も含まれます。蔵元の紹介とは区別して表示しています。</p></section>
  </DiscoveryShell>;
}
