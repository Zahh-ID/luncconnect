import {
  KeplrWallet,
  LeapWallet,
  GalaxyStationWallet,
} from 'cosmos-connect-core';

export const wallets = {
  keplr: new KeplrWallet(),
  leap: new LeapWallet(),
  galaxyStation: new GalaxyStationWallet(),
};
