import { expect } from "chai";
import { network } from "hardhat";

const { ethers } = (await network.create()) as any;

describe("PokemonFTCG", function () {
  let pokemon: any;
  let yoda: any;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy Yoda token
    const Yoda = await ethers.getContractFactory("ERC20Token");
    yoda = await Yoda.deploy(100, 18);
    await yoda.waitForDeployment();

    // Deploy Pokemon contract
    const Pokemon = await ethers.getContractFactory("PokemonFTCG");
    pokemon = await Pokemon.deploy(await yoda.getAddress());
    await pokemon.waitForDeployment();
  });

  it("should mint a card", async function () {
    await pokemon.mintCard(owner.address, "Pikachu", 50, 30, 100, 1, false);

    expect(await pokemon.ownerOf(0)).to.equal(owner.address);
  });

  it("should allow listing and buying a card", async function () {
    await pokemon.mintCard(owner.address, "Charmander", 40, 20, 80, 1, false);

    // give user tokens
    await yoda.transfer(user1.address, ethers.parseUnits("100", 18));

    // approve marketplace
    await yoda
      .connect(user1)
      .approve(pokemon.target, ethers.parseUnits("50", 18));

    // list card
    await pokemon.listCard(0, ethers.parseUnits("50", 18));

    // buy card
    await pokemon.connect(user1).buyCard(0);

    expect(await pokemon.ownerOf(0)).to.equal(user1.address);
  });

  it("should start and place bids in auction", async function () {
    await pokemon.mintCard(owner.address, "Bulbasaur", 40, 40, 90, 1, false);

    await pokemon.startAuction(0, ethers.parseUnits("10", 18), 60);

    await yoda.transfer(user2.address, ethers.parseUnits("100", 18));

    await yoda
      .connect(user2)
      .approve(pokemon.target, ethers.parseUnits("50", 18));

    await pokemon.connect(user2).placeBid(0, ethers.parseUnits("20", 18));

    const auction = await pokemon.auctions(0);
    expect(auction.highestBidder).to.equal(user2.address);
  });

  it("should reject non-owner minting", async function () {
    await expect(
      pokemon.connect(user1).mintCard(user1.address, "Mew", 80, 70, 120, 2, true),
    ).to.be.rejectedWith("Not contract owner");
  });

  it("should reject buying unlisted card", async function () {
    await pokemon.mintCard(owner.address, "Squirtle", 25, 35, 70, 1, false);
    await expect(pokemon.connect(user1).buyCard(0)).to.be.rejectedWith(
      "Card not listed",
    );
  });

  it("should complete auction lifecycle end + claim", async function () {
    await pokemon.mintCard(owner.address, "Eevee", 30, 30, 60, 1, false);
    await pokemon.startAuction(0, ethers.parseUnits("10", 18), 2);

    await yoda.transfer(user1.address, ethers.parseUnits("100", 18));
    await yoda
      .connect(user1)
      .approve(pokemon.target, ethers.parseUnits("25", 18));
    await pokemon.connect(user1).placeBid(0, ethers.parseUnits("20", 18));

    await ethers.provider.send("evm_increaseTime", [3]);
    await ethers.provider.send("evm_mine", []);

    await pokemon.endAuction(0);
    const [winner] = await pokemon.getAuctionWinner(0);
    expect(winner).to.equal(user1.address);

    await pokemon.connect(user1).claimNFT(0);
    expect(await pokemon.ownerOf(0)).to.equal(user1.address);
  });

  it("should reject bids below current price", async function () {
    await pokemon.mintCard(owner.address, "Snorlax", 60, 60, 200, 3, false);
    await pokemon.startAuction(0, ethers.parseUnits("10", 18), 60);

    await yoda.transfer(user2.address, ethers.parseUnits("100", 18));
    await yoda
      .connect(user2)
      .approve(pokemon.target, ethers.parseUnits("10", 18));

    await expect(
      pokemon.connect(user2).placeBid(0, ethers.parseUnits("10", 18)),
    ).to.be.rejectedWith("Bid too low");
  });
});
