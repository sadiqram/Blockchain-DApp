"use client";

import Card from "./card";
import { useCards } from "../hooks/useCards";
import { Contract } from "ethers";

type Props = {
  contract: Contract | null;
  account: string | null;
};

export default function DisplayCards({ contract, account }: Props) {
  const { cards, loading } = useCards({ contract });

  const myCards = account
    ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
    : [];

  return (
    <div className="text-white">
      <h2 className="text-xl font-bold mb-2">My Cards</h2>

      {loading && <p>Loading...</p>}

      {myCards.length === 0 && !loading && (
        <p className="text-gray-400">You don’t own any cards yet.</p>
      )}

      <div className="grid grid-cols-3 gap-4">
        {myCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
