export declare const useAccount: () => {
    address: any;
    status: any;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    account: any;
};
export declare const useConnect: () => {
    connect: (walletId: string, chainId: string) => Promise<any>;
};
export declare const useDisconnect: () => {
    disconnect: () => Promise<any>;
};
export declare const useClient: () => Client;
export declare const useBalance: () => {
    balance: {
        amount: string;
        denom: string;
    } | null;
    isLoading: boolean;
};
