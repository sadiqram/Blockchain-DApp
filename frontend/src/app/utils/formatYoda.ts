import { ethers } from "ethers";

export function formatYoda(amount: string) {
  const value = Math.floor(Number(ethers.formatUnits(amount, 18)));
  return value.toLocaleString();
}