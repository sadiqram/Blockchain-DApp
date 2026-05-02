import { ethers } from "ethers";
import YODAABI from "../contracts/YODA.json";

export async function requestYodaTokens(contractAddress) {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(contractAddress, YODAABI.abi, signer);

        const tx = await contract.receiveTokens();
        await tx.wait();

        console.log("YODA tokens requested successfully");
    } catch (err) {
        console.error("YODA request failed:", err);
        throw err;
    }
}