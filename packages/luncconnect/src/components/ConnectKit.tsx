import React, {
  createContext,
  createElement,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Buffer } from 'buffer';
import {
  CustomTheme,
  Languages,
  Mode,
  Theme,
  CustomAvatarProps,
} from '../types';

import defaultTheme from '../styles/defaultTheme';

import ConnectKitModal from '../components/ConnectModal';
import { ThemeProvider } from 'styled-components';
import {
  useConnectCallback,
  useConnectCallbackProps,
} from '../hooks/useConnectCallback';
// import { isFamily } from '../utils/wallets';
import { useAccount, CosmosProvider } from 'cosmos-connect-react';
import { ClientConfig } from 'cosmos-connect-core';
import { Web3ContextProvider } from './contexts/web3';

import { routes } from '../constants/routes';

type Connector = {
  id: string;
};
type Error = string | React.ReactNode | null;

type ContextValue = {
  theme: Theme;
  setTheme: React.Dispatch<React.SetStateAction<Theme>>;
  mode: Mode;
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
  customTheme: CustomTheme | undefined;
  setCustomTheme: React.Dispatch<React.SetStateAction<CustomTheme | undefined>>;
  lang: Languages;
  setLang: React.Dispatch<React.SetStateAction<Languages>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  route: string;
  setRoute: React.Dispatch<React.SetStateAction<string>>;
  connector: Connector;
  setConnector: React.Dispatch<React.SetStateAction<Connector>>;
  errorMessage: Error;
  options?: ConnectKitOptions;
  // signInWithEthereum: boolean;
  debugMode?: boolean;
  log: (...props: any) => void;
  displayError: (message: string | React.ReactNode | null, code?: any) => void;
  resize: number;
  triggerResize: () => void;
} & useConnectCallbackProps;

export const Context = createContext<ContextValue | null>(null);

export type ConnectKitOptions = {
  language?: Languages;
  hideBalance?: boolean;
  hideTooltips?: boolean;
  hideQuestionMarkCTA?: boolean;
  hideNoWalletCTA?: boolean;
  hideRecentBadge?: boolean;
  walletConnectCTA?: 'link' | 'modal' | 'both';
  avoidLayoutShift?: boolean; // Avoids layout shift when the ConnectKit modal is open by adding padding to the body
  embedGoogleFonts?: boolean; // Automatically embeds Google Font of the current theme. Does not work with custom themes
  truncateLongENSAddress?: boolean; // TODO: Rename or repurpose for Terra addresses?
  walletConnectName?: string;
  reducedMotion?: boolean;
  disclaimer?: ReactNode | string;
  bufferPolyfill?: boolean;
  customAvatar?: React.FC<CustomAvatarProps>;
  initialChainId?: number; // Changed from number to string for Cosmos
  enforceSupportedChains?: boolean;
  ethereumOnboardingUrl?: string; // Removed
  walletOnboardingUrl?: string;
  disableSiweRedirect?: boolean; // Removed
  overlayBlur?: number; // Blur the background when the modal is open
};

type ConnectKitProviderProps = {
  children?: React.ReactNode;
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;
  options?: ConnectKitOptions;
  config?: ClientConfig; // Added for Cosmos config
  debugMode?: boolean;
} & useConnectCallbackProps;

export const ConnectKitProvider = (props: ConnectKitProviderProps) => {
  return (
    <CosmosProvider config={props.config}>
      <ConnectKitProviderInner {...props} />
    </CosmosProvider>
  );
};

export const ConnectKitProviderInner = ({
  children,
  theme = 'auto',
  mode = 'auto',
  customTheme,
  options,
  onConnect,
  onDisconnect,
  debugMode = false,
  config,
}: ConnectKitProviderProps) => {
  // Only allow for mounting ConnectKitProvider once, so we avoid weird global
  // state collisions.
  if (React.useContext(Context)) {
    throw new Error(
      'Multiple, nested usages of ConnectKitProvider detected. Please use only one.'
    );
  }

  useConnectCallback({
    onConnect,
    onDisconnect,
  });

  // Default config options
  const defaultOptions: ConnectKitOptions = {
    language: 'en-US',
    hideBalance: false,
    hideTooltips: false,
    hideQuestionMarkCTA: false,
    hideNoWalletCTA: false,
    walletConnectCTA: 'link',
    hideRecentBadge: false,
    avoidLayoutShift: true,
    embedGoogleFonts: false,
    truncateLongENSAddress: true,
    walletConnectName: undefined,
    reducedMotion: false,
    disclaimer: null,
    bufferPolyfill: true,
    customAvatar: undefined,
    initialChainId: undefined, // chains?.[0]?.id, // TODO
    enforceSupportedChains: false,
    ethereumOnboardingUrl: undefined,
    walletOnboardingUrl: undefined,
    disableSiweRedirect: false,
  };

  const opts: ConnectKitOptions = Object.assign({}, defaultOptions, options);

  if (typeof window !== 'undefined') {
    // Buffer Polyfill, needed for bundlers that don't provide Node polyfills (e.g CRA, Vite, etc.)
    if (opts.bufferPolyfill) window.Buffer = window.Buffer ?? Buffer;
  }

  const [ckTheme, setTheme] = useState<Theme>(theme);
  const [ckMode, setMode] = useState<Mode>(mode);
  const [ckCustomTheme, setCustomTheme] = useState<CustomTheme | undefined>(
    customTheme ?? {}
  );
  const [ckLang, setLang] = useState<Languages>('en-US');
  const [open, setOpen] = useState<boolean>(false);
  const [connector, setConnector] = useState<ContextValue['connector']>({
    id: '',
  });
  const [route, setRoute] = useState<string>(routes.CONNECTORS);
  const [errorMessage, setErrorMessage] = useState<Error>('');

  const [resize, onResize] = useState<number>(0);

  // Other Configuration
  useEffect(() => setTheme(theme), [theme]);
  useEffect(() => setLang(opts.language || 'en-US'), [opts.language]);
  useEffect(() => setErrorMessage(null), [route, open]);

  // Check if chain is supported, elsewise redirect to switches page
  const { isConnected } = useAccount(); // chain unused for now

  const log = debugMode ? console.log : () => {};

  const value = React.useMemo(
    () => ({
      theme: ckTheme,
      setTheme,
      mode: ckMode,
      setMode,
      customTheme: ckCustomTheme,
      setCustomTheme,
      lang: ckLang,
      setLang,
      open,
      setOpen,
      route,
      setRoute,
      connector,
      setConnector,
      signInWithEthereum: false,
      onConnect,
      // Other configuration
      options: opts,
      errorMessage,
      debugMode,
      log,
      displayError: (message: string | React.ReactNode | null, code?: any) => {
        setErrorMessage(message);
        console.log('---------CONNECTKIT DEBUG---------');
        console.log(message);
        if (code) console.table(code);
        console.log('---------/CONNECTKIT DEBUG---------');
      },
      resize,
      triggerResize: () => onResize((prev) => prev + 1),
    }),
    [
      ckTheme,
      ckMode,
      ckCustomTheme,
      ckLang,
      open,
      route,
      connector,
      onConnect,
      opts,
      errorMessage,
      debugMode,
      log,
      resize,
    ]
  );

  return createElement(
    Context.Provider,
    { value },
    <Web3ContextProvider enabled={open}>
      <ThemeProvider theme={defaultTheme}>
        {children}
        <ConnectKitModal
          lang={ckLang}
          theme={ckTheme}
          mode={mode}
          customTheme={ckCustomTheme}
        />
      </ThemeProvider>
    </Web3ContextProvider>
  );
};

export const useContext = () => {
  const context = React.useContext(Context);
  if (!context) throw Error('ConnectKit Hook must be inside a Provider.');
  return context;
};
