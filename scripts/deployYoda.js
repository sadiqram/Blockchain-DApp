const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const initialReceiveAmount = Number(process.env.YODA_INITIAL_AMOUNT ?? "1000");
  const decimals = Number(process.env.YODA_DECIMALS ?? "18");

  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(
    `Deploying ERC20Token (YODA) with initialReceiveAmount=${initialReceiveAmount}, decimals=${decimals}`,
  );

  const Yoda = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await Yoda.deploy(initialReceiveAmount, decimals);
  await yoda.waitForDeployment();

  const yodaAddress = await yoda.getAddress();
  const totalSupply = await yoda.totalSupply();
  const deployerBalance = await yoda.balanceOf(deployer.address);

  console.log("ERC20Token (YODA) deployed to:", yodaAddress);
  console.log("Total supply:", totalSupply.toString());
  console.log("Deployer balance:", deployerBalance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});