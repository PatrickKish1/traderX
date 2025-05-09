"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAccount } from "wagmi"
import { useTheme } from "@/lib/context/theme-context"
import WalletConnection from "./wallet-connection"
import { Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()
  const { isConnected } = useAccount()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "News", path: "/news" },
    { name: "Game", path: "/game" },
    { name: "AI Chat", path: "/chat" },
    // { name: "Trade", path: "/trade" },
    { name: "Portfolio", path: "/portfolio" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b bg-white dark:bg-[#1a1a3a] border-border/40 backdrop-blur supports-[backdrop-filter]:bg-white dark:supports-[backdrop-filter]:bg-[#1a1a3a]/90">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center" prefetch>
              <span className="text-2xl font-bold text-blue-700 hover:text-blue-800">CryptoTrader Pro</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-bold transition-colors ${
                  pathname === item.path ? "text-primary text-white" : "text-purple-600 hover:text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isConnected && (
              <Link
                href="/trade"
                className={`text-sm font-bold transition-colors ${
                  pathname === "/trade" ? "text-primary text-white" : "text-purple-600 hover:text-foreground"
                }`}
              >
                Trade
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="rounded-full text-foreground/60 hover:text-foreground hover:bg-accent"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {/* Wallet Connection */}
            <WalletConnection />

            {/* Mobile Menu Button */}
            <Button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full text-foreground/60 hover:text-foreground hover:bg-accent"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border/40">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.path
                      ? "bg-accent text-primary"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isConnected && (
                <Link
                  href="/trade"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === "/trade"
                      ? "bg-accent text-primary"
                      : "text-foreground/60 hover:text-foreground hover:bg-accent/50"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Trade
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
