"use client";

import { useWallet } from "../hooks/useWallet";
import { useCards } from "../hooks/useCards";
import { useContract } from "../hooks/useContract";
import { useMarketplace } from "../hooks/useMarketplace";
import Card from "../components/card";

export default function MyCardsPage() {
  const { account } = useWallet();
  const { readContract, writeContract } = useContract();

  const { cards, loading } = useCards({
    contract: readContract,
  });

  const { listCard, startAuction } = useMarketplace({
    contract: writeContract,
  });

  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  const handleList = async (id: number, price: string) => {
    await listCard(id, price);
  };

  const handleAuction = async (id: number, price: string, duration: number) => {
    await startAuction(id, price, duration);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Cards</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-3 gap-4">
        {myCards.map((c) => (
          <Card
            key={c.id}
            card={c}
            account={account}
            onList={handleList}
            onAuction={handleAuction} 
          />
        ))}
      </div>
    </div>
  );
}
