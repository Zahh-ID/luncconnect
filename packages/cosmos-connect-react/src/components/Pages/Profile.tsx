import React, { useState } from 'react';
import { useCosmos } from '../../CosmosProvider.js';
import { useAccount, useDisconnect, useBalance } from '../../hooks.js';
import { Avatar } from '../Avatar.js';

const Profile: React.FC = () => {
  const { client } = useCosmos();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { balance, isLoading: isBalanceLoading } = useBalance();
  const [copyFeedback, setCopyFeedback] = useState(false);

  const formatBalance = (bal: { amount: string; denom: string } | null) => {
    if (!bal) return '0.00 LUNC';
    const amount = parseFloat(bal.amount) / 1000000;
    return `${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LUNC`;
  };

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    }
  };

  if (!address) return null;

  return (
    <div className="cc-page-profile">
      <div className="cc-profile-view">
        <div className="cc-profile-avatar">
          <Avatar address={address} size={84} />
        </div>
        
        <div className="cc-profile-info">
          <h3 className="cc-profile-address">
            {address.slice(0, 12)}...{address.slice(-6)}
          </h3>
          <div className="cc-profile-balance">
            {isBalanceLoading ? 'Loading...' : formatBalance(balance)}
          </div>
        </div>

        <div className="cc-profile-actions">
          <button className="cc-util-btn" onClick={handleCopy}>
            {copyFeedback ? 'Copied!' : 'Copy Address'}
          </button>
          <button 
            className="cc-util-btn" 
            onClick={() => disconnect()}
            style={{ color: '#ef4444' }}
          >
            Disconnect
          </button>
        </div>
        
        <div className="cc-profile-footer">
          Connected to {client.getChains()[0]?.chainId}
        </div>
      </div>
    </div>
  );
};

export default Profile;
