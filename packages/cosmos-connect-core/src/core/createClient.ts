import {
  Chain,
  Client,
  ClientConfig,
  ClientState,
  StorageAdapter,
  WalletAdapter,
  Listener,
} from "./types.js";
import { defaultStorage } from "./storage.js";

const STORAGE_KEY_CHAIN = "cosmos-connect.chain";
const STORAGE_KEY_WALLET = "cosmos-connect.wallet";

export function createClient(config: ClientConfig): Client {
  const { chains, wallets } = config;
  const storage: StorageAdapter = config.storage || defaultStorage;

  let state: ClientState = {
    currentChain: null,
    currentWallet: null,
    account: null,
    status: "disconnected",
  };

  const listeners = new Set<Listener<ClientState>>();

  function setState(partial: Partial<ClientState>) {
    state = { ...state, ...partial };
    listeners.forEach((listener) => listener(state));
  }

  function getChain(chainId: string): Chain | undefined {
    return chains.find((c) => c.chainId === chainId);
  }

  function getWallet(walletId: string): WalletAdapter | undefined {
    return wallets.find((w) => w.id === walletId);
  }

  async function connect(walletId: string, chainId: string) {
    try {
      const chain = getChain(chainId);
      if (!chain) throw new Error(`Chain ${chainId} not found`);

      const wallet = getWallet(walletId);
      if (!wallet) throw new Error(`Wallet ${walletId} not found`);

      setState({ status: "connecting" });

      if (!wallet.installed() && !wallet.getUri) {
        throw new Error(`Wallet ${wallet.name} is not installed`);
      }

      const account = await wallet.connect(chain);

      setState({
        currentChain: chain,
        currentWallet: wallet,
        account,
        status: "connected",
      });

      storage.setItem(STORAGE_KEY_CHAIN, chainId);
      storage.setItem(STORAGE_KEY_WALLET, walletId);
    } catch (error) {
      setState({ status: "disconnected", account: null });
      throw error;
    }
  }

  async function disconnect() {
    if (state.currentWallet) {
      try {
        await state.currentWallet.disconnect();
      } catch (e) {
        console.error("Wallet disconnect failed", e);
      }
    }

    setState({
      currentChain: null,
      currentWallet: null,
      account: null,
      status: "disconnected",
    });

    storage.removeItem(STORAGE_KEY_CHAIN);
    storage.removeItem(STORAGE_KEY_WALLET);
  }

  async function signAndBroadcast(txBytes: Uint8Array): Promise<string> {
    if (!state.currentChain || !state.currentWallet || !state.account) {
      throw new Error("Client not connected");
    }

    // 1. Sign
    const signedTxBytes = await state.currentWallet.signTx(txBytes);

    // 2. Broadcast
    const rpc = state.currentChain.rpc;
    return await broadcastTx(rpc, signedTxBytes);
  }

  function subscribe(listener: Listener<ClientState>) {
    listeners.add(listener);
    listener(state);
    return () => {
      listeners.delete(listener);
    };
  }

  if (storage) {
    const savedChainId = storage.getItem(STORAGE_KEY_CHAIN);
    const savedWalletId = storage.getItem(STORAGE_KEY_WALLET);

    if (savedChainId && savedWalletId) {
      connect(savedWalletId, savedChainId).catch(console.error);
    }
  }

  const client: Client = {
    get state() {
      return state;
    },
    connect,
    disconnect,
    signAndBroadcast,
    subscribe,
    getChain,
    getWallet,
    getWallets: () => wallets,
    getChains: () => chains,
  };

  let updateQueued = false;
  // Subscribe to updates from wallets (e.g. for QR code URIs)
  wallets.forEach((w) => {
    if (w.onUpdate) {
      w.onUpdate(() => {
        if (!updateQueued) {
          updateQueued = true;
          queueMicrotask(() => {
            listeners.forEach((l) => l({ ...state }));
            updateQueued = false;
          });
        }
      });
    }
  });

  return client;
}

// Browser-compatible base64 encoding
function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function broadcastTx(rpc: string, signedTx: Uint8Array): Promise<string> {
  const txBytesBase64 = toBase64(signedTx);
  const body = {
    jsonrpc: "2.0",
    id: "1",
    method: "broadcast_tx_sync",
    params: {
      tx: txBytesBase64,
    },
  };

  if (typeof fetch === "undefined") {
    throw new Error("Fetch is not defined in this environment");
  }

  const res = await fetch(rpc, {
    method: "POST",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`RPC request failed with status ${res.status}`);
  }

  const json = await res.json();
  if (json.error) {
    throw new Error(json.error.message);
  }
  return json.result.hash;
}
