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
export default function DisplayCards({ contract,account }:Props) {
  const [cards, setCards] = useState<CardType[]>([]);

  useEffect(() => {
    const loadCards = async () => {
      if (!contract) return;

      const total = await contract.totalSupply();

      let allCards: CardType[] = [];

      for (let i = 0; i < total; i++) {
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
    };

    loadCards();
  }, [contract]);
    
    const myCards = account
      ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
      : [];

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {cards.map((card) => (
        <div key={card.id} className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold">{card.name}</h2>
          <p>HP: {card.hp}</p>
          <p>ATK: {card.attack}</p>
          <p>DEF: {card.defense}</p>
          <p>Rarity: {card.rarity}</p>
          <p>{card.shiny ? "✨ Shiny" : ""}</p>
          <p className="text-xs">Owner: {card.owner.slice(0, 6)}...</p>
        </div>
      ))}
    </div>
  );
}
