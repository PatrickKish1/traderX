/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { Search, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

interface MarketSelectorProps {
  markets: any[]
  selectedMarket: string
  onMarketChange: (market: string) => void
}

export default function MarketSelector({ markets, selectedMarket, onMarketChange }: MarketSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  // Filter markets based on search query
  const filteredMarkets = markets.filter((market) => market.id.toLowerCase().includes(searchQuery.toLowerCase()))

  // Get selected market details
  const selected = markets.find((m) => m.id === selectedMarket) || {
    id: selectedMarket,
    base_currency: selectedMarket.split("-")[0],
    quote_currency: selectedMarket.split("-")[1],
    price: "Loading...",
    price_change_24h: 0,
  }

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 bg-card hover:bg-accent px-4 py-2 rounded-lg border border-border">
          <span className="font-semibold">
            {selected.base_currency}/{selected.quote_currency}
          </span>
          <ChevronDown size={16} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]">
          <div className="p-2">
            <Input
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-2"
              prefix={<Search size={16} className="text-muted-foreground" />}
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredMarkets.length > 0 ? (
              filteredMarkets.map((market) => (
                <DropdownMenuItem
                  key={market.id}
                  onClick={() => onMarketChange(market.id)}
                  className="flex justify-between cursor-pointer"
                >
                  <span>
                    {market.base_currency}/{market.quote_currency}
                  </span>
                  <span className={market.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {market.price}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <div className="p-2 text-center text-muted-foreground">No markets found</div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Current price display */}
      <div className="ml-4">
        <div className="text-2xl font-bold">
          ${typeof selected.price === "number" ? selected.price.toLocaleString() : selected.price}
        </div>
        <div className={`text-sm ${selected.price_change_24h >= 0 ? "text-green-500" : "text-red-500"}`}>
          {selected.price_change_24h >= 0 ? "+" : ""}
          {selected.price_change_24h}% (24h)
        </div>
      </div>
    </div>
  )
}
