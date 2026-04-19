"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getContract, CONTRACT_ADDRESS } from "../contract";
import { ethers } from "ethers";

export const YODA_TOKEN_ADDRESS = "0xYOUR_YODA_TOKEN_ADDRESS";
const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function receiveTokens()",
];

export default function Buy() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const contract = await getContract();

        const temp = [];

        for (let i = 0; i < 4; i++) {
          const listing = await contract.getListing(i);

          if (listing.price > 0) {
            temp.push({
              tokenId: i,
              price: listing.price.toString(),
              seller: listing.seller,
            });
          }
        }

        setListings(temp);
      } catch (err) {
        console.error(err);
      }
    };

    fetchListings();
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyClick = async (tokenId: number, price: string) => {
    if (!account) {
      setShowError(true);
      return;
    }

    try {
      const { ethereum } = window as any;

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = await getContract();

      // Convert price from contract (assumed 18 decimals)
      const amount = BigInt(price);

      const token = new ethers.Contract(YODA_TOKEN_ADDRESS, ERC20_ABI, signer);

      // 1. approve marketplace
      const approveTx = await token.approve(CONTRACT_ADDRESS, amount);
      await approveTx.wait();

      // 2. buy NFT
      const tx = await contract.buyCard(tokenId);
      await tx.wait();

      console.log("Bought successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Home link */}
      <div className="p-6">
        <Link href="/">
          <p className="text-blue-600 hover:text-blue-700 font-bold text-lg cursor-pointer">
            Home
          </p>
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-5xl font-bold text-blue-600 text-center mb-8">Buy</h1>

      {/* Error */}
      {showError && (
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
            <p className="font-bold">Error!</p>
            <p>You must connect your MetaMask wallet to buy items.</p>
          </div>
        </div>
      )}

      {/* Listings */}
      <div className="flex justify-center gap-4 py-8 flex-wrap">
        {listings.map((item) => (
          <div key={item.tokenId} className="flex flex-col items-center">
            <div className="bg-blue-500 p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-64 h-80">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                Pokemon #{item.tokenId}
              </h2>
            </div>

            <p className="text-gray-800 font-bold mt-2">
              Price: {ethers.formatUnits(item.price, 18)} Yoda
            </p>

            <button
              onClick={() => handleBuyClick(item.tokenId, item.price)}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors cursor-pointer"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
