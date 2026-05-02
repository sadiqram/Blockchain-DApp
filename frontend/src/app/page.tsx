"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bangers } from "next/font/google";

const titleFont = Bangers({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <h1
        className={`${titleFont.className} text-6xl mb-16 text-[#ffcc03]`}
        style={{
          textShadow: `
      -3px -3px 0 #2a75bb,
       3px -3px 0 #2a75bb,
      -3px  3px 0 #2a75bb,
       3px  3px 0 #2a75bb,
       0px  3px 0 #2a75bb,
       3px  0px 0 #2a75bb,
      -3px  0px 0 #2a75bb,
       0px -3px 0 #2a75bb
    `,
        }}
      >
        Pokemon FTCG
      </h1>

      {/* Cards */}
      <div className="flex gap-4 mb-8">
        {["/charizard.jpg", "/mewtwo.jpg", "/pikachu.jpg", "/snorlax.jpg"].map(
          (image, i) => (
            <div
              key={i}
              className="w-64 h-80 rounded-lg shadow-md overflow-hidden bg-blue-500"
            >
              <img
                src={image}
                alt={`Pokemon ${i + 1}`}
                className="w-full h-full object-fill"
              />
            </div>
          ),
        )}
      </div>

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

        <Link href="/buy">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            Buy
          </button>
        </Link>

        <Link href="/list">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            List
          </button>
        </Link>

        <Link href="/bid">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md">
            Bid
          </button>
        </Link>
      </div>
    </div>
  );
}
