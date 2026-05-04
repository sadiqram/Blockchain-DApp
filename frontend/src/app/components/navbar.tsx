"use client";
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
    console.log("YODA ADDRESS:", process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS);
    console.log(
      "NFT ADDRESS:",
      process.env.NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS,
    );

    if (res.success && account) {
      const updated = await getYodaBalance(account);
      setBalance(updated);
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
          Fantasy Pokemon NFT
        </div>

        {/* Links */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-black transition-colors duration-200 group"
            >
              {link.label}

              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE (BALANCE + BUTTON) */}
        <div className="flex items-center gap-3">
          {/* YODA BALANCE */}
          <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-black shadow-sm">
            {balance} YODA
          </div>

          {/* GET YODA BUTTON */}
          <button
            onClick={handleGetYoda}
            className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-medium 
        hover:bg-gray-800 active:scale-95 transition-all duration-200 shadow-sm"
          >
            Get YODA
          </button>
        </div>
      </div>
    </nav>
  );
}
