"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Card from "./card";

type Auction = {
  currentPrice: string;
  highestBidder: string;
  endTime: number;
};

type Props = {
  card: {
    id: number;
    name: string;
    attack: string;
    defense: string;
    hp: string;
    rarity: number;
    shiny: boolean;
    owner: string;
  };

  auction: Auction;
  onBid: (id: number, amount: string) => void;
};

export default function AuctionCard({ card, auction, onBid }: Props) {
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const ended = Number(auction.endTime) * 1000 < Date.now();

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = auction.endTime - now;

      if (diff <= 0) {
        setTimeLeft("Auction ended");
        return;
      }

      const mins = Math.floor(diff / 60);
      const secs = diff % 60;

      setTimeLeft(`${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [auction.endTime]);

  const currentBid = Number(auction.currentPrice);

  return (
    <div className="bg-white rounded-xl shadow p-4 w-64 text-black">
      {/* CARD INFO */}
      <h2 className="text-lg font-bold">{card.name}</h2>

      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>

      {/* AUCTION INFO */}
      <p className="mt-2 text-sm">
        Current Bid: {ethers.formatUnits(currentBid.toString(), 2)} YODA
      </p>

      <p className="text-xs text-gray-500">
        Highest Bidder: {auction.highestBidder?.slice(0, 6)}...
      </p>

      <p className="text-xs text-red-500 mt-1">⏳ {timeLeft}</p>

      {/* INPUT */}
      <input
        disabled={ended}
        placeholder="Your bid"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        className="border p-1 text-sm text-black mt-2 w-full"
      />

      {/* BUTTON */}
      <button
        disabled={ended || !bid}
        onClick={() => onBid(card.id, bid)}
        className={`mt-2 w-full px-3 py-2 rounded text-white ${
          ended ? "bg-gray-400" : "bg-purple-600"
        }`}
      >
        {ended ? "Auction Ended" : "Place Bid"}
      </button>
    </div>
  );
}
