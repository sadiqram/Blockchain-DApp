import { ethers } from "ethers";
// import PokemonArtifact from "../../../artifacts/contracts/pokemonsc.sol/PokemonFTCG.json";
import abi from "./contracts/PokemonFTCG.json" assert { type: "json" };



export const CONTRACT_ABI = abi.abi;
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS ||
  "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
export const YODA_TOKEN_ADDRESS =
  process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS ||
  "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// export const CONTRACT_ABI = [
//   "function totalSupply() public view returns (uint256)",
//   "function mintCard(address to, string name, uint256 attack, uint256 defense, uint256 hp, uint8 rarity, bool shiny)",
//   "function listCard(uint256 cardId, uint256 price)",
//   "function cancelListing(uint256 tokenId)",
//   "function buyCard(uint256 cardId)",
//   "function startAuction(uint256 tokenId, uint256 startingPrice, uint256 duration)",
//   "function endAuction(uint256 tokenId)",
//   "function claimNFT(uint256 tokenId)",
//   "function refundBids(uint256 tokenId)",
//   "function placeBid(uint256 tokenId, uint256 amount)",
//   "function ownerOf(uint256 tokenId) view returns (address)",
//   "function listings(uint256) view returns (uint256 price, address seller)",
//   "function getListing(uint256 tokenId) view returns (uint256 price, address seller)",
//   "function _nextTokenId() view returns (uint256)",
//   "function getActiveAuctions() view returns (uint256[])",
//   "function auctions(uint256) view returns (tuple(uint256 startingPrice,uint256 currentPrice,uint256 endTime,address highestBidder,uint256 highestBid,uint256 tokenId,address seller,bool active,bool ended,bool claimed,bool refunded))",
// ];
export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function balanceOf(address owner) view returns (uint256)",
  "function receiveTokens()",
];

export const getReadOnlyContract = () => {
  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL || "http://127.0.0.1:8545";
  const provider = new ethers.JsonRpcProvider(rpcUrl);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
};

export const getWriteContract = async () => {
  const { ethereum } = window as any;

  if (!ethereum) throw new Error("MetaMask not found");

  const provider = new ethers.BrowserProvider(ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
};