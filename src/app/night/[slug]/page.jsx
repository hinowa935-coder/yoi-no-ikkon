import { notFound } from "next/navigation";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import DiscoveryFlow from "../../components/DiscoveryFlow.jsx";
import DiscoveryQueryFlow from '../../components/DiscoveryQueryFlow.jsx';
import {Suspense} from 'react';
import { getNightBySlug, getNightOptions, getNightMoodEntry, toPathSegment } from "../../../data/siteData.js";
import { daySeed } from "../../../data/discovery.js";
export function generateStaticParams() { return getNightOptions().map(name => ({ slug: toPathSegment(name) })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const night = getNightBySlug(slug);
  return night ? { title: `${getNightMoodEntry(night.name)?.label || night.name}の日本酒と料理`, alternates: { canonical: `/night/${slug}` } } : {};
}
export default async function LegacyNightPage({ params }) {
  const { slug } = await params;
  const night = getNightBySlug(slug);
  if (!night) notFound();
  const label = getNightMoodEntry(night.name)?.label || night.name;
  const id = /雨/.test(label) ? "rain" : /寒|燗|ぬくもり/.test(label) ? "cold" : /贅沢|褒美/.test(label) ? "treat" : /ひとり|静|謐/.test(label) ? "quiet" : /誰か|語らい/.test(label) ? "together" : /軽く|ひと息/.test(label) ? "just-one" : /しっかり/.test(label) ? "dinner" : /疲れ|仕事/.test(label) ? "after-work" : "ordinary";
  const seed = daySeed();
  return <DiscoveryShell><p className="legacy-night-note">{label}から、今夜の食卓へ。</p><Suspense fallback={<DiscoveryFlow seed={seed} initialNight={id} />}><DiscoveryQueryFlow seed={seed} initialNight={id} /></Suspense></DiscoveryShell>;
}
