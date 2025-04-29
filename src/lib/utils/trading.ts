import { TradeRequest } from '@/lib/types/crypto';

export function getFullCoinName(symbol: string): string {
  const coinMap: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'ADA': 'cardano',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'MATIC': 'matic-network',
    'AAVE': 'aave',
    'COMP': 'compound-governance-token',
    'SNX': 'synthetix-network-token',
    'MKR': 'maker',
    'YFI': 'yearn-finance',
    'SUSHI': 'sushi',
    'CRV': 'curve-dao-token',
    'BAL': 'balancer',
    '1INCH': '1inch',
  };
  
  return coinMap[symbol.toUpperCase()] || 'bitcoin';
}

export function getChainId(blockchain: string): string {
  const chainMap: Record<string, string> = {
    'BASE': '8453',
    'POLYGON': '137',
    'ARBITRUM': '42161',
    'WORLD': '1',
  };
  
  return chainMap[blockchain.toUpperCase()] || '1';
}

export function calculateSellAmount(tradeRequest: TradeRequest): string {
  const amount = parseFloat(tradeRequest.token_amount);
  const lotSize = tradeRequest.lot_size || 1;
  
  // Convert to base units (e.g., wei for ETH)
  const decimals = getTokenDecimals(tradeRequest.token);
  const baseUnits = amount * lotSize * Math.pow(10, decimals);
  
  return baseUnits.toString();
}

function getTokenDecimals(symbol: string): number {
  const decimalMap: Record<string, number> = {
    'BTC': 8,
    'ETH': 18,
    'USDC': 6,
    'USDT': 6,
    'DAI': 18,
    'SOL': 9,
    'ADA': 6,
    'DOT': 10,
    'AVAX': 18,
    'XRP': 6,
    'DOGE': 8,
    'LINK': 18,
    'UNI': 18,
    'MATIC': 18,
    'AAVE': 18,
    'COMP': 18,
    'SNX': 18,
    'MKR': 18,
    'YFI': 18,
    'SUSHI': 18,
    'CRV': 18,
    'BAL': 18,
    '1INCH': 18,
  };
  
  return decimalMap[symbol.toUpperCase()] || 18;
}