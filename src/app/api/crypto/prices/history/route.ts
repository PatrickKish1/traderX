import { NextRequest, NextResponse } from 'next/server';
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const coinId = searchParams.get('coinId');
  const days = searchParams.get('days') || '7';
  if (!coinId) {
    return NextResponse.json(
      { error: 'Coin ID is required' },
      { status: 400 }
    );
  }
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch crypto history');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching crypto history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crypto history' },
      { status: 500 }
    );
  }
}