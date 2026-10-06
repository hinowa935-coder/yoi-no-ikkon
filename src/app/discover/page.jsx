import DiscoveryShell from "../components/DiscoveryShell.jsx";
import { Suspense } from "react";
import DiscoveryQueryFlow from "../components/DiscoveryQueryFlow.jsx";
import DiscoveryFlow from "../components/DiscoveryFlow.jsx";
import { daySeed } from "../../data/discovery.js";
export const metadata = { title: "今夜の気分から、料理と日本酒を探す", alternates: { canonical: "/discover" } };
export default function DiscoverPage() {
  const seed = daySeed();
  return <DiscoveryShell><Suspense fallback={<DiscoveryFlow seed={seed} />}><DiscoveryQueryFlow seed={seed} /></Suspense></DiscoveryShell>;
}
