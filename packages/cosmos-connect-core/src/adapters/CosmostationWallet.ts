import { WalletAdapter, Chain, Account } from '../core/types.js';
import { WalletConnectWallet } from './WalletConnectWallet.js';
import { WalletName } from '@goblinhunt/cosmes/wallet';

// Basic Keplr-compatible provider structure in Cosmostation
interface CosmostationProvider {
  providers: {
    keplr: {
      enable(chainId: string): Promise<void>;
      getKey(chainId: string): Promise<{
        name: string;
        algo: string;
        bech32Address: string;
        pubKey: Uint8Array;
        isNanoLedger: boolean;
      }>;
      getOfflineSigner(chainId: string): any;
      signDirect(chainId: string, signer: string, signDoc: any): Promise<any>;
      signArbitrary(
        chainId: string,
        signer: string,
        data: string
      ): Promise<any>;
    };
  };
}

declare global {
  interface Window {
    cosmostation?: CosmostationProvider;
  }
}

export class CosmostationWallet implements WalletAdapter {
  id = WalletName.COSMOSTATION;
  name = 'Cosmostation';
  icon =
    'https://raw.githubusercontent.com/cosmostation/cosmostation_token_resource/master/all_chains/cosmos/resource/cosmostation.png';

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
        name: 'Cosmostation',
        android:
          'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;',
        ios: 'cosmostation://wc',
      },
    });
  }

  installed(): boolean {
    return typeof window !== 'undefined' && !!window.cosmostation;
  }

  getUri(): string {
    return this.wc?.getUri() ?? '';
  }

  onUpdate(callback: () => void): void {
    this.wc?.onUpdate(callback);
  }

  async connect(chain: Chain): Promise<Account> {
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
    } catch (error: any) {
      throw new Error(`Cosmostation connection failed: ${error.message}`);
    }
  }

  async disconnect(): Promise<void> {
    if (this.wc) {
      await this.wc.disconnect();
    }
    return Promise.resolve();
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error(
      'signTx not fully implemented for raw bytes in Cosmostation yet.'
    );
  }

  async signMsg(_msg: string): Promise<Uint8Array> {
    throw new Error('signMsg not implemented yet.');
  }
}
