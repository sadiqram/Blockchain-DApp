const hre = require("hardhat");

async function main() {
  const { ethers } = await hre.network.connect();
  const [deployer] = await ethers.getSigners();

  const ERC20Token = await ethers.getContractFactory("ERC20Token");
  const yoda = await ERC20Token.deploy(1000000, 18);
  await yoda.waitForDeployment();

  console.log("ERC20Token deployed to:", await yoda.getAddress());
  console.log("Deployer address:", deployer.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});