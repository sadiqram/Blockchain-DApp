import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      {/* Header */}
      <h1 className="text-5xl font-bold text-blue-600 mb-16">Market Chain</h1>

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

      {/* Buttons */}
      <div className="flex gap-4">
        <Link href="/buy">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
            Buy
          </button>
        </Link>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
          List
        </button>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-colors cursor-pointer">
          Bid
        </button>
      </div>
    </div>
  );
}
