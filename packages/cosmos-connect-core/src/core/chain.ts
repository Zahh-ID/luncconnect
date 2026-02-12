import { Chain } from "./types.js";

export const TERRA_CLASSIC: Chain = {
  chainId: "columbus-5",
  rpc: "https://rpc-columbus-5.garuda-defi.org/",
  rest: "https://lcd-columbus-5.garuda-defi.org/",
  bech32Prefix: "terra",
  gasPrice: "28.325uluna", // Approximate gas price for LUNC
};

export const DEFAULT_CHAINS: Chain[] = [TERRA_CLASSIC];

export function findChain(chains: Chain[], chainId: string): Chain | undefined {
  return chains.find((c) => c.chainId === chainId);
}
