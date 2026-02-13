// @ts-nocheck
import SignClient from '@walletconnect/sign-client';
import { isAndroid, isMobile } from './os.js';
import { MobileAppDetails, SignerMetadata } from './QRCodeModal.js';
import { debounce } from 'lodash-es';

// Re-defining internal types as they are not exported
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

const Method = {
  GET_ACCOUNTS: 'cosmos_getAccounts',
  SIGN_AMINO: 'cosmos_signAmino',
  SIGN_DIRECT: 'cosmos_signDirect',
  SIGN_ARBITRARY: 'keplr_signArbitrary',
  ADD_CHAIN: 'keplr_experimentalSuggestChain',
} as const;

const Event = {
  CHAIN_CHANGED: 'chainChanged',
  ACCOUNTS_CHANGED: 'accountsChanged',
} as const;

const DEFAULT_SIGN_OPTIONS = {
  preferNoSetFee: true,
  preferNoSetMemo: true,
};

export class WalletConnectV2 {
  private readonly projectId: string;
  private readonly mobileAppDetails: MobileAppDetails;
  private readonly signerMetadata: SignerMetadata;
  private readonly sessionStorageKey: string;
  private readonly accountStorageKey: string;
  private readonly onDisconnectCbs: Set<() => unknown>;
  private readonly onAccountChangeCbs: Set<() => unknown>;
  private readonly onUriCbs: Set<(uri: string) => unknown>;
  private signClient: any | null;
  private config?: WalletConnectV2Config;

  constructor(
    projectId: string,
    mobileAppDetails: MobileAppDetails,
    signerMetadata: SignerMetadata,
    config?: WalletConnectV2Config
  ) {
    this.projectId = projectId;
    this.mobileAppDetails = mobileAppDetails;
    this.signerMetadata = signerMetadata;
    this.sessionStorageKey = `cosmes.wallet.${mobileAppDetails.name.toLowerCase()}.wcSession`;
    this.accountStorageKey = `cosmes.wallet.${mobileAppDetails.name.toLowerCase()}.lastAccount`;
    this.onDisconnectCbs = new Set();
    this.onAccountChangeCbs = new Set();
    this.onUriCbs = new Set();
    this.signClient = null;
    this.config = config;
  }

  onUri(cb: (uri: string) => unknown): () => void {
    this.onUriCbs.add(cb);
    return () => {
      this.onUriCbs.delete(cb);
    };
  }

  async addChain(chainId: string, chainInfo: any): Promise<void> {
    if (!this.signClient) {
      throw new Error('SignClient is not initialized');
    }
    await this.request(chainId, Method.ADD_CHAIN, {
      chainInfo,
    });
  }

  async connect(chainIds: string[]): Promise<void> {
    // Initialise the sign client and event listeners if they don't already exist
    if (!this.signClient) {
      console.log('WalletConnectV2: Initializing SignClient...');
      try {
        this.signClient = await (SignClient as any).init({
          projectId: this.projectId,
        });
        console.log('WalletConnectV2: SignClient initialized');
      } catch (err) {
        console.error('WalletConnectV2: Failed to initialize SignClient', err);
        throw err;
      }
      // Disconnect if the session is disconnected or expired
      this.signClient.on('session_delete', ({ topic }: { topic: string }) =>
        this._disconnect(topic)
      );
      this.signClient.on('session_expire', ({ topic }: { topic: string }) =>
        this._disconnect(topic)
      );
      // Handle the `accountsChanged` event
      const handleAccountChange = debounce(
        // Handler is debounced as the `accountsChanged` event is fired once for
        // each connected chain, but we only want to trigger the callback once.
        () => this.onAccountChangeCbs.forEach((cb) => cb()),
        300,
        { leading: true, trailing: false }
      );
      this.signClient.on('session_event', ({ params }: { params: any }) => {
        if (params.event.name === Event.ACCOUNTS_CHANGED) {
          handleAccountChange();
        }
      });
    }
    // Check if a valid session already exists
    const oldSession = localStorage.getItem(this.sessionStorageKey);
    const chainIdsSet = new Set(chainIds);

    if (oldSession) {
      const { topic, chainIds: storedIds } = JSON.parse(oldSession);
      const storedIdsSet = new Set<string>(storedIds);
      if (chainIds.every((id) => storedIdsSet.has(id))) {
        if (this.config?.disableConnectionCheck) {
          return;
        }
        // If the requested chain IDs are a subset of the stored chain IDs,
        // check if the session is still working and connected
        if (await this.isConnected(this.signClient, topic, 4)) {
          // If the current session is properly connected, return early
          return;
        } else {
          // Otherwise, assume the session is stale and disconnect
          this._disconnect(topic);
        }
      } else {
        // Otherwise, we need to merge the stored IDs with the requested IDs
        for (const id of storedIds) {
          chainIdsSet.add(id);
        }
      }
    }
    // Initialise a new session with auto-regeneration on timeout
    const maxRetries = 3;
    const pairingTimeout = 300000; // 5 minutes per attempt

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      const { uri, approval } = await this.signClient!.connect({
        requiredNamespaces: {
          cosmos: {
            chains: [...chainIdsSet].map((id) => this.toCosmosNamespace(id)),
            methods: Object.values(Method),
            events: Object.values(Event),
          },
        },
      });
      if (uri) {
        console.log(
          `WalletConnectV2: URI generated (attempt ${
            attempt + 1
          }/${maxRetries})`,
          uri
        );
        this._uri = uri;
        this.onUriCbs.forEach((cb) => cb(uri));
        console.log(
          `WalletConnectV2: Waiting for approval (timeout: ${pairingTimeout}ms)...`
        );

        try {
          const approvalPromise = approval();
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Connection approval timed out')),
              pairingTimeout
            )
          );

          const { topic } = await (Promise.race([
            approvalPromise,
            timeoutPromise,
          ]) as Promise<{ topic: string }>);

          console.log('WalletConnectV2: Approved session topic', topic);
          const newSession = {
            topic,
            chainIds: [...chainIdsSet],
          };
          localStorage.setItem(
            this.sessionStorageKey,
            JSON.stringify(newSession)
          );
          return; // Successfully connected
        } catch (err: any) {
          const isRetryable =
            err?.message === 'Connection approval timed out' ||
            err?.message === 'Proposal expired';
          if (isRetryable && attempt < maxRetries - 1) {
            console.log(
              `WalletConnectV2: ${err.message}, regenerating QR code (attempt ${
                attempt + 2
              }/${maxRetries})...`
            );
            continue; // Retry with a new URI
          }
          throw err;
        }
      }
    }
  }

  disconnect() {
    const session = localStorage.getItem(this.sessionStorageKey);
    if (session) {
      const { topic } = JSON.parse(session);
      this._disconnect(topic);
    }
  }

  onDisconnect(cb: () => unknown): () => void {
    this.onDisconnectCbs.add(cb);
    return () => {
      this.onDisconnectCbs.delete(cb);
    };
  }

  onAccountChange(cb: () => unknown): () => void {
    this.onAccountChangeCbs.add(cb);
    return () => {
      this.onAccountChangeCbs.delete(cb);
    };
  }

  async getAccount(chainId: string): Promise<GetAccountResponse> {
    if (!this.config?.disableConnectionCheck) {
      const res = await this.request(chainId, Method.GET_ACCOUNTS, {});
      // result might be array or single object depending on wallet impl, usually array
      return Array.isArray(res) ? res[0] : res;
    }
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timed out')), 3000)
      );
      const resArray: any = await Promise.race([
        this.request(chainId, Method.GET_ACCOUNTS, {}),
        timeout,
      ]);
      const res = Array.isArray(resArray) ? resArray[0] : resArray;
      // Store successful response
      this.onDisconnect(() => {
        localStorage.removeItem(this.accountStorageKey);
      });
      localStorage.setItem(this.accountStorageKey, JSON.stringify(res));
      return res;
    } catch (e) {
      // Try to get stored account data
      const stored = localStorage.getItem(this.accountStorageKey);
      if (stored) {
        const account = JSON.parse(stored);
        // Try to refresh in background
        this.request(chainId, Method.GET_ACCOUNTS, {})
          .then((res: any) => {
            const accountData = Array.isArray(res) ? res[0] : res;
            localStorage.setItem(
              this.accountStorageKey,
              JSON.stringify(accountData)
            );
          })
          .catch(() => {});
        this.onDisconnect(() => {
          localStorage.removeItem(this.accountStorageKey);
        });
        return account;
      }
      throw e;
    }
  }

  async signArbitrary(
    chainId: string,
    signerAddress: string,
    data: string
  ): Promise<{ signature: string }> {
    return this.request(chainId, Method.SIGN_ARBITRARY, {
      chainId,
      signer: signerAddress,
      type: 'string',
      data,
    });
  }

  async signAmino(
    chainId: string,
    signerAddress: string,
    stdSignDoc: any
  ): Promise<SignAminoResponse> {
    const { signature, signed } = await this.request(
      chainId,
      Method.SIGN_AMINO,
      {
        signerAddress,
        signDoc: stdSignDoc,
        signOptions: DEFAULT_SIGN_OPTIONS,
      }
    );
    return {
      signature: signature,
      signed: signed ?? stdSignDoc,
    };
  }

  async signDirect(
    chainId: string,
    signerAddress: string,
    signDoc: any
  ): Promise<SignDirectResponse> {
    const { signature, signed } = await this.request(
      chainId,
      Method.SIGN_DIRECT,
      {
        signerAddress,
        signDoc,
        signOptions: DEFAULT_SIGN_OPTIONS,
      }
    );
    return {
      signature: signature,
      signed: signed ?? signDoc,
    };
  }

  private isConnected(
    signClient: any,
    topic: string,
    timeoutSeconds: number
  ): Promise<boolean> {
    const tryPing = async () =>
      signClient
        .ping({ topic })
        .then(() => true)
        .catch(() => false);
    const waitDisconnect = async () =>
      new Promise<boolean>((resolve) => {
        // @ts-ignore
        signClient.on('session_delete', (res) => {
          if (topic === res.topic) {
            resolve(false);
          }
        });
        // @ts-ignore
        signClient.on('session_expire', (res) => {
          if (topic === res.topic) {
            resolve(false);
          }
        });
      });
    const timeout = async () =>
      new Promise<boolean>((resolve) =>
        setTimeout(() => resolve(false), timeoutSeconds * 1000)
      );
    return Promise.race([tryPing(), waitDisconnect(), timeout()]);
  }

  private _disconnect(topic: string) {
    const session = localStorage.getItem(this.sessionStorageKey);
    if (!session || session.includes(topic)) {
      localStorage.removeItem(this.sessionStorageKey);
      this.onDisconnectCbs.forEach((cb) => cb());
    }
  }

  private async request(
    chainId: string,
    method: string,
    params: any
  ): Promise<any> {
    const session = localStorage.getItem(this.sessionStorageKey);
    if (!session || !this.signClient) {
      throw new Error('Session not found for ' + chainId);
    }
    const { topic } = JSON.parse(session);
    if (isMobile() && method !== Method.GET_ACCOUNTS) {
      window.location.href = isAndroid()
        ? this.mobileAppDetails.android
        : this.mobileAppDetails.ios;
    }
    return this.signClient!.request({
      topic,
      chainId: this.toCosmosNamespace(chainId),
      request: {
        method,
        params,
      },
    });
  }

  private toCosmosNamespace(chainId: string): string {
    return 'cosmos:' + chainId;
  }
}
