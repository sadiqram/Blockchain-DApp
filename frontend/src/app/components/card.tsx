"use client";

import { useState } from "react";

type Props = {
  card: any;
  onList?: (id: number, price: string) => void;
};

// images are currently not being displayed properly
const pokemonImageMap: Record<string, string> = {
  Snorlax: "../public/snorlax.jpg",
  Charizard: "../public/charizard.jpg",
  Mewtwo: "../public/mewtwo.jpg",
  Pikachu: ".../public/pikachu.jpg",
};
//  DApp / frontend /src / app/ public / charizard.jpg;

export default function Card({ card, onList }: Props) {
  const [price, setPrice] = useState("");

  const image = pokemonImageMap[card.name] || "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 w-64 text-black">
      {/* IMAGE */}
      <img
        src={image}
        alt={card.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      {/* INFO */}
      <h2 className="text-lg font-bold">{card.name}</h2>
      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>
      <p>Rarity: {card.rarity}</p>

      {/* LIST ACTION */}
      {onList && (
        <div className="mt-3 flex gap-2">
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price"
            className="border p-1 w-full text-sm"
          />
          <button
            onClick={() => onList(card.id, price)}
            className="bg-blue-600 text-white px-2 py-1 text-sm rounded"
          >
            List
          </button>
        </div>
      )}
    </div>
  );
}
