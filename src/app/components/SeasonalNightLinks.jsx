"use client";
import Link from 'next/link';
import {isNightInSeason} from '../../data/discoveryNights.js';
import useCurrentTokyoDay from './useCurrentTokyoDay.js';
export default function SeasonalNightLinks({nights,inline=false}){
  const day=useCurrentTokyoDay();
  const visible=day?nights.filter(n=>isNightInSeason(n.id,day)).slice(0,3):[];
  return <span className={inline?undefined:'night-inline'}>{visible.map(n=><Link key={n.id} className={inline?undefined:'yoi-button'} href={inline?`/discover?night=${n.id}`:`/nights/${n.id}`}>{n.name}{inline?' ':' →'}</Link>)}</span>;
}
