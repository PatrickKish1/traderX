export const MOCK_DATA = {
    markets: [
      { id: "BTC-USD", base_currency: "BTC", quote_currency: "USD", price: 65432.1, price_change_24h: 2.45 },
      { id: "ETH-USD", base_currency: "ETH", quote_currency: "USD", price: 3456.78, price_change_24h: -1.23 },
      { id: "SOL-USD", base_currency: "SOL", quote_currency: "USD", price: 123.45, price_change_24h: 5.67 },
      { id: "ADA-USD", base_currency: "ADA", quote_currency: "USD", price: 0.45, price_change_24h: 3.21 },
      { id: "DOGE-USD", base_currency: "DOGE", quote_currency: "USD", price: 0.12, price_change_24h: 7.89 },
    ],
    accounts: [
      {
        uuid: "8bfc20d7-f7c6-4422-bf07-8243ca4169fe",
        name: "USD Wallet",
        currency: "USD",
        available_balance: { value: "10000.00", currency: "USD" },
        hold: { value: "0.00", currency: "USD" },
      },
      {
        uuid: "7afc20d7-f7c6-4422-bf07-8243ca4169fe",
        name: "BTC Wallet",
        currency: "BTC",
        available_balance: { value: "0.5", currency: "BTC" },
        hold: { value: "0.00", currency: "BTC" },
      },
      {
        uuid: "6afc20d7-f7c6-4422-bf07-8243ca4169fe",
        name: "ETH Wallet",
        currency: "ETH",
        available_balance: { value: "5.0", currency: "ETH" },
        hold: { value: "0.00", currency: "ETH" },
      },
    ],
    orderBook: {
      bids: Array.from({ length: 10 }, (_, i) => ({
        price: (65000 - i * 10).toString(),
        size: (Math.random() * 2).toFixed(6),
      })),
      asks: Array.from({ length: 10 }, (_, i) => ({
        price: (65100 + i * 10).toString(),
        size: (Math.random() * 2).toFixed(6),
      })),
    },
    tradeHistory: Array.from({ length: 20 }, (_, i) => ({
      trade_id: i.toString(),
      price: (65000 + (Math.random() * 200 - 100)).toString(),
      size: (Math.random() * 1).toFixed(6),
      time: new Date(Date.now() - i * 60000).toISOString(),
      side: Math.random() > 0.5 ? "buy" : "sell",
    })),
  }
  