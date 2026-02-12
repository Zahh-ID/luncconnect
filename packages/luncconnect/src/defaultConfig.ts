import { ClientConfig } from 'cosmos-connect-core';
import defaultConnectors from './defaultConnectors';

// TODO: Move these to a provider rather than global variable
let globalAppName: string;
let globalAppIcon: string;
export const getAppName = () => globalAppName;
export const getAppIcon = () => globalAppIcon;

const terraClassic = {
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

type DefaultConfigProps = {
  appName: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  projectId?: string;
  chains?: any[];
  wallets?: any[];
};

const defaultConfig = ({
  appName = 'ConnectKit',
  appIcon,
  appDescription,
  appUrl,
  projectId = '39190b939e067ecb6dccdb7c77653a42',
  chains = [terraClassic],
  wallets,
}: DefaultConfigProps): ClientConfig => {
  const finalWallets =
    wallets ??
    defaultConnectors({
      appName,
      appIcon,
      appDescription,
      appUrl,
      projectId,
    });
  globalAppName = appName;
  if (appIcon) globalAppIcon = appIcon;

  const config: ClientConfig = {
    chains,
    wallets: finalWallets,
  };

  return config;
};

export default defaultConfig;
