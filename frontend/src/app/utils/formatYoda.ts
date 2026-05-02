import { ethers } from "ethers";

export function formatYoda(amount: string) {
  return `${ethers.formatUnits(amount, 18)} YODA`;
}
