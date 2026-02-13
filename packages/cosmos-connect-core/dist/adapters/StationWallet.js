import { WalletConnectWallet } from './WalletConnectWallet.js';
export class StationWallet {
    id = 'station';
    name = 'Station Wallet';
    icon = 'https://raw.githubusercontent.com/terra-money/station-assets/main/img/station.png';
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
                name: 'Station Wallet',
                android: 'terrastation://wc',
                ios: 'terrastation://wc',
                isStation: true,
            },
            signerMetadata: {
                name: 'LUNCConnect',
                description: 'Connect to LUNCConnect',
                url: typeof window !== 'undefined' ? window.location.origin : '',
                icons: [
                    'https://raw.githubusercontent.com/terra-money/station-assets/main/img/station.png',
                ],
            },
        });
    }
    installed() {
        // Note: Both Station and Galaxy Station might use window.station.
        // Usually one is installed at a time.
        return typeof window !== 'undefined' && !!window.station;
    }
    getUri() {
        return this.wc?.getUri() ?? '';
    }
    onUpdate(callback) {
        this.wc?.onUpdate(callback);
    }
    async connect(chain) {
        const station = window.station;
        if (!station) {
            if (this.wc) {
                return this.wc.connect(chain);
            }
            throw new Error('Station Wallet extension not found');
        }
        try {
            const provider = station.keplr;
            await provider.enable(chain.chainId);
            const key = await provider.getKey(chain.chainId);
            return {
                address: key.bech32Address,
                pubKey: key.pubKey,
                algo: key.algo,
                name: key.name,
            };
        }
        catch (error) {
            throw new Error(`Station Wallet connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (this.wc) {
            await this.wc.disconnect();
        }
        return Promise.resolve();
    }
    async signTx(_bytes) {
        throw new Error('signTx not implemented for Station Wallet yet.');
    }
}
