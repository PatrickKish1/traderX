"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"

interface CryptoPrice {
  symbol: string
  price: string
  change: string
  isPositive: boolean
}

export default function PriceTickerBanner() {
  const [prices, setPrices] = useState<CryptoPrice[]>([
    { symbol: "BTC/USDT", price: "$65,432.10", change: "+2.45%", isPositive: true },
    { symbol: "ETH/USDT", price: "$3,456.78", change: "-1.23%", isPositive: false },
    { symbol: "SOL/USDT", price: "$123.45", change: "+5.67%", isPositive: true },
    { symbol: "BNB/USDT", price: "$567.89", change: "+0.89%", isPositive: true },
    { symbol: "XRP/USDT", price: "$0.5678", change: "-0.45%", isPositive: false },
    { symbol: "ADA/USDT", price: "$0.4567", change: "+3.21%", isPositive: true },
    { symbol: "DOGE/USDT", price: "$0.1234", change: "+7.89%", isPositive: true },
  ])

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prevPrices) => {
        return prevPrices.map((crypto) => {
          // Randomly update some prices
          if (Math.random() > 0.7) {
            const changeValue = (Math.random() * 2 - 1) * 0.5 // Random change between -0.5% and +0.5%
            const isPositive = changeValue >= 0
            const newChange = `${isPositive ? "+" : ""}${changeValue.toFixed(2)}%`
            return { ...crypto, change: newChange, isPositive }
          }
          return crypto
        })
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden border-b border-gray-800">
      <div className="relative">
        <motion.div
          animate={{ x: [0, -2000] }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 30,
            ease: "linear",
          }}
          className="flex whitespace-nowrap"
        >
          {prices.concat(prices).map((crypto, index) => (
            <div key={index} className="flex items-center mx-6">
              <span className="font-medium">{crypto.symbol}</span>
              <span className="ml-2">{crypto.price}</span>
              <span className={`ml-2 flex items-center ${crypto.isPositive ? "text-green-500" : "text-red-500"}`}>
                {crypto.isPositive ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : (
                  <TrendingDown size={14} className="mr-1" />
                )}
                {crypto.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
