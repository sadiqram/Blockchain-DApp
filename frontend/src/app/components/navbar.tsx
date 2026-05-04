import Link from "next/link";
import { getFreeYoda, getYodaBalance } from "../utils/getYoda";
import { useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";


const links = [
  { href: "/", label: "Home" },
  { href: "/cards", label: "Cards" },
  { href: "/my-cards", label: "My Cards" },
  { href: "/marketplace", label: "Marketplace" },
  { href: "/auction", label: "Auction" },
];

export default function Navbar() {
    const handleGetYoda = async () => {
      const res = await getFreeYoda();

      if (res.success) {
        alert("YODA claimed!");
      } else {
        alert(res.error);
      }
    };
  const [balance, setBalance] = useState("0");
  const { account } = useWallet();

  useEffect(() => {
    if (!account) return;

    getYodaBalance(account).then(setBalance);
  }, [account]);
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* Logo */}
        <div className="text-black font-bold text-lg tracking-wide">
          Fantasy Pokemon NFT Cards
        </div>

        {/* Links */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-black hover:text-black transition-colors duration-200 group"
            >
              {link.label}

              {/* black underline animation */}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </div>
      <button
        onClick={handleGetYoda}
        className="border px-3 py-1 rounded hover:bg-gray-200 transition"
      >
        Get YODA
      </button>
      <p className="text-sm">{balance} YODA</p>
    </nav>
  );
}
