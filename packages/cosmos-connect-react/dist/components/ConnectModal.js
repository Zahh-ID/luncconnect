import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCosmos } from '../CosmosProvider.js';
import { useConnect, useAccount } from '../hooks.js';
import Connectors from './Pages/Connectors.js';
import About from './Pages/About.js';
import Profile from './Pages/Profile.js';
import Connecting from './Pages/Connecting.js';
export const ConnectModal = ({ isOpen, onClose }) => {
    const { client } = useCosmos();
    const { connect } = useConnect();
    const { isConnected, status } = useAccount();
    const [route, setRoute] = useState('connectors');
    const [pendingWallet, setPendingWallet] = useState(null);
    // Sync route with connection status
    useEffect(() => {
        if (isConnected) {
            setRoute('profile');
        }
        else if (status === 'connecting') {
            setRoute('connecting');
        }
        else if (!isOpen) {
            setRoute('connectors');
        }
    }, [isConnected, status, isOpen]);
    if (!isOpen)
        return null;
    const handleWalletSelect = async (wallet) => {
        try {
            setPendingWallet(wallet);
            setRoute('connecting');
            const chainId = client.getChains()[0]?.chainId || 'columbus-5';
            await connect(wallet.id, chainId);
        }
        catch (error) {
            console.error('Failed to connect:', error);
            setRoute('connectors');
        }
    };
    const showBackButton = route !== 'connectors' && route !== 'profile';
    const showInfoButton = route === 'connectors';
    const variants = {
        initial: (direction) => ({
            x: direction > 0 ? 50 : -50,
            opacity: 0,
        }),
        animate: {
            x: 0,
            opacity: 1,
        },
        exit: (direction) => ({
            x: direction < 0 ? 50 : -50,
            opacity: 0,
        }),
    };
    // Direction logic for transitions (simple for now)
    const getDirection = (newRoute) => {
        if (newRoute === 'about' || newRoute === 'connecting')
            return 1;
        return -1;
    };
    const renderPage = () => {
        switch (route) {
            case 'connectors':
                return _jsx(Connectors, { onSelect: handleWalletSelect });
            case 'about':
                return _jsx(About, {});
            case 'profile':
                return _jsx(Profile, {});
            case 'connecting':
                return _jsx(Connecting, { wallet: pendingWallet, onCancel: () => setRoute('connectors') });
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
    return (_jsx("div", { className: "cc-modal-overlay", onClick: onClose, children: _jsxs(motion.div, { className: "cc-modal-content", onClick: (e) => e.stopPropagation(), initial: { scale: 0.95, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.95, opacity: 0 }, children: [_jsxs("div", { className: "cc-modal-header", children: [showBackButton ? (_jsx("button", { className: "cc-back-btn", onClick: () => setRoute('connectors'), children: "\u2190" })) : showInfoButton ? (_jsx("button", { className: "cc-help-btn", onClick: () => setRoute('about'), title: "About Wallets", children: "?" })) : _jsx("div", { style: { width: 28 } }), _jsx("span", { className: "cc-modal-title", children: getTitle() }), _jsx("button", { className: "cc-close-btn", onClick: onClose, children: "\u00D7" })] }), _jsx("div", { className: "cc-modal-body", children: _jsx(AnimatePresence, { exitBeforeEnter: true, initial: false, children: _jsx(motion.div, { custom: getDirection(route), variants: variants, initial: "initial", animate: "animate", exit: "exit", transition: { duration: 0.2, ease: "easeInOut" }, children: renderPage() }, route) }) })] }) }));
};
