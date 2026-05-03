"use client";

import { useState } from "react";
import { Contract, ethers } from "ethers";

type Props = {
  contract: Contract | null;
};

export function useMarketplace({ contract }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // LIST CARD
  // -------------------------
  const listCard = async (id: number, price: string) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.listCard(
        id,
        ethers.parseUnits(price.toString(), 18),
      );

      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // BUY CARD
  // -------------------------
  const buyCard = async (id: number) => {
    if (!contract) return;

    try {
      setLoading(true);

      const listing = await contract.getListing(id);

      const tx = await contract.buyCard(id, {
        value: listing.price,
      });

      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // START AUCTION
  // -------------------------
  const startAuction = async (
    id: number,
    price: string,
    durationSeconds: number,
  ) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.startAuction(
        id,
        ethers.parseUnits(price.toString(), 18),
        durationSeconds,
      );

      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // PLACE BID
  // -------------------------
  const placeBid = async (id: number, amount: string) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.placeBid(
        id,
        ethers.parseUnits(amount.toString(), 18),
      );

      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // END AUCTION
  // -------------------------
  const endAuction = async (id: number) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.endAuction(id);
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // CLAIM NFT
  // -------------------------
  const claimNFT = async (id: number) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.claimNFT(id);
      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    listCard,
    buyCard,
    startAuction,
    placeBid,
    endAuction,
    claimNFT,
    loading,
    error,
  };
}
