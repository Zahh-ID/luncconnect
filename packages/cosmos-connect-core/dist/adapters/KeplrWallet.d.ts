import { WalletAdapter, Chain, Account } from '../core/types.js';
interface Keplr {
    enable(chainId: string): Promise<void>;
    getKey(chainId: string): Promise<{
        name: string;
        algo: string;
        bech32Address: string;
        pubKey: Uint8Array;
        isNanoLedger: boolean;
    }>;
    getOfflineSigner(chainId: string): any;
    signDirect(chainId: string, signer: string, signDoc: any): Promise<any>;
    signArbitrary(chainId: string, signer: string, data: string): Promise<any>;
}
declare global {
    interface Window {
        keplr?: Keplr;
    }
}
export declare class KeplrWallet implements WalletAdapter {
    id: "keplr";
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
    signMsg(_msg: string): Promise<Uint8Array>;
}
export {};
