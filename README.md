# Blockchain-DApp (Hardhat)

This project is configured with Hardhat and `@nomicfoundation/hardhat-toolbox` for compiling, testing, local deployment, and Sepolia deployment.

## Setup

```shell
npm install
cp .env.example .env
```

Fill `.env` with your RPC/API keys when deploying to Sepolia.

## Available commands

```shell
npm run compile
npm run test
npm run clean
npm run node
npm run deploy:yoda:local
npm run deploy:yoda:sepolia
npm run deploy:local
npm run deploy:sepolia
npm run scenario:purchase
```

## Notes

- `deploy:yoda:*` deploys only the Yoda ERC20 (`ERC20Token`).
- `deploy:*` deploys `PokemonFTCG` and either:
  - deploys a fresh Yoda token first, or
  - reuses `YODA_ADDRESS` from `.env` if provided.
- `scenario:purchase` runs an end-to-end local scenario: deploys both contracts, mints a card, lists it, buys it, and validates ownership/payment.
- Local deploy scripts with `--network localhost` expect `npm run node` in another terminal.
- Sepolia deploy uses `SEPOLIA_RPC_URL` and `PRIVATE_KEY` from `.env`.
- You can still use ignition modules, e.g. `npx hardhat ignition deploy ./ignition/modules/Lock.js`.
