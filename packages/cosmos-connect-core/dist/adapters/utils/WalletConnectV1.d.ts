import { MobileAppDetails } from './QRCodeModal.js';
/**
 * WalletConnect V1 wrapper for LUNCDash and other wallets that use
 * the legacy WalletConnect protocol with a custom bridge server.
 */
export declare class WalletConnectV1 {
    private readonly sessionStorageKey;
    private readonly mobileAppDetails;
    private readonly bridge;
    private readonly onDisconnectCbs;
    private readonly onUriCbs;
    private _uri;
    constructor(sessionStorageKey: string, mobileAppDetails: MobileAppDetails, bridge: string);
    onUri(cb: (uri: string) => unknown): () => void;
    /**
     * Returns the current WalletConnect instance. If a cached session exists,
     * reconnects to it. Otherwise, creates a new session and waits for approval.
     */
    connect(): Promise<WalletConnect>;
    getUri(): string;
    onDisconnect(cb: () => unknown): () => void;
    /**
     * Saves the session to local storage. Should only be called once the user
     * actually approves the connection.
     */
    cacheSession(wc: WalletConnect): void;
}
