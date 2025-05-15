"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchTradeHistory } from "@/lib/api/coinbase"
import { toast } from "sonner"

interface TradeHistoryProps {
  market: string
}

interface Trade {
  trade_id: string
  price: string
  size: string
  time: string
  side: "buy" | "sell"
}

export default function TradeHistory({ market }: TradeHistoryProps) {
  const [trades, setTrades] = useState<Trade[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadTradeHistory = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await fetchTradeHistory(market)
      setTrades(data)
    } catch (error) {
      toast.error("Error",{
        description: "Failed to load trade history",
      })
      console.error("Failed to load trade history:", error)
    } finally {
      setIsLoading(false)
    }
  }, [market])

  useEffect(() => {
    loadTradeHistory()

    // Set up interval to refresh trade history
    const interval = setInterval(loadTradeHistory, 50000)

    return () => clearInterval(interval)
  }, [loadTradeHistory])

  const formatTime = (timeString: string) => {
    const date = new Date(timeString)
    return date.toLocaleTimeString()
  }

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading trade history...</div>
  }

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-3 mb-2 text-sm font-medium text-muted-foreground">
        <div>Price</div>
        <div className="text-right">Amount</div>
        <div className="text-right">Time</div>
      </div>

      {trades.length > 0 ? (
        trades.slice(0, 15).map((trade) => (
          <div key={trade.trade_id} className="grid grid-cols-3 text-sm">
            <div className={trade.side === "buy" ? "text-green-500" : "text-red-500"}>
              {Number.parseFloat(trade.price).toFixed(2)}
            </div>
            <div className="text-right">{Number.parseFloat(trade.size).toFixed(6)}</div>
            <div className="text-right text-muted-foreground">{formatTime(trade.time)}</div>
          </div>
        ))
      ) : (
        <div className="text-center py-4 text-muted-foreground">No recent trades</div>
      )}
    </div>
  )
}
