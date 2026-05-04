"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { getWriteContract } from "../contract";

export default function Mint() {
  const { account, isConnected, connectWallet } = useWallet();

  const [name, setName] = useState("");
  const [attack, setAttack] = useState("50");
  const [defense, setDefense] = useState("50");
  const [hp, setHp] = useState("100");
  const [rarity, setRarity] = useState("1");
  const [shiny, setShiny] = useState(false);
  const [status, setStatus] = useState("");

  const handleMint = async () => {
    if (!account) return;

    try {
      setStatus("Minting...");

      const contract = await getWriteContract();

      const tx = await contract.mintCard(
        account,
        name,
        BigInt(attack),
        BigInt(defense),
        BigInt(hp),
        Number(rarity),
        shiny,
      );

      await tx.wait();
      setStatus("✨ Mint successful!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Mint failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-100 to-gray-200 flex flex-col">
      {/* NAV */}
      <div className="p-6">
        <Link href="/" className="text-black underline hover:opacity-70">
          ← Home
        </Link>
      </div>

      {/* TITLE */}
      <h1 className="text-5xl text-center font-extrabold mb-8 text-black">
        Mint Your NFT
      </h1>

      {/* WALLET */}
      {!isConnected && (
        <div className="flex justify-center mb-6">
          <button
            onClick={connectWallet}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {/* FORM CARD */}
      <div className="flex justify-center px-4">
        <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-6 space-y-4 border border-gray-200">
          {/* INPUTS */}
          <div className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Name
              </label>
              <input
                className="w-full px-4 py-2 rounded-lg border text-black focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="e.g. Charizard"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* GRID INPUTS */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attack
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border text-black focus:ring-2 focus:ring-black"
                  value={attack}
                  onChange={(e) => setAttack(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Defense
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border text-black focus:ring-2 focus:ring-black"
                  value={defense}
                  onChange={(e) => setDefense(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  HP
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border text-black focus:ring-2 focus:ring-black"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rarity
                </label>
                <input
                  className="w-full px-3 py-2 rounded-lg border text-black focus:ring-2 focus:ring-black"
                  value={rarity}
                  onChange={(e) => setRarity(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* SHINY TOGGLE */}
          <label className="flex items-center gap-2 text-black">
            <input
              type="checkbox"
              checked={shiny}
              onChange={(e) => setShiny(e.target.checked)}
            />
            ✨ Shiny Variant
          </label>

          {/* MINT BUTTON */}
          <button
            onClick={handleMint}
            className="w-full bg-black text-white py-3 rounded-xl hover:scale-[1.02] transition transform font-semibold"
          >
            Mint Card
          </button>

          {/* STATUS */}
          {status && (
            <p className="text-center text-sm text-gray-600">{status}</p>
          )}
        </div>
      </div>
    </div>
  );
}
