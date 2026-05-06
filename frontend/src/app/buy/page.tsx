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

// export default function Buy() {
//   const { account, isConnected, connectWallet } = useWallet();
//   const [listings, setListings] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const cardImages: Record<number, string> = {
//     0: "/charizard.jpg",
//     1: "/mewtwo.jpg",
//     2: "/pikachu.jpg",
//     3: "/snorlax.jpg",
//   };

//   useEffect(() => {
//     const loadListings = async () => {
//       try {
//         const contract = getReadOnlyContract();

//         const temp: any[] = [];

//         for (let i = 0; i < 4; i++) {
//           const listing = await contract.listings(i);

//           if (listing.price > 0) {
//             temp.push({
//               tokenId: i,
//               price: listing.price.toString(),
//               seller: listing.seller,
//             });
//           }
//         }

//         setListings(temp);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadListings();
//   }, []);

//   const handleBuy = async (tokenId: number, price: string) => {
//     if (!account) return;

//     try {
//       const signerContract = await getWriteContract();

//       const { ethereum } = window as any;
//       const provider = new ethers.BrowserProvider(ethereum);
//       const signer = await provider.getSigner();

//       const token = new ethers.Contract(YODA_TOKEN_ADDRESS, ERC20_ABI, signer);

//       const amount = BigInt(price);

//       const approveTx = await token.approve(CONTRACT_ADDRESS, amount);
//       await approveTx.wait();

//       const tx = await signerContract.buyCard(tokenId);
//       await tx.wait();

//       console.log("Bought successfully");
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <div className="p-6">
//         <Link href="/">Home</Link>
//       </div>

//       <h1 className="text-5xl text-center font-bold mb-8">Buy</h1>

//       {!isConnected ? (
//         <div className="flex justify-center">
//           <button
//             onClick={connectWallet}
//             className="bg-green-600 text-white px-6 py-2 rounded-lg"
//           >
//             Connect Wallet
//           </button>
//         </div>
//       ) : (
//         <p className="text-center mb-6">
//           Connected: {account?.slice(0, 6)}...{account?.slice(-4)}
//         </p>
//       )}

//       <div className="flex justify-center gap-4 flex-wrap">
//         {listings.map((item) => (
//           <div
//             key={item.tokenId}
//             className="bg-blue-500 p-4 w-64 rounded-lg text-center"
//           >
//             <img
//                 src={cardImages[item.tokenId]}
//                 alt={`Pokemon #${item.tokenId}`}
//                 className="w-full h-40 object-cover rounded-lg mb-3"
//             />

//             <h2 className="text-yellow-300 font-bold">
//               Pokemon #{item.tokenId}
//             </h2>

//             <p className="mt-2 text-white">
//               Price: {ethers.formatUnits(item.price, 18)} YODA
//             </p>

//             <button
//               onClick={() => handleBuy(item.tokenId, item.price)}
//               className="mt-3 bg-blue-700 text-white px-4 py-2 rounded-lg"
//             >
//               Buy
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
