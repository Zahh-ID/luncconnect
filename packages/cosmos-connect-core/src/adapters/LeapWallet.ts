import { WalletAdapter, Chain, Account } from '../core/types.js';
import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';

// Basic Leap type definitions
interface Leap {
  enable(chainId: string): Promise<void>;
  getKey(chainId: string): Promise<{
    name: string;
    algo: string;
    bech32Address: string;
    pubKey: Uint8Array;
    isNanoLedger: boolean;
  }>;
  getOfflineSigner(chainId: string): any;
}

declare global {
  interface Window {
    leap?: Leap;
  }
}

export class LeapWallet implements WalletAdapter {
  id = WalletName.LEAP;
  name = 'Leap';
  icon =
    'https://raw.githubusercontent.com/leapwallet/assets/master/images/leap-cosmos-logo.png';

  private wc?: WalletConnectWallet;

  constructor(options?: { projectId?: string }) {
    if (options?.projectId) {
      this._initWC(options.projectId);
    }
  }

  setProjectId(projectId: string) {
    if (!this.wc) {
      this._initWC(projectId);
    }
  }

  private _initWC(projectId: string) {
    this.wc = new WalletConnectWallet({
      projectId,
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

  installed(): boolean {
    return typeof window !== 'undefined' && !!window.leap;
  }

  getUri(): string {
    return this.wc?.getUri() ?? '';
  }

  onUpdate(callback: () => void): void {
    this.wc?.onUpdate(callback);
  }

  async connect(chain: Chain): Promise<Account> {
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
    } catch (error: any) {
      throw new Error(`Leap connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.wc) {
      await this.wc.disconnect();
    }
    return Promise.resolve();
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error('signTx not implemented for Leap yet.');
  }
}
