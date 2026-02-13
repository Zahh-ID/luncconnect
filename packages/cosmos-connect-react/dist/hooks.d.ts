export declare const useAccount: () => {
    address: string | undefined;
    status: import("cosmos-connect-core").ClientStatus;
    isConnected: boolean;
    isConnecting: boolean;
    isDisconnected: boolean;
    account: import("cosmos-connect-core").Account | null;
};
export declare const useConnect: () => {
    connect: (walletId: string, chainId: string) => Promise<void>;
};
export declare const useDisconnect: () => {
    disconnect: () => Promise<void>;
};
export declare const useClient: () => import("cosmos-connect-core").Client;
export declare const useBalance: () => {
    balance: {
        amount: string;
        denom: string;
    } | null;
    isLoading: boolean;
};
