"use client";

import { useEffect, useState } from "react";
import { Contract, ethers } from "ethers";
import { useCards } from "../hooks/useCards";

type Props = {
  contract: Contract | null;
  account: string | null;
};

type CardType = {
  id: number;
  name: string;
  attack: string;
  defense: string;
  hp: string;
  rarity: number;
  shiny: boolean;
  owner: string;
};

export default function CardsPage({ contract }: any) {
  const { cards, loading, error } = useCards({ contract });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {cards.map((c) => (
        <div key={c.id}>{c.name}</div>
      ))}
    </div>
  );
}

// export default function DisplayCards({ contract, account }: Props) {
//   const [cards, setCards] = useState<CardType[]>([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const loadCards = async () => {
//       if (!contract) return;

//       try {
//         setLoading(true);

//         const total = Number(await contract._nextTokenId());
//         console.log("NEXT TOKEN ID:", total);
//         console.log("CONTRACT:", contract.target);
//         const allCards: CardType[] = [];

//         for (let i = 0; i < total; i++) {
//           try {
//             const owner = await contract.ownerOf(i);
//             const card = await contract.cards(i);

//             allCards.push({
//               id: i,
//               name: card.name,
//               attack: card.attack.toString(),
//               defense: card.defense.toString(),
//               hp: card.hp.toString(),
//               rarity: Number(card.rarity),
//               shiny: card.Shiny,
//               owner,
//             });
//           } catch (err) {
//             continue;
//           }
//         }

//         setCards(allCards);
//       } catch (err) {
//         console.error("Failed to load cards:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadCards();
//   }, [contract]);

//   const myCards = account
//     ? cards.filter((c) => c.owner.toLowerCase() === account.toLowerCase())
//     : [];

//   return (
//     <div className="w-full px-6 mt-10 text-white">
//       {loading && <p className="text-gray-300 mb-4">Loading cards...</p>}

//       {/* MY CARDS (optional section) */}
//       {account && (
//         <>
//           <h2 className="text-2xl font-bold mb-4">My Cards</h2>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//             {myCards.length === 0 ? (
//               <p className="text-gray-400">No cards owned yet.</p>
//             ) : (
//               myCards.map((card) => (
//                 <div
//                   key={card.id}
//                   className="bg-gray-800 p-4 rounded shadow border border-gray-700"
//                 >
//                   <h2 className="font-bold text-lg">{card.name}</h2>

//                   <p>HP: {card.hp}</p>
//                   <p>ATK: {card.attack}</p>
//                   <p>DEF: {card.defense}</p>
//                   <p>Rarity: {card.rarity}</p>

//                   {card.shiny && <p className="text-yellow-400">✨ Shiny</p>}

//                   <button className="mt-2 bg-blue-600 text-white px-3 py-1 rounded">
//                     List Card
//                   </button>
//                 </div>
//               ))
//             )}
//           </div>
//         </>
//       )}

//       {/* ALL CARDS */}
//       <h2 className="text-2xl font-bold mb-4">Marketplace (All Cards)</h2>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         {cards.length === 0 ? (
//           <p className="text-gray-400">No cards found.</p>
//         ) : (
//           cards.map((card) => (
//             <div
//               key={card.id}
//               className="bg-gray-800 p-4 rounded shadow border border-gray-700"
//             >
//               <h2 className="font-bold text-lg">{card.name}</h2>

//               <p>HP: {card.hp}</p>
//               <p>ATK: {card.attack}</p>

//               <p className="text-xs text-gray-300 mt-2">
//                 Owner: {card.owner.slice(0, 6)}...
//                 {card.owner.slice(-4)}
//               </p>

//               <button className="mt-2 bg-green-600 text-white px-3 py-1 rounded">
//                 Buy
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }
