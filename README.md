# LUNCConnect

LUNCConnect is a powerful [React](https://reactjs.org/) component library for connecting Cosmos wallets to your dApp. Built specifically for Terra Classic (LUNC) and Cosmos ecosystem, it provides a beautiful, seamless wallet connection experience. forked from [ConnectKit](https://github.com/family/connectkit)

## Features

- 💡 **TypeScript Ready** — Get types straight out of the box.
- 🌱 **Cosmos Ecosystem** — Built for Terra Classic and Cosmos chains.
- 🔌 **Multiple Wallets** — Supports Keplr, Leap, Cosmostation, Station, LUNCDash, and more.
- 🖥️ **Simple UX** — Give users a simple, attractive experience.
- 🎨 **Beautiful Themes** — Predesigned themes or full customization.
- 📱 **Mobile Support** — Deep linking for mobile wallet apps.

## Quick Start

Get started with a LUNCConnect project by running one of the following in your terminal:

#### npm

```sh
npx create-react-app my-app --template luncconnect
```

#### yarn

```sh
yarn create react-app my-app --template luncconnect
```

#### pnpm

```sh
pnpm dlx create-react-app ./my-app --template luncconnect
```

## Installation

```sh
npm install LUNCConnect @yourorg/cosmos-connect-core @yourorg/cosmos-connect-react
```

## Basic Usage

```tsx
import { ConnectKitProvider, ConnectKitButton } from 'LUNCConnect';
import { KeplrWallet, LeapWallet } from '@yourorg/cosmos-connect-core';

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
    <ConnectKitProvider config={config}>
      <ConnectKitButton />
    </ConnectKitProvider>
  );
}
```

## Supported Wallets

- **Keplr** - Browser extension and mobile app
- **Leap** - Browser extension and mobile app
- **Cosmostation** - Browser extension and mobile app
- **Station** - Terra's official wallet
- **LUNCDash** - LUNC-focused wallet
- **Galaxy Station** - Alternative Station wallet

## License

See [LICENSE](./LICENSE) for more information.

## Author

Created by [@0xzahh](https://github.com/0xzahh)
