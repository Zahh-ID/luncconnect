import React from 'react';

interface ConnectingProps {
  wallet: any;
  onCancel: () => void;
}

const Connecting: React.FC<ConnectingProps> = ({ wallet, onCancel }) => {
  return (
    <div className="cc-page-connecting">
      <div className="cc-connecting-view">
        <div className="cc-spinner-container">
          <div className="cc-spinner"></div>
          {wallet?.icon && (
            <img src={wallet.icon} alt="" className="cc-spinner-icon" />
          )}
        </div>
        <h3 className="cc-connecting-title">Requesting Connection</h3>
        <p className="cc-connecting-text">
          Open the {wallet?.name || 'Wallet'} extension to continue.
        </p>
        <button className="cc-footer-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Connecting;
