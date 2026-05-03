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
      const results: AuctionType[] = [];

      for (let id of ids) {
        const a = await contract.auctions(id);
        const card = await contract.cards(id);
        const owner = await contract.ownerOf(id);

        results.push({
          tokenId: id,
          startingPrice: a.startingPrice.toString(),
          currentPrice: a.currentPrice.toString(),
          endTime: Number(a.endTime),
          highestBidder: a.highestBidder,
          seller: a.seller,
          active: a.active,

          //  attach card info
          name: card.name,
          attack: card.attack.toString(),
          defense: card.defense.toString(),
          hp: card.hp.toString(),
          owner,
        });
      }

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
