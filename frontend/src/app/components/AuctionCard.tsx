"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Card from "./card";

type Props = {
  card: any;
  auction: any;
  account?: string | null;

  onBid: (id: number, amount: string) => void;
  onEnd: (id: number) => void;
  onClaim: (id: number) => void;
};

export default function AuctionCard({
  card,
  auction,
  account,
  onBid,
  onEnd,
  onClaim,
}: Props) {
  const [bid, setBid] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  const currentPrice = Number(ethers.formatUnits(auction.currentPrice, 18));

  const isEnded = timeLeft === "Ended";

  // -------------------------
  // ROLE CHECKS
  // -------------------------
  const isSeller =
    !!account && auction.seller?.toLowerCase() === account.toLowerCase();

  const isWinner =
    !!account && auction.highestBidder?.toLowerCase() === account.toLowerCase();

  const cannotBid = isSeller || isWinner || isEnded;

  // -------------------------
  // TIMER
  // -------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Math.floor(Date.now() / 1000);
      const diff = auction.endTime - now;

      if (diff <= 0) {
        setTimeLeft("Ended");
        return;
      }

      const mins = Math.floor(diff / 60);
      const secs = diff % 60;

      setTimeLeft(`${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [auction.endTime]);

  // -------------------------
  // BID HANDLER
  // -------------------------
  const handleBidClick = () => {
    const bidValue = Number(bid);

    if (!bid || bidValue <= currentPrice) {
      alert("Bid must be higher than current price");
      return;
    }

    if (cannotBid) {
      return;
    }

    onBid(card.tokenId, bid);
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <Card card={card}>
      <p className="text-sm">Current: {currentPrice} YODA</p>

      <p className="text-xs text-gray-500">
        Highest: {auction.highestBidder?.slice(0, 6)}...
      </p>

      <p className="text-xs text-red-500">⏳ {timeLeft}</p>

      {/* BID SECTION */}
      {!isEnded && (
        <>
          <input
            value={bid}
            onChange={(e) => setBid(e.target.value)}
            placeholder="Bid amount"
            disabled={cannotBid}
            className="border p-1 text-black mt-2 w-full disabled:bg-gray-200"
          />

          <button
            onClick={handleBidClick}
            disabled={cannotBid}
            className={`w-full py-1 mt-2 rounded text-white transition
              ${
                cannotBid
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
          >
            {isSeller
              ? "You are seller"
              : isWinner
              ? "You are highest bidder"
              : "Place Bid"}
          </button>
        </>
      )}

      {/* END AUCTION (SELLER ONLY) */}
      {isEnded && isSeller && (
        <button
          onClick={() => onEnd(card.tokenId)}
          className="bg-red-600 hover:bg-red-700 text-white w-full py-1 mt-2 rounded"
        >
          End Auction
        </button>
      )}

      {/* CLAIM NFT (WINNER ONLY) */}
      {isEnded && isWinner && (
        <button
          onClick={() => onClaim(card.tokenId)}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-1 mt-2 rounded"
        >
          Claim NFT
        </button>
      )}
    </Card>
  );
}
