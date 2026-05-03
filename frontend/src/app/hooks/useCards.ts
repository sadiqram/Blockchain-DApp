"use client";

import { useEffect, useState, useCallback } from "react";
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
  isListed: boolean;
  price?: string;
  seller?: string;
};

type Props = {
  contract: Contract | null;
};

export function useCards({ contract }: Props) {
  const [cards, setCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCards = useCallback(async () => {
    if (!contract) return;

    try {
      setLoading(true);

      const total = Number(await contract.totalSupply());
      const results: CardType[] = [];

      for (let i = 0; i < total; i++) {
        try {
          const card = await contract.cards(i);
          const owner = await contract.ownerOf(i);
          const listing = await contract.getListing(i);

          const price = listing.price.toString();

          results.push({
            id: i,
            name: card.name,
            attack: card.attack.toString(),
            defense: card.defense.toString(),
            hp: card.hp.toString(),
            rarity: Number(card.rarity),
            shiny: card.Shiny,
            owner,

            isListed: price !== "0",
            price: price !== "0" ? price : undefined,
            seller: listing.seller,
          });
        } catch {
          continue;
        }
      }

      setCards(results);
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return {
    cards,
    loading,
    reload: loadCards,
  };
}
