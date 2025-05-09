"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchOrderBook } from "@/lib/api/coinbase"
import { toast } from "sonner"

interface OrderBookProps {
  market: string
}

interface OrderBookEntry {
  price: string
  size: string
}

export default function OrderBook({ market }: OrderBookProps) {
  const [orderBook, setOrderBook] = useState<{ bids: OrderBookEntry[]; asks: OrderBookEntry[] }>({
    bids: [],
    asks: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  const loadOrderBook = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchOrderBook(market)
      setOrderBook(data)
    } catch (error) {
      toast.error("Error",{
        description: "Failed to load order book",
      })
      console.error("Failed to load order book:", error)
    } finally {
      setIsLoading(false)
    }
  }, [market])

  useEffect(() => {
    loadOrderBook()

    // Set up interval to refresh order book
    const interval = setInterval(loadOrderBook, 5000)

    return () => clearInterval(interval)
  }, [loadOrderBook])

  // Find the highest volume for visualization
  const maxBidSize = Math.max(...orderBook.bids.map((bid) => Number.parseFloat(bid.size)), 0)
  const maxAskSize = Math.max(...orderBook.asks.map((ask) => Number.parseFloat(ask.size)), 0)
  const maxSize = Math.max(maxBidSize, maxAskSize)

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading order book...</div>
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {/* Bids (buy orders) */}
      <div>
        <div className="grid grid-cols-2 mb-2 text-sm font-medium text-muted-foreground">
          <div>Price</div>
          <div className="text-right">Amount</div>
        </div>
        <div className="space-y-1">
          {orderBook.bids.slice(0, 10).map((bid, index) => (
            <div key={index} className="grid grid-cols-2 text-sm relative">
              <div
                className="absolute inset-0 bg-green-500/10 rounded-sm"
                style={{ width: `${(Number.parseFloat(bid.size) / maxSize) * 100}%` }}
              />
              <div className="relative text-green-500">{Number.parseFloat(bid.price).toFixed(2)}</div>
              <div className="relative text-right">{Number.parseFloat(bid.size).toFixed(6)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Asks (sell orders) */}
      <div>
        <div className="grid grid-cols-2 mb-2 text-sm font-medium text-muted-foreground">
          <div>Price</div>
          <div className="text-right">Amount</div>
        </div>
        <div className="space-y-1">
          {orderBook.asks.slice(0, 10).map((ask, index) => (
            <div key={index} className="grid grid-cols-2 text-sm relative">
              <div
                className="absolute inset-0 bg-red-500/10 rounded-sm"
                style={{ width: `${(Number.parseFloat(ask.size) / maxSize) * 100}%` }}
              />
              <div className="relative text-red-500">{Number.parseFloat(ask.price).toFixed(2)}</div>
              <div className="relative text-right">{Number.parseFloat(ask.size).toFixed(6)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
