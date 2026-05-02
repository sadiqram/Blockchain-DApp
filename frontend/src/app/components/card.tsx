"use client";

type Props = {
  card: any;
  children?: React.ReactNode;
};

const pokemonImageMap: Record<string, string> = {
  snorlax: "/snorlax.jpg",
  charizard: "/charizard.jpg",
  mewtwo: "/mewtwo.jpg",
  pikachu: "/pikachu.jpg",
};

export default function Card({ card, children }: Props) {
  const image = pokemonImageMap[card.name?.toLowerCase()] || "/placeholder.png";

  return (
      <div className="bg-white rounded-xl shadow p-4 w-64 text-black">
          {/* properly implement this part and proper styling acrosss pages after basic functionality is completed
      {/* {card.price ? (
        <p className="text-green-600 font-semibold">Listed: {card.price}</p>
      ) : (
        <p className="text-gray-500">Not Listed</p>
      )} */}

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

      {/* ACTIONS */}
      <div className="mt-3 flex gap-2 flex-wrap">{children}</div>
    </div>
  );
}
