"use client";

import { useWallet } from "../hooks/useWallet";
import { useCards } from "../hooks/useCards";
import { useContract } from "../hooks/useContract";
import Card from "../components/card";

export default function MyCardsPage() {
  const { account } = useWallet();
  const { readContract } = useContract();

  const { cards, loading } = useCards({
    contract: readContract,
  });

  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Cards</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-3 gap-4">
        {myCards.map((c) => (
          <Card key={c.id} card={c} account={account} onList={() => {}} />
        ))}
      </div>
    </div>
  );
}
