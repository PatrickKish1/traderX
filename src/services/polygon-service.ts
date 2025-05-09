/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { restClient } from '@polygon.io/client-js';

interface Token {
  ticker: string;
  name: string;
  baseCurrencySymbol: string;
  baseCurrencyName: string;
}

interface MarketData {
  symbol: string;
  currentPrice: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
}

class PolygonService {
  private rest: any;
  private cache: Map<string, any>;
  private tokenCache: Token[] | null = null;
  private lastTokenFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  constructor(apiKey: string) {
    apiKey = `${process.env.POLYGON_API_KEY}`
    this.rest = restClient(apiKey);
    this.cache = new Map();
  }

  async getAllCryptoTokens(): Promise<Token[]> {
    const now = Date.now();
    
    if (this.tokenCache && now - this.lastTokenFetch < this.CACHE_DURATION) {
        return this.tokenCache;
    }

    try {
        let allTokens: Token[] = [];
        let nextUrl: string | null = null;
        
        do {
        const response: {
            status: string;
            results?: Array<{
            ticker: string;
            name: string;
            base_currency_symbol: string;
            base_currency_name: string;
            }>;
            next_url?: string;
        } = nextUrl 
            ? await this.rest.reference.tickers({ url: nextUrl })
            : await this.rest.reference.tickers({
                market: "crypto",
                active: true,
                limit: 1000,
                order: "asc",
                sort: "ticker"
            });

        if (response.status !== "OK") {
            throw new Error(`Failed to fetch tokens: ${response.status}`);
        }

        const tokens = (response.results || [])
            .filter(t => t.ticker.startsWith("X:"))
            .map(t => ({
            ticker: t.ticker,
            name: t.name,
            baseCurrencySymbol: t.base_currency_symbol,
            baseCurrencyName: t.base_currency_name
            }));

        allTokens = [...allTokens, ...tokens];
        nextUrl = response.next_url || null;
        } while (nextUrl);

        this.tokenCache = allTokens;
        this.lastTokenFetch = now;

        return allTokens;
    } catch (error) {
        console.error('Error fetching crypto tokens:', error);
        throw error;
    }
    }

  async getCurrentData(symbol: string, marketType: string): Promise<MarketData> {
    const cacheKey = `current-${symbol}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let response;
      if (marketType === 'crypto') {
        // For crypto, we need to remove the "X:" prefix and split the pair
        const cleanSymbol = symbol.replace('X:', '');
        const [base, quote] = cleanSymbol.split(/(?=[A-Z]{3}$)/); // Split before the last 3 letters (USD, etc.)
        
        response = await this.rest.crypto.previousClose(`X:${cleanSymbol}`, { adjusted: true });
      } else {
        response = await this.rest.stocks.previousClose(symbol, { adjusted: true });
      }

      if (!response.results || response.results.length === 0) {
        throw new Error(`No market data available for ${symbol}`);
      }

      const result = response.results[0];
      const marketData: MarketData = {
        symbol,
        currentPrice: result.c,
        open: result.o,
        high: result.h,
        low: result.l,
        close: result.c,
        volume: result.v,
        timestamp: new Date(result.t).toISOString()
      };

      // Cache the result
      this.cache.set(cacheKey, marketData);
      setTimeout(() => this.cache.delete(cacheKey), this.CACHE_DURATION);

      return marketData;
    } catch (error) {
      console.error(`Error fetching current data for ${symbol}:`, error);
      throw error;
    }
  }

  async getDayData(symbol: string, marketType: string, date: string): Promise<MarketData> {
    const cacheKey = `day-${symbol}-${date}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      let response;
      if (marketType === 'crypto') {
        const cleanSymbol = symbol.replace('X:', '');
        const [base, quote] = cleanSymbol.split(/(?=[A-Z]{3}$)/);
        
        response = await this.rest.crypto.dailyOpenClose(base, quote, date, { adjusted: true });
      } else {
        response = await this.rest.stocks.dailyOpenClose(symbol, date, { adjusted: true });
      }

      if (!response) {
        throw new Error(`No market data available for ${symbol} on ${date}`);
      }

      const marketData: MarketData = {
        symbol,
        currentPrice: response.close,
        open: response.open,
        high: response.high || response.close, // Some APIs might not provide high/low
        low: response.low || response.open,
        close: response.close,
        volume: 0, // Daily endpoints might not provide volume
        timestamp: response.day
      };

      // Cache the result
      this.cache.set(cacheKey, marketData);
      setTimeout(() => this.cache.delete(cacheKey), this.CACHE_DURATION);

      return marketData;
    } catch (error) {
      console.error(`Error fetching day data for ${symbol} on ${date}:`, error);
      throw error;
    }
  }
}

// Create singleton instance
const polygonService = new PolygonService(process.env.POLYGON_API_KEY || '');
export default polygonService;