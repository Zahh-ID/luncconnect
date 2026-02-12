import React, { useEffect, useState } from 'react';
import { useContext } from '../../ConnectKit';
import { nFormatter, truncateTerraAddress } from '../../../utils';

import {
  useDisconnect,
  useAccount,
  useBalance,
} from 'cosmos-connect-react';

import {
  AvatarContainer,
  AvatarInner,
  ChainSelectorContainer,
  BalanceContainer,
  LoadingBalance,
  Balance,
} from './styles';

import {
  PageContent,
  ModalBody,
  ModalContent,
  ModalH1,
} from '../../Common/Modal/styles';
import Button from '../../Common/Button';
import Avatar from '../../Common/Avatar';
import ChainSelector from '../../Common/ChainSelect';

import { DisconnectIcon } from '../../../assets/icons';
import CopyToClipboard from '../../Common/CopyToClipboard';
import { AnimatePresence } from 'framer-motion';
import { useThemeContext } from '../../ConnectKitThemeProvider/ConnectKitThemeProvider';
import useLocales from '../../../hooks/useLocales';

const Profile: React.FC<{ closeModal?: () => void }> = ({ closeModal }) => {
  const context = useContext();
  const themeContext = useThemeContext();

  const locales = useLocales();

  const { disconnect } = useDisconnect();

  const { address, isConnected } = useAccount();
  const { balance, isLoading } = useBalance();

  const [shouldDisconnect, setShouldDisconnect] = useState(false);

  useEffect(() => {
    if (!isConnected) context.setOpen(false);
  }, [isConnected]);

  useEffect(() => {
    if (!shouldDisconnect) return;

    // Close before disconnecting to avoid layout shifting while modal is still open
    if (closeModal) {
      closeModal();
    } else {
      context.setOpen(false);
    }
    disconnect();
  }, [shouldDisconnect, disconnect]);

  const separator = ['web95', 'rounded', 'minimal'].includes(
    themeContext.theme ?? context.theme ?? ''
  )
    ? '....'
    : undefined;

  const formattedBalance = balance
    ? nFormatter(Number(balance.amount) / 1000000)
    : '0';
  const symbol = balance?.denom === 'uluna' ? 'LUNC' : balance?.denom;

  return (
    <PageContent>
      <ModalContent style={{ paddingBottom: 22, gap: 6 }}>
        <AvatarContainer>
          <AvatarInner>
            <ChainSelectorContainer>
              <ChainSelector />
            </ChainSelectorContainer>
            <Avatar address={address} />
          </AvatarInner>
        </AvatarContainer>
        <ModalH1>
          <CopyToClipboard string={address}>
            {truncateTerraAddress(address, separator)}
          </CopyToClipboard>
        </ModalH1>
        {context?.options?.hideBalance ? null : (
          <ModalBody>
            <BalanceContainer>
              <AnimatePresence initial={false}>
                {!isLoading && balance && (
                  <Balance
                    key={`balance`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formattedBalance}
                    {` `}
                    {symbol}
                  </Balance>
                )}
                {isLoading && (
                  <LoadingBalance
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    &nbsp;
                  </LoadingBalance>
                )}
              </AnimatePresence>
            </BalanceContainer>
          </ModalBody>
        )}
      </ModalContent>

      <Button
        onClick={() => setShouldDisconnect(true)}
        icon={<DisconnectIcon />}
      >
        {locales.disconnect}
      </Button>
    </PageContent>
  );
};

export default Profile;
