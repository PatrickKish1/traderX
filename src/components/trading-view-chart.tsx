/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"

interface TradingViewChartProps {
  symbol: string
  height?: number
  width?: string
}

declare global {
  interface Window {
    TradingView?: {
      widget: any
    }
  }
}

export default function TradingViewChart({ symbol = "BTCUSDT", height = 500, width = "100%" }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
    
    const initializeWidget = () => {
      if (window.TradingView && containerRef.current) {
        // Create and configure the widget
        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: `BINANCE:${symbol}`,
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "rgba(0, 0, 0, 0)",
          enable_publishing: false,
          hide_top_toolbar: true,
          hide_legend: false,
          save_image: false,
          height,
          width,
          autosize: false,
          allow_symbol_change: false,
          studies: ["RSI@tv-basicstudies"],
          show_popup_button: false,
          popup_width: "1000",
          popup_height: "650",
        })
      }
    }
    script.onload = initializeWidget
    document.head.appendChild(script)
    return () => {
      if (widgetRef.current) {
        // Clean up if possible
        try {
          widgetRef.current = null
        } catch (e) {
          console.error("Error cleaning up TradingView widget:", e)
        }
      }
    }
  }, [height, symbol, width])


  return (
    <div id="tradingview_widget_container" ref={containerRef} style={{ height: `${height}px`, width }}>
      <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
        <div className="text-white text-opacity-70">Loading chart...</div>
      </div>
    </div>
  )
}
