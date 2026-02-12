export interface Chain {
  chainId: string;
  rpc: string;
  rest?: string;
  bech32Prefix: string;
  gasPrice?: string;
}

export interface Account {
  address: string;
  pubKey: Uint8Array;
  algo?: string;
  name?: string;
  isNanoLedger?: boolean;
}

export interface WalletAdapter {
  id: string;
  name: string;
  icon?: string;

  installed(): boolean;
  connect(chain: Chain): Promise<Account>;
  disconnect(): Promise<void>;

  signTx(bytes: Uint8Array): Promise<Uint8Array>;
  signMsg?(msg: string): Promise<Uint8Array>;
  getUri?(): string;
  onUpdate?(callback: () => void): void;
}

export type ClientStatus = "disconnected" | "connecting" | "connected";

export interface ClientState {
  currentChain: Chain | null;
  currentWallet: WalletAdapter | null;
  account: Account | null;
  status: ClientStatus;
}

export interface ClientConfig {
  chains: Chain[];
  wallets: WalletAdapter[];
  storage?: StorageAdapter;
}

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export type Listener<T> = (state: T) => void;

export interface Client {
  // State
  readonly state: ClientState;

  // Actions
  connect(walletId: string, chainId: string): Promise<void>;
  disconnect(): Promise<void>;
  signAndBroadcast(txBytes: Uint8Array): Promise<string>;

  // Events
  subscribe(listener: Listener<ClientState>): () => void;

  // Getters
  getChain(chainId: string): Chain | undefined;
  getWallet(walletId: string): WalletAdapter | undefined;
  getWallets(): WalletAdapter[];
  getChains(): Chain[];
}
