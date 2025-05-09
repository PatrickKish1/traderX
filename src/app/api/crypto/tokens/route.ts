import { NextResponse } from 'next/server';
import polygonService from '@/services/polygon-service';

export async function GET() {
  try {
    const tokens = await polygonService.getAllCryptoTokens();
    
    // Format tokens for the search component
    const formattedTokens = tokens.map(token => ({
      id: token.ticker, // Keep the full ticker (X:BTCUSD)
      symbol: token.ticker.replace('X:', ''), // Display without X: prefix
      name: token.baseCurrencyName
    }));

    return NextResponse.json(formattedTokens);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    );
  }
}



// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextResponse } from 'next/server';

// interface CryptoToken {
//   id: string;
//   symbol: string;
//   name: string;
// }

// // Cache the response for 5 minutes
// let cachedData: CryptoToken[] | null = null;
// let lastFetchTime: number | null = null;
// const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// export async function GET() {
//   try {
//     // Return cached data if valid
//     if (cachedData && lastFetchTime && (Date.now() - lastFetchTime) < CACHE_DURATION) {
//       return NextResponse.json(cachedData);
//     }

//     // Prevent multiple simultaneous requests
//     if (lastFetchTime && (Date.now() - lastFetchTime) < 1000) {
//       if (cachedData) return NextResponse.json(cachedData);
//       await new Promise(resolve => setTimeout(resolve, 1000));
//     }

//     const [listResponse, marketsResponse] = await Promise.all([
//       fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=false', {
//         headers: {
//           'Accept': 'application/json',
//           'Cache-Control': 'no-cache'
//         }
//       }),
//       fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&sparkline=false', {
//         headers: {
//           'Accept': 'application/json',
//           'Cache-Control': 'no-cache'
//         }
//       })
//     ]);

//     if (!listResponse.ok || !marketsResponse.ok) {
//       throw new Error('Failed to fetch token data');
//     }

//     const tokens: CryptoToken[] = await listResponse.json();
//     const markets = await marketsResponse.json();
//     const topTokenIds = new Set(markets.map((t: any) => t.id));

//     const filteredTokens = tokens
//       .filter(token => topTokenIds.has(token.id))
//       .map(token => ({
//         id: token.id,
//         symbol: token.symbol.toUpperCase(),
//         name: token.name
//       }));

//     // Update cache
//     cachedData = filteredTokens;
//     lastFetchTime = Date.now();

//     return NextResponse.json(filteredTokens);
//   } catch (error) {
//     console.error('Error fetching token list:', error);
//     // Return cached data if available
//     if (cachedData) {
//       return NextResponse.json(cachedData);
//     }
//     return NextResponse.json({ error: 'Failed to fetch token list' }, { status: 500 });
//   }
// }
