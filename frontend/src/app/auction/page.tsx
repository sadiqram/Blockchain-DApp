"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useAuction } from "../hooks/useAuctions";
import { getReadOnlyContract, getWriteContract } from "../contract";
import Card from "../components/card";

type AuctionType = {
  tokenId: number;
  startingPrice: string;
  currentPrice: string;
  endTime: number;
  highestBid: string;
  highestBidder: string;
  seller: string;
  active: boolean;
};

export default function AuctionPage() {
  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");

  const { placeBid, loading } = useAuction({
    contract: writeContract,
  });

  // -------------------------
  // Load contracts
  // -------------------------
  useEffect(() => {
    const load = async () => {
      const read = await getReadOnlyContract();
      setReadContract(read);

      try {
        const write = await getWriteContract();
        setWriteContract(write);
      } catch {
        console.log("No wallet connected for write actions");
      }
    };

    load();
  }, []);

  // -------------------------
  // Load auctions
  // -------------------------
  useEffect(() => {
    const loadAuctions = async () => {
      if (!readContract) return;

      try {
        const ids = await readContract.getActiveAuctions();

        const results: AuctionType[] = [];

        for (let i = 0; i < ids.length; i++) {
          const a = await readContract.auctions(ids[i]);

          results.push({
            tokenId: Number(a.tokenId),
            startingPrice: a.startingPrice.toString(),
            currentPrice: a.currentPrice.toString(),
            endTime: Number(a.endTime),
            highestBid: a.highestBid.toString(),
            highestBidder: a.highestBidder,
            seller: a.seller,
            active: a.active,
          });
        }

        setAuctions(results);
      } catch (err) {
        console.error("Failed loading auctions:", err);
      }
    };

    loadAuctions();
  }, [readContract]);

  // -------------------------
  // BID HANDLER
  // -------------------------
  const handleBid = async (tokenId: number) => {
    if (!bidAmount) return;

    await placeBid(tokenId, bidAmount);

    setBidAmount("");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">Auctions</h1>

      {auctions.length === 0 && <p>No active auctions</p>}

      <div className="grid grid-cols-3 gap-4">
        {auctions.map((auction) => (
          <div key={auction.tokenId} className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold">Token #{auction.tokenId}</h2>

            <p>Current Bid: {auction.currentPrice}</p>
            <p>Highest Bid: {auction.highestBid}</p>

            <p className="text-xs">Seller: {auction.seller.slice(0, 6)}...</p>

            {/* BID INPUT */}
            <input
              type="text"
              placeholder="Bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="border p-1 mt-2 w-full"
            />

            <button
              onClick={() => handleBid(auction.tokenId)}
              disabled={loading}
              className="mt-2 w-full bg-purple-600 text-white py-2 rounded"
            >
              {loading ? "Bidding..." : "Place Bid"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
