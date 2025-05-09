/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { fetchMarketPrice } from "@/lib/api/coinbase"
import { executeOrder } from "@/lib/api/trading"
import { toast } from "sonner"

interface OrderFormProps {
  market: string
  orderType: "limit" | "market" | "stop"
  prefilledValues?: {
    type: string
    token: string
    amount: string
    price?: string
    takeProfitPrice?: string
    stopLossPrice?: string
    pair: string
  }
}

export default function OrderForm({ market, orderType, prefilledValues }: OrderFormProps) {
  const [side, setSide] = useState<"buy" | "sell">("buy")
  const [price, setPrice] = useState<string>("")
  const [amount, setAmount] = useState<string>("")
  const [total, setTotal] = useState<string>("")
  const [stopPrice, setStopPrice] = useState<string>("")
  const [sliderValue, setSliderValue] = useState<number>(0)
  const [isPostOnly, setIsPostOnly] = useState<boolean>(false)
  const [isReduceOnly, setIsReduceOnly] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [marketPrice, setMarketPrice] = useState<number | null>(null)

  // Parse market symbol
  const [baseCurrency, quoteCurrency] = market.split("-")

  useEffect(() => {
    // Fetch current market price
    const fetchPrice = async () => {
      try {
        const price = await fetchMarketPrice(market)
        setMarketPrice(price)

        // Set default price for limit and stop orders
        if (orderType !== "market" && !price) {
          setPrice(price.toString())
        }
      } catch (error) {
        console.error("Failed to fetch market price:", error)
      }
    }

    fetchPrice()

    // Set up interval to refresh price
    const interval = setInterval(fetchPrice, 5000)

    return () => clearInterval(interval)
  }, [market, orderType])

  // Calculate total when price or amount changes
  useEffect(() => {
    if (price && amount) {
      const calculatedTotal = Number.parseFloat(price) * Number.parseFloat(amount)
      setTotal(calculatedTotal.toFixed(2))
    } else {
      setTotal("")
    }
  }, [price, amount])

  // Calculate amount when total changes
  const handleTotalChange = (value: string) => {
    setTotal(value)
    if (value && price && Number.parseFloat(price) > 0) {
      const calculatedAmount = Number.parseFloat(value) / Number.parseFloat(price)
      setAmount(calculatedAmount.toFixed(8))
    }
  }

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const percentage = value[0]
    setSliderValue(percentage)

    // Calculate amount based on percentage of available balance
    // This would require fetching the user's available balance
    // For now, we'll just use a placeholder
    const availableBalance = 1000 // This should be fetched from the user's account
    const calculatedAmount = (availableBalance * percentage) / 100

    if (orderType === "market") {
      setAmount(calculatedAmount.toFixed(8))
    } else {
      if (price && Number.parseFloat(price) > 0) {
        const calculatedAmount = (availableBalance * percentage) / (100 * Number.parseFloat(price))
        setAmount(calculatedAmount.toFixed(8))
      }
    }
  }

  // Add effect to handle prefilled values
  useEffect(() => {
    if (prefilledValues) {
      // Set the side based on the order type
      setSide(prefilledValues.type.toLowerCase().includes('buy') ? 'buy' : 'sell')
      
      // Set amount
      setAmount(prefilledValues.amount)
      
      // Set price for limit orders
      if (orderType === 'limit' && prefilledValues.price) {
        setPrice(prefilledValues.price)
      }
      
      // Set stop price for stop orders
      if (orderType === 'stop' && prefilledValues.stopLossPrice) {
        setStopPrice(prefilledValues.stopLossPrice)
      }
      
      // Calculate total based on price and amount
      if (prefilledValues.price && prefilledValues.amount) {
        const calculatedTotal = Number(prefilledValues.price) * Number(prefilledValues.amount)
        setTotal(calculatedTotal.toFixed(2))
      }
    }
  }, [prefilledValues, orderType])

  // Handle order submission
  const handleSubmit = async () => {
    try {
      setIsLoading(true)

      // Validate inputs
      if (orderType !== "market" && (!price || Number.parseFloat(price) <= 0)) {
        throw new Error("Please enter a valid price")
      }

      if (!amount || Number.parseFloat(amount) <= 0) {
        throw new Error("Please enter a valid amount")
      }

      if (orderType === "stop" && (!stopPrice || Number.parseFloat(stopPrice) <= 0)) {
        throw new Error("Please enter a valid stop price")
      }

      // Create order object
      const order = {
        market,
        side,
        type: orderType,
        size: amount,
        price: orderType !== "market" ? price : undefined,
        stop_price: orderType === "stop" ? stopPrice : undefined,
        post_only: isPostOnly,
        reduce_only: isReduceOnly,
      }

      // Execute order
      const result = await executeOrder(order)
      console.log(`${result}`)

      toast.success("Order Submitted",{
        description: `Your ${side} order has been submitted successfully.`,
      })

      // Reset form
      setAmount("")
      setTotal("")
      setSliderValue(0)
    } catch (error: any) {
      toast.error("Order Failed",{
        description: error.message || "Failed to submit order. Please try again.",
      })
      console.error("Failed to submit order:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Buy/Sell toggle */}
      <div className="flex rounded-md overflow-hidden">
        <Button
          type="button"
          className={`flex-1 rounded-none ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-muted hover:bg-muted/80"}`}
          onClick={() => setSide("buy")}
        >
          Buy
        </Button>
        <Button
          type="button"
          className={`flex-1 rounded-none ${side === "sell" ? "bg-red-600 hover:bg-red-700" : "bg-muted hover:bg-muted/80"}`}
          onClick={() => setSide("sell")}
        >
          Sell
        </Button>
      </div>

      {/* Market price display */}
      <div className="text-sm text-muted-foreground">
        Market Price: {marketPrice ? `$${marketPrice.toFixed(2)}` : "Loading..."}
      </div>

      {/* Order form fields */}
      <div className="space-y-3">
        {orderType !== "market" && (
          <div>
            <Label htmlFor="price">Price ({quoteCurrency})</Label>
            <Input
              id="price"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>
        )}

        {orderType === "stop" && (
          <div>
            <Label htmlFor="stopPrice">Stop Price ({quoteCurrency})</Label>
            <Input
              id="stopPrice"
              type="number"
              placeholder="0.00"
              value={stopPrice}
              onChange={(e) => setStopPrice(e.target.value)}
              step="0.01"
              min="0"
            />
          </div>
        )}

        <div>
          <Label htmlFor="amount">Amount ({baseCurrency})</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00000000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.00000001"
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="total">Total ({quoteCurrency})</Label>
          <Input
            id="total"
            type="number"
            placeholder="0.00"
            value={total}
            onChange={(e) => handleTotalChange(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>

        {/* Amount slider */}
        <div className="pt-2">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
          <Slider defaultValue={[0]} max={100} step={1} value={[sliderValue]} onValueChange={handleSliderChange} />
        </div>

        {/* Advanced options */}
        {orderType === "limit" && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="post-only" className="cursor-pointer">
                Post Only
              </Label>
              <Switch id="post-only" checked={isPostOnly} onCheckedChange={setIsPostOnly} />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="reduce-only" className="cursor-pointer">
                Reduce Only
              </Label>
              <Switch id="reduce-only" checked={isReduceOnly} onCheckedChange={setIsReduceOnly} />
            </div>
          </div>
        )}
      </div>

      {/* Submit button */}
      <Button
        type="button"
        className={`w-full ${side === "buy" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}`}
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <ArrowUpDown className="mr-2 h-4 w-4 animate-spin" /> : null}
        {side === "buy" ? "Buy" : "Sell"} {baseCurrency}
      </Button>
    </div>
  )
}
