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
      setStatus("Mint successful");
    } catch (err) {
      console.error(err);
      setStatus("Mint failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <Link href="/">Home</Link>
      </div>
      <h1 className="text-5xl text-center font-bold mb-8">Mint</h1>
      {!isConnected ? (
        <div className="flex justify-center">
          <button
            onClick={connectWallet}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Connect Wallet
          </button>
        </div>
      ) : null}
      <div className="flex flex-col items-center gap-3">
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Attack"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
        />
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Defense"
          value={defense}
          onChange={(e) => setDefense(e.target.value)}
        />
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="HP"
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Rarity (0-255)"
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
        />
        <label className="text-black">
          <input
            type="checkbox"
            checked={shiny}
            onChange={(e) => setShiny(e.target.checked)}
            className="mr-2"
          />
          Shiny
        </label>
        <button
          onClick={handleMint}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          Mint Card
        </button>
        {status ? <p className="text-sm text-gray-700">{status}</p> : null}
      </div>
    </div>
  );
}
