type Props = {
  onClick: () => void;
};

export default function BuyButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
    >
      Buy
    </button>
  );
}
