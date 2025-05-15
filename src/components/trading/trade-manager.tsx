"use client"

import { useCallback, useEffect } from 'react';
import { useTradeStore } from '@/lib/stores/tradeStore';
import { Button } from '@/components/ui/button';
import { formatDistance } from 'date-fns';
import { coinbaseApi } from '@/lib/coinbase-api';
import { toast } from 'sonner';

export default function TradeManager() {
  const { trades, closeTrade, updateTradeProfit, accountBalance } = useTradeStore();

  const handleCloseTrade = useCallback((tradeId: string, profit: number, reason?: string) => {
    closeTrade(tradeId, profit);
    
    const trade = trades.find(t => t.id === tradeId);
    if (trade) {
      const message = reason || 'Trade closed manually';
      toast.success(message, {
        description: `${trade.type.toUpperCase()} ${trade.symbol} closed with ${profit >= 0 ? 'profit' : 'loss'}: $${profit.toFixed(2)}`
      });
    }
  }, [closeTrade, trades]);

  useEffect(() => {
    // Set up price monitoring for open trades
    const monitorTrades = async () => {
      const openTrades = trades.filter(t => t.status === 'open');
      
      for (const trade of openTrades) {
        try {
          // Get current market price
          const priceData = await coinbaseApi.getBestBidAsk([trade.symbol]);
          const currentPrice = parseFloat(priceData.pricebooks[trade.symbol].asks[0].price);

          // Calculate profit/loss
          const priceDiff = currentPrice - trade.price;
          const profit = trade.type === 'buy' ? 
            priceDiff * trade.amount : 
            -priceDiff * trade.amount;

          // Update trade profit
          updateTradeProfit(trade.id, profit);

          // Check take profit and stop loss conditions
          if (trade.takeProfit && trade.type === 'buy' && currentPrice >= trade.takeProfit) {
            handleCloseTrade(trade.id, profit, 'Take profit triggered');
          } else if (trade.takeProfit && trade.type === 'sell' && currentPrice <= trade.takeProfit) {
            handleCloseTrade(trade.id, profit, 'Take profit triggered');
          } else if (trade.stopLoss && trade.type === 'buy' && currentPrice <= trade.stopLoss) {
            handleCloseTrade(trade.id, profit, 'Stop loss triggered');
          } else if (trade.stopLoss && trade.type === 'sell' && currentPrice >= trade.stopLoss) {
            handleCloseTrade(trade.id, profit, 'Stop loss triggered');
          }
        } catch (error) {
          console.error(`Error monitoring trade ${trade.id}:`, error);
        }
      }
    };

    const interval = setInterval(monitorTrades, 1000);
    return () => clearInterval(interval);
  }, [trades, updateTradeProfit, handleCloseTrade]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Account Balance</h2>
        <span className="text-xl font-bold">${accountBalance.toFixed(2)}</span>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Open Trades</h3>
        {trades.filter(t => t.status === 'open').map(trade => (
          <div key={trade.id} className="bg-card p-4 rounded-lg border border-border">
            <div className="flex justify-between items-start">
              <div>
                <span className={`text-sm font-medium ${
                  trade.type === 'buy' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {trade.type.toUpperCase()} {trade.symbol}
                </span>
                <div className="text-sm text-muted-foreground">
                  Amount: {trade.amount} @ ${trade.price.toFixed(2)}
                </div>
                {trade.takeProfit && (
                  <div className="text-sm text-green-500">
                    TP: ${trade.takeProfit.toFixed(2)}
                  </div>
                )}
                {trade.stopLoss && (
                  <div className="text-sm text-red-500">
                    SL: ${trade.stopLoss.toFixed(2)}
                  </div>
                )}
                <div className="text-sm text-muted-foreground">
                  {formatDistance(trade.timestamp, new Date(), { addSuffix: true })}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-medium ${
                  trade.profit >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  ${trade.profit.toFixed(2)}
                </div>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleCloseTrade(trade.id, trade.profit)}
                >
                  Close Trade
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}