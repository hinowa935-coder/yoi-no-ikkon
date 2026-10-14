'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {sakeDiscoveryContext} from '../../data/discoveryContext.js';
export default function SakeDiscoveryContext({item,placement='top',fallback=null}) {
  const query=useSearchParams();
  const context=sakeDiscoveryContext(query,item);
  if(!context)return fallback;
  if(placement==='pairing')return <><h2 id="sake-pairings">{context.dishName}に合わせて選んだ一献</h2><p>{context.reason}</p><small>宵の一献の提案</small><p className="muted-copy">ほかの料理との楽しみ方</p></>;
  return <aside className="discovery-context" aria-label="選んだ料理と夜"><p>{context.dishName}に合わせて選んだ一献</p><p className="muted-copy">{context.nightName}</p><p>{context.reason}</p><Link className="text-link" href={context.returnHref}>おすすめの三本へ戻る →</Link></aside>;
}
