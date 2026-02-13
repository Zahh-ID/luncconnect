# cosmos-connect-react

React hooks and context provider for Cosmos wallet management. Built on top of `cosmos-connect-core`.

## 🔗 Live Demo

**[Try it live →](https://zahh-id.github.io/luncconnect/)**

## Installation

```bash
npm install cosmos-connect-react cosmos-connect-core
```

## Usage

### Setup Provider

```tsx
import { CosmosProvider } from 'cosmos-connect-react';
import { KeplrWallet, LeapWallet } from 'cosmos-connect-core';

const terraClassic = {
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

const config = {
  chains: [terraClassic],
  walletConnectProjectId: 'YOUR_PROJECT_ID', // from https://cloud.walletconnect.com
  wallets: [new KeplrWallet(), new LeapWallet()],
};

function App() {
  return (
    <CosmosProvider config={config}>
      <YourApp />
    </CosmosProvider>
  );
}
```

### Use Hooks

```tsx
import { useAccount, useConnect, useClient } from 'cosmos-connect-react';

function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { client } = useClient();

  if (isConnected) {
    return <div>Connected: {address}</div>;
  }

  return (
    <button onClick={() => connect(client.getWallets()[0])}>
      Connect Wallet
    </button>
  );
}
```

## Available Hooks

- `useAccount()` - Get current account address and connection status
- `useConnect()` - Connect/disconnect wallet functions
- `useClient()` - Access wallet client instance
- `useCosmos()` - Access full Cosmos context

## License

BSD-2-Clause

## Author

[@0xzahh](https://github.com/0xzahh)
