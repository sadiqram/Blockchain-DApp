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

     // ONE SINGLE RPC CALL (instead of looping)
     const [cards, owners, listings] = await contract.getAllCards();

     const results = cards.map((card: any, i: number) => {
       const listing = listings[i];

       return {
         id: i,
         name: card.name,
         attack: card.attack.toString(),
         defense: card.defense.toString(),
         hp: card.hp.toString(),
         rarity: Number(card.rarity),
         shiny: card.Shiny,
         owner: owners[i],
         isListed: listing.price.toString() !== "0",
         price:
           listing.price.toString() !== "0"
             ? listing.price.toString()
             : undefined,
         seller: listing.seller,
       };
     });

     setCards(results);
   } catch (err) {
     console.error("getAllCards failed:", err);
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
