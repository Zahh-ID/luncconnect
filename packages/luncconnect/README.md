# luncconnect

Beautiful, customizable UI components for connecting Cosmos wallets to your dApp. Built specifically for Terra Classic (LUNC) and the Cosmos ecosystem.

Forked from [ConnectKit](https://github.com/family/connectkit)

## Installation

```bash
npm install luncconnect cosmos-connect-react cosmos-connect-core
```

## Quick Start

```tsx
import { ConnectKitProvider, ConnectKitButton } from 'luncconnect';
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
  wallets: [new KeplrWallet(), new LeapWallet()],
};

function App() {
  return (
    <CosmosProvider config={config}>
      <ConnectKitProvider>
        <ConnectKitButton />
      </ConnectKitProvider>
    </CosmosProvider>
  );
}
```

## Features

- 🎨 **Beautiful UI** - Pre-designed themes with full customization
- 💡 **TypeScript** - Full type safety out of the box
- 📱 **Mobile Support** - Deep linking for mobile wallet apps
- 🌐 **Multi-Wallet** - Keplr, Leap, Cosmostation, Station, and more
- 🎭 **Themeable** - Multiple built-in themes or create your own
- ⚡ **Fast** - Optimized performance with React

## Supported Wallets

- Keplr (Browser + Mobile)
- Leap (Browser + Mobile)
- Cosmostation (Browser + Mobile)
- Station (Terra's official wallet)
- Galaxy Station
- LUNCDash

## Customization

```tsx
<ConnectKitProvider
  customTheme={{
    '--ck-connectbutton-background': '#1a1b1f',
    '--ck-connectbutton-color': '#ffffff',
    '--ck-connectbutton-border-radius': '12px',
  }}
>
  <ConnectKitButton />
</ConnectKitProvider>
```

## Components

- `<ConnectKitButton />` - Main connect button
- `<ConnectKitProvider />` - Context provider
- `<Avatar />` - Account avatar
- Custom modal pages and components

## License

BSD-2-Clause

## Author

[@0xzahh](https://github.com/0xzahh)
