import Link from "next/link";

export default function BidButton({ tokenId }: { tokenId: number }) {
  return (
    <Link href={`/auctions?tokenId=${tokenId}`}>
      <button className="mt-2 bg-purple-600 text-white px-3 py-1 rounded">
        Bid
      </button>
    </Link>
  );
}
