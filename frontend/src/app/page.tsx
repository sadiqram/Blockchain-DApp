"use client";

import Link from "next/link";
import { useWallet } from "./hooks/useWallet";
import { ethers } from "ethers";
import DisplayCards from "./components/displayCards";
import { getReadOnlyContract } from "./contract";
import { useEffect, useState } from "react";
import { Contract } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "./contract";

export default function Home() {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();
  const [readContract, setReadContract] = useState<Contract | null>(null);
  const [writeContract, setWriteContract] = useState<Contract | null>(null);
  
  useEffect(() => {
    const loadContracts = async () => {
      if (!window.ethereum) return;

      const provider = new ethers.BrowserProvider(window.ethereum);

      // ✅ read contract
      const read = await getReadOnlyContract();
      setReadContract(read);

      // ✅ write contract (only if wallet connected)
      try {
        const signer = await provider.getSigner();

        const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
        const abi = CONTRACT_ABI; // your ABI

        const write = new ethers.Contract(contractAddress, abi, signer);
        setWriteContract(write);
      } catch (err) {
        console.log("No signer yet");
      }
    };

    loadContracts();
  }, [account]);
  useEffect(() => {
    const test = async () => {
      const contract = await getReadOnlyContract();
      console.log("TOTAL SUPPLY:", await contract.totalSupply());

      // 🔥 NEW FUNCTION TEST
      const data = await contract.getAllCards();
      console.log("ALL CARDS:", data);
    };

    test();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-5xl font-bold text-blue-600 mb-16">
        Fantasy Pokemon Trading Cards
      </h1>

      {/* Cards */}
      <DisplayCards contract={readContract} account={account} />

      {/* Text */}
      <h2 className="text-3xl font-bold text-gray-800 mb-8">
        Buy, List, Bid, and More!
      </h2>

      {/* Wallet Section */}
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors"
        >
          {isConnecting ? "Connecting..." : "Connect MetaMask Wallet"}
        </button>
      ) : (
        <div className="text-center mb-8">
          <p className="text-gray-800 font-bold mb-2">
            Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
          </p>

          <button
            onClick={disconnectWallet}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg"
          >
            Disconnect
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4 mt-4">
        <Link href="/mint">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            Mint
          </button>
        </Link>

        <Link href="/marketplace">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            Buy
          </button>
        </Link>

        <Link href="/my-cards">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            List
          </button>
        </Link>

        <Link href="/auction">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            Bid
          </button>
        </Link>
      </div>
    </div>
  );
}
