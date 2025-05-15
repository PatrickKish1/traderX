/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server"
import { makeCoinbaseRequest } from "@/lib/coinbase-auth"

export async function GET() {
  try {
    // Try to get a list of accounts as a test
    const result = await makeCoinbaseRequest("GET", "/api/v3/brokerage/accounts")
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Coinbase API test error:", error)
    return NextResponse.json({ error: `Coinbase API test error: ${error.message}` }, { status: 500 })
  }
}
