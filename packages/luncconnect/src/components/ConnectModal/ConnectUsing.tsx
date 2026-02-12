import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { useContext } from '../ConnectKit';
import { useWallet } from '../../wallets/useWallets';

import ConnectWithInjector from './ConnectWithInjector';
import ConnectWithQRCode from './ConnectWithQRCode';

import { contentVariants } from '../Common/Modal';
import Alert from '../Common/Alert';

const states = {
  QRCODE: 'qrcode',
  INJECTOR: 'injector',
};

const ConnectUsing = () => {
  const context = useContext();
  const wallet = useWallet(context.connector.id);

  // In Cosmos, we don't really have a generic QR code flow for all injected wallets yet
  // but we can keep the structure for future use if needed (e.g. WalletConnect)
  const isQrCode = !wallet?.isInstalled && wallet?.getWalletConnectDeeplink;

  const [status, setStatus] = useState(
    isQrCode ? states.QRCODE : states.INJECTOR
  );

  useEffect(() => {
    // if no provider, change to qrcode if available, or just keep injector (which shows install CTA)
    if (!wallet?.isInstalled && wallet?.getWalletConnectDeeplink) {
      setStatus(states.QRCODE);
      setTimeout(context.triggerResize, 10);
    }
  }, [wallet]);

  if (!wallet) return <Alert>Connector not found {context.connector.id}</Alert>;

  return (
    <AnimatePresence>
      {status === states.QRCODE && (
        <motion.div
          key={states.QRCODE}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={contentVariants}
        >
          <ConnectWithQRCode
            switchConnectMethod={(id?: string) => {
              //if (id) setId(id);
              setStatus(states.INJECTOR);
              setTimeout(context.triggerResize, 10); // delay required here for modal to resize
            }}
          />
        </motion.div>
      )}
      {status === states.INJECTOR && (
        <motion.div
          key={states.INJECTOR}
          initial={'initial'}
          animate={'animate'}
          exit={'exit'}
          variants={contentVariants}
        >
          <ConnectWithInjector
            switchConnectMethod={(id?: string) => {
              //if (id) setId(id);
              if (wallet?.getWalletConnectDeeplink) {
                setStatus(states.QRCODE);
                setTimeout(context.triggerResize, 10); // delay required here for modal to resize
              }
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConnectUsing;
