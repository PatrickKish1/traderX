'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  CircleDollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  ExternalLink, 
  BarChart4,
  PieChart,
  Wallet,
  History,
  RefreshCw
} from 'lucide-react';
import { formatPrice, formatPercentage } from '@/lib/utils/trading';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import LoadingSpinner from '@/components/loader-spinner';

// Mock portfolio data
const portfolioData = [
  { name: 'Bitcoin', symbol: 'BTC', value: 0.5, price: 36000, change: 2.3, color: '#F7931A' },
  { name: 'Ethereum', symbol: 'ETH', value: 4.2, price: 2000, change: -1.1, color: '#627EEA' },
  { name: 'Solana', symbol: 'SOL', value: 20, price: 80, change: 5.2, color: '#00FFA3' },
  { name: 'Cardano', symbol: 'ADA', value: 1000, price: 0.5, change: -0.8, color: '#0033AD' },
  { name: 'US Dollar', symbol: 'USD', value: 2500, price: 1, change: 0, color: '#85bb65' },
];

// Mock historical data
const historicalData = [
  { date: '2023-01-01', value: 15000 },
  { date: '2023-02-01', value: 16200 },
  { date: '2023-03-01', value: 14800 },
  { date: '2023-04-01', value: 18500 },
  { date: '2023-05-01', value: 17800 },
  { date: '2023-06-01', value: 19200 },
  { date: '2023-07-01', value: 21000 },
  { date: '2023-08-01', value: 20500 },
  { date: '2023-09-01', value: 22800 },
  { date: '2023-10-01', value: 21700 },
  { date: '2023-11-01', value: 24000 },
  { date: '2023-12-01', value: 26500 },
];

// Mock transaction history
const transactionHistory = [
  { id: 1, type: 'BUY', asset: 'BTC', amount: 0.1, price: 35000, date: '2023-12-10T10:15:00Z' },
  { id: 2, type: 'SELL', asset: 'ETH', amount: 1.5, price: 2100, date: '2023-12-05T14:30:00Z' },
  { id: 3, type: 'BUY', asset: 'SOL', amount: 10, price: 75, date: '2023-11-28T09:45:00Z' },
  { id: 4, type: 'BUY', asset: 'ETH', amount: 2.0, price: 1950, date: '2023-11-20T16:20:00Z' },
  { id: 5, type: 'SELL', asset: 'ADA', amount: 500, price: 0.52, date: '2023-11-15T11:10:00Z' },
];

export default function PortfolioPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // Mock connected state - in a real app, this would use wallet connection state
  const isConnected = true;
  
  // Calculate portfolio totals
  const totalValue = portfolioData.reduce((sum, asset) => sum + (asset.value * asset.price), 0);
  const totalChange = portfolioData.reduce((sum, asset) => {
    const assetValue = asset.value * asset.price;
    const assetChangeValue = assetValue * (asset.change / 100);
    return sum + assetChangeValue;
  }, 0);
  const totalChangePercent = (totalChange / (totalValue - totalChange)) * 100;
  
  // Prepare data for pie chart
  const pieData = portfolioData.map(asset => ({
    name: asset.symbol,
    value: asset.value * asset.price,
    color: asset.color,
  }));
  
  useEffect(() => {
    // Redirect to home if wallet is not connected
    if (!isConnected) {
      router.push('/');
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [isConnected, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <h1 className="text-2xl font-bold mb-4">Wallet Connection Required</h1>
        <p className="mb-6 text-muted-foreground">
          Please connect your wallet to access your portfolio.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8 px-4 sm:px-6 mb-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Portfolio</h1>
          <Button className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                Total Balance
              </CardTitle>
              <CardDescription>
                Current portfolio value
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatPrice(totalValue)}</div>
              <div className={`flex items-center mt-1 ${totalChangePercent >= 0 ? 'text-chart-2' : 'text-destructive'}`}>
                {totalChangePercent >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                )}
                <span>
                  {formatPercentage(Math.abs(totalChangePercent))} ({formatPrice(Math.abs(totalChange))})
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CircleDollarSign className="h-5 w-5 text-primary" />
                Best Performer
              </CardTitle>
              <CardDescription>
                Highest gaining asset
              </CardDescription>
            </CardHeader>
            <CardContent>
              {(() => {
                const bestAsset = [...portfolioData].sort((a, b) => b.change - a.change)[0];
                return (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold">{bestAsset.symbol}</span>
                      <span className="text-xl">{formatPrice(bestAsset.price)}</span>
                    </div>
                    <div className="text-chart-2 flex items-center mt-1">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      <span>{formatPercentage(bestAsset.change)}</span>
                    </div>
                  </>
                );
              })()}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
                Trading Volume
              </CardTitle>
              <CardDescription>
                30-day trading activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatPrice(125000)}</div>
              <div className="text-muted-foreground mt-1">
                25 transactions this month
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs */}
        <Tabs defaultValue="assets" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="assets" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Assets
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <BarChart4 className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Transactions
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="assets">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Asset Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="w-full overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Asset</th>
                          <th className="text-right py-3 px-4">Holdings</th>
                          <th className="text-right py-3 px-4">Price</th>
                          <th className="text-right py-3 px-4">Value</th>
                          <th className="text-right py-3 px-4">24h</th>
                          <th className="text-right py-3 px-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {portfolioData.map((asset, index) => (
                          <tr key={index} className="border-b last:border-b-0 hover:bg-muted/40">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full" style={{ backgroundColor: asset.color }}></div>
                                <div>
                                  <div className="font-medium">{asset.symbol}</div>
                                  <div className="text-sm text-muted-foreground">{asset.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="text-right py-4 px-4">
                              {asset.symbol === 'USD' 
                                ? formatPrice(asset.value) 
                                : `${asset.value.toLocaleString(undefined, { 
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 8
                                  })}`}
                            </td>
                            <td className="text-right py-4 px-4">
                              {formatPrice(asset.price)}
                            </td>
                            <td className="text-right py-4 px-4 font-medium">
                              {formatPrice(asset.value * asset.price)}
                            </td>
                            <td className={`text-right py-4 px-4 ${
                              asset.change > 0 ? 'text-chart-2' : 
                              asset.change < 0 ? 'text-destructive' : ''
                            }`}>
                              {asset.change !== 0 && (
                                <div className="flex items-center justify-end">
                                  {asset.change > 0 ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                  )}
                                  {formatPercentage(Math.abs(asset.change))}
                                </div>
                              )}
                            </td>
                            <td className="text-right py-4 px-4">
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => router.push('/trade')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-square w-full h-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [formatPrice(value), 'Value']}
                          labelFormatter={(index: number) => pieData[index].name}
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-6 space-y-2">
                    {pieData.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: entry.color }}
                          ></div>
                          <span className="text-sm">{entry.name}</span>
                        </div>
                        <span className="text-sm font-medium">
                          {((entry.value / totalValue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-96 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={historicalData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(date) => new Date(date).toLocaleDateString([], { month: 'short' })}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          tickFormatter={(value) => formatPrice(value)} 
                          width={80}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatPrice(value), 'Portfolio Value']}
                          labelFormatter={(date) => new Date(date).toLocaleDateString([], { 
                            year: 'numeric', 
                            month: 'long',
                            day: 'numeric'
                          })}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="hsl(var(--chart-1))" 
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "hsl(var(--chart-1))", stroke: 'hsl(var(--background))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Performance Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="text-sm text-muted-foreground mb-1">Return on Investment</h4>
                    <div className="text-2xl font-bold">+76.67%</div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">All Time High</span>
                      <span className="font-medium">{formatPrice(28500)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">All Time Low</span>
                      <span className="font-medium">{formatPrice(14800)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Starting Value</span>
                      <span className="font-medium">{formatPrice(15000)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Current Value</span>
                      <span className="font-medium">{formatPrice(totalValue)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Total Profit/Loss</span>
                      <span className="font-medium text-chart-2">{formatPrice(totalValue - 15000)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Asset</th>
                        <th className="text-right py-3 px-4">Amount</th>
                        <th className="text-right py-3 px-4">Price</th>
                        <th className="text-right py-3 px-4">Total</th>
                        <th className="text-right py-3 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((tx) => (
                        <tr key={tx.id} className="border-b last:border-b-0 hover:bg-muted/40">
                          <td className="py-4 px-4">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.type === 'BUY' 
                                ? 'bg-chart-2/10 text-chart-2' 
                                : 'bg-destructive/10 text-destructive'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            {tx.asset}
                          </td>
                          <td className="text-right py-4 px-4">
                            {tx.amount.toLocaleString(undefined, { 
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 8
                            })}
                          </td>
                          <td className="text-right py-4 px-4">
                            {formatPrice(tx.price)}
                          </td>
                          <td className="text-right py-4 px-4 font-medium">
                            {formatPrice(tx.amount * tx.price)}
                          </td>
                          <td className="text-right py-4 px-4">
                            <Button variant="ghost" size="icon">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <Button variant="outline">Load More Transactions</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}