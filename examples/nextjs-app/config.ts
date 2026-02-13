import {
  KeplrWallet,
  LeapWallet,
  GalaxyStationWallet,
} from 'cosmos-connect-core';

const terraClassic = {
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

export const config = {
  chains: [terraClassic],
  wallets: [
    new KeplrWallet({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
    new LeapWallet({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
    new GalaxyStationWallet({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }),
  ],
};
