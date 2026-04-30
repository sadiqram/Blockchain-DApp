// NFT will be here to mint
const hre = require("hardhat");

const LOCAL_TESTING = false; // true for local testing | false for sepolia

async function main() {
    const [deployer] = await hre.ethers.getSigners(); // Get the deployer account

    let yodaAddress; // Declare yoda address

    if (LOCAL_TESTING) {
        console.log("Local Testing");

        const YODA = await hre.ethers.getContractFactory("YODA");
        const yoda = await YODA.deploy("Yoda Token", "YODA", 1000000); // 1 million supply
        await yoda.deploymentTransaction().wait();
        
        yodaAddress = yoda.target;

        console.log("YODA deployed to:", yodaAddress);

    } else {
        console.log("Sepolia deployment");

        yodaAddress = "0xREAL_YODA_ADDRESS"; // Given yoda address
    }

    console.log("Deploying FantasyPokemon contract");

    const FantasyPokemon = await hre.ethers.getContractFactory("FantasyPokemon");

    const fantasyPokemon= await FantasyPokemon.deploy(
        yodaAddress, // YODA address
        "FantasyPokemon", // NFT name
        "FPNFT", // NFT symbol
        5000 // Global mint price (2 decimal, 5000 -> 50.00 YODA)
    );

    await fantasyPokemon.deploymentTransaction().wait();

    console.log("FantasyPokemon contract deployed to:", fantasyPokemon.target);

    console.log("Deployer address:", deployer.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});