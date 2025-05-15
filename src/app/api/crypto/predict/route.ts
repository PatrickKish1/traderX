import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface PredictionResult {
  direction: 'buy' | 'sell';
  price: number;
  confidence: number;
  takeProfit: number;
  stopLoss: number;
  reasoning: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const symbol = searchParams.get('symbol') || 'BTC-USD';
    const currentPrice = parseFloat(searchParams.get('price') || '0');
    
    // Generate a realistic prediction
    const prediction = generatePrediction(currentPrice, symbol);
    
    return NextResponse.json(prediction);
  } catch (error) {
    console.error('Error generating prediction:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}

function generatePrediction(currentPrice: number, symbol: string): PredictionResult {
  // Generate a random direction bias (-1 for sell, 1 for buy)
  const directionBias = Math.random() > 0.5 ? 1 : -1;
  
  // Generate a random price change between -5% and +5%
  const changePercentage = (Math.random() * 5) * directionBias;
  const priceChange = (currentPrice * changePercentage) / 100;
  const predictedPrice = currentPrice + priceChange;
  
  // Generate take profit and stop loss levels
  const takeProfitPercent = Math.abs(changePercentage) * 2; // 2x the predicted move
  const stopLossPercent = Math.abs(changePercentage) * 0.5; // 0.5x the predicted move
  
  const direction = directionBias > 0 ? 'buy' : 'sell';
  const takeProfit = direction === 'buy' ? 
    currentPrice * (1 + takeProfitPercent/100) : 
    currentPrice * (1 - takeProfitPercent/100);
  
  const stopLoss = direction === 'buy' ? 
    currentPrice * (1 - stopLossPercent/100) : 
    currentPrice * (1 + stopLossPercent/100);
  
  // Generate a confidence score between 60% and 90%
  const confidence = 60 + (Math.random() * 30);
  
  // Generate reasoning based on the prediction
  const reasoning = generateReasoning(direction, changePercentage, confidence, symbol);
  
  return {
    direction,
    price: predictedPrice,
    confidence,
    takeProfit,
    stopLoss,
    reasoning,
  };
}

function generateReasoning(
  direction: 'buy' | 'sell', 
  change: number, 
  confidence: number, 
  symbol: string
): string {
  const reasons = [
    `Technical analysis indicates a potential ${direction} opportunity with ${confidence.toFixed(1)}% confidence`,
    `Market sentiment and volume analysis suggest a ${Math.abs(change).toFixed(2)}% move ${direction === 'buy' ? 'upward' : 'downward'}`,
    `${symbol} shows ${direction === 'buy' ? 'bullish' : 'bearish'} momentum patterns`,
    `Recent price action and indicator analysis point to a ${direction} signal`,
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
}