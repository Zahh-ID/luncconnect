// @ts-nocheck
import WalletConnect from '@walletconnect/legacy-client';
/**
 * WalletConnect V1 wrapper for LUNCDash and other wallets that use
 * the legacy WalletConnect protocol with a custom bridge server.
 */
export class WalletConnectV1 {
    sessionStorageKey;
    mobileAppDetails;
    bridge;
    onDisconnectCbs;
    onUriCbs;
    _uri = '';
    constructor(sessionStorageKey, mobileAppDetails, bridge) {
        this.sessionStorageKey = sessionStorageKey;
        this.mobileAppDetails = mobileAppDetails;
        this.bridge = bridge;
        this.onDisconnectCbs = new Set();
        this.onUriCbs = new Set();
    }
    onUri(cb) {
        this.onUriCbs.add(cb);
        return () => {
            this.onUriCbs.delete(cb);
        };
    }
    /**
     * Returns the current WalletConnect instance. If a cached session exists,
     * reconnects to it. Otherwise, creates a new session and waits for approval.
     */
    async connect() {
        // Get cached session in local storage
        const cachedSession = localStorage.getItem(this.sessionStorageKey);
        const session = cachedSession ? JSON.parse(cachedSession) : undefined;
        // Create a new WalletConnect instance
        const wc = new WalletConnect({
            bridge: this.bridge,
            signingMethods: [],
            session,
        });
        wc.on('disconnect', () => {
            localStorage.removeItem(this.sessionStorageKey);
            this.onDisconnectCbs.forEach((cb) => cb());
        });
        // If a previous session exists and is connected, return it
        if (session && wc.connected) {
            return wc;
        }
        // Else, kill any stale session and create a new one
        if (wc.connected) {
            await wc.killSession();
        }
        await wc.createSession();
        // Emit the URI for QR code rendering
        if (wc.uri) {
            this._uri = wc.uri;
            this.onUriCbs.forEach((cb) => cb(wc.uri));
        }
        // Return the WalletConnect instance once the user approves
        return new Promise((resolve, reject) => {
            wc.on('connect', (error) => {
                error ? reject(error) : resolve(wc);
            });
        });
    }
    getUri() {
        return this._uri;
    }
    onDisconnect(cb) {
        this.onDisconnectCbs.add(cb);
        return () => this.onDisconnectCbs.delete(cb);
    }
    /**
     * Saves the session to local storage. Should only be called once the user
     * actually approves the connection.
     */
    cacheSession(wc) {
        if (!wc.connected) {
            return;
        }
        localStorage.setItem(this.sessionStorageKey, JSON.stringify(wc.session));
    }
}
