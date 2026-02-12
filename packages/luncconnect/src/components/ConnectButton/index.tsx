import React from 'react';
import { useAccount } from 'cosmos-connect-react';
import { truncateTerraAddress } from './../../utils';
import useIsMounted from '../../hooks/useIsMounted';

import {
  IconContainer,
  TextContainer,
  UnsupportedNetworkContainer,
} from './styles';
import { useContext } from '../ConnectKit';
import { routes } from '../../constants/routes';
import { useModal } from '../../hooks/useModal';

import Avatar from '../Common/Avatar';
import { AnimatePresence, Variants, motion } from 'framer-motion';
import { CustomTheme, Mode, Theme } from '../../types';
import { Balance } from '../BalanceButton';
import ThemedButton, { ThemeContainer } from '../Common/ThemedButton';
import { ResetContainer } from '../../styles';
import useLocales from '../../hooks/useLocales';

const contentVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    x: '-100%',
  },
  animate: {
    opacity: 1,
    x: 0.1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    opacity: 0,
    x: '-100%',
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const addressVariants: Variants = {
  initial: {
    zIndex: 2,
    opacity: 0,
    x: '100%',
  },
  animate: {
    x: 0.2,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    zIndex: 1,
    x: '100%',
    opacity: 0,
    pointerEvents: 'none',
    position: 'absolute',
    transition: {
      duration: 0.4,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const textVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
  exit: {
    position: 'absolute',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

type ConnectKitButtonProps = {
  // Options
  label?: string;
  showBalance?: boolean;
  showAvatar?: boolean;

  // Theming
  theme?: Theme;
  mode?: Mode;
  customTheme?: CustomTheme;

  // Events
  onClick?: (open: () => void) => void;
};

type ConnectButtonRendererProps = {
  children?: (renderProps: {
    show?: () => void;
    hide?: () => void;
    chain?: any;
    unsupported: boolean;
    isConnected: boolean;
    isConnecting: boolean;
    address?: string;
    truncatedAddress?: string;
    ensName?: string;
  }) => React.ReactNode;
};

const ConnectButtonRenderer: React.FC<ConnectButtonRendererProps> = ({
  children,
}) => {
  const isMounted = useIsMounted();
  const context = useContext();
  const { open, setOpen } = useModal();

  const { address, isConnected } = useAccount();
  const isChainSupported = true; // For now

  function hide() {
    setOpen(false);
  }

  function show() {
    setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  if (!children) return null;
  if (!isMounted) return null;

  return (
    <>
      {children({
        show,
        hide,
        chain: undefined,
        unsupported: !isChainSupported,
        isConnected: !!address,
        isConnecting: open,
        address: address,
        truncatedAddress: address ? truncateTerraAddress(address) : undefined,
        ensName: undefined,
      })}
    </>
  );
};

ConnectButtonRenderer.displayName = 'ConnectKitButton.Custom';

function ConnectKitButtonInner({
  label,
  showAvatar,
  separator,
}: {
  label?: string;
  showAvatar?: boolean;
  separator?: string;
}) {
  const locales = useLocales({});
  const context = useContext();

  const { address } = useAccount();
  const isChainSupported = true;
  const defaultLabel = locales.connectWallet;

  return (
    <AnimatePresence initial={false}>
      {address ? (
        <TextContainer
          key="connectedText"
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={addressVariants}
          style={{
            height: 40,
          }}
        >
          {showAvatar && (
            <IconContainer>
              {/* Removed UnsupportedNetworkContainer and AuthIcon for now */}
              <Avatar size={24} address={address} />
            </IconContainer>
          )}

          <div
            style={{
              position: 'relative',
              paddingRight: showAvatar ? 1 : 0,
            }}
          >
            <TextContainer
              key="ckTruncatedAddress"
              initial={'initial'}
              animate={'animate'}
              exit={'exit'}
              variants={textVariants}
              style={{
                position: 'relative',
              }}
            >
              {truncateTerraAddress(address, separator)}{' '}
            </TextContainer>
          </div>
        </TextContainer>
      ) : (
        <TextContainer
          key="connectWalletText"
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={contentVariants}
          style={{
            height: 40,
          }}
        >
          {label ? label : defaultLabel}
        </TextContainer>
      )}
    </AnimatePresence>
  );
}

// ... (ConnectKitButton remains largely same but updated with Cosmos hooks)
export function ConnectKitButton({
  label,
  showBalance = false,
  showAvatar = true,
  theme,
  mode,
  customTheme,
  onClick,
}: ConnectKitButtonProps) {
  const isMounted = useIsMounted();
  const context = useContext();
  const { isConnected, address } = useAccount();

  function show() {
    context.setOpen(true);
    context.setRoute(isConnected ? routes.PROFILE : routes.CONNECTORS);
  }

  const separator = ['web95', 'rounded', 'minimal'].includes(
    theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;

  if (!isMounted) return null;

  const shouldShowBalance = showBalance;
  const willShowBalance = address && shouldShowBalance;

  return (
    <ResetContainer
      $useTheme={theme ?? context.theme}
      $useMode={mode ?? context.mode}
      $customTheme={customTheme ?? context.customTheme}
    >
      <ThemeContainer
        onClick={() => {
          if (onClick) {
            onClick(show);
          } else {
            show();
          }
        }}
      >
        {shouldShowBalance && (
          <AnimatePresence initial={false}>
            {willShowBalance && (
              <motion.div
                key={'balance'}
                initial={{
                  opacity: 0,
                  x: '100%',
                  width: 0,
                  marginRight: 0,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                  width: 'auto',
                  marginRight: -24,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  x: '100%',
                  width: 0,
                  marginRight: 0,
                  transition: {
                    duration: 0.4,
                    ease: [0.25, 1, 0.5, 1],
                  },
                }}
              >
                <ThemedButton
                  variant={'secondary'}
                  theme={theme ?? context.theme}
                  mode={mode ?? context.mode}
                  customTheme={customTheme ?? context.customTheme}
                  style={{ overflow: 'hidden' }}
                >
                  <motion.div style={{ paddingRight: 24 }}>
                    <Balance hideSymbol />
                  </motion.div>
                </ThemedButton>
              </motion.div>
            )}
          </AnimatePresence>
        )}
        <ThemedButton
          theme={theme ?? context.theme}
          mode={mode ?? context.mode}
          customTheme={customTheme ?? context.customTheme}
          style={
            shouldShowBalance &&
            showBalance &&
            address &&
            (theme === 'retro' || context.theme === 'retro')
              ? {
                  boxShadow:
                    'var(--ck-connectbutton-balance-connectbutton-box-shadow)',
                  borderRadius:
                    'var(--ck-connectbutton-balance-connectbutton-border-radius)',
                  overflow: 'hidden',
                }
              : {
                  overflow: 'hidden',
                }
          }
        >
          <ConnectKitButtonInner
            separator={separator}
            showAvatar={showAvatar}
            label={label}
          />
        </ThemedButton>
      </ThemeContainer>
    </ResetContainer>
  );
}

ConnectKitButton.Custom = ConnectButtonRenderer;
