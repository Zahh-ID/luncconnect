import { useState, useEffect } from 'react';
import { useCosmos } from './CosmosProvider.js';
import { useCallback } from 'react';

export const useAccount = () => {
  const { state } = useCosmos();
  return {
    address: state.account?.address,
    status: state.status,
    isConnected: state.status === 'connected',
    isConnecting: state.status === 'connecting',
    isDisconnected: state.status === 'disconnected',
    account: state.account,
  };
};

export const useConnect = () => {
  const { client } = useCosmos();
  
  const connect = useCallback(async (walletId: string, chainId: string) => {
    return client.connect(walletId, chainId);
  }, [client]);

  return { connect };
};

export const useDisconnect = () => {
  const { client } = useCosmos();
  
  const disconnect = useCallback(async () => {
    return client.disconnect();
  }, [client]);

  return { disconnect };
};

export const useClient = () => {
  const { client } = useCosmos();
  return client;
};

export const useBalance = () => {
  const { state } = useCosmos();
  const [balance, setBalance] = useState<{ amount: string; denom: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const address = state.account?.address;
    const rest = state.currentChain?.rest;

    if (address && rest) {
      setIsLoading(true);
      const fetchBalance = async () => {
        try {
          const res = await fetch(
            `${rest}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=uluna`
          );
          const data = await res.json();
          setBalance(data.balance || { amount: '0', denom: 'uluna' });
        } catch (error) {
          console.error('Failed to fetch balance:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [state.account?.address, state.currentChain]);

  return { balance, isLoading };
};
