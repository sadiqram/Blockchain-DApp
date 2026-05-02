"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { useWallet } from "../hooks/useWallet";
import { useCards } from "../hooks/useCards";
import { getReadOnlyContract, getWriteContract } from "../contract";
import Card from "../components/card";

export default function MyCardsPage() {
  const { account } = useWallet();

  const [contract, setContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);

  // load contracts
  useEffect(() => {
    const load = async () => {
      const read = await getReadOnlyContract();
      setContract(read);

      try {
        const write = await getWriteContract();
        setWriteContract(write);
      } catch {
        console.log("Wallet not connected for write actions");
      }
    };

    load();
  }, []);

  // load cards
  const { cards, loading, error } = useCards({ contract });

  // filter ONLY user cards
  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold mb-6">My Cards</h1>

      {!account && (
        <p className="text-red-500">Connect your wallet to view your cards</p>
      )}

      {loading && <p>Loading cards...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {myCards.length === 0 && account && <p>You don’t own any cards yet.</p>}

      <div className="grid grid-cols-3 gap-4">
        {myCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
