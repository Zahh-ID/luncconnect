import { useContext } from '../../ConnectKit';
import { routes } from '../../../constants/routes';

import {
  ConnectorsContainer,
  ConnectorButton,
  ConnectorLabel,
  ConnectorIcon,
  RecentlyUsedTag,
} from './styles';

import { useWeb3 } from '../../contexts/web3';

import useIsMobile from '../../../hooks/useIsMobile';
import { ScrollArea } from '../../Common/ScrollArea';
import Alert from '../Alert';

import { WalletProps, useWallets } from '../../../wallets/useWallets';
import {
  detectBrowser,
  isCoinbaseWalletConnector,
  isPortoConnector,
  isWalletConnectConnector,
} from '../../../utils';
import { useLastConnector } from '../../../hooks/useLastConnector';
import { useConnect } from '../../../hooks/useConnect';
import {
  useFamilyAccountsConnector,
  useFamilyConnector,
} from '../../../hooks/useConnectors';
import { isFamily } from '../../../utils/wallets';

const ConnectorList = () => {
  const isMobile = useIsMobile();

  const wallets = useWallets();
  const { lastConnectorId } = useLastConnector();

  const mainWallets = ['keplr', 'leap', 'cosmostation', 'walletConnect'];
  const walletsToDisplay = wallets.filter((w) => mainWallets.includes(w.id));

  return (
    <ScrollArea mobileDirection={'horizontal'}>
      {walletsToDisplay.length === 0 && (
        <Alert error>No connectors found in ConnectKit config.</Alert>
      )}
      {walletsToDisplay.length > 0 && (
        <ConnectorsContainer
          $mobile={isMobile}
          $totalResults={walletsToDisplay.length}
        >
          {walletsToDisplay.map((wallet) => (
            <ConnectorItem
              key={wallet.id}
              wallet={wallet}
              isRecent={wallet.id === lastConnectorId}
            />
          ))}
        </ConnectorsContainer>
      )}
    </ScrollArea>
  );
};

export default ConnectorList;

const ConnectorItem = ({
  wallet,
  isRecent,
}: {
  wallet: WalletProps;
  isRecent?: boolean;
}) => {
  const isMobile = useIsMobile();
  const context = useContext();

  return (
    <ConnectorButton
      type="button"
      disabled={context.route !== routes.CONNECTORS}
      onClick={() => {
        if (
          wallet.id === 'walletConnect' ||
          wallet.id === 'walletConnectV2' ||
          wallet.id === 'wallet-connect'
        ) {
          context.setRoute(routes.MOBILECONNECTORS);
        } else {
          context.setRoute(routes.CONNECT);
          context.setConnector({ id: wallet.id });
        }
      }}
    >
      <ConnectorIcon
        data-small={wallet.iconShouldShrink}
        data-shape={wallet.iconShape}
      >
        {wallet.icon}
      </ConnectorIcon>
      <ConnectorLabel>
        {isMobile ? (wallet.shortName ?? wallet.name) : wallet.name}
        {!context.options?.hideRecentBadge && isRecent && (
          <RecentlyUsedTag>
            <span>Recent</span>
          </RecentlyUsedTag>
        )}
      </ConnectorLabel>
    </ConnectorButton>
  );
};
