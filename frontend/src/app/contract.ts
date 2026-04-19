import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xYOUR_DEPLOYED_ADDRESS_HERE";

export const CONTRACT_ABI = [
  "function listCard(uint256 cardId, uint256 price)",
  "function buyCard(uint256 cardId)",
  "function placeBid(uint256 tokenId, uint256 amount)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function listings(uint256) view returns (uint256 price, address seller)",
];

export const getContract = async () => {
  const { ethereum } = window as any;

  if (!ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};