'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

const COINBASE_TOKEN = `${process.env.COINBASE_TOKEN}`;
const PROJECT_ID = `${process.env.BASE_PROJECT_ID}`;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={`${COINBASE_TOKEN}`}
      projectId={`${PROJECT_ID}`}
      chain={base}
      config={{
        appearance: {
          name: 'CryptoTrader Pro',
          logo: 'https://pbs.twimg.com/profile_images/1902457858232287232/lLiKq_s__400x400.jpg',
          mode: 'dark',
          theme: 'default',
        },
        wallet: { 
          display: 'modal',
          termsUrl: 'https://cryptotraderpro.com/terms', 
          privacyUrl: 'https://cryptotraderpro.com/privacy', 
        },
      }}
    >
      {children}
    </OnchainKitProvider>
  );
}