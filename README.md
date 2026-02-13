# LUNCConnect

LUNCConnect is a powerful [React](https://reactjs.org/) component library for connecting Cosmos wallets to your dApp. Built specifically for Terra Classic (LUNC) and Cosmos ecosystem, it provides a beautiful, seamless wallet connection experience. Forked from [ConnectKit](https://github.com/family/connectkit).

## 🔗 Live Demo

**[Try it live →](https://zahh-id.github.io/luncconnect/)**

## Features

- 💡 **TypeScript Ready** — Get types straight out of the box.
- 🌱 **Cosmos Ecosystem** — Built for Terra Classic and Cosmos chains.
- 🔌 **Multiple Wallets** — Supports Keplr, Leap, Cosmostation, Station, LUNCDash, and more.
- 🖥️ **Simple UX** — Give users a simple, attractive experience.
- 🎨 **Beautiful Themes** — Predesigned themes or full customization.
- 📱 **Mobile Support** — Deep linking and WalletConnect for mobile wallet apps.

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
npm install luncconnect cosmos-connect-core cosmos-connect-react
```

## Basic Usage

```tsx
import { ConnectKitProvider, ConnectKitButton } from 'luncconnect';
import { KeplrWallet, LeapWallet, LUNCDashWallet } from 'cosmos-connect-core';

const terraClassic = {
  chainId: 'columbus-5',
  rpc: 'https://terra-classic-rpc.publicnode.com',
  rest: 'https://terra-classic-lcd.publicnode.com',
  bech32Prefix: 'terra',
};

const config = {
  chains: [terraClassic],
  walletConnectProjectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // from https://cloud.walletconnect.com
  wallets: [new KeplrWallet(), new LeapWallet(), new LUNCDashWallet()],
};

function App() {
  return (
    <ConnectKitProvider config={config}>
      <ConnectKitButton />
    </ConnectKitProvider>
  );
}
```

> **Note:** Get your WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).
> Set it once in `walletConnectProjectId` and it will be automatically passed to all wallets.

## Supported Wallets

- **Keplr** - Browser extension and mobile app
- **Leap** - Browser extension and mobile app
- **Cosmostation** - Browser extension and mobile app
- **Station** - Terra's official wallet
- **LUNCDash** - LUNC-focused wallet (WalletConnect V1)
- **Galaxy Station** - Alternative Station wallet

## License

See [LICENSE](./LICENSE) for more information.

## Author

Created by [@0xzahh](https://github.com/0xzahh)
