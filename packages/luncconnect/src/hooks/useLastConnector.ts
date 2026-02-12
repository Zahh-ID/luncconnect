import { useEffect, useState } from 'react';

export const useLastConnector = () => {
  const [lastConnectorId, setLastConnectorId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('connectkit.recentConnectorId');
    setLastConnectorId(id ?? '');
  }, []);

  const update = (id: string) => {
    localStorage.setItem('connectkit.recentConnectorId', id);
    setLastConnectorId(id);
  };

  return {
    lastConnectorId,
    updateLastConnectorId: update,
  };
};
