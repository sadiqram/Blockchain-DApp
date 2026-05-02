"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Card from "./card";

type Props = {
  card: any;
  auction: any;
  onBid: (id: number, amount: string) => void;
};

export default function AuctionCard({ card, auction, onBid }: Props) {
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const diff = Number(auction.endTime) - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
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

  return (
    <Card card={card}>
      <p className="text-sm">
        Current Bid: {ethers.formatUnits(auction.currentPrice, 18)} YODA
      </p>

      <p className="text-xs text-gray-500">
        Highest Bidder: {auction.highestBidder?.slice(0, 6)}...
      </p>

      <p className="text-xs text-red-500">⏳ {timeLeft}</p>

      <input
        placeholder="Your bid"
        value={bid}
        onChange={(e) => setBid(e.target.value)}
        className="border p-1 text-sm text-black mt-2"
      />

      <button
        onClick={() => onBid(card.id, bid)}
        className="bg-purple-600 text-white px-3 py-1 rounded mt-2"
      >
        Place Bid
      </button>
    </Card>
  );
}
