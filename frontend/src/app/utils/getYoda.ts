"use client";

import { ethers } from "ethers";
import YodaABI from "../contracts/YODA.json";


const YODA_ADDRESS = process.env.NEXT_PUBLIC_YODA_TOKEN_ADDRESS!;
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL;

//  SINGLETON provider + contract (VERY IMPORTANT)
const provider = new ethers.JsonRpcProvider(RPC_URL);
const readContract = new ethers.Contract(YODA_ADDRESS, YodaABI.abi, provider);

// -----------------------------
// WRITE CONTRACT (MetaMask)
// -----------------------------
export async function getYodaContract() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  const browserProvider = new ethers.BrowserProvider(window.ethereum);
  const signer = await browserProvider.getSigner();

  return new ethers.Contract(YODA_ADDRESS, YodaABI.abi, signer);
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
let lastFetch = 0;
let cachedBalance = "0";

export async function getYodaBalance(account: string) {
  const now = Date.now();

  // cache for 10 seconds(attempt to fix rpc limit issue)
  if (now - lastFetch < 10000) {
    return cachedBalance;
  }

  try {
    const balance = await readContract.balanceOf(account);

    cachedBalance = ethers.formatUnits(balance, 18);
    lastFetch = now;

    return cachedBalance;
  } catch (err) {
    console.error("Balance fetch failed:", err);
    return cachedBalance;
  }
}
