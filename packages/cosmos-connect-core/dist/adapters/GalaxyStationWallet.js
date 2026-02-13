import { WalletConnectWallet } from './WalletConnectWallet.js';
export class GalaxyStationWallet {
    id = 'galaxy-station';
    name = 'Galaxy Station';
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
                name: 'Galaxy Station',
                android: 'https://station.hexxagon.io/wcV2#Intent;package=io.hexxagon.station;scheme=galaxystation;end;',
                ios: 'https://station.hexxagon.io/wcV2',
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
        return typeof window !== 'undefined' && !!window.galaxyStation;
    }
    getUri() {
        return this.wc?.getUri() ?? '';
    }
    onUpdate(callback) {
        this.wc?.onUpdate(callback);
    }
    async connect(chain) {
        const galaxyStation = window.galaxyStation;
        if (!galaxyStation) {
            if (this.wc) {
                return this.wc.connect(chain);
            }
            throw new Error('Galaxy Station Wallet extension not found');
        }
        try {
            const provider = galaxyStation.keplr;
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
            throw new Error(`Galaxy Station Wallet connection failed: ${error.message}`);
        }
    }
    async disconnect() {
        if (this.wc) {
            await this.wc.disconnect();
        }
        return Promise.resolve();
    }
    async signTx(_bytes) {
        throw new Error('signTx not implemented for Galaxy Station yet.');
    }
}
