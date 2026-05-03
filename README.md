# Fantasy Pokemon Trading Card NFT Decentralized App

A full-stack Web3 trading card marketplace built with **Next.js, Solidity, Hardhat, and Ethers.js**.  
Users can mint, trade, list, and auction Pokemon-style NFT cards using an ERC-20 token called **YODA** as the in-game currency.

---

## Live Features

### NFT Cards
- Mint and own Pokemon-style NFT cards
- Each card has:
  - HP, Attack, Defense
  - Rarity
  - Optional shiny variant
- Cards are fully owned on-chain

### YODA Token Economy
- ERC-20 token used as in-game currency
- Used for:
  - Buying cards
  - Bidding in auctions
  - Marketplace transactions

###  Marketplace
- List owned cards for sale
- Buy listed cards using YODA
- Automatic ownership transfer after purchase

### Auctions System
- Start auctions on owned cards
- Place bids using YODA tokens
- Time-based auction expiration
- Winner can claim NFT after auction ends

---

## Tech Stack

### Frontend
- Next.js (App Router)
- React
- TypeScript
- Ethers.js
- TailwindCSS

### Smart Contracts
- Solidity
- Hardhat
- OpenZeppelin (ERC20, ERC721)

### Blockchain
- Sepolia Testnet (Ethereum)

---

## Project Structure

```bash
/app
  /cards
  /my-cards
  /marketplace
  /auction
/components
/hooks
/contracts
  Yoda.sol
  PokemonFTCG.sol

<!-- # Fantasy Pokemon Trading Card Game dApp

Hardhat + Solidity + Next.js dApp for minting, listing, buying, and auctioning Pokemon cards using a YODA ERC20 token.

## Requirements

- Node.js `>= 22.10.0` (required by this Hardhat setup)
- npm
- MetaMask (for frontend write actions)

## Environment Setup

### Root (`/`)

Copy `.env.example` to `.env` and fill values:

```shell
cp .env.example .env
```

- `SEPOLIA_RPC_URL`: Sepolia RPC URL
- `SEPOLIA_PRIVATE_KEY`: deployer private key for Sepolia deployment

### Frontend (`/frontend`)

Copy `frontend/.env.example` to `frontend/.env.local`:

```shell
cp frontend/.env.example frontend/.env.local
```

- `NEXT_PUBLIC_RPC_URL`: RPC endpoint for read-only frontend calls
- `NEXT_PUBLIC_POKEMON_CONTRACT_ADDRESS`: deployed `PokemonFTCG` address
- `NEXT_PUBLIC_YODA_TOKEN_ADDRESS`: deployed `ERC20Token` address

## Install

```shell
npm install
cd frontend && npm install
```

## Local Deploy (Hardhat)

Deploy both token and Pokemon contract locally:

```shell
npx hardhat ignition deploy ignition/modules/PokemonFTCG.ts
```

Use the addresses from:

- `ignition/deployments/chain-31337/deployed_addresses.json`

Set them in `frontend/.env.local`.

## Run Tests

```shell
npm test
```

Optional:

```shell
npm run test:mocha
npm run test:solidity
```

## Run Frontend

```shell
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Current MVP Features

- Owner minting of Pokemon cards
- Card listing and buying with YODA token
- Auction flow: start, bid, end, claim, refund
- Frontend pages for mint, list, buy, and bid -->
