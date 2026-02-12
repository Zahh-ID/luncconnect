import { useClient } from 'cosmos-connect-react';

export function useConnectors() {
  const client = useClient();
  return client.getWallets();
}

export function useConnector(id: string) {
  const connectors = useConnectors();
  return connectors.find((c) => c.id === id);
}

// These are legacy and can be removed or stubbed if needed
export function useFamilyAccountsConnector() {
  return undefined;
}
export function useFamilyConnector() {
  return undefined;
}
export function useInjectedConnector(uuid?: string) {
  return useConnector('keplr'); // Default to keplr for Terra
}
export function useWalletConnectConnector() {
  return undefined;
}
export function useCoinbaseWalletConnector() {
  return undefined;
}
export function useMetaMaskConnector() {
  return undefined;
}
