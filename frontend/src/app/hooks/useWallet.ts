"use client";

import { useEffect, useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // -------------------------
  // Connect wallet
  // -------------------------
  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;

      if (!ethereum) {
        alert("MetaMask not found");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts?.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  };

  // -------------------------
  // Disconnect (UI only)
  // -------------------------
  const disconnectWallet = () => {
    setAccount(null);
    setIsConnected(false);
  };

  // -------------------------
  // Auto-connect + listeners
  // -------------------------
  useEffect(() => {
    const { ethereum } = window as any;

    if (!ethereum) return;

    // 1. Auto-reconnect on refresh
    const checkConnection = async () => {
      try {
        const accounts = await ethereum.request({
          method: "eth_accounts",
        });

        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        console.error(err);
      }
    };

    checkConnection();

    // 2. Handle account switching in MetaMask
    const handleAccountsChanged = (accounts: string[]) => {
      if (!accounts || accounts.length === 0) {
        setAccount(null);
        setIsConnected(false);
      } else {
        setAccount(accounts[0]);
        setIsConnected(true);
      }
    };

    ethereum.on("accountsChanged", handleAccountsChanged);

    // cleanup
    return () => {
      if (ethereum.removeListener) {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
      }
    };
  }, []);

  return {
    account,
    isConnected,
    connectWallet,
    disconnectWallet,
  };
}
