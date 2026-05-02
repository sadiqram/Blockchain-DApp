"use client";

import { useState } from "react";
import { Contract } from "ethers";

type UseMarketplaceProps = {
  contract: Contract | null;
};

export function useMarketplace({ contract }: UseMarketplaceProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // LIST CARD
  // -------------------------
  const listCard = async (id: number, price: string | number) => {
    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.listCard(id, price);
      await tx.wait(); // IMPORTANT: wait for confirmation

      return tx;
    } catch (err: any) {
      console.error("listCard error:", err);
      setError(err?.message || "Failed to list card");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // BUY CARD
  // -------------------------
  const buyCard = async (id: number) => {
    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.buyCard(id);
      await tx.wait(); // wait for blockchain confirmation

      return tx;
    } catch (err: any) {
      console.error("buyCard error:", err);
      setError(err?.message || "Failed to buy card");
    } finally {
      setLoading(false);
    }
  };

  return {
    listCard,
    buyCard,
    loading,
    error,
  };
}
