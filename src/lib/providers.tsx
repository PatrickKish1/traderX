'use client';
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains';

const COINBASE_TOKEN = `${process.env.COINBASE_TOKEN}`;

export function Providers({ children }: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={`${COINBASE_TOKEN}`}
      projectId="1d0226d4-9f84-48d6-9486-b4381e220d9f"
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