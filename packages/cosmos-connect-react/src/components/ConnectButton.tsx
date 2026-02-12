import React, { useState } from 'react';
import { useAccount } from '../hooks.js';
import { ConnectModal } from './ConnectModal.js';
import { Avatar } from './Avatar.js';

export const ConnectButton: React.FC = () => {
  const { isConnected, address, status } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
  };

  if (isConnected && address) {
    return (
      <>
        <button className="cc-pill" onClick={() => setIsModalOpen(true)}>
          <Avatar address={address} size={24} />
          <span className="cc-pill-text">{formatAddress(address)}</span>
        </button>
        <ConnectModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      </>
    );
  }

  return (
    <>
      <button 
        className="cc-btn" 
        onClick={() => setIsModalOpen(true)}
        disabled={status === 'connecting'}
      >
        {status === 'connecting' ? 'Connecting...' : 'Connect Wallet'}
      </button>
      <ConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
};
