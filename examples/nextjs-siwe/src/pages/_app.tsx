import '@/styles/globals.css';
import { ConnectKitProvider } from 'luncconnect';
import { CosmosProvider } from 'cosmos-connect-react';
import type { AppProps } from 'next/app';
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

const config = {
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

export default function App({ Component, pageProps }: AppProps) {
  return (
    <CosmosProvider config={config}>
      <ConnectKitProvider>
        <Component {...pageProps} />
      </ConnectKitProvider>
    </CosmosProvider>
  );
}
