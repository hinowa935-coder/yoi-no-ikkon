import DiscoveryShell from "../components/DiscoveryShell.jsx";
import FoodBrowser from "../components/FoodBrowser.jsx";
export const metadata = { title: "家庭料理から日本酒を探す", alternates: { canonical: "/food" } };
export default function FoodIndex() { return <DiscoveryShell><FoodBrowser /></DiscoveryShell>; }
