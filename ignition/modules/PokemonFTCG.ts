import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PokemonModule = buildModule("PokemonModule", (m) => {
  // 1. Deploy Yoda token first
  const yoda = m.contract("ERC20Token", [10000, 18]);
  // (initialReceiveAmount = 100, decimals = 18)

  // 2. Deploy Pokemon contract with Yoda address
  const pokemon = m.contract("PokemonFTCG", [yoda]);

  return { yoda, pokemon };
});

export default PokemonModule;
