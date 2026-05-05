"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";

export type AuctionType = {
  tokenId: number;
  startingPrice: string;
  currentPrice: string;
  endTime: number;
  highestBidder: string;
  seller: string;
  active: boolean;

  //  ADD CARD DATA
  name: string;
  attack: string;
  defense: string;
  hp: string;
  owner: string;
};

type Props = {
  contract: Contract | null;
};

export function useAuctions({ contract }: Props) {
  const [auctions, setAuctions] = useState<AuctionType[]>([]);
  const [loading, setLoading] = useState(false);

const load = async () => {
  if (!contract) return;

  try {
    setLoading(true);

    const ids: number[] = await contract.getActiveAuctions();

    const limited = ids.slice(0, 20); // 🚨 LIMIT

    const promises = limited.map(async (id) => {
      const [a, card, owner] = await Promise.all([
        contract.auctions(id),
        contract.cards(id),
        contract.ownerOf(id),
      ]);

      return {
        tokenId: id,
        startingPrice: a.startingPrice.toString(),
        currentPrice: a.currentPrice.toString(),
        endTime: Number(a.endTime),
        highestBidder: a.highestBidder,
        seller: a.seller,
        active: a.active,
        name: card.name,
        attack: card.attack.toString(),
        defense: card.defense.toString(),
        hp: card.hp.toString(),
        owner,
      };
    });

    const results = await Promise.all(promises);

    setAuctions(results);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    load();
  }, [contract]);

  return { auctions, loading, reload: load };
}
