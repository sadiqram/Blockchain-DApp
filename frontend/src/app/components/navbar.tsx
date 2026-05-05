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
  const { account } = useWallet();
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(false);

  // -----------------------------
  // SAFE BALANCE FETCH 
  // -----------------------------
  useEffect(() => {
    if (!account) return;

    let cancelled = false;

    const fetchBalance = async () => {
      try {
        const bal = await getYodaBalance(account);
        if (!cancelled) setBalance(bal);
      } catch (e) {
        console.error(e);
      }
    };

    fetchBalance();

    //  DO NOT poll aggressively
    const interval = setInterval(fetchBalance, 15000); // every 15s

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [account]);

  // -----------------------------
  // GET YODA BUTTON
  // -----------------------------
  const handleGetYoda = async () => {
    try {
      setLoading(true);

      const res = await getFreeYoda();

      if (!res.success) {
        alert(res.error);
        return;
      }

      // refresh balance AFTER claim
      if (account) {
        const updated = await getYodaBalance(account);
        setBalance(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        {/* LOGO */}
        <div className="text-black font-bold text-lg tracking-wide">
          Fantasy Pokemon NFT
        </div>

        {/* LINKS */}
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative text-black group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-black transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">
          {/* BALANCE */}
          <div className="px-3 py-1 rounded-full bg-gray-100 text-sm font-medium text-black shadow-sm">
            {balance} YODA
          </div>

          {/* BUTTON */}
          <button
            onClick={handleGetYoda}
            disabled={loading}
            className="px-4 py-1.5 rounded-full bg-black text-white text-sm font-medium 
            hover:bg-gray-800 active:scale-95 transition disabled:opacity-50"
          >
            {loading ? "Claiming..." : "Get YODA"}
          </button>
        </div>
      </div>
    </nav>
  );
}
