import React, { ReactNode } from 'react';
import { Client, ClientState, ClientConfig } from 'cosmos-connect-core';
interface CosmosContextValue {
    client: Client;
    state: ClientState;
}
export interface CosmosProviderProps {
    children: ReactNode;
    config?: Partial<ClientConfig>;
}
export declare const CosmosProvider: React.FC<CosmosProviderProps>;
export declare const useCosmos: () => CosmosContextValue;
export {};
