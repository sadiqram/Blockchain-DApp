import { ethers } from "ethers";
import PokemonFTCGABI from "../contracts/PokemonFTCG.json";

export async function handleMint(card, contractAddress, setIsBuying) {
  try {
    setIsBuying(true);
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, PokemonFTCGABI.abi, signer);
    const to = await signer.getAddress();
    const tx = await contract.mintCard(
      to,
      card.name,
      BigInt(card.attack),
      BigInt(card.defense),
      BigInt(card.hp),
      Number(card.rarity),
      Boolean(card.shiny),
    );

    await tx.wait();
    return tx.hash;

  } catch (err) {
    console.error("Mint failed:", err);
    throw err;
  } finally {
    setIsBuying(false);
  }
}