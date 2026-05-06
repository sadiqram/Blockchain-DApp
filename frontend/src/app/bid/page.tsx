// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { useWallet } from "../hooks/useWallet";
// import {
//   getReadOnlyContract,
//   getWriteContract,
//   CONTRACT_ADDRESS,
//   YODA_TOKEN_ADDRESS,
//   ERC20_ABI,
// } from "../contract";

// export default function Bid() {
//   const { account, isConnected, connectWallet, disconnectWallet } = useWallet();

//   const [auctions, setAuctions] = useState<any[]>([]);
//   const [bids, setBids] = useState<{ [key: number]: string }>({});
//   const [status, setStatus] = useState("");

//   const loadAuctions = async () => {
//     try {
//       const contract = getReadOnlyContract();

//       const ids = await contract.getActiveAuctions();
//       const temp: any[] = [];

//       for (let id of ids) {
//         const auction = await contract.auctions(id);

//         temp.push({
//           tokenId: Number(id),
//           currentPrice: auction.currentPrice.toString(),
//           highestBid: auction.highestBid.toString(),
//           endTime: Number(auction.endTime),
//         });
//       }

//       setAuctions(temp);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     loadAuctions();
//   }, []);

//   const withStatus = async (label: string, action: () => Promise<void>) => {
//     try {
//       setStatus(`${label}...`);
//       await action();
//       setStatus(`${label} complete`);
//       await loadAuctions();
//     } catch (err) {
//       console.error(err);
//       setStatus(`${label} failed`);
//     }
//   };

//   const handleEndAuction = async (tokenId: number) =>
//     withStatus(`Ending auction #${tokenId}`, async () => {
//       const contract = await getWriteContract();
//       const tx = await contract.endAuction(tokenId);
//       await tx.wait();
//     });

//   const handleClaim = async (tokenId: number) =>
//     withStatus(`Claiming NFT #${tokenId}`, async () => {
//       const contract = await getWriteContract();
//       const tx = await contract.claimNFT(tokenId);
//       await tx.wait();
//     });

//   const handleRefund = async (tokenId: number) =>
//     withStatus(`Refunding bids for #${tokenId}`, async () => {
//       const contract = await getWriteContract();
//       const tx = await contract.refundBids(tokenId);
//       await tx.wait();
//     });

//   const handleBid = async (tokenId: number, bidAmount: string) => {
//     if (!account) return;

//     await withStatus(`Placing bid on #${tokenId}`, async () => {
//       const signerContract = await getWriteContract();

//       const { ethereum } = window as any;
//       const provider = new ethers.BrowserProvider(ethereum);
//       const signer = await provider.getSigner();

//       const token = new ethers.Contract(YODA_TOKEN_ADDRESS, ERC20_ABI, signer);

//       const amount = ethers.parseUnits(bidAmount, 18);

//       const approveTx = await token.approve(CONTRACT_ADDRESS, amount);
//       await approveTx.wait();

//       const tx = await signerContract.placeBid(tokenId, amount);
//       await tx.wait();
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="p-6">
//         <Link href="/">Home</Link>
//       </div>

//       <h1 className="text-5xl text-center font-bold mb-8">Bid</h1>

//       {!isConnected ? (
//         <div className="flex justify-center">
//           <button
//             onClick={connectWallet}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//           >
//             Connect Wallet
//           </button>
//         </div>
//       ) : (
//         <div className="text-center mb-4">
//           <p>
//             Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
//           </p>

//           <button
//             onClick={disconnectWallet}
//             className="bg-red-600 text-white px-3 py-1 rounded mt-2"
//           >
//             Disconnect
//           </button>
//         </div>
//       )}

//       {status ? <p className="text-center mb-4 text-gray-700">{status}</p> : null}

//       <div className="flex justify-center gap-4 flex-wrap">
//         {auctions.map((a) => (
//           <div
//             key={a.tokenId}
//             className="bg-blue-500 p-4 w-64 rounded-lg text-center"
//           >
//             <h2 className="text-yellow-300 font-bold">Auction #{a.tokenId}</h2>

//             <p className="text-white mt-2">
//               Current: {ethers.formatUnits(a.currentPrice, 18)}
//             </p>
//             <p className="text-white mt-2">
//               Ends: {new Date(a.endTime * 1000).toLocaleTimeString()}
//             </p>

//             <input
//               className="mt-2 px-2 py-1 text-black rounded"
//               placeholder="Bid amount"
//               value={bids[a.tokenId] || ""}
//               onChange={(e) =>
//                 setBids({ ...bids, [a.tokenId]: e.target.value })
//               }
//             />

//             <button
//               onClick={() => handleBid(a.tokenId, bids[a.tokenId])}
//               className="mt-2 bg-blue-700 text-white px-4 py-2 rounded"
//             >
//               Bid
//             </button>

//             <button
//               onClick={() => handleEndAuction(a.tokenId)}
//               className="mt-2 bg-orange-700 text-white px-4 py-2 rounded"
//             >
//               End
//             </button>

//             <button
//               onClick={() => handleClaim(a.tokenId)}
//               className="mt-2 bg-green-700 text-white px-4 py-2 rounded"
//             >
//               Claim
//             </button>

//             <button
//               onClick={() => handleRefund(a.tokenId)}
//               className="mt-2 bg-purple-700 text-white px-4 py-2 rounded"
//             >
//               Refund
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
