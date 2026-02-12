import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCosmos } from '../CosmosProvider.js';
import { useConnect, useAccount } from '../hooks.js';

import Connectors from './Pages/Connectors.js';
import About from './Pages/About.js';
import Profile from './Pages/Profile.js';
import Connecting from './Pages/Connecting.js';

interface ConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export type ModalRoute = 'connectors' | 'about' | 'profile' | 'connecting';

export const ConnectModal: React.FC<ConnectModalProps> = ({ isOpen, onClose }) => {
  const { client } = useCosmos();
  const { connect } = useConnect();
  const { isConnected, status } = useAccount();

  const [route, setRoute] = useState<ModalRoute>('connectors');
  const [pendingWallet, setPendingWallet] = useState<any>(null);

  // Sync route with connection status
  useEffect(() => {
    if (isConnected) {
      setRoute('profile');
    } else if (status === 'connecting') {
      setRoute('connecting');
    } else if (!isOpen) {
      setRoute('connectors');
    }
  }, [isConnected, status, isOpen]);

  if (!isOpen) return null;

  const handleWalletSelect = async (wallet: any) => {
    try {
      setPendingWallet(wallet);
      setRoute('connecting');
      const chainId = client.getChains()[0]?.chainId || 'columbus-5';
      await connect(wallet.id, chainId);
    } catch (error) {
      console.error('Failed to connect:', error);
      setRoute('connectors');
    }
  };

  const showBackButton = route !== 'connectors' && route !== 'profile';
  const showInfoButton = route === 'connectors';

  const variants = {
    initial: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    animate: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  };

  // Direction logic for transitions (simple for now)
  const getDirection = (newRoute: ModalRoute) => {
    if (newRoute === 'about' || newRoute === 'connecting') return 1;
    return -1;
  };

  const renderPage = () => {
    switch (route) {
      case 'connectors':
        return <Connectors onSelect={handleWalletSelect} />;
      case 'about':
        return <About />;
      case 'profile':
        return <Profile />;
      case 'connecting':
        return <Connecting wallet={pendingWallet} onCancel={() => setRoute('connectors')} />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (route) {
      case 'profile': return 'Account';
      case 'about': return 'About Wallets';
      case 'connecting': return 'Requesting Connection';
      default: return 'Connect Wallet';
    }
  };

  return (
    <div className="cc-modal-overlay" onClick={onClose}>
      <motion.div 
        className="cc-modal-content" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
      >
        <div className="cc-modal-header">
          {showBackButton ? (
            <button className="cc-back-btn" onClick={() => setRoute('connectors')}>←</button>
          ) : showInfoButton ? (
            <button className="cc-help-btn" onClick={() => setRoute('about')} title="About Wallets">?</button>
          ) : <div style={{ width: 28 }} />}
          
          <span className="cc-modal-title">{getTitle()}</span>
          
          <button className="cc-close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cc-modal-body">
          <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
              key={route}
              custom={getDirection(route)}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
