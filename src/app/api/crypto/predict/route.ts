import { PredictionResult } from '@/lib/types/crypto';
import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol') || 'BTC';
  const timeframe = searchParams.get('timeframe') || '24h';
  try {
    // In a real implementation, you would use a machine learning model or external API
    // For this example, we'll generate a mock prediction
    
    // Get current price from CoinGecko
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${getFullCoinName(symbol)}&vs_currencies=usd`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch current price');
    }
    const data = await response.json();
    const coinId = getFullCoinName(symbol);
    const currentPrice = data[coinId]?.usd || 50000; // Fallback price if API fails
    
    // Generate a mock prediction
    const prediction = generateMockPrediction(symbol, currentPrice, timeframe);
    
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error generating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}
function getFullCoinName(symbol: string): string {
  const coinMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
  };
  
  return coinMap[symbol.toUpperCase()] || 'bitcoin';
}
function generateMockPrediction(symbol: string, currentPrice: number, timeframe: string): PredictionResult {
  // Generate a random price change between -10% and +15%
  const changePercentage = (Math.random() * 25) - 10;
  const priceChange = (currentPrice * changePercentage) / 100;
  const predictedPrice = currentPrice + priceChange;
  
  const confidence = 60 + (Math.random() * 30);
  
  let reasoning = '';
  if (predictedPrice > currentPrice) {
    reasoning = `Based on technical analysis of ${symbol} price patterns, market sentiment indicators, and on-chain metrics, I'm seeing bullish signals. Trading volume has been increasing, and there's positive momentum in the market. Additionally, recent developments in the ${symbol} ecosystem suggest growing adoption.`;
  } else {
    reasoning = `Analysis of ${symbol} price action shows some bearish indicators in the short term. Market sentiment has been cautious, and there's been some selling pressure. Technical indicators suggest a potential retracement before continuing the long-term uptrend. However, fundamentals remain strong for the long term.`;
  }
  
  return {
    token: symbol,
    currentPrice,
    predictedPrice,
    confidence,
    timeframe,
    reasoning,
  };
}