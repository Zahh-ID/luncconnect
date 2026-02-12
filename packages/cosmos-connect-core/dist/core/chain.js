export const TERRA_CLASSIC = {
    chainId: "columbus-5",
    rpc: "https://rpc-columbus-5.garuda-defi.org/",
    rest: "https://lcd-columbus-5.garuda-defi.org/",
    bech32Prefix: "terra",
    gasPrice: "28.325uluna", // Approximate gas price for LUNC
};
export const DEFAULT_CHAINS = [TERRA_CLASSIC];
export function findChain(chains, chainId) {
    return chains.find((c) => c.chainId === chainId);
}
