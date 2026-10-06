"use client";
import Link from "next/link";
import { visibleSakePairings } from "../../data/siteData.js";
import { resolveFavorite } from "../../data/favoriteReferences.js";
import { useFavorites } from "./Ochoko.jsx";
import { SearchCard } from "./SakeSearch.jsx";
export default function OchokoList() {
  const { ids, ready, toggle } = useFavorites();
  const active = visibleSakePairings.filter(item => ids.includes(item.id));
  const archived = ids.filter(id => !visibleSakePairings.some(item => item.id === id));
  return <section className="ochoko-page"><p className="section-kicker">気になる一献を、また今度。</p><h1>わたしのおちょこ</h1><p className="muted-copy">{active.length}商品を入れています。</p><Link href="/discover" className="text-link">今夜の料理から選び直す →</Link>{!ready && <p role="status">おちょこを開いています。</p>}{ready && ids.length === 0 && <div className="empty-state"><p>出会ったお酒を、ここに置いておけます。</p><Link href="/discover" className="yoi-button">今夜の気分から探す →</Link></div>}<div className="search-result-grid">{active.map(item => <SearchCard key={item.id} item={item} />)}</div>{archived.length > 0 && <section className="archived-favorites"><h2>以前おちょこに入れたお酒</h2><p className="muted-copy">今の一覧にはないお酒も、保存はそのまま残しています。</p><ul>{archived.map(id => { const ref = resolveFavorite(id); return <li key={id}>{ref.status !== "unknown" ? <Link href={`/sake/${id}`}>{ref.archivedName}</Link> : <span>以前保存したお酒</span>}<button type="button" className="text-link" onClick={() => toggle(id)}>おちょこから外す</button></li>; })}</ul></section>}</section>;
}
