"use client"

import { useState, useCallback } from "react"
import { coinbaseApi } from "@/lib/coinbase-api"
import { toast } from "sonner"

interface OrderData {
  type: "buy" | "sell"
  price?: number
  amount: number
  orderType: "market" | "limit" | "stop" | "bracket"
  stopPrice?: number
  takeProfitPrice?: number
  timeInForce?: "GTC" | "GTD" | "FOK"
}

export function useOrderExecution(tradingPair: string) {
  const [isExecuting, setIsExecuting] = useState(false)
  const [lastPrice, setLastPrice] = useState(0)

  // Fetch the current price
  const fetchCurrentPrice = useCallback(async () => {
    try {
      const response = await coinbaseApi.getBestBidAsk([tradingPair])
      if (response.pricebooks && response.pricebooks[tradingPair]) {
        const asks = response.pricebooks[tradingPair].asks
        if (asks && asks.length > 0) {
          setLastPrice(Number.parseFloat(asks[0].price))
        }
      }
    } catch (error) {
      console.error("Failed to fetch current price:", error)
    }
  }, [tradingPair])

  // Execute a market order
  const executeMarketOrder = useCallback(
    async (orderData: OrderData) => {
      try {
        setIsExecuting(true)
        await fetchCurrentPrice()

        const side = orderData.type.toUpperCase() as "BUY" | "SELL"
        const result = await coinbaseApi.createMarketOrder(tradingPair, side, orderData.amount.toString())

        toast.success("Order Executed",{
          description: `${orderData.type === "buy" ? "Bought" : "Sold"} ${orderData.amount} at market price`,
        })

        return result
      } catch (error) {
        console.error("Failed to execute market order:", error)

        toast.error("Order Failed",{ description: "Failed to execute order. Please try again.",
        })

        throw error
      } finally {
        setIsExecuting(false)
      }
    },
    [tradingPair, fetchCurrentPrice],
  )

  // Execute a limit order
  const executeLimitOrder = useCallback(
    async (orderData: OrderData) => {
      try {
        setIsExecuting(true)

        if (!orderData.price) {
          throw new Error("Limit price is required for limit orders")
        }

        const side = orderData.type.toUpperCase() as "BUY" | "SELL"
        const timeInForce = orderData.timeInForce || "GTC"

        const result = await coinbaseApi.createLimitOrder(
          tradingPair,
          side,
          orderData.amount.toString(),
          orderData.price.toString(),
          timeInForce,
        )

        toast.success("Order Placed",{
          description: `${orderData.type === "buy" ? "Buy" : "Sell"} limit order placed for ${orderData.amount} at ${orderData.price}`,
        })

        return result
      } catch (error) {
        console.error("Failed to place limit order:", error)

        toast.error("Order Failed",{
          description: "Failed to place order. Please try again.",
        })

        throw error
      } finally {
        setIsExecuting(false)
      }
    },
    [tradingPair],
  )

  // Execute a stop order
  const executeStopOrder = useCallback(
    async (orderData: OrderData) => {
      try {
        setIsExecuting(true)

        if (!orderData.price || !orderData.stopPrice) {
          throw new Error("Limit price and stop price are required for stop orders")
        }

        const side = orderData.type.toUpperCase() as "BUY" | "SELL"
        // Determine stop direction based on side and current price
        const stopDirection = side === "BUY" ? "STOP_DIRECTION_STOP_UP" : "STOP_DIRECTION_STOP_DOWN"

        const result = await coinbaseApi.createStopLimitOrder(
          tradingPair,
          side,
          orderData.amount.toString(),
          orderData.price.toString(),
          orderData.stopPrice.toString(),
          stopDirection,
        )

        toast.success("Stop Order Placed",{
          description: `${orderData.type === "buy" ? "Buy" : "Sell"} stop order placed for ${orderData.amount} at ${orderData.price} (stop: ${orderData.stopPrice})`,
        })

        return result
      } catch (error) {
        console.error("Failed to place stop order:", error)

        toast.error("Order Failed", {
          description: "Failed to place stop order. Please try again.",
        })

        throw error
      } finally {
        setIsExecuting(false)
      }
    },
    [tradingPair],
  )

  // Execute a bracket order (entry with take profit and stop loss)
  const executeBracketOrder = useCallback(
    async (orderData: OrderData) => {
      try {
        setIsExecuting(true)

        if (!orderData.price || !orderData.stopPrice) {
          throw new Error("Limit price and stop price are required for bracket orders")
        }

        const side = orderData.type.toUpperCase() as "BUY" | "SELL"

        const result = await coinbaseApi.createBracketOrder(
          tradingPair,
          side,
          orderData.amount.toString(),
          orderData.price.toString(),
          orderData.stopPrice.toString(),
        )

        toast.success("Bracket Order Placed",{
          description: `${orderData.type === "buy" ? "Buy" : "Sell"} bracket order placed for ${orderData.amount} at ${orderData.price} with stop at ${orderData.stopPrice}`,
        })

        return result
      } catch (error) {
        console.error("Failed to place bracket order:", error)

        toast.error("Order Failed",{
          description: "Failed to place bracket order. Please try again.",
        })

        throw error
      } finally {
        setIsExecuting(false)
      }
    },
    [tradingPair],
  )

  // Cancel an order
  const cancelOrder = useCallback(async (orderId: string) => {
    try {
      setIsExecuting(true)

      const result = await coinbaseApi.cancelOrder(orderId)

      toast.error("Order Cancelled",{
        description: "Your order has been cancelled successfully.",
      })

      return result
    } catch (error) {
      console.error("Failed to cancel order:", error)

      toast.error("Cancellation Failed",{
        description: "Failed to cancel order. Please try again.",
      })

      throw error
    } finally {
      setIsExecuting(false)
    }
  }, [])

  return {
    executeMarketOrder,
    executeLimitOrder,
    executeStopOrder,
    executeBracketOrder,
    cancelOrder,
    isExecuting,
    lastPrice,
    fetchCurrentPrice,
  }
}
