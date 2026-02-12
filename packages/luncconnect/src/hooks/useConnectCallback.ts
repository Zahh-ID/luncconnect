import { useEffect, useRef } from 'react';
import { useAccount } from 'cosmos-connect-react';

export type useConnectCallbackProps = {
  onConnect?: ({
    address,
    connectorId,
  }: {
    address?: string;
    connectorId?: string;
  }) => void;
  onDisconnect?: () => void;
};

export const useConnectCallback = ({
  onConnect,
  onDisconnect,
}: useConnectCallbackProps) => {
  const { address, isConnected } = useAccount();
  const prevIsConnected = useRef(isConnected);

  useEffect(() => {
    if (isConnected && !prevIsConnected.current) {
      onConnect?.({
        address: address,
        connectorId: '', // connector id not easily available here
      });
    } else if (!isConnected && prevIsConnected.current) {
      onDisconnect?.();
    }
    prevIsConnected.current = isConnected;
  }, [isConnected, address, onConnect, onDisconnect]);
};
