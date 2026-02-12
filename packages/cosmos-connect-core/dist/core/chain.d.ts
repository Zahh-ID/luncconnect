import { Chain } from "./types.js";
export declare const TERRA_CLASSIC: Chain;
export declare const DEFAULT_CHAINS: Chain[];
export declare function findChain(chains: Chain[], chainId: string): Chain | undefined;
