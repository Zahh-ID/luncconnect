import React, { useEffect, useState } from 'react';
import { AnimatePresence, Variants } from 'framer-motion';
import {
  Container,
  ConnectingContainer,
  ConnectingAnimation,
  RetryButton,
  RetryIconContainer,
  Content,
} from './styles';

import {
  PageContent,
  ModalHeading,
  ModalBody,
  ModalH1,
  ModalContentContainer,
  ModalContent,
} from '../../Common/Modal/styles';
import { OrDivider } from '../../Common/Modal';
import Button from '../../Common/Button';
import Tooltip from '../../Common/Tooltip';
import Alert from '../../Common/Alert';

import SquircleSpinner from './SquircleSpinner';

import { RetryIconCircle } from '../../../assets/icons';
import BrowserIcon from '../../Common/BrowserIcon';
import { AlertIcon, TickIcon } from '../../../assets/icons';
import { detectBrowser, isWalletConnectConnector } from '../../../utils';
import useLocales from '../../../hooks/useLocales';
import { useConnect } from '../../../hooks/useConnect';
import { useContext } from '../../ConnectKit';
import { useWallet } from '../../../wallets/useWallets';
import CircleSpinner from './CircleSpinner';

export const states = {
  CONNECTED: 'connected',
  CONNECTING: 'connecting',
  EXPIRING: 'expiring',
  FAILED: 'failed',
  REJECTED: 'rejected',
  NOTCONNECTED: 'notconnected',
  UNAVAILABLE: 'unavailable',
};

const contentVariants: Variants = {
  initial: {
    willChange: 'transform,opacity',
    position: 'relative',
    opacity: 0,
    scale: 0.95,
  },
  animate: {
    position: 'relative',
    opacity: 1,
    scale: 1,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.4,
      delay: 0.05,
      position: { delay: 0 },
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    scale: 0.95,
    transition: {
      ease: [0.16, 1, 0.3, 1],
      duration: 0.3,
    },
  },
};

const ConnectWithInjector: React.FC<{
  switchConnectMethod: (id?: string) => void;
  forceState?: typeof states;
}> = ({ switchConnectMethod, forceState }) => {
  const { connect } = useConnect({
    mutation: {
      onMutate: () => {
        setStatus(states.CONNECTING);
      },
      onError(err?: any) {
        console.error(err);
        setStatus(states.FAILED);
      },
      onSettled(data?: any, error?: any) {
        if (error) {
          setShowTryAgainTooltip(true);
          setTimeout(() => setShowTryAgainTooltip(false), 3500);
          setStatus(states.FAILED);
        } else if (data) {
          setStatus(states.CONNECTED);
        }
        setTimeout(triggerResize, 100);
      },
    },
  });

  const { triggerResize, connector: c } = useContext();
  const id = c.id;
  const wallet = useWallet(id);

  const walletInfo = {
    name: wallet?.name,
    shortName: wallet?.shortName ?? wallet?.name,
    icon: wallet?.icon,
    iconShape: wallet?.iconShape ?? 'circle',
    iconShouldShrink: wallet?.iconShouldShrink,
  };

  const [showTryAgainTooltip, setShowTryAgainTooltip] = useState(false);

  const browser = detectBrowser();
  const extensionUrl = (wallet?.downloadUrls as any)?.[browser];

  const suggestedExtension = wallet?.downloadUrls
    ? {
        name: Object.keys(wallet?.downloadUrls)[0],
        label:
          Object.keys(wallet?.downloadUrls)[0]?.charAt(0).toUpperCase() +
          Object.keys(wallet?.downloadUrls)[0]?.slice(1),
        url: (wallet?.downloadUrls as any)[
          Object.keys(wallet?.downloadUrls)[0]
        ],
      }
    : undefined;

  const [status, setStatus] = useState(
    forceState
      ? forceState
      : !wallet?.isInstalled
        ? states.UNAVAILABLE
        : states.CONNECTING
  );

  const locales = useLocales({
    CONNECTORNAME: walletInfo.name,
    CONNECTORSHORTNAME: walletInfo.shortName ?? walletInfo.name,
    SUGGESTEDEXTENSIONBROWSER: suggestedExtension?.label ?? 'your browser',
  });

  const runConnect = async () => {
    if (wallet?.isInstalled && wallet?.connector) {
      connect({ connector: wallet?.connector });
    } else {
      setStatus(states.UNAVAILABLE);
    }
  };

  useEffect(() => {
    if (status === states.UNAVAILABLE) return;
    const connectTimeout = setTimeout(runConnect, 600);
    return () => {
      clearTimeout(connectTimeout);
    };
  }, []);

  if (!wallet) {
    return (
      <PageContent>
        <Container>
          <ModalHeading>Invalid State</ModalHeading>
          <ModalContent>
            <Alert>
              No connectors match the id given. This state should never happen.
            </Alert>
          </ModalContent>
        </Container>
      </PageContent>
    );
  }

  return (
    <PageContent>
      <Container>
        <ConnectingContainer>
          <ConnectingAnimation
            $shake={status === states.FAILED || status === states.REJECTED}
            $circle={walletInfo.iconShape === 'circle'}
          >
            <AnimatePresence>
              {(status === states.FAILED || status === states.REJECTED) && (
                <RetryButton
                  aria-label="Retry"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ duration: 0.1 }}
                  onClick={runConnect}
                >
                  <RetryIconContainer>
                    <Tooltip
                      open={
                        showTryAgainTooltip &&
                        (status === states.FAILED || status === states.REJECTED)
                      }
                      message={locales.tryAgainQuestion}
                      xOffset={-6}
                    >
                      <RetryIconCircle />
                    </Tooltip>
                  </RetryIconContainer>
                </RetryButton>
              )}
            </AnimatePresence>
            {walletInfo.iconShape === 'circle' ? (
              <CircleSpinner
                logo={
                  status === states.UNAVAILABLE ? (
                    <div
                      style={{
                        transform: 'scale(1.14)',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {walletInfo.icon}
                    </div>
                  ) : (
                    <>{walletInfo.icon}</>
                  )
                }
                smallLogo={walletInfo.iconShouldShrink}
                connecting={status === states.CONNECTING}
                unavailable={status === states.UNAVAILABLE}
              />
            ) : (
              <SquircleSpinner
                logo={
                  status === states.UNAVAILABLE ? (
                    <div
                      style={{
                        transform: 'scale(1.14)',
                        position: 'relative',
                        width: '100%',
                      }}
                    >
                      {walletInfo.icon}
                    </div>
                  ) : (
                    <>{walletInfo.icon}</>
                  )
                }
                connecting={status === states.CONNECTING}
              />
            )}
          </ConnectingAnimation>
        </ConnectingContainer>
        <ModalContentContainer>
          <AnimatePresence initial={false}>
            {status === states.FAILED && (
              <Content
                key={states.FAILED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1 $error>
                    <AlertIcon />
                    {locales.injectionScreen_failed_h1}
                  </ModalH1>
                  <ModalBody>{locales.injectionScreen_failed_p}</ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.REJECTED && (
              <Content
                key={states.REJECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>{locales.injectionScreen_rejected_h1}</ModalH1>
                  <ModalBody>{locales.injectionScreen_rejected_p}</ModalBody>
                </ModalContent>
              </Content>
            )}
            {(status === states.CONNECTING || status === states.EXPIRING) && (
              <Content
                key={states.CONNECTING}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent
                  style={{
                    paddingBottom: 28,
                  }}
                >
                  <ModalH1>{locales.injectionScreen_connecting_h1}</ModalH1>
                  <ModalBody>{locales.injectionScreen_connecting_p}</ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.CONNECTED && (
              <Content
                key={states.CONNECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1 $valid>
                    <TickIcon /> {locales.injectionScreen_connected_h1}
                  </ModalH1>
                  <ModalBody>{locales.injectionScreen_connected_p}</ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.NOTCONNECTED && (
              <Content
                key={states.NOTCONNECTED}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                <ModalContent>
                  <ModalH1>{locales.injectionScreen_notconnected_h1}</ModalH1>
                  <ModalBody>
                    {locales.injectionScreen_notconnected_p}
                  </ModalBody>
                </ModalContent>
              </Content>
            )}
            {status === states.UNAVAILABLE && (
              <Content
                key={states.UNAVAILABLE}
                initial={'initial'}
                animate={'animate'}
                exit={'exit'}
                variants={contentVariants}
              >
                {!extensionUrl ? (
                  <>
                    <ModalContent style={{ paddingBottom: 12 }}>
                      <ModalH1>
                        {locales.injectionScreen_unavailable_h1}
                      </ModalH1>
                      <ModalBody>
                        {locales.injectionScreen_unavailable_p}
                      </ModalBody>
                    </ModalContent>

                    {!wallet.isInstalled && suggestedExtension && (
                      <Button
                        href={suggestedExtension?.url}
                        icon={
                          <BrowserIcon browser={suggestedExtension?.name} />
                        }
                      >
                        Install on {suggestedExtension?.label}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <ModalContent style={{ paddingBottom: 18 }}>
                      <ModalH1>{locales.injectionScreen_install_h1}</ModalH1>
                      <ModalBody>{locales.injectionScreen_install_p}</ModalBody>
                    </ModalContent>
                    {!wallet.isInstalled && extensionUrl && (
                      <Button href={extensionUrl} icon={<BrowserIcon />}>
                        {locales.installTheExtension}
                      </Button>
                    )}
                  </>
                )}
              </Content>
            )}
          </AnimatePresence>
        </ModalContentContainer>
      </Container>
    </PageContent>
  );
};

export default ConnectWithInjector;
