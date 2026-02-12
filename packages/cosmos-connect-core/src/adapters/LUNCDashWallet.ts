import { WalletConnectWallet } from "./WalletConnectWallet.js";

export class LUNCDashWallet extends WalletConnectWallet {
  constructor({ projectId }: { projectId: string }) {
    super({
      projectId,
      id: "luncdash",
      name: "LUNCDash",
      icon: "https://luncdash.com/assets/logo-dash-r8Nezm76.png",
      mobileAppDetails: {
        name: "LUNCDash",
        description: "Connect to LUNCDash",
        url: "https://luncdash.com",
        icons: ["https://luncdash.com/assets/logo-dash-r8Nezm76.png"],
        android: "luncdash://wc",
        ios: "luncdash://wc",
      },
    });
  }
}
