// @ts-nocheck
import SignClient from '@walletconnect/sign-client';
import { isAndroid, isMobile } from './os.js';
import { debounce } from 'lodash-es';
const Method = {
    GET_ACCOUNTS: 'cosmos_getAccounts',
    SIGN_AMINO: 'cosmos_signAmino',
    SIGN_DIRECT: 'cosmos_signDirect',
    SIGN_ARBITRARY: 'keplr_signArbitrary',
    ADD_CHAIN: 'keplr_experimentalSuggestChain',
};
const Event = {
    CHAIN_CHANGED: 'chainChanged',
    ACCOUNTS_CHANGED: 'accountsChanged',
};
const DEFAULT_SIGN_OPTIONS = {
    preferNoSetFee: true,
    preferNoSetMemo: true,
};
export class WalletConnectV2 {
    projectId;
    mobileAppDetails;
    signerMetadata;
    sessionStorageKey;
    accountStorageKey;
    onDisconnectCbs;
    onAccountChangeCbs;
    onUriCbs;
    signClient;
    config;
    constructor(projectId, mobileAppDetails, signerMetadata, config) {
        this.projectId = projectId;
        this.mobileAppDetails = mobileAppDetails;
        this.signerMetadata = signerMetadata;
        this.sessionStorageKey = `cosmes.wallet.${mobileAppDetails.name.toLowerCase()}.wcSession`;
        this.accountStorageKey = `cosmes.wallet.${mobileAppDetails.name.toLowerCase()}.lastAccount`;
        this.onDisconnectCbs = new Set();
        this.onAccountChangeCbs = new Set();
        this.onUriCbs = new Set();
        this.signClient = null;
        this.config = config;
    }
    onUri(cb) {
        this.onUriCbs.add(cb);
        return () => {
            this.onUriCbs.delete(cb);
        };
    }
    async addChain(chainId, chainInfo) {
        if (!this.signClient) {
            throw new Error('SignClient is not initialized');
        }
        await this.request(chainId, Method.ADD_CHAIN, {
            chainInfo,
        });
    }
    async connect(chainIds) {
        // Initialise the sign client and event listeners if they don't already exist
        if (!this.signClient) {
            console.log('WalletConnectV2: Initializing SignClient...');
            try {
                this.signClient = await SignClient.init({
                    projectId: this.projectId,
                });
                console.log('WalletConnectV2: SignClient initialized');
            }
            catch (err) {
                console.error('WalletConnectV2: Failed to initialize SignClient', err);
                throw err;
            }
            // Disconnect if the session is disconnected or expired
            this.signClient.on('session_delete', ({ topic }) => this._disconnect(topic));
            this.signClient.on('session_expire', ({ topic }) => this._disconnect(topic));
            // Handle the `accountsChanged` event
            const handleAccountChange = debounce(
            // Handler is debounced as the `accountsChanged` event is fired once for
            // each connected chain, but we only want to trigger the callback once.
            () => this.onAccountChangeCbs.forEach((cb) => cb()), 300, { leading: true, trailing: false });
            this.signClient.on('session_event', ({ params }) => {
                if (params.event.name === Event.ACCOUNTS_CHANGED) {
                    handleAccountChange();
                }
            });
        }
        // Check if a valid session already exists
        const oldSession = localStorage.getItem(this.sessionStorageKey);
        const chainIdsSet = new Set(chainIds);
        if (oldSession) {
            const { topic, chainIds: storedIds } = JSON.parse(oldSession);
            const storedIdsSet = new Set(storedIds);
            if (chainIds.every((id) => storedIdsSet.has(id))) {
                if (this.config?.disableConnectionCheck) {
                    return;
                }
                // If the requested chain IDs are a subset of the stored chain IDs,
                // check if the session is still working and connected
                if (await this.isConnected(this.signClient, topic, 4)) {
                    // If the current session is properly connected, return early
                    return;
                }
                else {
                    // Otherwise, assume the session is stale and disconnect
                    this._disconnect(topic);
                }
            }
            else {
                // Otherwise, we need to merge the stored IDs with the requested IDs
                for (const id of storedIds) {
                    chainIdsSet.add(id);
                }
            }
        }
        // Initialise a new session with auto-regeneration on timeout
        const maxRetries = 3;
        const pairingTimeout = 300000; // 5 minutes per attempt
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const { uri, approval } = await this.signClient.connect({
                requiredNamespaces: {
                    cosmos: {
                        chains: [...chainIdsSet].map((id) => this.toCosmosNamespace(id)),
                        methods: Object.values(Method),
                        events: Object.values(Event),
                    },
                },
            });
            if (uri) {
                console.log(`WalletConnectV2: URI generated (attempt ${attempt + 1}/${maxRetries})`, uri);
                this._uri = uri;
                this.onUriCbs.forEach((cb) => cb(uri));
                console.log(`WalletConnectV2: Waiting for approval (timeout: ${pairingTimeout}ms)...`);
                try {
                    const approvalPromise = approval();
                    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Connection approval timed out')), pairingTimeout));
                    const { topic } = await Promise.race([
                        approvalPromise,
                        timeoutPromise,
                    ]);
                    console.log('WalletConnectV2: Approved session topic', topic);
                    const newSession = {
                        topic,
                        chainIds: [...chainIdsSet],
                    };
                    localStorage.setItem(this.sessionStorageKey, JSON.stringify(newSession));
                    return; // Successfully connected
                }
                catch (err) {
                    const isRetryable = err?.message === 'Connection approval timed out' ||
                        err?.message === 'Proposal expired';
                    if (isRetryable && attempt < maxRetries - 1) {
                        console.log(`WalletConnectV2: ${err.message}, regenerating QR code (attempt ${attempt + 2}/${maxRetries})...`);
                        continue; // Retry with a new URI
                    }
                    throw err;
                }
            }
        }
    }
    disconnect() {
        const session = localStorage.getItem(this.sessionStorageKey);
        if (session) {
            const { topic } = JSON.parse(session);
            this._disconnect(topic);
        }
    }
    onDisconnect(cb) {
        this.onDisconnectCbs.add(cb);
        return () => {
            this.onDisconnectCbs.delete(cb);
        };
    }
    onAccountChange(cb) {
        this.onAccountChangeCbs.add(cb);
        return () => {
            this.onAccountChangeCbs.delete(cb);
        };
    }
    async getAccount(chainId) {
        if (!this.config?.disableConnectionCheck) {
            const res = await this.request(chainId, Method.GET_ACCOUNTS, {});
            // result might be array or single object depending on wallet impl, usually array
            return Array.isArray(res) ? res[0] : res;
        }
        try {
            const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), 3000));
            const resArray = await Promise.race([
                this.request(chainId, Method.GET_ACCOUNTS, {}),
                timeout,
            ]);
            const res = Array.isArray(resArray) ? resArray[0] : resArray;
            // Store successful response
            this.onDisconnect(() => {
                localStorage.removeItem(this.accountStorageKey);
            });
            localStorage.setItem(this.accountStorageKey, JSON.stringify(res));
            return res;
        }
        catch (e) {
            // Try to get stored account data
            const stored = localStorage.getItem(this.accountStorageKey);
            if (stored) {
                const account = JSON.parse(stored);
                // Try to refresh in background
                this.request(chainId, Method.GET_ACCOUNTS, {})
                    .then((res) => {
                    const accountData = Array.isArray(res) ? res[0] : res;
                    localStorage.setItem(this.accountStorageKey, JSON.stringify(accountData));
                })
                    .catch(() => { });
                this.onDisconnect(() => {
                    localStorage.removeItem(this.accountStorageKey);
                });
                return account;
            }
            throw e;
        }
    }
    async signArbitrary(chainId, signerAddress, data) {
        return this.request(chainId, Method.SIGN_ARBITRARY, {
            chainId,
            signer: signerAddress,
            type: 'string',
            data,
        });
    }
    async signAmino(chainId, signerAddress, stdSignDoc) {
        const { signature, signed } = await this.request(chainId, Method.SIGN_AMINO, {
            signerAddress,
            signDoc: stdSignDoc,
            signOptions: DEFAULT_SIGN_OPTIONS,
        });
        return {
            signature: signature,
            signed: signed ?? stdSignDoc,
        };
    }
    async signDirect(chainId, signerAddress, signDoc) {
        const { signature, signed } = await this.request(chainId, Method.SIGN_DIRECT, {
            signerAddress,
            signDoc,
            signOptions: DEFAULT_SIGN_OPTIONS,
        });
        return {
            signature: signature,
            signed: signed ?? signDoc,
        };
    }
    isConnected(signClient, topic, timeoutSeconds) {
        const tryPing = async () => signClient
            .ping({ topic })
            .then(() => true)
            .catch(() => false);
        const waitDisconnect = async () => new Promise((resolve) => {
            // @ts-ignore
            signClient.on('session_delete', (res) => {
                if (topic === res.topic) {
                    resolve(false);
                }
            });
            // @ts-ignore
            signClient.on('session_expire', (res) => {
                if (topic === res.topic) {
                    resolve(false);
                }
            });
        });
        const timeout = async () => new Promise((resolve) => setTimeout(() => resolve(false), timeoutSeconds * 1000));
        return Promise.race([tryPing(), waitDisconnect(), timeout()]);
    }
    _disconnect(topic) {
        const session = localStorage.getItem(this.sessionStorageKey);
        if (!session || session.includes(topic)) {
            localStorage.removeItem(this.sessionStorageKey);
            this.onDisconnectCbs.forEach((cb) => cb());
        }
    }
    async request(chainId, method, params) {
        const session = localStorage.getItem(this.sessionStorageKey);
        if (!session || !this.signClient) {
            throw new Error('Session not found for ' + chainId);
        }
        const { topic } = JSON.parse(session);
        if (isMobile() && method !== Method.GET_ACCOUNTS) {
            window.location.href = isAndroid()
                ? this.mobileAppDetails.android
                : this.mobileAppDetails.ios;
        }
        return this.signClient.request({
            topic,
            chainId: this.toCosmosNamespace(chainId),
            request: {
                method,
                params,
            },
        });
    }
    toCosmosNamespace(chainId) {
        return 'cosmos:' + chainId;
    }
}
