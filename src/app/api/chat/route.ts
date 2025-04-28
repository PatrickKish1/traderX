import { NextRequest, NextResponse } from 'next/server';

const OPENAI_API_KEY = `${process.env.OPEN_AI_API_KEY}`;

export async function POST(request: NextRequest) {
  try {
    const { message, threadId } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // Get current crypto market data to provide context to the AI
    const marketDataResponse = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false',
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    let marketContext = '';
    if (marketDataResponse.ok) {
      const marketData = await marketDataResponse.json();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      marketContext = 'Current market data:\n' + marketData.map((coin: any) => 
        `${coin.name} (${coin.symbol.toUpperCase()}): $${coin.current_price.toLocaleString()} (${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}% 24h)`
      ).join('\n');
    }
    
    // Check if the message is asking for a trade signal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isTradeRequest = 
    (message.toLowerCase().includes('buy') || message.toLowerCase().includes('sell')) && 
    (
        message.toLowerCase().includes('bitcoin') || message.toLowerCase().includes('btc') || 
        message.toLowerCase().includes('ethereum') || message.toLowerCase().includes('eth') ||
        message.toLowerCase().includes('solana') || message.toLowerCase().includes('sol')
    );
    
    // Check if the message is asking for a signal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const isSignalRequest = message.toLowerCase().includes('signal') || message.toLowerCase().includes('recommendation');
    
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a cryptocurrency trading assistant with expertise in market analysis, trading strategies, and blockchain technology. 
            
            Current date: ${new Date().toISOString().split('T')[0]}
            
            ${marketContext}
            
            Provide helpful, accurate information about cryptocurrency markets, trading, and blockchain technology. When discussing price predictions, be balanced and mention both potential upsides and risks. For trading advice, emphasize risk management and diversification.
            
            If the user asks for a trading signal or recommendation, or asks to buy/sell a specific cryptocurrency, you should generate a trade signal in the following format:
            
            TRADE_SIGNAL_START
            {
              "type": "BUY" or "SELL" or "BUY_LIMIT" or "SELL_LIMIT" or "BUY_STOP" or "SELL_STOP",
              "token": "BTC" or "ETH" or "SOL" etc.,
              "amount": "0.1" or other appropriate amount,
              "lotSize": 1 or 2 or 5 or 10,
              "price": "50000" (for limit/stop orders),
              "takeProfitPrice": "55000",
              "stopLossPrice": "48000",
              "pair": "BTC/USDC" or other appropriate pair
            }
            TRADE_SIGNAL_END
            
            Include this JSON block in your response, and then continue with your normal explanation of the trade recommendation.
            `
          },
          {
            role: 'user',
            content: message
          }
        ]
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from AI');
    }
    
    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    return NextResponse.json({ response: aiResponse, threadId });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process chat message' },
      { status: 500 }
    );
  }
}
