"use client";

import { useState } from "react";
import type { CardType } from "../types/card";
import { formatYoda } from "../utils/formatYoda";

type Props = {
  card: CardType;
  children?: React.ReactNode;
  onBuy?: (id: number) => void;
  onList?: (id: number, price: string) => void;
  onAuction?: (id: number, price: string, duration: number) => void;
  account?: string | null;
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
}: Props) {
  const [listPrice, setListPrice] = useState("");
  const [auctionPrice, setAuctionPrice] = useState("");
  const [duration, setDuration] = useState("60");

  const isOwner =
    !!account &&
    !!card.owner &&
    card.owner.toLowerCase() === account.toLowerCase();

  const image = pokemonImageMap[card.name] || "/placeholder.png";

  return (
    <div className="bg-white text-black rounded-xl shadow p-4 w-64">
      {/* IMAGE */}
    
      <div className="w-full h-40 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
        <img
          src={image}
          alt={card.name}
          className="h-full w-auto object-contain drop-shadow-md"
        />
      </div>

      <h2 className="font-bold text-lg">{card.name}</h2>

      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>

      <p className="mt-2 text-sm">
        Owner: {card.owner?.slice(0, 6) ?? "unknown"}...
      </p>

      {/* LIST STATUS */}
      {card.isListed ? (
        <p className="text-green-600 font-bold">
          Listed: {card.price ? formatYoda(card.price.toString()) : "0 YODA"}
        </p>
      ) : (
        <p className="text-gray-500">Not Listed</p>
      )}

      {/* BUY */}
      {onBuy && card.isListed && !isOwner && (
        <button
          onClick={() => onBuy(card.id)}
          className="mt-2 w-full bg-green-600 text-white py-1 rounded"
        >
          Buy
        </button>
      )}

      {/* LIST (only if not listed) */}
      {isOwner && onList && !card.isListed && (
        <div className="mt-2">
          <input
            className="border p-1 w-full text-sm"
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

      {/* AUCTION (only if not listed) */}
      {isOwner && onAuction && !card.isListed && (
        <div className="mt-2">
          <input
            className="border p-1 w-full text-sm"
            placeholder="Starting price in YODA"
            value={auctionPrice}
            onChange={(e) => setAuctionPrice(e.target.value)}
          />

          <input
            className="border p-1 w-full text-sm mt-2"
            placeholder="Duration (seconds)"
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

      {/* EXTENSION SLOT (USED BY AUCTIONS) */}
      {children}
    </div>
  );
}
