import { WalletAdapter, Chain, Account } from "../core/types.js";
interface GalaxyStation {
    keplr: {
        enable(chainId: string | string[]): Promise<void>;
        getKey(chainId: string): Promise<{
            name: string;
            algo: string;
            bech32Address: string;
            pubKey: Uint8Array;
            isNanoLedger: boolean;
        }>;
    };
}
declare global {
    interface Window {
        galaxyStation?: GalaxyStation;
    }
}
export declare class GalaxyStationWallet implements WalletAdapter {
    id: string;
    name: string;
    icon: string;
    private wc?;
    constructor(options?: {
        projectId?: string;
    });
    installed(): boolean;
    getUri(): string;
    onUpdate(callback: () => void): void;
    connect(chain: Chain): Promise<Account>;
    disconnect(): Promise<void>;
    signTx(_bytes: Uint8Array): Promise<Uint8Array>;
}
export {};
