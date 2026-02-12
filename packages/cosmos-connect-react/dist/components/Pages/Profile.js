import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useCosmos } from '../../CosmosProvider.js';
import { useAccount, useDisconnect, useBalance } from '../../hooks.js';
import { Avatar } from '../Avatar.js';
const Profile = () => {
    const { client } = useCosmos();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { balance, isLoading: isBalanceLoading } = useBalance();
    const [copyFeedback, setCopyFeedback] = useState(false);
    const formatBalance = (bal) => {
        if (!bal)
            return '0.00 LUNC';
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
    if (!address)
        return null;
    return (_jsx("div", { className: "cc-page-profile", children: _jsxs("div", { className: "cc-profile-view", children: [_jsx("div", { className: "cc-profile-avatar", children: _jsx(Avatar, { address: address, size: 84 }) }), _jsxs("div", { className: "cc-profile-info", children: [_jsxs("h3", { className: "cc-profile-address", children: [address.slice(0, 12), "...", address.slice(-6)] }), _jsx("div", { className: "cc-profile-balance", children: isBalanceLoading ? 'Loading...' : formatBalance(balance) })] }), _jsxs("div", { className: "cc-profile-actions", children: [_jsx("button", { className: "cc-util-btn", onClick: handleCopy, children: copyFeedback ? 'Copied!' : 'Copy Address' }), _jsx("button", { className: "cc-util-btn", onClick: () => disconnect(), style: { color: '#ef4444' }, children: "Disconnect" })] }), _jsxs("div", { className: "cc-profile-footer", children: ["Connected to ", client.getChains()[0]?.chainId] })] }) }));
};
export default Profile;
