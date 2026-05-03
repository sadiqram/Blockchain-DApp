"use client";

import { useCards } from "../hooks/useCards";
import { useMarketplace } from "../hooks/useMarketplace";
import { useContract } from "../hooks/useContract";
import Card from "../components/card";

export default function MarketplacePage() {
  const { readContract, writeContract, loading } = useContract();

  const { cards, reload } = useCards({ contract: readContract });

  const { buyCard } = useMarketplace({ contract: writeContract });

  const listed = cards.filter((c) => c.isListed);

  if (loading) {
    return <p className="p-8">Loading contracts...</p>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

      <div className="grid grid-cols-3 gap-4">
        {listed.map((c) => (
          <Card
            key={c.id}
            card={c}
            onBuy={async (id) => {
              await buyCard(id);
              await reload();
            }}
          />
        ))}
      </div>
    </div>
  );
}
