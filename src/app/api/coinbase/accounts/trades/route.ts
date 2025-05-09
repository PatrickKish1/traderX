/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import { MOCK_DATA } from "@/lib/api/mock-data"

export async function GET(request: NextRequest) {
  try {
    const productId = request.nextUrl.searchParams.get("product_id") || "BTC-USD"
    productId.toString()

    // In a real implementation, you would call the Coinbase API with JWT auth
    // For this example, we'll return mock data
    return NextResponse.json({ trades: MOCK_DATA.tradeHistory })
  } catch (error: any) {
    console.error("Error fetching trades:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch trades" }, { status: 500 })
  }
}
