import DiscoveryShell from "../components/DiscoveryShell.jsx";
import OchokoList from "../components/OchokoList.jsx";
export const metadata = { title: "わたしのおちょこ", robots: { index: false }, alternates: { canonical: "/ochoko" } };
export default function OchokoPage() { return <DiscoveryShell><OchokoList /></DiscoveryShell>; }
