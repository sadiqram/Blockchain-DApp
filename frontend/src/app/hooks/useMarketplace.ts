"use client";

import { useState } from "react";
import { Contract, ethers } from "ethers";
import YodaABI from "../contracts/YODA.json";

type Props = {
  contract: Contract | null;
};

export function useMarketplace({ contract }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------
  // GET YODA CONTRACT
  // -------------------------
  const getYodaContract = async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    return new ethers.Contract(
      process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS!,
      YodaABI.abi, // ✅ IMPORTANT FIX (.abi)
      signer,
    );
  };

  // -------------------------
  // APPROVE YODA
  // -------------------------
  const approveYoda = async (amount: bigint) => {
    const yoda = await getYodaContract();

    const tx = await yoda.approve(
      process.env.NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS,
      amount,
    );

    await tx.wait();
  };

  // -------------------------
  // LIST CARD
  // -------------------------
  const listCard = async (id: number, price: string) => {
    if (!contract) return;

    try {
      setLoading(true);

      const tx = await contract.listCard(id, ethers.parseUnits(price, 18));

      await tx.wait();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // BUY CARD (YODA VERSION)
  // -------------------------
  const buyCard = async (id: number) => {
    if (!contract) return;

    try {
      setLoading(true);

      const listing = await contract.getListing(id);
      const price = listing.price;

      // ✅ Step 1: approve YODA
      await approveYoda(price);

      // ✅ Step 2: call buy (NO ETH)
      const tx = await contract.buyCard(id);

      await tx.wait();
    } catch (err: any) {
      console.error(err);
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
        ethers.parseUnits(price, 18),
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
  // PLACE BID (YODA VERSION)
  // -------------------------
  const placeBid = async (id: number, amount: string) => {
    if (!contract) return;

    try {
      setLoading(true);

      const parsed = ethers.parseUnits(amount, 18);

      // ✅ approve tokens first
      await approveYoda(parsed);

      // ✅ place bid
      const tx = await contract.placeBid(id, parsed);

      await tx.wait();
    } catch (err: any) {
      console.error(err);
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
