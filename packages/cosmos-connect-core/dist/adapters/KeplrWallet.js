import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';
export class KeplrWallet {
    id = WalletName.KEPLR;
    name = 'Keplr';
    icon = 'https://raw.githubusercontent.com/chainapsis/keplr-wallet/master/packages/extension/src/public/assets/img/logo-256.png';
    wc;
    constructor(options) {
        if (options?.projectId) {
            this._initWC(options.projectId);
        }
    }
    setProjectId(projectId) {
        if (!this.wc) {
            this._initWC(projectId);
        }
    }
    _initWC(projectId) {
        this.wc = new WalletConnectWallet({
            projectId,
            id: this.id,
            name: this.name,
            icon: this.icon,
            mobileAppDetails: {
                name: 'Keplr',
                android: 'intent://wcV2#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;',
                ios: 'keplrwallet://wcV2',
            },
        });
    }
    installed() {
        return typeof window !== 'undefined' && !!window.keplr;
    }
    getUri() {
        return this.wc?.getUri() ?? '';
    }
    onUpdate(callback) {
        this.wc?.onUpdate(callback);
    }
    async connect(chain) {
        const keplr = window.keplr;
        if (!keplr) {
            if (this.wc) {
                return this.wc.connect(chain);
            }
            throw new Error('Keplr extension not found');
        }
        try {
            await keplr.enable(chain.chainId);
            const key = await keplr.getKey(chain.chainId);
            return {
                address: key.bech32Address,
                pubKey: key.pubKey,
                algo: key.algo,
                name: key.name,
                isNanoLedger: key.isNanoLedger,
            };
        }
        catch (error) {
            throw new Error(`Keplr connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (this.wc) {
            await this.wc.disconnect();
        }
        return Promise.resolve();
    }
    async signTx(_bytes) {
        console.debug('Keplr signTx', _bytes.length);
        // In a real implementation, you'd decode bytes to SignDoc or use signDirect/Amino
        // Since the core SDK takes raw bytes, we assume the bytes ARE the signDoc or
        // the user wants to sign these specific bytes.
        // For Keplr, signDirect is common.
        // NOTE: This is a simplified implementation. Real-world usage requires
        // proper tx construction handling.
        // For now, let's assume we use signDirect if we can decode the bytes
        // or provide a helper for cosmes integrations.
        throw new Error('signTx not fully implemented for raw bytes in Keplr yet. Use cosmes-compatible signers.');
    }
    async signMsg(_msg) {
        console.debug('Keplr signMsg', _msg.length);
        const keplr = window.keplr;
        if (!keplr)
            throw new Error('Keplr not found');
        // Find current address (assumes already connected or we need to connect)
        // For simplicity, we'll try to get the first address.
        // This is often used for Siwe etc.
        // return keplr.signArbitrary(...);
        throw new Error('signMsg not implemented yet.');
    }
}
