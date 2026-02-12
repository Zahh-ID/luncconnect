import { WalletAdapter, Chain, Account } from "../core/types.js";
import { WalletConnectWallet } from "./WalletConnectWallet.js";
import { WalletName } from "@goblinhunt/cosmes/wallet";

// Basic Galaxy Station type definitions
interface GalaxyStation {
  keplr: {
    enable(chainId: string | string[]): Promise<void>;
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
    galaxyStation?: GalaxyStation;
  }
}

export class GalaxyStationWallet implements WalletAdapter {
  id = "galaxy-station";
  name = "Galaxy Station";
  icon =
    "https://raw.githubusercontent.com/terra-money/station-assets/main/img/station.png";

  private wc?: WalletConnectWallet;

  constructor(options?: { projectId?: string }) {
    if (options?.projectId) {
      this.wc = new WalletConnectWallet({
        projectId: options.projectId,
        id: this.id,
        name: this.name,
        icon: this.icon,
        mobileAppDetails: {
          name: "Galaxy Station",
          description: "Galaxy Station Wallet (Terra Classic)",
          android:
            "https://station.hexxagon.io/wcV2#Intent;package=io.hexxagon.station;scheme=galaxystation;end;",
          ios: "https://station.hexxagon.io/wcV2",
        },
      });
    }
  }

  installed(): boolean {
    return typeof window !== "undefined" && !!window.galaxyStation;
  }

  getUri(): string {
    return this.wc?.getUri() ?? "";
  }

  onUpdate(callback: () => void): void {
    this.wc?.onUpdate(callback);
  }

  async connect(chain: Chain): Promise<Account> {
    const galaxyStation = window.galaxyStation;
    if (!galaxyStation) {
      if (this.wc) {
        return this.wc.connect(chain);
      }
      throw new Error("Galaxy Station Wallet extension not found");
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
    } catch (error: any) {
      throw new Error(
        `Galaxy Station Wallet connection failed: ${error.message}`,
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.wc) {
      await this.wc.disconnect();
    }
    return Promise.resolve();
  }

  async signTx(_bytes: Uint8Array): Promise<Uint8Array> {
    throw new Error("signTx not implemented for Galaxy Station yet.");
  }
}
