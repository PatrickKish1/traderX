/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { NewsItem } from '@/lib/types/crypto';

const CRYPTO_PANIC_API_KEY = process.env.CRYPTO_PANIC_API_KEY;

export async function GET() {
  try {
    // Fetch real-time crypto news from CryptoPanic API
    const response = await fetch(
      `https://cryptopanic.com/api/v1/posts/?auth_token=${CRYPTO_PANIC_API_KEY}&filter=hot&currencies=BTC,ETH,SOL,ADA,DOT,AVAX`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }
      }
    );

    if (!response.ok) {
      throw new Error(`CryptoPanic API responded with status ${response.status}`);
    }

    const data = await response.json();

    const newsItems: NewsItem[] = data.results.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      imageUrl: item.metadata?.image,
      source: item.source.domain,
      publishedAt: item.published_at,
      summary: item.metadata?.description || '',
      importance: item.votes?.important || 0,
      positiveSentiment: item.votes?.positive || 0,
      negativeSentiment: item.votes?.negative || 0,
      currencies: item.currencies.map((c: any) => c.code)
    }));

    // Sort by importance and recency
    const sortedNews = newsItems.sort((a, b) => {
      // First sort by importance (higher first)
      const importanceDiff = (b.importance || 0) - (a.importance || 0);
      if (importanceDiff !== 0) return importanceDiff;
      
      // Then sort by recency (newer first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    return NextResponse.json(sortedNews);
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    
    // Fallback to CoinGecko API if primary fails
    try {
      const fallbackResponse = await fetch(
        'https://api.coingecko.com/api/v3/news',
        {
          headers: {
            'Accept': 'application/json',
          }
        }
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        const fallbackNews: NewsItem[] = fallbackData.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          url: item.url,
          imageUrl: item.thumb_2x || '/crypto-news-placeholder.jpg',
          source: item.news_site,
          publishedAt: item.updated_at,
          summary: item.description,
        }));
        return NextResponse.json(fallbackNews);
      }
    } catch (fallbackError) {
      console.error('Fallback news fetch failed:', fallbackError);
    }

    return NextResponse.json(
      { error: 'Failed to fetch crypto news' },
      { status: 500 }
    );
  }
}