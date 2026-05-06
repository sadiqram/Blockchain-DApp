const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying with:", deployer.address);

  // 1. Deploy YODA token
  const ERC20 = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await ERC20.deploy(10000, 18);
  await yoda.waitForDeployment();

  console.log("YODA deployed:", await yoda.getAddress());

  // 2. Deploy Pokemon contract
  const Pokemon = await hre.ethers.getContractFactory("PokemonFTCG");
  const pokemon = await Pokemon.deploy(await yoda.getAddress());
  await pokemon.waitForDeployment();

  console.log("PokemonFTCG deployed:", await pokemon.getAddress());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});