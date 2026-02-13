import { WalletConnectV2 } from './utils/WalletConnectV2.js';
import { base64 } from '@goblinhunt/cosmes/codec';
export class WalletConnectWallet {
    id = 'walletConnect';
    name = 'Other Wallets';
    icon = 'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg';
    wc;
    _uri = '';
    _connecting = false;
    _updateCallback;
    constructor({ projectId, id, name, icon, mobileAppDetails, signerMetadata, }) {
        if (id)
            this.id = id;
        if (name)
            this.name = name;
        if (icon)
            this.icon = icon;
        const details = mobileAppDetails || {
            name: 'Cosmos Connect',
            android: 'intent://wcV2#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;', // Default to Keplr for android
            ios: 'keplrwallet://wcV2', // Default to Keplr for ios
        };
        const metadata = signerMetadata || {
            name: 'LUNCConnect',
            description: 'Connect to LUNCConnect',
            url: typeof window !== 'undefined' ? window.location.origin : '',
            icons: [
                'https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg',
            ],
        };
        this.wc = new WalletConnectV2(projectId, details, metadata);
        this.wc.onUri((uri) => {
            this._uri = uri;
            this._updateCallback?.();
        });
    }
    // projectId is set at construction for WalletConnectWallet
    setProjectId(_projectId) { }
    installed() {
        return false;
    }
    getUri() {
        return this._uri;
    }
    _connectPromise = null;
    async connect(chain) {
        if (this._connectPromise) {
            console.log('WalletConnectWallet: connect already in progress, returning existing promise...');
            return this._connectPromise;
        }
        this._connectPromise = (async () => {
            console.log('WalletConnectWallet: connect called for chain', chain.chainId);
            this._connecting = true;
            try {
                // This will trigger our onUri callback
                console.log('WalletConnectWallet: triggering wc.connect...');
                await this.wc.connect([chain.chainId]);
                console.log('WalletConnectWallet: wc.connect settled');
                // After approval, keys are set
                const accountRes = await this.wc.getAccount(chain.chainId);
                return {
                    address: accountRes.address,
                    pubKey: base64.decode(accountRes.pubkey),
                    algo: accountRes.algo,
                    name: accountRes.name,
                };
            }
            catch (e) {
                console.error('WalletConnectWallet: Connection failed', e);
                throw e;
            }
            finally {
                this._connecting = false;
                this._connectPromise = null;
            }
        })();
        return this._connectPromise;
    }
    async disconnect() {
        this.wc.disconnect();
        this._uri = '';
        this._connecting = false;
    }
    async signTx(_bytes) {
        throw new Error('signTx not implemented directly on adapter. Use client.signAndBroadcast');
    }
    onUpdate(callback) {
        this._updateCallback = callback;
    }
    // Helper for direct access if needed
    get client() {
        return this.wc;
    }
}
