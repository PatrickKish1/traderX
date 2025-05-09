/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useRef } from "react"

interface TradingViewProps {
  symbol: string
  height?: number
}

declare global {
  interface Window {
    TradingView?: {
      widget: any
    }
  }
}

export default function TradingView({ symbol, height = 500 }: TradingViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<any>(null)

  useEffect(() => {
    const initializeWidget = () => {
      if (window.TradingView && containerRef.current) {
        // Format symbol for TradingView
        const formattedSymbol = `COINBASE:${symbol.replace("-", "")}`

        // Create and configure the widget
        widgetRef.current = new window.TradingView.widget({
          container_id: containerRef.current.id,
          symbol: formattedSymbol,
          interval: "15",
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1",
          locale: "en",
          toolbar_bg: "rgba(0, 0, 0, 0)",
          enable_publishing: false,
          hide_top_toolbar: false,
          hide_legend: false,
          save_image: false,
          height,
          width: "100%",
          autosize: true,
          allow_symbol_change: true,
          studies: ["RSI@tv-basicstudies", "MAExp@tv-basicstudies", "MACD@tv-basicstudies"],
          show_popup_button: false,
        })
      }
    }

    // Load TradingView widget script
    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/tv.js"
    script.async = true
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
  }, [height, symbol])

  return (
    <div id="tradingview_widget_container" ref={containerRef} style={{ height: `${height}px`, width: "100%" }}>
      <div className="flex items-center justify-center h-full bg-card">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    </div>
  )
}
