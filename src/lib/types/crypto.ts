import { Token } from '@coinbase/onchainkit/token';
export interface CryptoData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d?: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  circulating_supply: number;
  total_supply: number;
  ath: number;
  ath_change_percentage: number;
}
export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}
export interface TradeRequest {
  type: 'BUY' | 'SELL';
  token: string;
  token_amount: string;
  pair_token: string;
  slippage_bips: number;
  blockchain: string;
  user_address: string;
  order_type?: 'MARKET' | 'LIMIT' | 'STOP';
  price?: string;
  take_profit?: string;
  stop_loss?: string;
  lot_size?: number;
}
export interface TradeResponse {
  quoteId: string;
  inputAmount: string;
  outputAmount: string;
  price: string;
  fee: string;
  expiresAt: string;
  orderType?: 'MARKET' | 'LIMIT' | 'STOP';
}
export interface NewsItem {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
  summary: string;
}
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
export interface PredictionResult {
  token: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  reasoning: string;
}
export interface GameState {
  score: number;
  level: number;
  coins: number;
  gameOver: boolean;
  highScore: number;
}
export interface SwapState {
  fromToken: Token;
  toToken: Token;
  amount: string;
  isSwapping: boolean;
  error: string | null;
  success: boolean;
}
export interface OrderBookEntry {
  price: number;
  amount: number;
}
export interface OrderBook {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
}
export interface Order {
  id: string;
  type: 'BUY' | 'SELL' | 'BUY_LIMIT' | 'SELL_LIMIT' | 'BUY_STOP' | 'SELL_STOP';
  price: number;
  amount: number;
  lotSize: number;
  total: number;
  filled: number;
  status: 'open' | 'partial' | 'filled' | 'canceled' | 'triggered';
  timestamp: Date;
  takeProfitPrice?: number;
  stopLossPrice?: number;
  pair: string;
}
export interface TradingPair {
  base: string;
  quote: string;
  displayName: string;
}
export interface AISignal {
  id: string;
  token: string;
  type: 'BUY' | 'SELL';
  entryPrice: number;
  targetPrice: number;
  stopPrice: number;
  timestamp: Date;
  status: 'active' | 'completed' | 'stopped';
  roi?: number;
  confidence: number;
  reasoning: string;
}