"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { useMarketplace } from "../hooks/useMarketplace";
import { getReadOnlyContract, getWriteContract } from "../contract";
import Card from "../components/card";

type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;
  price?: string;
  seller?: string;
};

export default function MarketplacePage() {
  const { account } = useWallet();

  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);
  const [listedCards, setListedCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);

  const { buyCard } = useMarketplace({ contract: writeContract });

  // -------------------------
  // Load contracts
  // -------------------------
  useEffect(() => {
    const loadContracts = async () => {
      const read = await getReadOnlyContract();
      setReadContract(read);

      try {
        const write = await getWriteContract();
        setWriteContract(write);
      } catch {
        console.log("Wallet not connected for write contract");
      }
    };

    loadContracts();
  }, []);

  // -------------------------
  // Load marketplace listings
  // -------------------------
  useEffect(() => {
    const loadListings = async () => {
      if (!readContract) return;

      try {
        setLoading(true);

        const total = await readContract.totalSupply();
        const results: CardType[] = [];

        for (let i = 0; i < total; i++) {
          try {
            const card = await readContract.cards(i);
            const listing = await readContract.getListing(i);

            const price = listing?.price?.toString?.() || "0";
            const seller = listing?.seller;

            // only show listed cards
            if (price !== "0" && seller) {
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
          } catch (err) {
            console.log("Skipping card", i);
          }
        }

        setListedCards(results);
      } catch (err) {
        console.error("Error loading listings:", err);
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [readContract]);

  // -------------------------
  // BUY HANDLER
  // -------------------------
  const handleBuy = async (id: number) => {
    try {
      await buyCard(id);

      // refresh listings after buy
      const total = await readContract?.totalSupply();
      if (!total) return;

      const updated: CardType[] = [];

      for (let i = 0; i < total; i++) {
        const card = await readContract!.cards(i);
        const listing = await readContract!.getListing(i);

        if (listing.price.toString() !== "0") {
          updated.push({
            id: i,
            name: card.name,
            attack: card.attack.toString(),
            defense: card.defense.toString(),
            hp: card.hp.toString(),
            rarity: Number(card.rarity),
            shiny: card.Shiny,
            owner: listing.seller,
            price: listing.price.toString(),
            seller: listing.seller,
          });
        }
      }

      setListedCards(updated);
    } catch (err) {
      console.error("Buy failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-4xl font-bold mb-6">Marketplace</h1>

      {loading && <p>Loading listings...</p>}

      {!loading && listedCards.length === 0 && (
        <p>No cards currently listed.</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {listedCards.map((card) => (
          <div key={card.id} className="relative">
            <Card card={card} />

            <button
              onClick={() => handleBuy(card.id)}
              className="mt-2 w-full bg-green-600 text-white py-2 rounded"
            >
              Buy ({card.price})
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
