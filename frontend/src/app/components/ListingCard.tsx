"use client";

type Props = {
  card: any;
  onBuy: (id: number) => void;
  isOwner?: boolean;
};

const pokemonImageMap: Record<string, string> = {
  Snorlax: "/snorlax.jpg",
  Charizard: "/charizard.jpg",
  Mewtwo: "/mewtwo.jpg",
  Pikachu: "/pikachu.jpg",
};

export default function ListingCard({ card, onBuy, isOwner }: Props) {
  const image = pokemonImageMap[card.name] || "/placeholder.png";

  return (
    <div className="bg-white rounded-xl shadow p-4 w-64 text-black">
      <img
        src={image}
        alt={card.name}
        className="w-full h-40 object-cover rounded-lg mb-3"
      />

      <h2 className="text-lg font-bold">{card.name}</h2>
      <p>HP: {card.hp}</p>
      <p>ATK: {card.attack}</p>
      <p>DEF: {card.defense}</p>

      <p className="mt-2 text-sm text-gray-600">
        Seller: {card.seller?.slice(0, 6)}...
      </p>

      <p className="mt-2 font-bold text-green-600">Price: {card.price}</p>

      <button
        disabled={isOwner}
        onClick={() => onBuy(card.id)}
        className={`mt-3 w-full py-2 rounded text-white ${
          isOwner ? "bg-gray-400 cursor-not-allowed" : "bg-green-600"
        }`}
      >
        {isOwner ? "Your Listing" : "Buy"}
      </button>
    </div>
  );
}
