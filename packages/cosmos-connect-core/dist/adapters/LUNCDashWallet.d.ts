import { WalletAdapter, Chain, Account } from '../core/types.js';
export declare class LUNCDashWallet implements WalletAdapter {
    id: string;
    name: string;
    icon: string;
    private wc;
    private _uri;
    private _updateCallback?;
    private _connectPromise;
    private _wcInstance;
    constructor(_options?: {
        projectId?: string;
    });
    setProjectId(_projectId: string): void;
    installed(): boolean;
    getUri(): string;
    onUpdate(callback: () => void): void;
    connect(chain: Chain): Promise<Account>;
    disconnect(): Promise<void>;
    signTx(_bytes: Uint8Array): Promise<Uint8Array>;
}
