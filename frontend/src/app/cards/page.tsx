"use client";

import { useCards } from "../hooks/useCards";
import { useContract } from "../hooks/useContract";
import Card from "../components/card";

export default function CardsPage() {
  const { readContract, loading: contractLoading } = useContract();

  const { cards, loading: cardsLoading } = useCards({
    contract: readContract,
  });

  return (
    <div className="p-8 text-black">
      <h1 className="text-2xl font-bold mb-4">All Cards</h1>

      {(contractLoading || cardsLoading) && <p>Loading...</p>}

      <div className="grid grid-cols-3 gap-4">
        {cards.map((c) => (
          <Card key={c.id} card={c} />
        ))}
      </div>
    </div>
  );
}
