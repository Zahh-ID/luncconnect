import { WalletAdapter, Chain, Account } from '../core/types.js';
interface Leap {
    enable(chainId: string): Promise<void>;
    getKey(chainId: string): Promise<{
        name: string;
        algo: string;
        bech32Address: string;
        pubKey: Uint8Array;
        isNanoLedger: boolean;
    }>;
    getOfflineSigner(chainId: string): any;
}
declare global {
    interface Window {
        leap?: Leap;
    }
}
export declare class LeapWallet implements WalletAdapter {
    id: "leap";
    name: string;
    icon: string;
    private wc?;
    constructor(options?: {
        projectId?: string;
    });
    setProjectId(projectId: string): void;
    private _initWC;
    installed(): boolean;
    getUri(): string;
    onUpdate(callback: () => void): void;
    connect(chain: Chain): Promise<Account>;
    disconnect(): Promise<void>;
    signTx(_bytes: Uint8Array): Promise<Uint8Array>;
}
export {};
