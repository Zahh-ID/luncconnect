// @ts-nocheck
import { WalletAdapter, Chain, Account } from '../core/types.js';
import { WalletConnectV1 } from './utils/WalletConnectV1.js';
import { getAccount, toBaseAccount } from '@goblinhunt/cosmes/client';
import { CosmosCryptoSecp256k1PubKey } from '@goblinhunt/cosmes/protobufs';

const LUNCDASH_BRIDGE = 'https://walletconnect.luncdash.com';

export class LUNCDashWallet implements WalletAdapter {
  id = 'luncdash';
  name = 'LUNCDash';
  icon = 'https://luncdash.com/assets/logo-dash-r8Nezm76.png';

  private wc: WalletConnectV1;
  private _uri: string = '';
  private _updateCallback?: () => void;
  private _connectPromise: Promise<Account> | null = null;
  private _wcInstance: any = null;

  constructor(_options?: { projectId?: string }) {
    this.wc = new WalletConnectV1(
      'cosmes.wallet.luncdash.wcSession',
      {
        name: 'LUNCDash',
        android: 'luncdash://wallet_connect',
        ios: 'luncdash://wallet_connect',
        isStation: true,
        isLuncDash: true,
      },
      LUNCDASH_BRIDGE
    );

    this.wc.onUri((uri: string) => {
      this._uri = uri;
      this._updateCallback?.();
    });
  }

  // LUNCDash uses V1, projectId not needed
  setProjectId(_projectId: string) {}

  installed(): boolean {
    return false; // LUNCDash is mobile-only
  }

  getUri(): string {
    return this._uri;
  }

  onUpdate(callback: () => void) {
    this._updateCallback = callback;
  }

  async connect(chain: Chain): Promise<Account> {
    if (this._connectPromise) {
      return this._connectPromise;
    }

    this._connectPromise = (async () => {
      try {
        console.log('LUNCDashWallet: Connecting via WalletConnect V1...');
        const wc = await this.wc.connect();
        this._wcInstance = wc;

        // Station/LUNCDash WC V1 returns a single address
        const address = wc.accounts[0];
        if (!address) {
          throw new Error('No address returned from LUNCDash');
        }

        console.log('LUNCDashWallet: Connected, address:', address);

        // Cache the session after successful connection
        this.wc.cacheSession(wc);

        // Try to get the public key from the chain
        let pubKey = new Uint8Array();
        try {
          const account = await getAccount(chain.rpc, { address });
          const baseAccount = toBaseAccount(account);
          if (baseAccount.pubKey) {
            const decoded = CosmosCryptoSecp256k1PubKey.fromBinary(
              baseAccount.pubKey.value
            );
            pubKey = decoded.key;
          }
        } catch (err) {
          console.warn(
            'LUNCDashWallet: Could not fetch pubkey from chain (wallet may have no funds):',
            err
          );
        }

        return {
          address,
          pubKey,
          algo: 'secp256k1',
          name: 'LUNCDash',
        };
      } catch (e) {
        console.error('LUNCDashWallet: Connection failed', e);
        throw e;
      } finally {
        this._connectPromise = null;
      }
    })();

    return this._connectPromise;
  }

  async disconnect(): Promise<void> {
    if (this._wcInstance?.connected) {
      try {
        await this._wcInstance.killSession();
      } catch (e) {
        // Ignore disconnect errors
      }
    }
    this._wcInstance = null;
    this._uri = '';
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error(
      'signTx not supported for LUNCDash. Use the WalletConnect sendCustomRequest flow.'
    );
  }
}
