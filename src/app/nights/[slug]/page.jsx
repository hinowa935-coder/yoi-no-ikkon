import { notFound } from "next/navigation";
import DiscoveryShell from "../../components/DiscoveryShell.jsx";
import DiscoveryFlow from "../../components/DiscoveryFlow.jsx";
import { daySeed, discoveryNights } from "../../../data/discovery.js";
export function generateStaticParams() { return discoveryNights.map(n => ({ slug: n.id })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const night = discoveryNights.find(n => n.id === slug);
  return night ? { title: `${night.name}の料理と日本酒`, description: night.description, alternates: { canonical: `/nights/${slug}` } } : {};
}
export default async function NightDiscovery({ params }) {
  const { slug } = await params;
  const night = discoveryNights.find(n => n.id === slug);
  if (!night) notFound();
  return <DiscoveryShell><DiscoveryFlow seed={daySeed()} initialNight={night.id} /></DiscoveryShell>;
}
