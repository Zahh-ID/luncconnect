import { WalletAdapter, Chain, Account } from '../core/types.js';
import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';

// Basic Station type definitions
interface Station {
  keplr: {
    enable(chainId: string): Promise<void>;
    getKey(chainId: string): Promise<{
      name: string;
      algo: string;
      bech32Address: string;
      pubKey: Uint8Array;
      isNanoLedger: boolean;
    }>;
  };
}

declare global {
  interface Window {
    station?: Station;
  }
}

export class StationWallet implements WalletAdapter {
  id = 'station';
  name = 'Station Wallet';
  icon =
    'https://raw.githubusercontent.com/terra-money/station-assets/main/img/station.png';

  private wc?: WalletConnectWallet;

  constructor(options?: { projectId?: string }) {
    if (options?.projectId) {
      this.wc = new WalletConnectWallet({
        projectId: options.projectId,
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
  }

  installed(): boolean {
    // Note: Both Station and Galaxy Station might use window.station.
    // Usually one is installed at a time.
    return typeof window !== 'undefined' && !!window.station;
  }

  getUri(): string {
    return this.wc?.getUri() ?? '';
  }

  onUpdate(callback: () => void): void {
    this.wc?.onUpdate(callback);
  }

  async connect(chain: Chain): Promise<Account> {
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
    } catch (error: any) {
      throw new Error(`Station Wallet connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.wc) {
      await this.wc.disconnect();
    }
    return Promise.resolve();
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error('signTx not implemented for Station Wallet yet.');
  }
}
