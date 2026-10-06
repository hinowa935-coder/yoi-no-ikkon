import DiscoveryShell from "../components/DiscoveryShell.jsx";
import SakeSearch from "../components/SakeSearch.jsx";
export const metadata = { title: "日本酒を料理・産地・味わいから探す", alternates: { canonical: "/search" } };
export default function SearchPage() { return <DiscoveryShell><SakeSearch /></DiscoveryShell>; }
