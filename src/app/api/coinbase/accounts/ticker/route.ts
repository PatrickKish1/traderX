/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { MOCK_DATA } from "@/lib/api/mock-data"

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("product_id") || "BTC-USD"

    // In a real implementation, you would call the Coinbase API with JWT auth
    // For this example, we'll return mock data
    const market = MOCK_DATA.markets.find((m) => m.id === productId)
    return NextResponse.json({ price: market?.price.toString() || "0" })
  } catch (error: any) {
    console.error("Error fetching ticker:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch ticker" }, { status: 500 })
  }
}
