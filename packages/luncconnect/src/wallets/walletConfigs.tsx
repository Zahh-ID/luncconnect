import Logos from '../assets/logos';
import CosmosLogos from '../assets/cosmosLogos';

/**
 * EIP-6963: Multi Injected Provider Discovery
 * https://eips.ethereum.org/EIPS/eip-6963
 *
 */
export type WalletConfigProps = {
  // Wallets name
  name?: string;
  // Wallets short name. Defaults to `name`
  shortName?: string;
  // Icon to display in the modal
  icon?: string | React.ReactNode;
  // Icon to use on the wallet list button. If not provided, `icon` will be used
  iconConnector?: React.ReactNode;
  // Defaults to `'circle'`, but some icons look better as squircle (e.g. if they have a background)
  iconShape?: 'squircle' | 'circle' | 'square';
  // Defaults to `false`, but some icons don't have a background and look better if they shrink to fit the container
  iconShouldShrink?: boolean;
  // Links to download the wallet
  downloadUrls?: {
    // Download redirect, hosted by Family.co
    // This URL redirects to the correct download URL based on the user's device
    // Note: this will eventually be automated by the below data
    download?: string;
    // wallet's website
    website?: string;
    // app downloads
    desktop?: string;
    android?: string;
    ios?: string;
    // browser extensions
    chrome?: string;
    firefox?: string;
    brave?: string;
    edge?: string;
    safari?: string;
  };
  getWalletConnectDeeplink?: (uri: string) => string;
  shouldDeeplinkDesktop?: boolean;
  isStation?: boolean;
  isLuncDash?: boolean;
};

// Organised in alphabetical order by key
export const walletConfigs: {
  [rdns: string]: WalletConfigProps; // for multiple cases seperate rdns by comma
} = {
  keplr: {
    name: 'Keplr',
    shortName: 'Keplr',
    icon: <CosmosLogos.Keplr />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://www.keplr.app/download',
      website: 'https://www.keplr.app',
      chrome:
        'https://chrome.google.com/webstore/detail/keplr/dmkamcknogkgcdfhhbddcghachkejeap',
      firefox: 'https://addons.mozilla.org/en-US/firefox/addon/keplr/',
      ios: 'https://apps.apple.com/us/app/keplr-wallet/id1567851089',
      android:
        'https://play.google.com/store/apps/details?id=com.chainapsis.keplr&hl=en&gl=US',
    },
    getWalletConnectDeeplink: (uri: string) => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        const androidIntent =
          'intent://wcV2#Intent;package=com.chainapsis.keplr;scheme=keplrwallet;end;';
        const hashIndex = androidIntent.indexOf('#');
        return (
          androidIntent.slice(0, hashIndex) +
          '?' +
          encodeURIComponent(uri) +
          androidIntent.slice(hashIndex)
        );
      }
      return `keplrwallet://wcV2?${encodeURIComponent(uri)}`;
    },
  },
  leap: {
    name: 'Leap',
    shortName: 'Leap',
    icon: <CosmosLogos.Leap />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://www.leapwallet.io/download',
      website: 'https://www.leapwallet.io/',
      chrome:
        'https://chrome.google.com/webstore/detail/leap-cosmos-wallet/fcfcfllfndocbalnbalbihebejjbfmbe',
      edge: 'https://microsoftedge.microsoft.com/addons/detail/leap-cosmos-wallet/skclmmoedpdefmapamdedoaadjbgfcln',
      firefox:
        'https://addons.mozilla.org/en-US/firefox/addon/leap-cosmos-wallet/',
      ios: 'https://apps.apple.com/us/app/leap-cosmos/id1614533031',
      android:
        'https://play.google.com/store/apps/details?id=io.leapwallet.cosmos',
    },
    getWalletConnectDeeplink: (uri: string) => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        const androidIntent =
          'leapcosmos://wcV2#Intent;package=io.leapwallet.cosmos;scheme=leapwallet;end;';
        const hashIndex = androidIntent.indexOf('#');
        return (
          androidIntent.slice(0, hashIndex) +
          '?' +
          encodeURIComponent(uri) +
          androidIntent.slice(hashIndex)
        );
      }
      return `leapcosmos://wcV2?${encodeURIComponent(uri)}`;
    },
  },
  cosmostation: {
    name: 'Cosmostation',
    shortName: 'Cosmostation',
    icon: <CosmosLogos.Cosmostation />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://cosmostation.io/wallet/',
      website: 'https://cosmostation.io/',
      chrome:
        'https://chrome.google.com/webstore/detail/cosmostation/fpkhhfbjbacklhonnhgnoabneaagndfe',
      ios: 'https://apps.apple.com/us/app/cosmostation/id1459832242',
      android:
        'https://play.google.com/store/apps/details?id=wannabit.io.cosmostation',
    },
    getWalletConnectDeeplink: (uri: string) => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        const androidIntent =
          'intent://wc#Intent;package=wannabit.io.cosmostaion;scheme=cosmostation;end;';
        const hashIndex = androidIntent.indexOf('#');
        return (
          androidIntent.slice(0, hashIndex) +
          '?' +
          encodeURIComponent(uri) +
          androidIntent.slice(hashIndex)
        );
      }
      return `cosmostation://wc?${encodeURIComponent(uri)}`;
    },
  },
  'galaxy-station': {
    name: 'Galaxy Station',
    shortName: 'Galaxy',
    icon: <CosmosLogos.GalaxyStation />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://galaxystation.money/',
      website: 'https://galaxystation.money/',
      chrome:
        'https://chrome.google.com/webstore/detail/galaxy-station/akckefnapafjbpphkefbpkpcamkoaoai',
    },
    getWalletConnectDeeplink: (uri: string) => {
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        const androidIntent =
          'https://station.hexxagon.io/wcV2#Intent;package=io.hexxagon.station;scheme=galaxystation;end;';
        const hashIndex = androidIntent.indexOf('#');
        return (
          androidIntent.slice(0, hashIndex) +
          '?' +
          encodeURIComponent(uri) +
          androidIntent.slice(hashIndex)
        );
      }
      return `https://station.hexxagon.io/wcV2?${encodeURIComponent(uri)}`;
    },
  },
  station: {
    name: 'Station Wallet',
    shortName: 'Station',
    icon: <CosmosLogos.Station />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://setup.station.money/',
      website: 'https://station.money/',
      chrome:
        'https://chrome.google.com/webstore/detail/station-wallet/aiifbnbfobpmeekipheeijimdpnlpgpp',
    },
    getWalletConnectDeeplink: (uri: string) => {
      return `https://terrastation.page.link/?link=https://terra.money?${encodeURIComponent(
        `action=wallet_connect&payload=${encodeURIComponent(uri)}`
      )}&apn=money.terra.station&ibi=money.terra.station&isi=1548434735`;
    },
    isStation: true,
  },
  luncdash: {
    name: 'LUNCDash',
    shortName: 'LUNCDash',
    icon: <CosmosLogos.LUNCDash />,
    iconShape: 'squircle',
    downloadUrls: {
      download: 'https://luncdash.com/',
      website: 'https://luncdash.com/',
    },
    getWalletConnectDeeplink: (uri: string) => {
      return `luncdash://wallet_connect?${encodeURIComponent(
        `payload=${encodeURIComponent(uri)}`
      )}`;
    },
    isStation: true,
    isLuncDash: true,
  },
  walletConnect: {
    name: 'Other Wallets',
    shortName: 'Other',
    icon: <Logos.OtherWallets />,
    iconConnector: <Logos.OtherWallets />,
    iconShape: 'square',
    getWalletConnectDeeplink: (uri: string) => uri,
  },
} as const;
