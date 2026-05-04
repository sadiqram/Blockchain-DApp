const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // ------------------------
  // Deploy YODA
  // ------------------------
  const ERC20Token = await hre.ethers.getContractFactory("ERC20Token");

  const yoda = await ERC20Token.deploy(1000000, 18);
  await yoda.waitForDeployment();

  const yodaAddress = await yoda.getAddress();

  console.log("YODA deployed to:", yodaAddress);

  // ------------------------
  // Deploy Game Contract
  // ------------------------
  const PokemonFTCG = await hre.ethers.getContractFactory("PokemonFTCG");

  const pokemon = await PokemonFTCG.deploy(yodaAddress);
  await pokemon.waitForDeployment();

  console.log("PokemonFTCG deployed to:", await pokemon.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});