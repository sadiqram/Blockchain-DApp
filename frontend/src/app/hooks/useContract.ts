"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract";

type Contract = ethers.Contract | null;

export function useContract(account: string | null) {
  const [readContract, setReadContract] = useState<Contract>(null);
  const [writeContract, setWriteContract] = useState<Contract>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  // -------------------------
  // INIT PROVIDER + READ CONTRACT
  // -------------------------
  useEffect(() => {
    const init = async () => {
      // Read-only provider (RPC)
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";

      const rpcProvider = new ethers.JsonRpcProvider(rpcUrl);

      const read = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        rpcProvider,
      );

      setReadContract(read);
    };

    init();
  }, []);

  // -------------------------
  // INIT SIGNER + WRITE CONTRACT
  // -------------------------
  useEffect(() => {
    const initWrite = async () => {
      if (!window.ethereum || !account) {
        setWriteContract(null);
        setProvider(null);
        return;
      }

      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      try {
        const signer = await browserProvider.getSigner();

        const write = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer,
        );

        setWriteContract(write);
      } catch (err) {
        console.log("No signer available yet:", err);
        setWriteContract(null);
      }
    };

    initWrite();
  }, [account]);

  return {
    readContract,
    writeContract,
    provider,
  };
}
