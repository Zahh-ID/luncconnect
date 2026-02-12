import React from 'react';
import { useAccount, useClient } from 'cosmos-connect-react';

type Web3Context = {
  connect: {
    getUri: (id?: string) => string;
    connect: (id: string) => Promise<void>;
  };
  dapp: {
    chains: any[];
  };
  account?: {
    chain: any;
    chainIsSupported: boolean;
    address: string;
  };
};

const Web3Context = React.createContext({
  connect: {
    getUri: () => '',
    connect: async () => {},
  },
  dapp: {
    chains: [],
  },
  account: undefined,
} as Web3Context);

export const Web3ContextProvider = ({
  children,
}: {
  enabled?: boolean;
  children: React.ReactNode;
}) => {
  const { address, isConnected } = useAccount();
  const client = useClient();
  const chain = client.state.currentChain;
  const chains = client.getChains();

  const connectFunc = React.useCallback(
    async (id: string) => {
      const wallet = client.getWallet(id);
      if (wallet) {
        const chain = client.state.currentChain || chains[0];
        if (chain) {
          await client.connect(id, chain.chainId);
        }
      }
    },
    [client, chains]
  );

  const getUriFunc = React.useCallback(
    (id?: string) => {
      let wallet = id ? client.getWallet(id) : undefined;
      if (wallet && typeof (wallet as any).getUri === 'function') {
        const uri = (wallet as any).getUri();
        if (uri) return uri;
      }

      const wcWallet = client.getWallet('walletConnect');
      if (wcWallet && typeof (wcWallet as any).getUri === 'function') {
        const uri = (wcWallet as any).getUri();
        return uri;
      }
      return '';
    },
    [client]
  );

  const value = React.useMemo(
    () =>
      ({
        connect: {
          connect: connectFunc,
          getUri: getUriFunc,
        },
        dapp: {
          chains,
        },
        account:
          isConnected && address
            ? {
                chain,
                chainIsSupported: true,
                address: address,
              }
            : undefined,
      }) as Web3Context,
    [connectFunc, getUriFunc, chains, isConnected, address, chain]
  );

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

export const useWeb3 = () => React.useContext(Web3Context);
