"use client";

import { useState } from "react";
import type { CardType } from "../types/card";
import { formatYoda } from "../utils/formatYoda";

type Props = {
  card: CardType;
  children?: React.ReactNode;
  onBuy?: (id: number) => Promise<void> | void;
  onList?: (id: number, price: string) => void;
  onAuction?: (id: number, price: string, duration: number) => void;
  account?: string | null;
  disabled?: boolean;
};

const pokemonImageMap: Record<string, string> = {
  Snorlax: "/snorlax.jpg",
  Charizard: "/charizard.jpg",
  Mewtwo: "/mewtwo.jpg",
  Pikachu: "/pikachu.jpg",
};

export default function Card({
  card,
  children,
  onList,
  onBuy,
  onAuction,
  account,
  disabled,
}: Props) {
  const [listPrice, setListPrice] = useState("");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [duration, setDuration] = useState("60");

  // Local lock to prevent spam clicks
  const [isBuying, setIsBuying] = useState(false);

  // -------------------------
  // OWNERSHIP CHECKS
  // -------------------------
  const isOwner =
    !!account &&
    !!card.owner &&
    card.owner.toLowerCase() === account.toLowerCase();

  const isSeller =
    !!account &&
    !!card.seller &&
    card.seller.toLowerCase() === account.toLowerCase();

  const cannotBuy = isOwner || isSeller;

  const image = pokemonImageMap[card.name] || "/placeholder.png";

  // -------------------------
  // BUY HANDLER
  // -------------------------
  const handleBuy = async () => {
    if (!onBuy || cannotBuy || disabled || isBuying) return;

    try {
      setIsBuying(true);
      await onBuy(card.id);
    } catch (err) {
      console.error("Buy failed:", err);
    } finally {
      setIsBuying(false);
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="bg-white text-black rounded-xl shadow p-4 w-64 transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-purple-400">
      {/* IMAGE */}
      <img
        src={image}
        alt={card.name}
        className="h-40 w-full object-contain drop-shadow-md"
      />

      {/* NAME */}
      <h2 className="font-bold text-lg mt-2">{card.name}</h2>

      {/* STATS */}
      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>

      {/* OWNER */}
      <p className="mt-2 text-sm">Owner: {card.owner?.slice(0, 6)}...</p>

      {/* LIST STATUS */}
      {card.isListed ? (
        <p className="text-green-600 font-bold">
          Listed: {card.price ? formatYoda(card.price.toString()) : "0 YODA"}
        </p>
      ) : (
        <p className="text-gray-500">Not Listed</p>
      )}

      {/* -------------------------
          BUY SECTION (FIXED)
         ------------------------- */}

      {/* ONLY show button if user CAN buy */}
      {onBuy && card.isListed && !cannotBuy && (
        <button
          onClick={handleBuy}
          disabled={disabled || isBuying}
          className={`mt-2 w-full px-4 py-2 rounded-lg font-medium transition
            ${
              disabled || isBuying
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
        >
          {disabled || isBuying ? "Processing..." : "Buy"}
        </button>
      )}

      {/* SHOW MESSAGE INSTEAD */}
      {card.isListed && cannotBuy && (
        <p className="mt-2 text-sm text-center text-gray-500">
          You own this card
        </p>
      )}

      {/* -------------------------
          LIST
         ------------------------- */}
      {isOwner && onList && !card.isListed && (
        <div className="mt-2">
          <input
            className="border p-1 w-full text-sm text-black"
            placeholder="Price in YODA"
            value={listPrice}
            onChange={(e) => setListPrice(e.target.value)}
          />

          <button
            onClick={() => onList(card.id, listPrice)}
            className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
          >
            List
          </button>
        </div>
      )}

      {/* -------------------------
          AUCTION
         ------------------------- */}
      {isOwner && onAuction && !card.isListed && (
        <div className="mt-2">
          <input
            className="border p-1 w-full text-sm"
            placeholder="Starting price"
            value={auctionPrice}
            onChange={(e) => setAuctionPrice(e.target.value)}
          />

          <input
            className="border p-1 w-full text-sm mt-2"
            placeholder="Duration (sec)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <button
            onClick={() => onAuction(card.id, auctionPrice, Number(duration))}
            className="mt-2 w-full bg-purple-600 text-white py-1 rounded"
          >
            Start Auction
          </button>
        </div>
      )}

      {/* EXTENSION SLOT */}
      {children}
    </div>
  );
}
