import React from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectKitProvider } from 'luncconnect';
import { CosmosProvider } from 'cosmos-connect-react';
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

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <CosmosProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </CosmosProvider>
  );
};
