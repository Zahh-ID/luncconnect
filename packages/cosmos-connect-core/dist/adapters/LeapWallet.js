import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';
export class LeapWallet {
    id = WalletName.LEAP;
    name = 'Leap';
    icon = 'https://raw.githubusercontent.com/leapwallet/assets/master/images/leap-cosmos-logo.png';
    wc;
    constructor(options) {
        if (options?.projectId) {
            this.wc = new WalletConnectWallet({
                projectId: options.projectId,
                id: this.id,
                name: this.name,
                icon: this.icon,
                mobileAppDetails: {
                    name: 'Leap',
                    android: 'leapcosmos://wcV2',
                    ios: 'leapcosmos://wcV2',
                },
            });
        }
    }
    installed() {
        return typeof window !== 'undefined' && !!window.leap;
    }
    getUri() {
        return this.wc?.getUri() ?? '';
    }
    onUpdate(callback) {
        this.wc?.onUpdate(callback);
    }
    async connect(chain) {
        const leap = window.leap;
        if (!leap) {
            if (this.wc) {
                return this.wc.connect(chain);
            }
            throw new Error('Leap extension not found');
        }
        try {
            await leap.enable(chain.chainId);
            const key = await leap.getKey(chain.chainId);
            return {
                address: key.bech32Address,
                pubKey: key.pubKey,
                algo: key.algo,
                name: key.name,
            };
        }
        catch (error) {
            throw new Error(`Leap connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (this.wc) {
            await this.wc.disconnect();
        }
        return Promise.resolve();
    }
    async signTx(_bytes) {
        throw new Error('signTx not implemented for Leap yet.');
    }
}
