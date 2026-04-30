import { ethers } from "ethers";

export const CONTRACT_ADDRESS = "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53";

export const CONTRACT_ABI = [
  "function listCard(uint256 cardId, uint256 price)",
  "function buyCard(uint256 cardId)",
  "function placeBid(uint256 tokenId, uint256 amount)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function listings(uint256) view returns (uint256 price, address seller)",
  "function getActiveAuctions() view returns (uint256[])",
  "function auctions(uint256) view returns (tuple(uint256 startingPrice,uint256 currentPrice,uint256 endTime,address highestBidder,uint256 highestBid,uint256 tokenId,address seller,bool active,bool ended,bool claimed,bool refunded))",
];
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function receiveTokens()",
];


export const getContract = async () => {
  const { ethereum } = window as any;

  if (!ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};