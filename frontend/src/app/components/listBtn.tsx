type Props = {
  onClick: () => void;
};

export default function ListButton({ onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
    >
      List
    </button>
  );
}
