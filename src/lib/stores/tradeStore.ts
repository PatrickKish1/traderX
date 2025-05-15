import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: number;
  status: 'open' | 'closed';
  profit: number;
  takeProfit?: number;
  stopLoss?: number;
}

interface TradeStore {
  trades: Trade[];
  accountBalance: number;
  addTrade: (trade: Omit<Trade, 'id' | 'timestamp' | 'status' | 'profit'>) => void;
  closeTrade: (id: string, profit: number) => void;
  updateTradeProfit: (id: string, profit: number) => void;
}

export const useTradeStore = create(
  persist<TradeStore>(
    (set) => ({
      trades: [],
      accountBalance: 10000, // Initial balance
      addTrade: (trade) => set((state) => {
        const tradeAmount = trade.price * trade.amount;
        
        // Check if enough balance
        if (tradeAmount > state.accountBalance) {
          throw new Error('Insufficient balance');
        }
        
        return {
          trades: [...state.trades, {
            ...trade,
            id: Math.random().toString(36).substr(2, 9),
            timestamp: Date.now(),
            status: 'open',
            profit: 0,
          }],
          // Deduct trade amount from balance
          accountBalance: state.accountBalance - tradeAmount
        };
      }),
      closeTrade: (id, profit) => set((state) => ({
        trades: state.trades.map(t => 
          t.id === id ? { ...t, status: 'closed', profit } : t
        ),
        // Add profit/loss to balance
        accountBalance: state.accountBalance + profit
      })),
      updateTradeProfit: (id, profit) => set((state) => ({
        trades: state.trades.map(t =>
          t.id === id ? { ...t, profit } : t
        ),
      })),
    }),
    {
      name: 'trade-store',
    }
  )
);
