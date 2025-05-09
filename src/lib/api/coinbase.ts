// Mock data for development
const MOCK_DATA = {
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
  
  // Helper function to make API requests through our server-side API route
  const makeRequest = async (endpoint: string, options: RequestInit = {}) => {
    try {
      // For development, return mock data
      if (process.env.NODE_ENV === "development") {
        return mockResponse(endpoint)
      }
  
      const response = await fetch(`/api/coinbase/${endpoint}`, options)
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `API request failed with status ${response.status}`)
      }
  
      return await response.json()
    } catch (error) {
      console.error(`Error making request to ${endpoint}:`, error)
      throw error
    }
  }
  
  // Mock response for development
  const mockResponse = (endpoint: string) => {
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        if (endpoint.includes("products")) {
          resolve(MOCK_DATA.markets)
        } else if (endpoint.includes("accounts")) {
          resolve(MOCK_DATA.accounts)
        } else if (endpoint.includes("product_book")) {
          resolve({ pricebook: MOCK_DATA.orderBook })
        } else if (endpoint.includes("trades")) {
          resolve(MOCK_DATA.tradeHistory)
        } else {
          resolve({})
        }
      }, 500)
    })
  }
  
  // API Functions
  export const fetchMarkets = async () => {
    try {
      const data = await makeRequest("markets")
      return data.products || MOCK_DATA.markets
    } catch (error) {
      console.error("Error fetching markets:", error)
      return MOCK_DATA.markets
    }
  }
  
  export const fetchAccounts = async () => {
    try {
      const data = await makeRequest("accounts")
      return data.accounts || MOCK_DATA.accounts
    } catch (error) {
      console.error("Error fetching accounts:", error)
      return MOCK_DATA.accounts
    }
  }
  
  export const fetchOrderBook = async (productId: string) => {
    try {
      const data = await makeRequest(`orderbook?product_id=${productId}`)
      return data.pricebook || MOCK_DATA.orderBook
    } catch (error) {
      console.error("Error fetching order book:", error)
      return MOCK_DATA.orderBook
    }
  }
  
  export const fetchTradeHistory = async (productId: string) => {
    try {
      const data = await makeRequest(`trades?product_id=${productId}`)
      return data.trades || MOCK_DATA.tradeHistory
    } catch (error) {
      console.error("Error fetching trade history:", error)
      return MOCK_DATA.tradeHistory
    }
  }
  
  export const fetchMarketPrice = async (productId: string) => {
    try {
      const data = await makeRequest(`ticker?product_id=${productId}`)
      return Number.parseFloat(data.price || "0") || MOCK_DATA.markets.find((m) => m.id === productId)?.price || 0
    } catch (error) {
      console.error("Error fetching market price:", error)
      return MOCK_DATA.markets.find((m) => m.id === productId)?.price || 0
    }
  }
  