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
    const loadContracts = async () => {
      try {
        setLoading(true);
        setError(null);

        // READ contract (always works)
        const read = await getReadOnlyContract();
        setReadContract(read);

        // WRITE contract (only works if wallet connected)
        try {
          const write = await getWriteContract();
          setWriteContract(write);
        } catch (err) {
          console.log("Wallet not connected (write disabled)");
          setWriteContract(null);
        }
      } catch (err: any) {
        console.error("useContract error:", err);
        setError(err?.message || "Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };

    loadContracts();
  }, []);

  return {
    readContract,
    writeContract,
    loading,
    error,
  };
}