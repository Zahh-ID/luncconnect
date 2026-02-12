import React from 'react';
import {
  Container,
  WalletList,
  WalletItem,
  WalletIcon,
  WalletLabel,
} from './styles';

import { LearnMoreButton } from '../Connectors/styles';
import WalletAssetIcon from '../../../assets/wallet';

import { PageContent, ModalContent } from '../../Common/Modal/styles';

import { useContext } from '../../ConnectKit';
import { routes } from '../../../constants/routes';
import CopyToClipboard from '../../Common/CopyToClipboard';
import useLocales from '../../../hooks/useLocales';
import { Spinner } from '../../Common/Spinner';
import { ScrollArea } from '../../Common/ScrollArea';
import { useWeb3 } from '../../contexts/web3';
import { useWallets } from '../../../wallets/useWallets';
import { useState, useEffect } from 'react';
import { useClient } from 'cosmos-connect-react';
import {
  WalletConfigProps,
  walletConfigs,
} from '../../../wallets/walletConfigs';

const MoreIcon = (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M30 42V19M19 30.5H42"
      stroke="var(--ck-body-color-muted)"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

const MobileConnectors: React.FC = () => {
  const context = useContext();
  const locales = useLocales();

  const client = useClient();
  const [wcUri, setWcUri] = useState<string>('');

  useEffect(() => {
    let interval: any;
    const initConnection = async () => {
      const connector = (client as any).getWallet?.('walletConnect');
      if (connector) {
        // Start connection if needed or force it to ensure we get a URI
        const currentChain = client.state.currentChain;
        if (currentChain) {
          connector
            .connect(currentChain) // Just pass chain, client/adapter handles string vs chain logic
            .catch((e: any) => {
              // Even if it fails (e.g. "already pending"), we should still poll for the URI
            });
        }

        // Poll for URI
        interval = setInterval(() => {
          const uri = connector.getUri?.();
          if (uri) {
            setWcUri(uri);
            clearInterval(interval);
          }
        }, 500);
      }
    };

    initConnection();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [client]);

  const wallets = useWallets();

  // Filter to show wallets that are NOT in the main list
  const mainWallets = ['keplr', 'leap', 'cosmostation', 'walletConnect'];
  const walletsIdsToDisplay =
    Object.keys(walletConfigs).filter((walletId) => {
      // If it's a main wallet, hide it from here
      if (mainWallets.includes(walletId)) return false;

      const wallet = walletConfigs[walletId];
      // If it has a deeplink function, show it (this allows both registered and unregistered wallets)
      if ((wallet as any).getWalletConnectDeeplink) return true;

      return false;
    }) ?? [];

  const connectWallet = (wallet: WalletConfigProps, walletId: string) => {
    // If the wallet is a registered connector (available in useWallets), use the standard routing flow
    if (wallets.find((w) => w.id === walletId)) {
      context.setConnector({ id: walletId });
      context.setRoute(routes.CONNECT);
      return;
    }

    if (walletId === 'walletConnect') {
      context.setConnector({ id: 'walletConnect' });
      context.setRoute(routes.CONNECT);
      return;
    }
    let targetUri = wcUri;
    if (!targetUri) {
      // Last ditch attempt to get URI if it wasn't polled yet
      const connector = (client as any).getWallet?.('walletConnect');
      targetUri = connector?.getUri?.();
    }

    if (targetUri) {
      const uri = (wallet as any).getWalletConnectDeeplink?.(targetUri);
      if (uri) window.location.href = uri;
    } else {
      console.warn(
        'MobileConnectors: No WalletConnect URI available to deep link'
      );
    }
  };

  return (
    <PageContent style={{ width: 312 }}>
      <Container>
        <ModalContent style={{ paddingBottom: 0 }}>
          <ScrollArea height={340}>
            <WalletList>
              {walletsIdsToDisplay
                .sort((a, b) => {
                  const walletA = walletConfigs[a];
                  const walletB = walletConfigs[b];
                  const nameA = walletA.name ?? (walletA as any).shortName ?? a;
                  const nameB = walletB.name ?? (walletB as any).shortName ?? b;
                  return nameA.localeCompare(nameB);
                })
                .map((walletId, i) => {
                  const wallet = walletConfigs[walletId];
                  const { name, icon } = wallet;
                  const shortName = (wallet as any).shortName;
                  return (
                    <WalletItem
                      key={i}
                      onClick={() => connectWallet(wallet, walletId)}
                      style={{
                        animationDelay: `${i * 50}ms`,
                      }}
                    >
                      <WalletIcon $outline={true}>{icon}</WalletIcon>
                      <WalletLabel>{shortName ?? name}</WalletLabel>
                    </WalletItem>
                  );
                })}
            </WalletList>
          </ScrollArea>
        </ModalContent>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            paddingTop: 8,
          }}
        >
          <LearnMoreButton onClick={() => context.setRoute(routes.ONBOARDING)}>
            <WalletAssetIcon /> {locales.connectorsScreen_newcomer}
          </LearnMoreButton>
        </div>
      </Container>
    </PageContent>
  );
};

export default MobileConnectors;
