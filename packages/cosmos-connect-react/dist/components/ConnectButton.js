import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useAccount } from '../hooks.js';
import { ConnectModal } from './ConnectModal.js';
import { Avatar } from './Avatar.js';
export const ConnectButton = () => {
    const { isConnected, address, status } = useAccount();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formatAddress = (addr) => {
        return `${addr.slice(0, 8)}...${addr.slice(-4)}`;
    };
    if (isConnected && address) {
        return (_jsxs(_Fragment, { children: [_jsxs("button", { className: "cc-pill", onClick: () => setIsModalOpen(true), children: [_jsx(Avatar, { address: address, size: 24 }), _jsx("span", { className: "cc-pill-text", children: formatAddress(address) })] }), _jsx(ConnectModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsx("button", { className: "cc-btn", onClick: () => setIsModalOpen(true), disabled: status === 'connecting', children: status === 'connecting' ? 'Connecting...' : 'Connect Wallet' }), _jsx(ConnectModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false) })] }));
};
