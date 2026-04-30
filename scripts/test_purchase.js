const hre = require("hardhat");

async function main() {
  const [deployer, buyer] = await hre.ethers.getSigners();
  console.log(`Network: ${hre.network.name}`);
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Buyer: ${buyer.address}`);

  // 1) Deploy Yoda token and PokemonFTCG
  const Yoda = await hre.ethers.getContractFactory("ERC20Token");
  const yoda = await Yoda.deploy(1000, 18);
  await yoda.waitForDeployment();
  const yodaAddress = await yoda.getAddress();
  console.log(`ERC20Token deployed: ${yodaAddress}`);

  const PokemonFTCG = await hre.ethers.getContractFactory("PokemonFTCG");
  const pokemon = await PokemonFTCG.deploy(yodaAddress);
  await pokemon.waitForDeployment();
  const pokemonAddress = await pokemon.getAddress();
  console.log(`PokemonFTCG deployed: ${pokemonAddress}`);

  // 2) Mint one card to deployer (tokenId 0)
  await (await pokemon.mintCard(deployer.address, "Pikachu", 55, 40, 60, 2, false)).wait();
  const mintedOwner = await pokemon.ownerOf(0);
  console.log(`Owner of token 0 after mint: ${mintedOwner}`);

  // 3) Fund buyer with YODA and approve marketplace spend
  const cardPrice = hre.ethers.parseUnits("25", 18);
  await (await yoda.transfer(buyer.address, cardPrice)).wait();
  await (await yoda.connect(buyer).approve(pokemonAddress, cardPrice)).wait();

  // 4) List and buy card
  await (await pokemon.listCard(0, cardPrice)).wait();
  const [listedPrice, listedSeller] = await pokemon.getListing(0);
  console.log(`Listing price: ${listedPrice.toString()} seller: ${listedSeller}`);

  const sellerBalanceBefore = await yoda.balanceOf(deployer.address);
  await (await pokemon.connect(buyer).buyCard(0)).wait();
  const sellerBalanceAfter = await yoda.balanceOf(deployer.address);

  // 5) Assertions / sanity checks
  const newOwner = await pokemon.ownerOf(0);
  console.log(`Owner of token 0 after purchase: ${newOwner}`);

  if (newOwner.toLowerCase() !== buyer.address.toLowerCase()) {
    throw new Error("Purchase failed: token 0 owner is not the buyer");
  }

  const sellerDelta = sellerBalanceAfter - sellerBalanceBefore;
  if (sellerDelta !== cardPrice) {
    throw new Error("Purchase failed: seller did not receive expected YODA amount");
  }

  console.log("Purchase scenario completed successfully.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});