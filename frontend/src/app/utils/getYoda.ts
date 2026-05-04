"use client";

import { ethers } from "ethers";
import YodaABI from "../contracts/YODA.json";

// -----------------------------
// GET YODA CONTRACT
// -----------------------------
export async function getYodaContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(
    process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS!,
    YodaABI.abi,
    signer,
  );
}

// -----------------------------
// CLAIM FREE YODA
// -----------------------------
export async function getFreeYoda() {
  try {
    const yoda = await getYodaContract();

    const tx = await yoda.receiveTokens();
    await tx.wait();

    return { success: true };
  } catch (err: any) {
    console.error("YODA claim failed:", err);

    return {
      success: false,
      error: err?.reason || err?.message || "Transaction failed",
    };
  }
}

// -----------------------------
// GET BALANCE
// -----------------------------
export async function getYodaBalance(account: string) {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const contract = new ethers.Contract(
      process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS!,
      YodaABI.abi,
      provider,
    );

    const balance = await contract.balanceOf(account);

    return ethers.formatUnits(balance, 18);
  } catch (err) {
    console.error("Balance fetch failed:", err);
    return "0";
  }
}
