// src/app/api/trading/execute/route.ts
import { TradeRequest, TradeResponse } from '@/lib/types/crypto';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { 
  getFullCoinName, 
  getChainId, 
  calculateSellAmount 
} from '@/lib/utils/trading';

export async function POST(request: NextRequest) {
  try {
    const tradeRequest: TradeRequest = await request.json();
    
    // Validate the trade request
    if (!tradeRequest.token || !tradeRequest.token_amount || !tradeRequest.user_address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const coinId = getFullCoinName(tradeRequest.token);
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`,
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
    const currentPrice = data[coinId]?.usd || 50000; // Fallback price if API fails
    
    // Use limit price if provided, otherwise use current price
    const price = tradeRequest.order_type === 'LIMIT' && tradeRequest.price 
      ? parseFloat(tradeRequest.price) 
      : currentPrice;
    
    const tokenAmount = parseFloat(tradeRequest.token_amount);
    const lotSize = tradeRequest.lot_size || 1;
    const totalValue = tokenAmount * price * lotSize;
    const fee = totalValue * 0.001;
    
    // Create a mock trade response
    const tradeResponse: TradeResponse = {
      quoteId: uuidv4(),
      inputAmount: (tokenAmount * lotSize).toString(),
      outputAmount: tradeRequest.type === 'BUY' 
        ? (totalValue + fee).toFixed(2)
        : (totalValue - fee).toFixed(2),
      price: price.toFixed(2),
      fee: fee.toFixed(2),
      expiresAt: new Date(Date.now() + 60000).toISOString(), // Expires in 1 minute
      orderType: tradeRequest.order_type || 'MARKET'
    };
    
    // In a real implementation, you would execute the trade here
    // For example, by calling a DEX API or smart contract
    
    // For Universal.xyz API integration, you would use:
    const universalResponse = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'www.universal.xyz',
        path: '/api/v1/quote',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_API_KEY',
        },
        method: 'POST',
        body: JSON.stringify({
          type: tradeRequest.type,
          token: tradeRequest.token,
          token_amount: tradeRequest.token_amount,
          pair_token: tradeRequest.pair_token,
          slippage_bips: tradeRequest.slippage_bips,
          blockchain: tradeRequest.blockchain,
          user_address: tradeRequest.user_address,
          order_type: tradeRequest.order_type,
          price: tradeRequest.price,
          take_profit: tradeRequest.take_profit,
          stop_loss: tradeRequest.stop_loss,
          lot_size: tradeRequest.lot_size
        }),
      }),
    });
    
    const universalData = await universalResponse.json();
    console.error(`${universalData}`)
    
    // For 0x API integration, you would use:
    const zeroExResponse = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'api.0x.org',
        path: '/swap/permit2/quote',
        headers: {
          'Content-Type': 'application/json',
          '0x-api-key': 'b5e6c5d1-4c61-4c07-a2a9-36c576415769',
          '0x-version': 'v2',
        },
        method: 'GET',
        body: JSON.stringify({
          chainId: getChainId(tradeRequest.blockchain),
          sellToken: tradeRequest.type === 'SELL' ? tradeRequest.token : tradeRequest.pair_token,
          buyToken: tradeRequest.type === 'BUY' ? tradeRequest.token : tradeRequest.pair_token,
          sellAmount: calculateSellAmount(tradeRequest),
          takerAddress: tradeRequest.user_address,
        }),
      }),
    });
    
    const zeroExData = await zeroExResponse.json();
    console.error(`${zeroExData}`)
    
    return NextResponse.json(tradeResponse);
  } catch (error) {
    console.error('Error executing trade:', error);
    return NextResponse.json(
      { error: 'Failed to execute trade' },
      { status: 500 }
    );
  }
}