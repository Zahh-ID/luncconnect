import { WalletAdapter } from 'cosmos-connect-core';
import { useConnectors } from '../hooks/useConnectors';
import { useContext } from '../components/ConnectKit';
import { walletConfigs } from './walletConfigs';

export type WalletProps = {
  id: string;
  connector: WalletAdapter;
  isInstalled?: boolean;
  name: string;
  icon: React.ReactNode;
  iconShape?: 'squircle' | 'circle' | 'square';
  iconShouldShrink?: boolean;
  shortName?: string;
  shouldDeeplinkDesktop?: boolean;
  getWalletConnectDeeplink?: (uri: string) => string;
  downloadUrls?: { [key: string]: string };
};

export const useWallet = (id: string): WalletProps | null => {
  const wallets = useWallets();
  const wallet = wallets.find((c) => c.id === id);
  if (!wallet) return null;
  return wallet;
};

export const useWallets = (): WalletProps[] => {
  const connectors = useConnectors();
  const context = useContext();

  const wallets = connectors.map((connector): WalletProps => {
    let walletConfig = walletConfigs[connector.id] as any;
    if (
      !walletConfig &&
      (connector.id === 'wallet-connect' ||
        connector.id === 'walletConnectV2' ||
        connector.id.toLowerCase().includes('walletconnect'))
    ) {
      walletConfig = walletConfigs['walletConnect'];
    }

    return {
      id: connector.id,
      name: walletConfig?.name ?? connector.name,
      shortName: walletConfig?.shortName ?? connector.name,
      icon: walletConfig?.icon ? (
        walletConfig.icon
      ) : (
        <img
          src={connector.icon}
          alt={connector.name}
          width={'100%'}
          height={'100%'}
        />
      ),
      connector: connector,
      iconShape: walletConfig?.iconShape ?? 'squircle',
      isInstalled: connector.installed(),
      downloadUrls: walletConfig?.downloadUrls,
      getWalletConnectDeeplink: walletConfig?.getWalletConnectDeeplink,
    };
  });

  const sortedWallets = wallets
    // remove duplicate ids
    .filter(
      (wallet, index, self) =>
        self.findIndex((w) => w.id === wallet.id) === index
    )
    // Sort priority: Keplr > Leap > Cosmostation > others
    .sort((a, b) => {
      const priority: Record<string, number> = {
        keplr: 0,
        leap: 1,
        cosmostation: 2,
      };
      const aPrio = priority[a.id] ?? 99;
      const bPrio = priority[b.id] ?? 99;
      return aPrio - bPrio;
    });

  // Add Mobile Wallet option if not present
  if (
    !sortedWallets.find(
      (w) =>
        w.id === 'walletConnect' ||
        w.id === 'walletConnectV2' ||
        w.id === 'wallet-connect'
    )
  ) {
    const mobileConfig = walletConfigs['walletConnect'];
    if (mobileConfig) {
      sortedWallets.push({
        id: 'walletConnect',
        name: mobileConfig.name!,
        shortName: mobileConfig.shortName,
        icon: mobileConfig.icon!,
        iconShape: mobileConfig.iconShape,
        connector: {} as any, // Virtual connector
      });
    }
  }

  return sortedWallets;
};
