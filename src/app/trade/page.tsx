/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import TradingView from "@/components/trading/trading-view"
import OrderForm from "@/components/trading/order-form"
import OrderBook from "@/components/trading/order-book"
import TradeHistory from "@/components/trading/trade-history"
import MarketSelector from "@/components/trading/market-selector"
import AccountSummary from "@/components/trading/account-summary"
import PriceAlert from "@/components/trading/price-alert"
import LoadingSpinner from "@/components/loader-spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchMarkets } from "@/lib/api/coinbase"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function TradePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMarket, setSelectedMarket] = useState("BTC-USD")
  const [markets, setMarkets] = useState<any[]>([])
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [tradeSignal, setTradeSignal] = useState<any>(null);

  useEffect(() => {
    // Check wallet connection status safely
    try {
      // For demo purposes, we'll just set this to true
      // In a real app, you would check the actual wallet connection
      setIsWalletConnected(true)
      loadMarkets()
    } catch (error) {
      console.error("Error checking wallet connection:", error)
      // If there's an error, we'll still load the markets
      loadMarkets()
    }
  }, [])

  useEffect(() => {
    const signal = localStorage.getItem('tradeSignal');
    if (signal) {
      try {
        const parsedSignal = JSON.parse(signal);
        setTradeSignal(parsedSignal);
        
        // Set the selected market based on the trade signal pair
        if (parsedSignal.pair) {
          const market = parsedSignal.pair.replace('/', '-');
          setSelectedMarket(market);
        }
        
        // Clear the signal after loading
        localStorage.removeItem('tradeSignal');
      } catch (error) {
        console.error('Error parsing trade signal:', error);
      }
    }
  }, []);

  const loadMarkets = async () => {
    try {
      setIsLoading(true)
      const marketsData = await fetchMarkets()
      setMarkets(marketsData)
    } catch (error) {
      toast.error("Error",{
        description: "Failed to load markets. Using demo data instead.",
      })
      console.error("Failed to load markets:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarketChange = (market: string) => {
    setSelectedMarket(market)
  }

  const handleConnectWallet = () => {
    // In a real app, this would trigger the wallet connection flow
    // For now, we'll just set the state to true
    setIsWalletConnected(true)
  }

  const getDefaultOrderType = (signal: any) => {
    if (!signal) return 'limit';
    if (signal.type.includes('LIMIT')) return 'limit';
    if (signal.type.includes('STOP')) return 'stop';
    return 'market';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <LoadingSpinner />
      </div>
    )
  }

  // Show a simplified view if wallet is not connected
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-background text-foreground p-4">
        <div className="container mx-auto">
          <div className="flex flex-col gap-4">
            {/* Header with market selector */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <MarketSelector markets={markets} selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
              <Button onClick={handleConnectWallet}>Connect Wallet</Button>
            </div>

            {/* Main trading interface */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Chart and order book section */}
              <div className="lg:col-span-3 space-y-4">
                {/* TradingView chart */}
                <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                  <TradingView symbol={selectedMarket} />
                </div>

                {/* Order book and trade history */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                    <h2 className="text-lg font-semibold mb-4">Order Book</h2>
                    <OrderBook market={selectedMarket} />
                  </div>
                  <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                    <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
                    <TradeHistory market={selectedMarket} />
                  </div>
                </div>
              </div>

              {/* Connect wallet prompt */}
              <div className="bg-card rounded-lg shadow-sm p-6 border border-border flex flex-col items-center justify-center">
                <h2 className="text-xl font-semibold mb-4">Connect Wallet to Trade</h2>
                <p className="text-muted-foreground text-center mb-6">
                  Connect your wallet to access full trading features and manage your portfolio.
                </p>
                <Button onClick={handleConnectWallet} className="w-full">
                  Connect Wallet
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background text-foreground p-4 mb-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-4">
          {/* Header with market selector and account summary */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <MarketSelector markets={markets} selectedMarket={selectedMarket} onMarketChange={handleMarketChange} />
            <AccountSummary />
          </div>

          {/* Main trading interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Chart and order book section */}
            <div className="lg:col-span-3 space-y-4">
              {/* Price alert banner */}
              <PriceAlert market={selectedMarket} />

              {/* TradingView chart */}
              <div className="bg-card rounded-lg shadow-sm overflow-hidden border border-border">
                <TradingView symbol={selectedMarket} />
              </div>

              {/* Order book and trade history */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <h2 className="text-lg font-semibold mb-4">Order Book</h2>
                  <OrderBook market={selectedMarket} />
                </div>
                <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
                  <h2 className="text-lg font-semibold mb-4">Recent Trades</h2>
                  <TradeHistory market={selectedMarket} />
                </div>
              </div>
            </div>

            {/* Order form section */}
            <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
              <Tabs defaultValue="limit">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="limit">Limit</TabsTrigger>
                  <TabsTrigger value="market">Market</TabsTrigger>
                  <TabsTrigger value="stop">Stop</TabsTrigger>
                </TabsList>
                <TabsContent value="limit">
                  <OrderForm market={selectedMarket} orderType="limit" />
                </TabsContent>
                <TabsContent value="market">
                  <OrderForm market={selectedMarket} orderType="market" />
                </TabsContent>
                <TabsContent value="stop">
                  <OrderForm market={selectedMarket} orderType="stop" />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Open orders and order history */}
          <div className="bg-card rounded-lg shadow-sm p-4 border border-border mt-4">
            <Tabs defaultValue="open">
              <TabsList>
                <TabsTrigger value="open">Open Orders</TabsTrigger>
                <TabsTrigger value="filled">Order History</TabsTrigger>
              </TabsList>
              <TabsContent value="open">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Market</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Side</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Filled</th>
                        <th className="text-right py-3 px-4">Total</th>
                        <th className="text-right py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-muted-foreground">
                          No open orders
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
              <TabsContent value="filled">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Market</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Side</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Total</th>
                        <th className="text-right py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-muted-foreground">
                          No order history
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* Order form section - prefill if tradeSignal exists */}
        <div className="bg-card rounded-lg shadow-sm p-4 border border-border">
          <Tabs defaultValue={getDefaultOrderType(tradeSignal)}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="limit">Limit</TabsTrigger>
              <TabsTrigger value="market">Market</TabsTrigger>
              <TabsTrigger value="stop">Stop</TabsTrigger>
            </TabsList>
            <TabsContent value="limit">
              <OrderForm 
                market={selectedMarket} 
                orderType="limit" 
                prefilledValues={tradeSignal}
              />
            </TabsContent>
            <TabsContent value="market">
              <OrderForm 
                market={selectedMarket} 
                orderType="market" 
                prefilledValues={tradeSignal}
              />
            </TabsContent>
            <TabsContent value="stop">
              <OrderForm 
                market={selectedMarket} 
                orderType="stop" 
                prefilledValues={tradeSignal}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
