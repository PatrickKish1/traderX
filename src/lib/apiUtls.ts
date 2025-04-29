import { ChartData, CryptoData, NewsItem, PredictionResult, TradeRequest, TradeResponse } from "./types/crypto";


// Fetch current prices for top cryptocurrencies
export const fetchCryptoPrices = async (): Promise<CryptoData[]> => {
  try {
    const response = await fetch('/api/crypto/prices');
    if (!response.ok) {
      throw new Error('Failed to fetch crypto prices');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return [];
  }
};
// Fetch historical price data for a specific cryptocurrency
export const fetchCryptoHistory = async (
  coinId: string,
  days: number = 7
): Promise<ChartData> => {
  try {
    const response = await fetch(`/api/crypto/history?coinId=${coinId}&days=${days}`);
    if (!response.ok) {
      throw new Error('Failed to fetch crypto history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return { prices: [], market_caps: [], total_volumes: [] };
  }
};

export const fetchCryptoNews = async (): Promise<NewsItem[]> => {
  try {
    const response = await fetch('/api/crypto/news');
    if (!response.ok) {
      throw new Error('Failed to fetch crypto news');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return [];
  }
};
// Execute a trade
export const executeTrade = async (tradeRequest: TradeRequest): Promise<TradeResponse> => {
  try {
    const response = await fetch('/api/trading/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tradeRequest),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to execute trade');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error executing trade:', error);
    throw error;
  }
};
// Get price prediction for a cryptocurrency
export const getPricePrediction = async (
  symbol: string,
  timeframe: string
): Promise<PredictionResult> => {
  try {
    const response = await fetch(`/api/crypto/predict?symbol=${symbol}&timeframe=${timeframe}`);
    if (!response.ok) {
      throw new Error('Failed to get price prediction');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting price prediction:', error);
    throw error;
  }
};
// Send message to AI assistant
export const sendChatMessage = async (message: string): Promise<string> => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to send message to AI assistant');
    }
    
    const data = await response.json();
    return data.response;
  } catch (error) {
    console.error('Error sending chat message:', error);
    throw error;
  }
};