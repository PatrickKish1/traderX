import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import "@/lib/styles/onchainkit-styles.css"
// import '@coinbase/onchainkit/styles.css';
import { Providers } from "@/lib/providers"
import Header from "@/components/header"
import { ThemeProvider } from "@/lib/context/theme-context"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "CryptoTrader Pro",
  description: "Next-Gen Crypto Trading Platform",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased bg-background text-foreground`}
      >
        <ThemeProvider>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              {/* <Footer /> */}
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
