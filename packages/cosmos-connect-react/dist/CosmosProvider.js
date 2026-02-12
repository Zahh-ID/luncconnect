import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState, } from 'react';
import { createClient, TERRA_CLASSIC, KeplrWallet, GalaxyStationWallet, LeapWallet, WalletConnectWallet, } from 'cosmos-connect-core';
const CosmosContext = createContext(null);
const DEFAULT_CONFIG = {
    chains: [TERRA_CLASSIC],
    wallets: [
        new GalaxyStationWallet(),
        new KeplrWallet(),
        new LeapWallet(),
        new WalletConnectWallet({
            projectId: '39190b939e067ecb6dccdb7c77653a42', // Default placeholder or instructions needed
        }),
    ],
};
export const CosmosProvider = ({ children, config, }) => {
    const [client] = useState(() => {
        const fullConfig = {
            chains: config?.chains || DEFAULT_CONFIG.chains,
            wallets: config?.wallets || DEFAULT_CONFIG.wallets,
            storage: config?.storage || DEFAULT_CONFIG.storage,
        };
        return createClient(fullConfig);
    });
    const [state, setState] = useState(client.state);
    useEffect(() => {
        return client.subscribe(setState);
    }, [client]);
    return (_jsx(CosmosContext.Provider, { value: { client, state }, children: children }));
};
export const useCosmos = () => {
    const context = useContext(CosmosContext);
    if (!context) {
        throw new Error('useCosmos must be used within a CosmosProvider');
    }
    return context;
};
