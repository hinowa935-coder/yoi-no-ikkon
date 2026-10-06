import Link from "next/link";

export default function PairingPending() {
  return <p className="muted-copy">このお酒の料理提案は準備中です。<Link className="text-link" href="/food">家庭料理から探す →</Link></p>;
}
