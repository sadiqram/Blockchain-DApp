import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex gap-4 p-4 bg-black text-white">
      <Link href="/">Home</Link>
      <Link href="/cards">Cards</Link>
      <Link href="/my-cards">My Cards</Link>
      <Link href="/marketplace">Marketplace</Link>
      <Link href="/auction">Auction</Link>
    </div>
  );
}
