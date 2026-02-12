import { useState } from 'react';
import { useAccount, useClient } from 'cosmos-connect-react';
import { chainConfigs } from '../../../constants/chainConfigs';

import {
  SwitchNetworksContainer,
  ChainButton,
  ChainButtonContainer,
  ChainButtonBg,
  ChainButtonStatus,
  ChainButtons,
  ChainIcon,
  ChainLogoContainer,
  ChainLogoSpinner,
} from './styles';

import { AnimatePresence, motion } from 'framer-motion';
import { isMobile } from '../../../utils';

import ChainIcons from '../../../assets/chains';
import useLocales from '../../../hooks/useLocales';
import { useContext } from '../../ConnectKit';

const Spinner = (
  <svg
    aria-hidden="true"
    width="36"
    height="36"
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M2 16.75C2.69036 16.75 3.25 17.3096 3.25 18V19C3.25 26.5939 9.40609 32.75 17 32.75V35.25C8.02537 35.25 0.75 27.9746 0.75 19V18C0.75 17.3096 1.30964 16.75 2 16.75Z"
      fill="url(#paint0_linear_1288_18701)"
    />
    <defs>
      <linearGradient
        id="paint0_linear_1288_18701"
        x1="2"
        y1="19.4884"
        x2="16.8752"
        y2="33.7485"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="var(--ck-spinner-color)" />
        <stop offset="1" stopColor="var(--ck-spinner-color)" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

const ChainSelectList = ({
  variant,
}: {
  variant?: 'primary' | 'secondary';
}) => {
  const { address } = useAccount();
  const client = useClient();
  const chain = client.state.currentChain;
  const chains = client.getChains();

  const [pendingChainId, setPendingChainId] = useState<string | undefined>(
    undefined
  );

  const locales = useLocales({});
  const mobile = isMobile();

  const isPending = false; // Chain switching not implemented in the same way
  const disabled = true; // For now

  const handleSwitchNetwork = (chainId: string) => {
    // Chain switching not implemented for Cosmos Connect currently
  };

  return (
    <SwitchNetworksContainer style={{ marginBottom: 0 }}>
      <ChainButtonContainer>
        <ChainButtons>
          {chains.map((x) => {
            const ch = chainConfigs.find((ch) => ch.id === x.chainId) || {
              id: x.chainId,
              name: x.chainId,
              logo: <ChainIcons.UnknownChain />,
            };

            return (
              <ChainButton
                key={`${ch?.id}-${ch?.name}`}
                $variant={variant}
                disabled={disabled || ch.id === chain?.chainId}
                onClick={() => handleSwitchNetwork?.(ch.id as string)}
                style={{
                  opacity:
                    disabled && ch.id !== chain?.chainId ? 0.4 : undefined,
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    gap: 12,
                    color:
                      ch.id === chain?.chainId
                        ? 'var(--ck-dropdown-active-color, inherit)'
                        : 'inherit',
                  }}
                >
                  <ChainLogoContainer>
                    <ChainIcon>{ch.logo}</ChainIcon>
                  </ChainLogoContainer>
                  {ch.name}
                </span>
                {variant !== 'secondary' && (
                  <ChainButtonStatus>
                    <AnimatePresence initial={false}>
                      {ch.id === chain?.chainId && (
                        <motion.span
                          key={'connectedText'}
                          style={{
                            color:
                              'var(--ck-dropdown-active-color, var(--ck-focus-color))',
                            display: 'block',
                            position: 'relative',
                          }}
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{
                            opacity: 0,
                            x: 4,
                            transition: { duration: 0.1, delay: 0 },
                          }}
                          transition={{
                            ease: [0.76, 0, 0.24, 1],
                            duration: 0.3,
                            delay: 0.2,
                          }}
                        >
                          {locales.connected}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </ChainButtonStatus>
                )}
                {variant === 'secondary' ? (
                  <ChainButtonBg
                    initial={false}
                    animate={{
                      opacity: ch.id === chain?.chainId ? 1 : 0,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: 'easeOut',
                    }}
                  />
                ) : (
                  ch.id === chain?.chainId && (
                    <ChainButtonBg
                      layoutId="activeChain"
                      layout="position"
                      transition={{
                        duration: 0.3,
                        ease: 'easeOut',
                      }}
                    />
                  )
                )}
              </ChainButton>
            );
          })}
        </ChainButtons>
      </ChainButtonContainer>
    </SwitchNetworksContainer>
  );
};

export default ChainSelectList;
