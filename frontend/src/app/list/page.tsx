"use client";

import Link from "next/link";
import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { getWriteContract } from "../contract";

export default function List() {
  const { account, isConnected, connectWallet } = useWallet();

  const [tokenId, setTokenId] = useState("");
  const [price, setPrice] = useState("");

  const handleList = async () => {
    if (!account) return;

    try {
      const contract = await getWriteContract();

      await contract.listCard(Number(tokenId), price);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <Link href="/">Home</Link>
      </div>

      <h1 className="text-5xl text-center font-bold mb-8">List</h1>

      {!isConnected ? (
        <div className="flex justify-center">
          <button
            onClick={connectWallet}
            className="bg-green-600 text-white px-6 py-2 rounded"
          >
            Connect Wallet
          </button>
        </div>
      ) : (
        <p className="text-center mb-4">
          Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
        </p>
      )}

      <div className="flex flex-col items-center gap-4">
        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Token ID"
          value={tokenId}
          onChange={(e) => setTokenId(e.target.value)}
        />

        <input
          className="px-3 py-2 text-black rounded"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <button
          onClick={handleList}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          List NFT
        </button>
      </div>
    </div>
  );
}
