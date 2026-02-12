import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const Connecting = ({ wallet, onCancel }) => {
    return (_jsx("div", { className: "cc-page-connecting", children: _jsxs("div", { className: "cc-connecting-view", children: [_jsxs("div", { className: "cc-spinner-container", children: [_jsx("div", { className: "cc-spinner" }), wallet?.icon && (_jsx("img", { src: wallet.icon, alt: "", className: "cc-spinner-icon" }))] }), _jsx("h3", { className: "cc-connecting-title", children: "Requesting Connection" }), _jsxs("p", { className: "cc-connecting-text", children: ["Open the ", wallet?.name || 'Wallet', " extension to continue."] }), _jsx("button", { className: "cc-footer-btn", onClick: onCancel, children: "Cancel" })] }) }));
};
export default Connecting;
