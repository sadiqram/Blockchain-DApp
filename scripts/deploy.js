const hre = require("hardhat");

async function deployYodaIfNeeded(deployerAddress) {
  const existingYodaAddress = process.env.YODA_ADDRESS;
  if (existingYodaAddress) {
    console.log(`Using existing Yoda token at: ${existingYodaAddress}`);
    return existingYodaAddress;
  }

  const initialReceiveAmount = Number(process.env.YODA_INITIAL_AMOUNT ?? "1000");
  const decimals = Number(process.env.YODA_DECIMALS ?? "18");

  console.log(
    `Deploying Yoda token (initialReceiveAmount=${initialReceiveAmount}, decimals=${decimals})...`,
  );
  const Yoda = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await Yoda.deploy(initialReceiveAmount, decimals);
  await yoda.waitForDeployment();

  const yodaAddress = await yoda.getAddress();
  const deployerBalance = await yoda.balanceOf(deployerAddress);

  console.log(`ERC20Token (YODA) deployed at: ${yodaAddress}`);
  console.log(`Deployer initial YODA balance: ${deployerBalance.toString()}`);

  return yodaAddress;
}

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);

  const yodaAddress = await deployYodaIfNeeded(deployer.address);

  console.log("Deploying PokemonFTCG...");
  const PokemonFTCG = await hre.ethers.getContractFactory("PokemonFTCG");
  const pokemonFTCG = await PokemonFTCG.deploy(yodaAddress);
  await pokemonFTCG.waitForDeployment();

  const pokemonAddress = await pokemonFTCG.getAddress();
  console.log(`PokemonFTCG deployed at: ${pokemonAddress}`);

  // Post-deploy sanity checks
  const configuredYodaToken = await pokemonFTCG.yodaToken();
  const contractOwner = await pokemonFTCG.contractOwner();

  console.log("Sanity checks:");
  console.log(`- PokemonFTCG.yodaToken(): ${configuredYodaToken}`);
  console.log(`- PokemonFTCG.contractOwner(): ${contractOwner}`);

  if (configuredYodaToken.toLowerCase() !== yodaAddress.toLowerCase()) {
    throw new Error("Sanity check failed: PokemonFTCG points to wrong Yoda token");
  }
  if (contractOwner.toLowerCase() !== deployer.address.toLowerCase()) {
    throw new Error("Sanity check failed: wrong PokemonFTCG owner");
  }

  console.log("Deployment complete and checks passed.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});