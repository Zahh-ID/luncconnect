import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';
export class CosmostationWallet {
    id = WalletName.COSMOSTATION;
    name = 'Cosmostation';
    icon = 'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/all_chains/cosmos/resource/cosmostation.png';
    wc;
    constructor(options) {
        if (options?.projectId) {
            this.wc = new WalletConnectWallet({
                projectId: options.projectId,
                id: this.id,
                name: this.name,
                icon: this.icon,
                mobileAppDetails: {
                    name: 'Cosmostation',
                    android: 'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;',
                    ios: 'cosmostation://wc',
                },
            });
        }
    }
    installed() {
        return typeof window !== 'undefined' && !!window.cosmostation;
    }
    getUri() {
        return this.wc?.getUri() ?? '';
    }
    onUpdate(callback) {
        this.wc?.onUpdate(callback);
    }
    async connect(chain) {
        const cosmostation = window.cosmostation?.providers.keplr;
        if (!cosmostation) {
            if (this.wc) {
                return this.wc.connect(chain);
            }
            throw new Error('Cosmostation extension not found');
        }
        try {
            await cosmostation.enable(chain.chainId);
            const key = await cosmostation.getKey(chain.chainId);
            return {
                address: key.bech32Address,
                pubKey: key.pubKey,
                algo: key.algo,
                name: key.name,
                isNanoLedger: key.isNanoLedger,
            };
        }
        catch (error) {
            throw new Error(`Cosmostation connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (this.wc) {
            await this.wc.disconnect();
        }
        return Promise.resolve();
    }
    async signTx(_bytes) {
        throw new Error('signTx not fully implemented for raw bytes in Cosmostation yet.');
    }
    async signMsg(_msg) {
        throw new Error('signMsg not implemented yet.');
    }
}
