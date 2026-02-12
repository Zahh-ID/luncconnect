import React from 'react';
import { useCosmos } from '../../CosmosProvider.js';

interface ConnectorsProps {
  onSelect: (wallet: any) => void;
}

const Connectors: React.FC<ConnectorsProps> = ({ onSelect }) => {
  const { client } = useCosmos();
  const wallets = client.getWallets();

  return (
    <div className="cc-page-connectors">
      <div className="cc-wallet-list">
        {wallets.map((wallet) => (
          <button 
            key={wallet.id} 
            className="cc-wallet-item"
            onClick={() => onSelect(wallet)}
          >
            <span>{wallet.name}</span>
            {wallet.icon && <img src={wallet.icon} alt={wallet.name} className="cc-wallet-icon" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Connectors;
