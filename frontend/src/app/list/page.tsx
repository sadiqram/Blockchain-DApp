"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getContract } from "../contract";
import { ethers } from "ethers";


export default function List() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
 
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleListClick = async () => {
    if (!account) {
      setShowError(true);
      return;
    }
  
    try {
      const contract = await getContract(); 
  
      const tx = await contract.listCard(0, 100);
      await tx.wait();
  
      console.log("Listed!");
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-100 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <Link href="/">
          <p className="text-blue-600 hover:text-blue-700 font-bold text-lg cursor-pointer">
            Home
          </p>
        </Link>
      </div>
      
      {/* List Title */}
      <h1 className="text-5xl font-bold text-blue-600 text-center mb-8">List</h1>
      
      {/* Error Message */}
      {showError && (
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
            <p className="font-bold">Error!</p>
            <p>You must connect your MetaMask wallet to list items.</p>
          </div>
        </div>
      )}
      
      {/* Pokemon Card */}
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center">
          <div className="bg-blue-500 p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-64 h-80">
            <h2 className="text-2xl font-bold text-yellow-300 mb-4">Pokemon</h2>
          </div>
          
          {/* Name Input */}
          <div className="mt-4">
            <label className="text-gray-800 font-bold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter item name"
              className="block mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
          
          {/* Price Input */}
          <div className="mt-4">
            <label className="text-gray-800 font-bold">Price</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="block mt-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
            />
          </div>
          
          <button 
            onClick={handleListClick}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors cursor-pointer"
          >
            List
          </button>
        </div>
      </div>
    </div>
  );
}

