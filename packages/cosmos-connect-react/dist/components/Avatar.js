import { jsx as _jsx } from "react/jsx-runtime";
/**
 * A simple, colorful avatar generated from the address.
 * Mimics the ConnectKit/RainbowKit feel.
 */
export const Avatar = ({ address, size = 32 }) => {
    // Simple deterministic color generation from address
    const colors = [
        '#FFADAD', '#FFD6A5', '#FDFFB6', '#CAFFBF',
        '#9BF6FF', '#A0C4FF', '#BDB2FF', '#FFC6FF'
    ];
    const getHash = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };
    const colorIndex = Math.abs(getHash(address)) % colors.length;
    const secondaryColorIndex = (colorIndex + 3) % colors.length;
    return (_jsx("div", { style: {
            width: size,
            height: size,
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[secondaryColorIndex]} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.4,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 1px 2px rgba(0,0,0,0.1)',
            flexShrink: 0,
            overflow: 'hidden'
        }, children: address.slice(-2).toUpperCase() }));
};
