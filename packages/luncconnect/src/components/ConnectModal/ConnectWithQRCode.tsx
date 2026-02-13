import React, { useEffect } from 'react';
import { useContext } from '../ConnectKit';
import { routes } from '../../constants/routes';

import { detectBrowser, isWalletConnectConnector, isMobile } from '../../utils';

import { PageContent, ModalContent } from '../Common/Modal/styles';
import { OrDivider } from '../Common/Modal';

import CustomQRCode from '../Common/CustomQRCode';
import ScanIconWithLogos from '../../assets/ScanIconWithLogos';
import Button from '../Common/Button';
import useLocales from '../../hooks/useLocales';

import { useWallet } from '../../wallets/useWallets';
import { useWeb3 } from '../contexts/web3';

const ConnectWithQRCode: React.FC<{
  switchConnectMethod: (id?: string) => void;
}> = ({ switchConnectMethod }) => {
  const context = useContext();

  const id = context.connector.id;
  const wallet = useWallet(id);

  const {
    connect: { getUri, connect },
  } = useWeb3();

  const wcUri = getUri(id);
  const deeplink = wcUri
    ? wallet?.getWalletConnectDeeplink?.(wcUri) ?? wcUri
    : undefined;

  // For Station-based wallets (including LUNCDash), the QR code should contain the scheme-wrapped URI.
  // This ensures the mobile app identifies the intent correctly even when scanned.
  const uri = wallet?.isStation || wallet?.isLuncDash ? deeplink : wcUri;

  const locales = useLocales({
    CONNECTORNAME: wallet?.name,
  });

  useEffect(() => {
    if (isMobile() && deeplink) {
      window.location.href = deeplink;
    }
  }, [deeplink]);

  const [error, setError] = React.useState<null | 'timeout'>(null);

  const triggerConnect = React.useCallback(async () => {
    try {
      setError(null);
      // Trigger the specific wallet's connection logic.
      // Since it's not installed (otherwise we wouldn't be on this page),
      // the adapter will fallback to its internal WalletConnect instance.
      await connect(id);
    } catch (e: any) {
      console.error(`Failed to initiate connection for ${id}:`, e);
      if (
        e?.message?.includes('timeout') ||
        e?.message?.includes('expired') ||
        e?.message?.includes('pairing')
      ) {
        setError('timeout');
      }
    }
  }, [id, connect]);

  useEffect(() => {
    if (!wcUri) {
      triggerConnect();
    }
  }, [id, wcUri, triggerConnect]);

  if (!wallet) return <>Wallet not found {id}</>;

  const downloads = (wallet as any)?.downloadUrls;
  const hasApps = downloads && Object.keys(downloads).length !== 0;

  if (error === 'timeout') {
    return (
      <PageContent>
        <ModalContent
          style={{
            paddingBottom: 8,
            gap: 14,
            minHeight: 300,
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>
              {locales.scanScreen_timeout_h1}
            </h1>
            <p style={{ opacity: 0.6, fontSize: 14, lineHeight: '1.4' }}>
              {locales.scanScreen_timeout_p}
            </p>
          </div>
          <Button onClick={triggerConnect}>
            {locales.scanScreen_refresh_button}
          </Button>
        </ModalContent>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 8, gap: 14 }}>
        <CustomQRCode
          value={uri}
          image={wallet?.icon as any}
          tooltipMessage={
            isWalletConnectConnector(id) ? (
              <>
                <ScanIconWithLogos />
                <span>{locales.scanScreen_tooltip_walletConnect}</span>
              </>
            ) : (
              <>
                <ScanIconWithLogos logo={wallet?.icon as any} />
                <span>{locales.scanScreen_tooltip_default}</span>
              </>
            )
          }
        />
        {hasApps && <OrDivider>{locales.dontHaveTheApp}</OrDivider>}
      </ModalContent>

      {hasApps && (
        <>
          <Button
            onClick={() => {
              const url = downloads?.website || downloads?.download;
              if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
              }
            }}
            download
          >
            {locales.getWalletName}
          </Button>
        </>
      )}
    </PageContent>
  );
};

export default ConnectWithQRCode;
