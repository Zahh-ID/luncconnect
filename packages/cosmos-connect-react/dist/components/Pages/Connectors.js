import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCosmos } from '../../CosmosProvider.js';
const Connectors = ({ onSelect }) => {
    const { client } = useCosmos();
    const wallets = client.getWallets();
    return (_jsx("div", { className: "cc-page-connectors", children: _jsx("div", { className: "cc-wallet-list", children: wallets.map((wallet) => (_jsxs("button", { className: "cc-wallet-item", onClick: () => onSelect(wallet), children: [_jsx("span", { children: wallet.name }), wallet.icon && _jsx("img", { src: wallet.icon, alt: wallet.name, className: "cc-wallet-icon" })] }, wallet.id))) }) }));
};
export default Connectors;
