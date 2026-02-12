export function findWallet(wallets, walletId) {
    return wallets.find((w) => w.id === walletId);
}
