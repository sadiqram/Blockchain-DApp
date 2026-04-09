import Link from "next/link";

export default function Buy() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <Link href="/">
          <p className="text-blue-600 hover:text-blue-700 font-bold text-lg cursor-pointer">
            Home
          </p>
        </Link>
      </div>
      
      {/* Buy Title */}
      <h1 className="text-5xl font-bold text-blue-600 text-center mb-8">Buy</h1>
      <div className="flex justify-center gap-4 py-8">
        {Array.from({length: 4}, (_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="bg-blue-500 p-4 rounded-lg shadow-md flex flex-col items-center justify-center w-64 h-80">
              <h2 className="text-2xl font-bold text-yellow-300 mb-4">Pokemon</h2>
            </div>
            <p className="text-gray-800 font-bold mt-2">1 Yoda</p>
          </div>
        ))}
      </div>
    </div>
  );
}
