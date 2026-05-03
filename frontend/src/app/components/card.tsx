"use client";

import { useState } from "react";
import type { CardType } from "../types/card";
import { formatYoda } from "../utils/formatYoda";

type Props = {
  card: CardType;

  onList?: (id: number, price: string) => void;
  onBuy?: (id: number) => void;
  onAuction?: (id: number, price: string) => void;

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
  onList,
  onBuy,
  onAuction,
  account,
}: Props) {
  const [price, setPrice] = useState("");

    const isOwner = account && card.owner.toLowerCase() === account.toLowerCase();
    const image = pokemonImageMap[card.name] || "/placeholder.png";

  return (
    <div className="bg-white text-black rounded-xl shadow p-4 w-64">
      {/* IMAGE (RESTORED) */}
      <img
        src={image}
        alt={card.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />
      <h2 className="font-bold text-lg">{card.name}</h2>

      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>

      <p className="mt-2 text-sm">Owner: {card.owner.slice(0, 6)}...</p>

      {/* LIST STATUS */}
      {card.isListed ? (
        <p className="text-green-600 font-bold">
          Listed: {card.price ? formatYoda(card.price) : "0 YODA"}
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

      {/* OWNERS LIST ACTIONS */}
      {isOwner && onList && !card.isListed && (
        <div className="mt-2">
          <input
            className="border p-1 w-full text-sm"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            onClick={() => onList(card.id, price)}
            className="mt-2 w-full bg-blue-600 text-white py-1 rounded"
          >
            List
          </button>
        </div>
      )}

      {/* AUCTION */}
      {isOwner && onAuction && (
        <button
          onClick={() => onAuction(card.id, price)}
          className="mt-2 w-full bg-purple-600 text-white py-1 rounded"
        >
          Start Auction
        </button>
      )}
    </div>
  );
}
