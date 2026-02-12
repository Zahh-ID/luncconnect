import { WalletConnectV2 } from "./utils/WalletConnectV2.js";
import { WalletAdapter, Chain, Account } from "../core/types.js";
import { MobileAppDetails } from "./utils/QRCodeModal.js";
export declare class WalletConnectWallet implements WalletAdapter {
    id: string;
    name: string;
    icon: string;
    private wc;
    private _uri;
    private _connecting;
    private _updateCallback?;
    constructor({ projectId, id, name, icon, mobileAppDetails, }: {
        projectId: string;
        id?: string;
        name?: string;
        icon?: string;
        mobileAppDetails?: MobileAppDetails;
    });
    installed(): boolean;
    getUri(): string;
    private _connectPromise;
    connect(chain: Chain): Promise<Account>;
    disconnect(): Promise<void>;
    signTx(_bytes: Uint8Array): Promise<Uint8Array>;
    onUpdate(callback: () => void): void;
    get client(): WalletConnectV2;
}
