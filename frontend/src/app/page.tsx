"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window as any;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        }
      }
    } catch (error) {
      console.error("Error checking wallet connection:", error);
    }
  };

  const connectWallet = async () => {
    try {
      setIsConnecting(true);
      const { ethereum } = window as any;
      if (!ethereum) {
        alert("Please install MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setAccount(accounts[0]);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-5xl font-bold text-blue-600 mb-16">Fantasy Pokemon Trading Cards</h1>

      {/* Pokemon Cards */}
      <div className="flex gap-4 mb-8">
        {Array.from({length: 4}, (_, i) => (
          <div key={i} className="bg-blue-500 p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-64 h-80">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Pokemon</h2>
          </div>
        ))}
      </div>

      {/* Text */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Buy, List, Bid, and More!</h2>

      {/* Wallet Connection Section */}
      {!account ? (
        <div className="mb-8">
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer"
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
          </button>
        </div>
      ) : (
        <div className="mb-8 text-center">
          <p className="text-gray-800 font-bold mb-2">Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/buy">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
            Buy
          </button>
        </Link>
        <Link href="/list">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
            List
          </button>
        </Link>
        <Link href="/bid">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
            Bid
          </button>
        </Link>
      </div>
    </div>
  );
}
