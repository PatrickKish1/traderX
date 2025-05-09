/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { MOCK_DATA } from "@/lib/api/mock-data"

export async function GET() {
  try {
    // In a real implementation, you would call the Coinbase API with JWT auth
    // For this example, we'll return mock data
    return NextResponse.json({ products: MOCK_DATA.markets })
  } catch (error: any) {
    console.error("Error fetching markets:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch markets" }, { status: 500 })
  }
}
