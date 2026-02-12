import { ReactNode } from 'react';
import Logos from '../assets/chains';
import CosmosLogos from '../assets/cosmosLogos';

type Chain = {
  id: number | string;
  name: string;
  logo: ReactNode;
  rpcUrls?: {
    // ... rpc urls
  };
};

export const chainConfigs: Chain[] = [
  {
    id: 'columbus-5',
    name: 'Terra Classic',
    logo: <CosmosLogos.TerraClassic width="100%" height="100%" />,
  },
  {
    id: 'rebel-2',
    name: 'Terra Classic Testnet',
    logo: (
      <CosmosLogos.TerraClassic
        width="100%"
        height="100%"
        style={{ filter: 'grayscale(1)' }}
      />
    ),
  },
];
