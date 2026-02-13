# cosmos-connect-core

Core SDK for Cosmos wallet integration. Provides wallet adapters for Keplr, Leap, Cosmostation, Station, LUNCDash, and more.

## 🔗 Live Demo

**[Try it live →](https://zahh-id.github.io/luncconnect/)**

## Installation

```bash
npm install cosmos-connect-core
```

## Wallet Adapters

- **KeplrWallet** - Browser extension and mobile app
- **LeapWallet** - Browser extension and mobile app
- **CosmostationWallet** - Browser extension and mobile app
- **StationWallet** - Terra's official wallet
- **GalaxyStationWallet** - Alternative Station wallet
- **LUNCDashWallet** - LUNC-focused wallet (WalletConnect V1)
- **WalletConnectWallet** - WalletConnect v2 support

## Usage

```typescript
import { createClient, KeplrWallet, LeapWallet } from 'cosmos-connect-core';

const client = createClient({
  chains: [
    {
      chainId: 'columbus-5',
      rpc: 'https://terra-classic-rpc.publicnode.com',
      rest: 'https://terra-classic-lcd.publicnode.com',
      bech32Prefix: 'terra',
    },
  ],
  walletConnectProjectId: 'YOUR_PROJECT_ID', // from https://cloud.walletconnect.com
  wallets: [new KeplrWallet(), new LeapWallet()],
});

// Connect wallet
await client.connect('keplr', 'columbus-5');
console.log(client.state.account?.address); // terra1...
```

> **Note:** Set `walletConnectProjectId` once in the config — it will be automatically passed to all wallets that support WalletConnect.

## Supported Chains

- Terra Classic (columbus-5)
- Terra 2.0 (phoenix-1)
- Cosmos Hub
- Osmosis
- And any other Cosmos SDK chain

## License

BSD-2-Clause

## Author

[@0xzahh](https://github.com/0xzahh)
