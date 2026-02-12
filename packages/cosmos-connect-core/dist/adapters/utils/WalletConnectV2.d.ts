import { MobileAppDetails } from "./QRCodeModal.js";
export type GetAccountResponse = {
    name?: string | undefined;
    address: string;
    algo: string;
    pubkey: string;
};
export type WcSignAminoResponse = {
    signature: {
        signature: string;
    };
    signed?: any | undefined;
};
export type SignAminoResponse = Required<WcSignAminoResponse>;
export type WcSignDirectResponse = {
    signature: {
        signature: string;
    };
    signed?: any | undefined;
};
export type SignDirectResponse = Required<WcSignDirectResponse>;
export type WalletConnectV2Config = {
    disableConnectionCheck?: boolean;
};
export declare class WalletConnectV2 {
    private readonly projectId;
    private readonly mobileAppDetails;
    private readonly sessionStorageKey;
    private readonly accountStorageKey;
    private readonly onDisconnectCbs;
    private readonly onAccountChangeCbs;
    private readonly onUriCbs;
    private signClient;
    private config?;
    constructor(projectId: string, mobileAppDetails: MobileAppDetails, config?: WalletConnectV2Config);
    onUri(cb: (uri: string) => unknown): () => void;
    addChain(chainId: string, chainInfo: any): Promise<void>;
    connect(chainIds: string[]): Promise<void>;
    disconnect(): void;
    onDisconnect(cb: () => unknown): () => void;
    onAccountChange(cb: () => unknown): () => void;
    getAccount(chainId: string): Promise<GetAccountResponse>;
    signArbitrary(chainId: string, signerAddress: string, data: string): Promise<{
        signature: string;
    }>;
    signAmino(chainId: string, signerAddress: string, stdSignDoc: any): Promise<SignAminoResponse>;
    signDirect(chainId: string, signerAddress: string, signDoc: any): Promise<SignDirectResponse>;
    private isConnected;
    private _disconnect;
    private request;
    private toCosmosNamespace;
}
