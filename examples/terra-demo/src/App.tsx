import React from 'react';
import { ConnectKitProvider, ConnectKitButton } from 'luncconnect';
import {
  KeplrWallet,
  LeapWallet,
  GalaxyStationWallet,
  StationWallet,
  CosmostationWallet,
  LUNCDashWallet,
  WalletConnectWallet,
} from 'cosmos-connect-core';

const terraClassic = {
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

const terraTestnet = {
  chainId: 'rebel-2',
  rpc: 'https://terra-classic-testnet-rpc.publicnode.com',
  rest: 'https://terra-classic-testnet-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

const config = {
  chains: [terraClassic, terraTestnet],
  wallets: [
    new KeplrWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new LeapWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new GalaxyStationWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new StationWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new CosmostationWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new LUNCDashWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
    new WalletConnectWallet({
      projectId: '39190b939e067ecb6dccdb7c77653a42',
    }),
  ],
};

function App() {
  return (
    <ConnectKitProvider config={config}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: '20px',
          fontFamily: 'sans-serif',
        }}
      >
        <h1>Terra Classic ConnectKit Demo</h1>
        <ConnectKitButton />

        <div
          style={{
            marginTop: '20px',
            padding: '20px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          <p>This demo uses the refactored ConnectKit with Cosmos support.</p>
          <ul>
            <li>Exclusively supports Terra Classic</li>
            <li>Prioritizes Keplr Wallet</li>
            <li>Displays LUNA balances</li>
          </ul>
        </div>
      </div>
    </ConnectKitProvider>
  );
}

export default App;
