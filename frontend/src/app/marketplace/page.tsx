"use client";

import { useCards } from "../hooks/useCards";
import { useMarketplace } from "../hooks/useMarketplace";
import { useContract } from "../hooks/useContract";
import { useWallet } from "../hooks/useWallet";
import Card from "../components/card";
import { useCallback } from "react";

export default function MarketplacePage() {
  const {
    account, // ✅ FIX: needed for ownership checks
  } = useWallet();

  const {
    readContract,
    writeContract,
    loading: contractLoading,
    error: contractError,
  } = useContract();

  const {
    cards,
    loading: cardsLoading,
    reload,
  } = useCards({
    contract: readContract,
  });

  const {
    buyCard,
    loading: txLoading,
    error: txError,
  } = useMarketplace({ contract: writeContract });

  // -------------------------
  // FILTER LISTED CARDS
  // -------------------------
  const listed = cards.filter((c) => c.isListed);

  // -------------------------
  // SAFE RELOAD (prevents RPC spam)
  // -------------------------
  const safeReload = useCallback(() => {
    setTimeout(() => {
      reload();
    }, 1200);
  }, [reload]);

  // -------------------------
  // BUY HANDLER (clean version)
  // -------------------------
  const handleBuy = async (id: number) => {
    try {
      await buyCard(id);
      safeReload();
    } catch (err) {
      console.error("Buy failed:", err);
    }
  };

  // -------------------------
  // LOADING
  // -------------------------
  if (contractLoading || cardsLoading) {
    return <p className="p-8">Loading marketplace...</p>;
  }

  if (contractError) {
    return <p className="p-8 text-red-500">{contractError}</p>;
  }

  // -------------------------
  // EMPTY STATE
  // -------------------------
  if (listed.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
        <p className="text-gray-500">No cards listed yet.</p>
      </div>
    );
  }

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

      {/* TX ERROR */}
      {txError && <p className="mb-4 text-red-500 text-sm">{txError}</p>}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {listed.map((c) => (
          <Card
            key={c.id}
            card={c}
            account={account}
            onBuy={handleBuy}
            disabled={txLoading}
          />
        ))}
      </div>

      {/* TX STATUS */}
      {txLoading && (
        <p className="mt-6 text-sm text-gray-500 text-center">
          Processing transaction...
        </p>
      )}
    </div>
  );
}
