"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { useMarketplace } from "../hooks/useMarketplace";
import { getReadOnlyContract, getWriteContract } from "../contract";
import { formatYoda } from "../utils/formatYoda";

import ListingCard from "../components/ListingCard";

type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;
  price: string;
  seller: string;
};

export default function MarketplacePage() {
  const { account } = useWallet();

  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);
  const [listedCards, setListedCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);

  const { buyCard } = useMarketplace({ contract: writeContract });

  // -----------------------------
  // Load contracts
  // -----------------------------
  useEffect(() => {
    const loadContracts = async () => {
      const read = await getReadOnlyContract();
      setReadContract(read);

      try {
        const write = await getWriteContract();
        setWriteContract(write);
      } catch {
        console.log("Wallet not connected (write disabled)");
      }
    };

    loadContracts();
  }, []);
  const isOwner = (card: any) =>
    !!account && card.seller?.toLowerCase() === account.toLowerCase();
  // -----------------------------
  // Load listings
  // -----------------------------
  const loadListings = async () => {
    if (!readContract) return;

    try {
      setLoading(true);

      const total = await readContract.totalSupply();
      const results: CardType[] = [];

      for (let i = 0; i < Number(total); i++) {
        try {
          const card = await readContract.cards(i);
          const listing = await readContract.getListing(i);

          const rawPrice = listing.price.toString();
          const price = formatYoda(rawPrice);
          const seller = listing.seller;

          // only listed cards
          if (rawPrice !== "0" && seller !== ethers.ZeroAddress) {
            results.push({
              id: i,
              name: card.name,
              attack: card.attack.toString(),
              defense: card.defense.toString(),
              hp: card.hp.toString(),
              rarity: Number(card.rarity),
              shiny: card.Shiny,
              owner: seller,
              price,
              seller,
            });
          }
        } catch {
          continue;
        }
      }

      setListedCards(results);
    } catch (err) {
      console.error("Failed loading marketplace:", err);
    } finally {
      setLoading(false);
    }
  };

  // initial load + refresh when contract changes
  useEffect(() => {
    loadListings();
  }, [readContract]);

  // -----------------------------
  // BUY HANDLER
  // -----------------------------
const handleBuy = async (id: number) => {
  try {
    await buyCard(id);

    // confirm on-chain success BEFORE removing
    setListedCards((prev) => prev.filter((card) => card.id !== id));
  } catch (err) {
    console.error("Buy failed:", err);
    await loadListings(); // fallback sync
  }
};

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-4xl font-bold mb-6">Marketplace</h1>

      {loading && <p>Loading listings...</p>}

      {!loading && listedCards.length === 0 && (
        <p>No cards currently listed.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {listedCards.map((card) => (
          <ListingCard key={card.id} card={card} onBuy={handleBuy} isOwner={isOwner(card)} />
        ))}
      </div>
    </div>
  );
}
