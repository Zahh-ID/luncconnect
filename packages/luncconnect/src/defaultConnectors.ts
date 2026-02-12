import {
  KeplrWallet,
  LeapWallet,
  GalaxyStationWallet,
  StationWallet,
  CosmostationWallet,
  LUNCDashWallet,
  WalletConnectWallet,
} from 'cosmos-connect-core';

type DefaultConnectorsProps = {
  appName?: string;
  appIcon?: string;
  appDescription?: string;
  appUrl?: string;
  projectId?: string;
};

const defaultConnectors = (props?: DefaultConnectorsProps): any[] => {
  const projectId = props?.projectId ?? '39190b939e067ecb6dccdb7c77653a42'; // Default project ID from demo
  return [
    new KeplrWallet({ projectId }),
    new LeapWallet({ projectId }),
    new GalaxyStationWallet({ projectId }),
    new StationWallet({ projectId }),
    new CosmostationWallet({ projectId }),
    new LUNCDashWallet({ projectId }),
    new WalletConnectWallet({ projectId }),
  ];
};

export default defaultConnectors;
