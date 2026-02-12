import { WalletAdapter } from "./types.js";

export function findWallet(wallets: WalletAdapter[], walletId: string): WalletAdapter | undefined {
  return wallets.find((w) => w.id === walletId);
}
