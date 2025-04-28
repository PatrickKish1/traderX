import { NewsItem } from '@/lib/types/crypto';
import { NextResponse } from 'next/server';
// This is a mock implementation since we don't have a real news API
export async function GET() {
  try {
    // In a real implementation, you would fetch from a news API
    // For example: const response = await fetch('https://crypto-news-api.com/news');
    
    // For now, we'll return mock data
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Bitcoin Surges Past $60,000 as Institutional Adoption Grows',
        url: 'https://example.com/bitcoin-surges',
        imageUrl: 'https://via.placeholder.com/150',
        source: 'CryptoNews',
        publishedAt: new Date().toISOString(),
        summary: 'Bitcoin has surged past $60,000 as institutional adoption continues to grow, with major companies adding the cryptocurrency to their balance sheets.',
      },
      {
        id: '2',
        title: 'Ethereum 2.0 Upgrade on Track for Q3 Completion',
        url: 'https://example.com/ethereum-upgrade',
        imageUrl: 'https://via.placeholder.com/150',
        source: 'BlockchainInsider',
        publishedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        summary: 'The Ethereum 2.0 upgrade is on track for completion in Q3, promising improved scalability and reduced energy consumption through proof-of-stake.',
      },
      {
        id: '3',
        title: 'Regulatory Clarity Coming for Crypto Markets, Says SEC Chair',
        url: 'https://example.com/regulatory-clarity',
        imageUrl: 'https://via.placeholder.com/150',
        source: 'CryptoDaily',
        publishedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        summary: 'The SEC Chair has indicated that regulatory clarity is coming for cryptocurrency markets, potentially paving the way for greater institutional adoption.',
      },
      {
        id: '4',
        title: 'DeFi Market Cap Exceeds $100 Billion for First Time',
        url: 'https://example.com/defi-market-cap',
        imageUrl: 'https://via.placeholder.com/150',
        source: 'DeFiPulse',
        publishedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
        summary: 'The total market capitalization of DeFi tokens has exceeded $100 billion for the first time, highlighting the growing importance of decentralized finance.',
      },
    ];
    return NextResponse.json(mockNews);
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto news' },
      { status: 500 }
    );
  }
}