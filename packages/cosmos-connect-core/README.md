# cosmos-connect-core

Core SDK for Cosmos wallet integration. Provides wallet adapters for Keplr, Leap, Cosmostation, Station, and more.

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
- **LUNCDashWallet** - LUNC-focused wallet
- **WalletConnectWallet** - WalletConnect v2 support

## Usage

```typescript
import { KeplrWallet, LeapWallet } from 'cosmos-connect-core';

const keplr = new KeplrWallet();
const leap = new LeapWallet();

// Connect wallet
await keplr.connect({
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
});

// Get account
const account = await keplr.getAccount('columbus-5');
console.log(account.address); // terra1...
```

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
