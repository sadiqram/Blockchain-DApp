"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getContract,
  CONTRACT_ADDRESS,
  CONTRACT_ABI,
  ERC20_ABI,
} from "../contract";
import { ethers } from "ethers";

export const YODA_TOKEN_ADDRESS = "0xYOUR_YODA_TOKEN_ADDRESS";
console.log("Frontend address:", CONTRACT_ADDRESS);

export default function Bid() {
  const [account, setAccount] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [newBids, setNewBids] = useState<{ [key: number]: string }>({});
  const [auctions, setAuctions] = useState<any[]>([]);

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const contract = await getContract();

        // TEST CONNECTION HERE
        const owner = await contract.contractOwner();
        console.log("Contract owner:", owner);

        const ids = await contract.getActiveAuctions();
        console.log("Active auctions:", ids);

        const temp = [];

        for (let id of ids) {
          const auction = await contract.auctions(id);

          temp.push({
            tokenId: Number(id),
            currentPrice: auction.currentPrice.toString(),
            highestBid: auction.highestBid.toString(),
            highestBidder: auction.highestBidder,
          });
        }

        setAuctions(temp);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAuctions();
  }, []);

  // add to all pages too
  const disconnectWallet = () => {
    setAccount(null);
    setAuctions([]);
  };
  {
    account && (
      <button
        onClick={disconnectWallet}
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Disconnect Wallet
      </button>
    );
  }

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

  const handleBidClick = async (cardId: number, bidAmount: string) => {
    if (!account) {
      setShowError(true);
      return;
    }

    try {
      const { ethereum } = window as any;

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      const contract = await getContract();
      const owner = await contract.contractOwner();
      console.log("Contract owner:", owner);
      console.log(await contract.getActiveAuctions());

      const amount = ethers.parseUnits(bidAmount, 18);

      const token = new ethers.Contract(YODA_TOKEN_ADDRESS, ERC20_ABI, signer);

      //  Approve
      const approveTx = await token.approve(CONTRACT_ADDRESS, amount);
      await approveTx.wait();

      // Step 2: Bid
      const tx = await contract.placeBid(cardId, amount);
      await tx.wait();

      console.log("Bid placed!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetTokens = async () => {
    const { ethereum } = window as any;

    const provider = new ethers.BrowserProvider(ethereum);
    const signer = await provider.getSigner();

    const token = new ethers.Contract(YODA_TOKEN_ADDRESS, CONTRACT_ABI, signer);

    const tx = await token.receiveTokens();
    await tx.wait();

    console.log("Tokens received!");
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
      <div className="p-6">
        <Link href="/">
          <p className="text-blue-600 hover:text-blue-700 font-bold text-lg cursor-pointer">
            Home
          </p>
        </Link>
      </div>

      {/* Bid Title */}
      <h1 className="text-5xl font-bold text-blue-600 text-center mb-8">Bid</h1>

      {/* Error Message */}
      {showError && (
        <div className="flex justify-center mb-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center">
            <p className="font-bold">Error!</p>
            <p>You must connect your MetaMask wallet to bid on items.</p>
          </div>
        </div>
      )}

      {/* Pokemon Cards */}
      {account && (
        <button
          onClick={disconnectWallet}
          className="bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Disconnect
        </button>
      )}
      <div className="flex justify-center gap-4 py-8">
        {auctions.map((auction, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-blue-500 p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-64 h-80">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">
                Pokemon
              </h2>
            </div>

            <p className="text-gray-800 font-bold mt-2">
              Current Bid: {ethers.formatUnits(auction.currentPrice, 18)} Yoda
            </p>

            <div className="mt-4">
              <label className="text-gray-800 font-bold">Enter New Bid</label>
              <input
                type="text"
                value={newBids[auction.tokenId] || ""}
                onChange={(e) =>
                  setNewBids({
                    ...newBids,
                    [auction.tokenId]: e.target.value,
                  })
                }
                // onChange={(e) => setNewBids({ ...newBids, [i]: e.target.value })}
                className="block mt-2 px-4 py-2 border rounded-lg text-black"
              />
            </div>

            <button
              onClick={() => {
                const bid = newBids[auction.tokenId];
                if (!bid) {
                  alert("Enter a bid amount");
                  return;
                }
                handleBidClick(auction.tokenId, bid);
              }}
              className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-lg"
            >
              Bid
            </button>
            <button onClick={handleGetTokens}>Get Free YODA</button>
          </div>
        ))}
      </div>
    </div>
  );
}
