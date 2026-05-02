"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";

export type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;
};

type UseCardsProps = {
  contract: Contract | null;
};

export function useCards({ contract }: UseCardsProps) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      if (!contract) return;

      try {
        setLoading(true);
        setError(null);

        const total = await contract.totalSupply();
        const results: CardType[] = [];

        for (let i = 0; i < total; i++) {
          const card = await contract.cards(i);
          const owner = await contract.ownerOf(i);

          results.push({
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

        setCards(results);
      } catch (err: any) {
        console.error("useCards error:", err);
        setError(err?.message || "Failed to load cards");
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [contract]);

  return { cards, loading, error };
}
