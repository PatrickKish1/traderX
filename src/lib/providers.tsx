"use client"

import type { ReactNode } from "react"
import { OnchainKitProvider } from "@coinbase/onchainkit"
import { base } from "wagmi/chains"
import { useTheme } from "@/lib/context/theme-context"
import { Toaster } from "sonner"

const BASE_API_KEY = process.env.COINBASE_TOKEN
const PROJECT_ID = process.env.BASE_PROJECT_ID

export function Providers({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <WagmiProvider config={config}>
      <OnchainKitProvider
        apiKey={BASE_API_KEY}
        projectId={PROJECT_ID}
        chain={base}
        config={{
          appearance: {
            name: "CryptoTrader Pro",
            logo: "https://pbs.twimg.com/profile_images/1902457858232287232/lLiKq_s__400x400.jpg",
            mode: theme === "dark" ? "dark" : "light",
            theme: "base",
          },
          wallet: {
            display: "modal",
            termsUrl: "https://cryptotraderpro.com/terms",
            privacyUrl: "https://cryptotraderpro.com/privacy",
          },
        }}
      >
        {children}
        <Toaster />
      </OnchainKitProvider>
    </WagmiProvider>
  )
}


import { http, createConfig, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})