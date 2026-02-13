import { createElement, createContext, useContext } from 'react';
import { TestBenchProvider } from '../TestbenchProvider';

import { ConnectKitProvider } from 'luncconnect';
import { CosmosProvider } from 'cosmos-connect-react';
import {
  KeplrWallet,
  LeapWallet,
  GalaxyStationWallet,
} from 'cosmos-connect-core';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

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

const queryClient = new QueryClient();

type ContextValue = {};

const Context = createContext<ContextValue | null>(null);

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  return createElement(
    Context.Provider,
    { value: {} },
    <CosmosProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <TestBenchProvider>{children}</TestBenchProvider>
      </QueryClientProvider>
    </CosmosProvider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Context);
  if (!context) throw Error('useWeb3 must be inside a Web3Provider.');
  return context;
};
