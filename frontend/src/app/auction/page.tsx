"use client";

import { useContract } from "../hooks/useContract";
import { useAuctions } from "../hooks/useAuctions";
import { useMarketplace } from "../hooks/useMarketplace";
import { useWallet } from "../hooks/useWallet";

import AuctionCard from "../components/AuctionCard";

export default function AuctionsPage() {
  const { account } = useWallet();
  const { readContract, writeContract } = useContract();

  const { auctions, reload } = useAuctions({
    contract: readContract,
  });

  const { placeBid, endAuction, claimNFT } = useMarketplace({
    contract: writeContract,
  });

  const handleBid = async (id: number, amount: string) => {
    await placeBid(id, amount);
    await reload();
  };

  const handleEnd = async (id: number) => {
    await endAuction(id);
    await reload();
  };

  const handleClaim = async (id: number) => {
    await claimNFT(id);
    await reload();
  };

  return (
    <div className="p-8 ">
      <h1 className="text-2xl font-bold mb-4">Active Auctions</h1>

      {auctions.length === 0 && <p>No active auctions</p>}

      <div className="grid grid-cols-3 gap-4">
        {auctions.map((a) => (
          <AuctionCard
            key={a.tokenId}
            card={a}
            auction={a}
            account={account}
            onBid={handleBid}
            onEnd={handleEnd}
            onClaim={handleClaim}
          />
        ))}
      </div>
    </div>
  );
}
