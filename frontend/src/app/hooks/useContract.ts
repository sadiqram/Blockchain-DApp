"use client";

import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { getReadOnlyContract, getWriteContract } from "../contract";

export function useContract() {
  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadContracts = async () => {
      try {
        setLoading(true);
        setError(null);

        // -------------------------
        // READ CONTRACT (RPC)
        // -------------------------
        const read = await getReadOnlyContract();

        if (!mounted) return;
        setReadContract(read);

        // -------------------------
        // WRITE CONTRACT (MetaMask)
        // -------------------------
        try {
          const write = await getWriteContract();

          if (!mounted) return;
          setWriteContract(write);
        } catch {
          console.log("Wallet not connected (write disabled)");
          if (mounted) setWriteContract(null);
        }
      } catch (err: any) {
        console.error("useContract error:", err);
        if (mounted) {
          setError(err?.message || "Failed to load contracts");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadContracts();

    return () => {
      mounted = false;
    };
  }, []); //  only runs once

  return {
    readContract,
    writeContract,
    loading,
    error,
  };
}
