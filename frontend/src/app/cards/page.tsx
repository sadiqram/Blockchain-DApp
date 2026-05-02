"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";

type Props = {
  contract: Contract | null;
  account: string | null;
};

type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;
};

export default function DisplayCards({ contract, account }: Props) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCards = async () => {
      if (!contract) return;

      try {
        setLoading(true);

        const total: bigint = await contract.totalSupply();

        const allCards: CardType[] = [];

        for (let i = 0; i < Number(total); i++) {
          const card = await contract.cards(i);
          const owner = await contract.ownerOf(i);

          allCards.push({
            id: i,
            name: card.name,
            attack: card.attack.toString(),
            defense: card.defense.toString(),
            hp: card.hp.toString(),
            rarity: Number(card.rarity),
            shiny: card.Shiny,
            owner,
          });
        }

        setCards(allCards);
      } catch (err) {
        console.error("Failed to load cards:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [contract]);

  // 🧠 filter user cards
  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  return (
    <div className="w-full px-6 mt-10">
      {loading && <p className="text-gray-500 mb-4">Loading cards...</p>}

      {/* MY CARDS */}
      <h2 className="text-2xl font-bold text-black mb-4">My Cards</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {myCards.length === 0 ? (
          <p className="text-gray-500">No cards owned yet.</p>
        ) : (
          myCards.map((card) => (
            <div key={card.id} className="bg-white p-4 rounded shadow border">
              <h2 className="text-black font-bold text-lg">{card.name}</h2>

              <p className="text-black">HP: {card.hp}</p>
              <p className="text-black">ATK: {card.attack}</p>
              <p className="text-black">DEF: {card.defense}</p>
              <p className="text-black">Rarity: {card.rarity}</p>

              {card.shiny && <p className="text-yellow-500">✨ Shiny</p>}

              <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
                List Card
              </button>
            </div>
          ))
        )}
      </div>

      {/* ALL CARDS */}
      <h2 className="text-2xl font-bold text-black mb-4">
        Marketplace (All Cards)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-4 rounded shadow border">
            <h2 className="text-black font-bold text-lg">{card.name}</h2>

            <p className="text-black">HP: {card.hp}</p>
            <p className="text-black">ATK: {card.attack}</p>

            <p className="text-xs text-gray-600 mt-2">
              Owner: {card.owner.slice(0, 6)}...
              {card.owner.slice(-4)}
            </p>

            <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
