"use client"

import { useState, useEffect, useCallback } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { fetchMarketPrice } from "@/lib/api/coinbase"

interface PriceAlertProps {
  market: string
}

export default function PriceAlert({ market }: PriceAlertProps) {
  const [showAlert, setShowAlert] = useState(false)
  const [alertPrice, setAlertPrice] = useState<string>("")
  const [alertDirection, setAlertDirection] = useState<"above" | "below">("above")
  const [alertSet, setAlertSet] = useState(false)
  const [currentPrice, setCurrentPrice] = useState<number | null>(null)

  // Parse market symbol
  const [baseCurrency, quoteCurrency] = market.split("-")
  currentPrice?.toString ()

  const triggerAlert = useCallback((price: number, targetPrice: number) => {
    // Play sound
    const audio = new Audio("/alert-sound.mp3")
    audio.play().catch((e) => console.error("Failed to play alert sound:", e))

    // Show browser notification if supported
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(`${baseCurrency} Price Alert`, {
          body: `${baseCurrency} price is now ${alertDirection} ${targetPrice} (Current: ${price})`,
          icon: "/favicon.ico",
        })
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission()
      }
    }

    // Reset alert
    setAlertSet(false)
  }, [alertDirection, baseCurrency])

  useEffect(() => {
    if (!alertSet) return

    const checkPrice = async () => {
      try {
        const price = await fetchMarketPrice(market)
        setCurrentPrice(price)

        const targetPrice = Number(alertPrice)
        if (alertDirection === "above" && price > targetPrice) {
          triggerAlert(price, targetPrice)
        } else if (alertDirection === "below" && price < targetPrice) {
          triggerAlert(price, targetPrice)
        }
      } catch (error) {
        console.error("Error fetching price:", error)
      }
    }

    // Check price immediately and set up interval
    checkPrice()
    const interval = setInterval(checkPrice, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [market, alertSet, alertPrice, alertDirection, triggerAlert])

  const handleSetAlert = () => {
    if (!alertPrice || Number.parseFloat(alertPrice) <= 0) return
    setAlertSet(true)
    setShowAlert(false)

    // Request notification permission if needed
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission()
    }
  }

  if (!showAlert && !alertSet) {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={() => setShowAlert(true)}>
        <Bell size={16} />
        Set Price Alert
      </Button>
    )
  }

  if (alertSet) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-amber-500" />
          <span>
            Alert when {baseCurrency} price is {alertDirection}{" "}
            <strong>${Number.parseFloat(alertPrice).toFixed(2)}</strong>
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground"
          onClick={() => setAlertSet(false)}
        >
          <X size={16} />
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <Bell size={16} />
        <div className="flex-1">
          <select
            className="bg-background border border-input rounded-md px-3 py-1 text-sm w-full md:w-auto"
            value={alertDirection}
            onChange={(e) => setAlertDirection(e.target.value as "above" | "below")}
          >
            <option value="above">Price goes above</option>
            <option value="below">Price goes below</option>
          </select>
        </div>
        <div className="flex-1">
          <Input
            type="number"
            placeholder={`${baseCurrency} price in ${quoteCurrency}`}
            value={alertPrice}
            onChange={(e) => setAlertPrice(e.target.value)}
            className="h-8"
          />
        </div>
        <Button size="sm" onClick={handleSetAlert}>
          Set Alert
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowAlert(false)}>
          <X size={16} />
        </Button>
      </div>
    </div>
  )
}
