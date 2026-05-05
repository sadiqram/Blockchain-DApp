import { ethers } from "ethers";
import abi from "./contracts/PokemonFTCG.json" assert { type: "json" };

export const CONTRACT_ABI = abi.abi;

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS;

export const YODA_TOKEN_ADDRESS = process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS;

// -----------------------------
// READ ONLY CONTRACT
// -----------------------------
export const getReadOnlyContract = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;

  if (!rpcUrl) {
    throw new Error("Missing NEXT_PUBLIC_RPC_URL");
  }

  if (!CONTRACT_ADDRESS) {
    throw new Error("Missing NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS");
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl);

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

// -----------------------------
// WRITE CONTRACT (MetaMask)
// -----------------------------
export const getWriteContract = async () => {
  const { ethereum } = window as any;

  if (!ethereum) throw new Error("MetaMask not found");

  if (!CONTRACT_ADDRESS) {
    throw new Error("Missing NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS");
  }

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};
