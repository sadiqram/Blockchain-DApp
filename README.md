# Fantasy Pokemon Trading Card Game dApp

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
- Frontend pages for mint, list, buy, and bid
