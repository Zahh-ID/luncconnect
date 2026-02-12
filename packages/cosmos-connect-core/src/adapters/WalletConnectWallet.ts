import { WalletConnectV2 } from "./utils/WalletConnectV2.js";
import { WalletAdapter, Chain, Account } from "../core/types.js";
import { base64 } from "@goblinhunt/cosmes/codec";
import { MobileAppDetails } from "./utils/QRCodeModal.js";

export class WalletConnectWallet implements WalletAdapter {
  id = "walletConnect";
  name = "Other Wallets";
  icon =
    "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg";

  private wc: WalletConnectV2;
  private _uri: string = "";
  private _connecting: boolean = false;
  private _updateCallback?: () => void;

  constructor({
    projectId,
    id,
    name,
    icon,
    mobileAppDetails,
  }: {
    projectId: string;
    id?: string;
    name?: string;
    icon?: string;
    mobileAppDetails?: MobileAppDetails;
  }) {
    if (id) this.id = id;
    if (name) this.name = name;
    if (icon) this.icon = icon;

    const details = mobileAppDetails || {
      name: "Cosmos Connect",
      description: "Connect to Cosmos app",
      url: typeof window !== "undefined" ? window.location.origin : "",
      icons: [
        "https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Logo/Blue%20(Default)/Logo.svg",
      ],
      android:
        "intent://wcV2#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;", // Default to Keplr for android
      ios: "keplrwallet://wcV2", // Default to Keplr for ios
    };

    this.wc = new WalletConnectV2(projectId, details);

    this.wc.onUri((uri: string) => {
      this._uri = uri;
      this._updateCallback?.();
    });
  }

  installed(): boolean {
    return false;
  }

  getUri(): string {
    return this._uri;
  }

  private _connectPromise: Promise<Account> | null = null;

  async connect(chain: Chain): Promise<Account> {
    if (this._connectPromise) {
      console.log(
        "WalletConnectWallet: connect already in progress, returning existing promise...",
      );
      return this._connectPromise;
    }

    this._connectPromise = (async () => {
      console.log(
        "WalletConnectWallet: connect called for chain",
        chain.chainId,
      );
      this._connecting = true;
      try {
        // This will trigger our onUri callback
        console.log("WalletConnectWallet: triggering wc.connect...");
        await this.wc.connect([chain.chainId]);
        console.log("WalletConnectWallet: wc.connect settled");

        // After approval, keys are set
        const accountRes = await this.wc.getAccount(chain.chainId);

        return {
          address: accountRes.address,
          pubKey: base64.decode(accountRes.pubkey),
          algo: accountRes.algo,
          name: accountRes.name,
        };
      } catch (e) {
        console.error("WalletConnectWallet: Connection failed", e);
        throw e;
      } finally {
        this._connecting = false;
        this._connectPromise = null;
      }
    })();

    return this._connectPromise;
  }

  async disconnect(): Promise<void> {
    this.wc.disconnect();
    this._uri = "";
    this._connecting = false;
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error(
      "signTx not implemented directly on adapter. Use client.signAndBroadcast",
    );
  }

  onUpdate(callback: () => void) {
    this._updateCallback = callback;
  }

  // Helper for direct access if needed
  get client() {
    return this.wc;
  }
}
