import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  Client,
  ClientState,
  createClient,
  ClientConfig,
  TERRA_CLASSIC,
  KeplrWallet,
  GalaxyStationWallet,
  LeapWallet,
  WalletConnectWallet,
} from 'cosmos-connect-core';

interface CosmosContextValue {
  client: Client;
  state: ClientState;
}

const CosmosContext = createContext<CosmosContextValue | null>(null);

const DEFAULT_CONFIG: ClientConfig = {
  chains: [TERRA_CLASSIC],
  wallets: [
    new GalaxyStationWallet(),
    new KeplrWallet(),
    new LeapWallet(),
    new WalletConnectWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42', // Default placeholder or instructions needed
    }),
  ],
};

export interface CosmosProviderProps {
  children: ReactNode;
  config?: Partial<ClientConfig>;
}

export const CosmosProvider: React.FC<CosmosProviderProps> = ({
  children,
  config,
}) => {
  const [client] = useState(() => {
    const fullConfig: ClientConfig = {
      chains: config?.chains || DEFAULT_CONFIG.chains,
      wallets: config?.wallets || DEFAULT_CONFIG.wallets,
      storage: config?.storage || DEFAULT_CONFIG.storage,
    };
    return createClient(fullConfig);
  });
  const [state, setState] = useState<ClientState>(client.state);

  useEffect(() => {
    return client.subscribe(setState);
  }, [client]);

  return (
    <CosmosContext.Provider value={{ client, state }}>
      {children}
    </CosmosContext.Provider>
  );
};

export const useCosmos = () => {
  const context = useContext(CosmosContext);
  if (!context) {
    throw new Error('useCosmos must be used within a CosmosProvider');
  }
  return context;
};
