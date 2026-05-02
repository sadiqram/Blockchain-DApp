"use client";

import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { useCards } from "../hooks/useCards";
import { getReadOnlyContract, getWriteContract } from "../contract";
import Card from "../components/card";

export default function MyCardsPage() {
  const { account } = useWallet();

  const [contract, setContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);

  // 🔥 store per-card inputs
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [auctionPrices, setAuctionPrices] = useState<Record<number, string>>(
    {},
  );
  const [durations, setDurations] = useState<Record<number, string>>({});

  // load contracts
  useEffect(() => {
    const load = async () => {
      const read = await getReadOnlyContract();
      setContract(read);

      try {
        const write = await getWriteContract();
        setWriteContract(write);
      } catch {
        console.log("Wallet not connected for write actions");
      }
    };

    load();
  }, []);

  // load cards
  const { cards, loading, error } = useCards({ contract });

  // filter ONLY user cards
  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  // 🟦 LIST CARD
  const handleList = async (cardId: number) => {
    if (!writeContract) return;

    try {
      const price = prices[cardId];
      if (!price) return alert("Enter a price");

      const tx = await writeContract.listCard(
        cardId,
        ethers.parseUnits(price, 18),
      );
      await tx.wait();

      alert("Card listed!");
    } catch (err) {
      console.error(err);
    }
  };

  // 🟪 START AUCTION
  const handleStartAuction = async (cardId: number) => {
    if (!writeContract) return;

    try {
      const price = auctionPrices[cardId];
      const duration = durations[cardId];

      if (!price || !duration) {
        return alert("Enter starting price and duration");
      }

      const tx = await writeContract.startAuction(
        cardId,
        ethers.parseUnits(price, 18),
        Number(duration), // seconds
      );

      await tx.wait();

      alert("Auction started!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6 text-black">My Cards</h1>

      {!account && (
        <p className="text-red-500">Connect your wallet to view your cards</p>
      )}

      {loading && <p className="text-black">Loading cards...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {myCards.length === 0 && account && (
        <p className="text-black">You don’t own any cards yet.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {myCards.map((card) => (
          <Card key={card.id} card={card}>
            {/* 🔵 LIST CARD */}
            <div className="flex flex-col gap-1 w-full">
              <input
                placeholder="List Price (YODA)"
                value={prices[card.id] || ""}
                onChange={(e) =>
                  setPrices({ ...prices, [card.id]: e.target.value })
                }
                className="border p-1 text-sm text-black"
              />

              <button
                onClick={() => handleList(card.id)}
                className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
              >
                List
              </button>
            </div>

            {/* 🟣 START AUCTION */}
            <div className="flex flex-col gap-1 w-full mt-2">
              <input
                placeholder="Start Price"
                value={auctionPrices[card.id] || ""}
                onChange={(e) =>
                  setAuctionPrices({
                    ...auctionPrices,
                    [card.id]: e.target.value,
                  })
                }
                className="border p-1 text-sm text-black"
              />

              <input
                placeholder="Duration (sec)"
                value={durations[card.id] || ""}
                onChange={(e) =>
                  setDurations({
                    ...durations,
                    [card.id]: e.target.value,
                  })
                }
                className="border p-1 text-sm text-black"
              />

              <button
                onClick={() => handleStartAuction(card.id)}
                className="bg-purple-600 text-white px-2 py-1 rounded text-sm"
              >
                Start Auction
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
