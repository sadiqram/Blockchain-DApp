"use client";

import { useEffect, useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const isConnected = !!account;

  // -------------------------
  // Restore session (ONLY from storage)
  // -------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedAccount = sessionStorage.getItem("wallet_account");

    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);

  // -------------------------
  // Connect wallet (manual only)
  // -------------------------
  const connectWallet = async () => {
    if (typeof window === "undefined") return;

    const { ethereum } = window as any;

    if (!ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }

    try {
      setIsConnecting(true);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
        sessionStorage.setItem("wallet_account", accounts[0]);
      }
    } catch (err: any) {
      if (err?.code === 4001) {
        console.log("User rejected connection");
      } else {
        console.error("Connection error:", err);
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // -------------------------
  // Disconnect wallet (UI only)
  // -------------------------
  const disconnectWallet = () => {
    setAccount(null);
    sessionStorage.removeItem("wallet_account");
  };

  return {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  };
}
