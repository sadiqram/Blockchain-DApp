"use client";

import { useState } from "react";
import { Contract } from "ethers";

type UseAuctionProps = {
  contract: Contract | null;
};

export function useAuction({ contract }: UseAuctionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // PLACE BID
  // -------------------------
  const placeBid = async (tokenId: number, amount: string) => {
    if (!contract) {
      setError("Contract not loaded");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const tx = await contract.placeBid(tokenId, amount);
      await tx.wait();

      return tx;
    } catch (err: any) {
      console.error("placeBid error:", err);
      setError(err?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // START AUCTION
  // -------------------------
  const startAuction = async (
    tokenId: number,
    startingPrice: string,
    duration: number,
  ) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.startAuction(tokenId, startingPrice, duration);
      await tx.wait();

      return tx;
    } catch (err: any) {
      console.error("startAuction error:", err);
      setError(err?.message || "Failed to start auction");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // END AUCTION
  // -------------------------
  const endAuction = async (tokenId: number) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.endAuction(tokenId);
      await tx.wait();

      return tx;
    } catch (err: any) {
      console.error("endAuction error:", err);
      setError(err?.message || "Failed to end auction");
    } finally {
      setLoading(false);
    }
  };

  return {
    placeBid,
    startAuction,
    endAuction,
    loading,
    error,
  };
}
