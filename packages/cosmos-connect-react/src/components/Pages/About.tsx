import React from 'react';

const About: React.FC = () => {
  return (
    <div className="cc-page-about">
      <div className="cc-about-steps">
        <div className="cc-about-step">
          <div className="cc-step-num">1</div>
          <div className="cc-step-content">
            <h4>Get a Wallet</h4>
            <p>A wallet lets you connect to Terra Classic and manage your LUNC assets safely.</p>
          </div>
        </div>
        <div className="cc-about-step">
          <div className="cc-step-num">2</div>
          <div className="cc-step-content">
            <h4>Add some LUNC</h4>
            <p>You'll need some LUNC in your wallet to pay for gas fees on the Terra network.</p>
          </div>
        </div>
        <div className="cc-about-step">
          <div className="cc-step-num">3</div>
          <div className="cc-step-content">
            <h4>Connect & Stake</h4>
            <p>Connect your wallet to this app to start staking, voting, or trading.</p>
          </div>
        </div>
      </div>
      
      <button className="cc-primary-btn" onClick={() => window.open('https://www.galaxy-station.app/', '_blank')}>
        Get Galaxy Station
      </button>
    </div>
  );
};

export default About;
