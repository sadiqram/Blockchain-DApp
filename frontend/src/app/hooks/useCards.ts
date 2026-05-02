"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import type { CardType } from "../types/card";

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

        const total: number = Number(await contract.totalSupply());

        // build all token calls in parallel (IMPORTANT FIX)
        const requests = Array.from({ length: total }, (_, i) => i);

        const results = await Promise.all(
          requests.map(async (i) => {
            try {
              const owner = await contract.ownerOf(i);
              const card = await contract.cards(i);

              return {
                id: i,
                name: card.name,
                attack: card.attack.toString(),
                defense: card.defense.toString(),
                hp: card.hp.toString(),
                rarity: Number(card.rarity),
                shiny: card.Shiny,
                owner,
              } as CardType;
            } catch {
              return null; // skip invalid/missing tokens safely
            }
          }),
        );

        const cleaned = results.filter((c): c is CardType => c !== null);

        setCards(cleaned);
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
