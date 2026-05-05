"use client";

import { useState, useMemo } from "react";
import { Contract, ethers } from "ethers";
import YodaABI from "../contracts/YODA.json";

type Props = {
  contract: Contract | null;
};

export function useMarketplace({ contract }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Create provider ONCE (not per call)
  const provider = useMemo(() => {
    if (typeof window === "undefined" || !(window as any).ethereum) {
      return null;
    }
    return new ethers.BrowserProvider((window as any).ethereum);
  }, []);

  // -------------------------
  // GET YODA CONTRACT
  // -------------------------
  const getYodaContract = async () => {
    if (!provider) throw new Error("MetaMask not found");

    const signer = await provider.getSigner();

    return new ethers.Contract(
      process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS!,
      YodaABI.abi,
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
      setError(null);

      const tx = await contract.listCard(id, ethers.parseUnits(price, 18));

      await tx.wait();
    } catch (err: any) {
      console.error("List error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
  // BUY CARD (YODA)
  // -------------------------
  const buyCard = async (id: number) => {
    if (!contract) return;

    try {
      setLoading(true);
      setError(null);

      const listing = await contract.getListing(id);
      const price = listing.price;

      //  Approve tokens first
      await approveYoda(price);

      //  Buy (NO ETH sent)
      const tx = await contract.buyCard(id);

      await tx.wait();
    } catch (err: any) {
      console.error("Buy error:", err);
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
      setError(null);

      const tx = await contract.startAuction(
        id,
        ethers.parseUnits(price, 18),
        durationSeconds,
      );

      await tx.wait();
    } catch (err: any) {
      console.error("Auction start error:", err);
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
      setError(null);

      const parsed = ethers.parseUnits(amount, 18);

      // approve first
      await approveYoda(parsed);

      const tx = await contract.placeBid(id, parsed);

      await tx.wait();
    } catch (err: any) {
      console.error("Bid error:", err);
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
      setError(null);

      const tx = await contract.endAuction(id);

      await tx.wait();
    } catch (err: any) {
      console.error("End auction error:", err);
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
      setError(null);

      const tx = await contract.claimNFT(id);

      await tx.wait();
    } catch (err: any) {
      console.error("Claim error:", err);
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
