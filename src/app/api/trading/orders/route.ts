import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { type NextRequest, NextResponse } from "next/server"

// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//     const status = searchParams.get("status") || "all"
//     status.toString()

//     // In a real implementation, you would call the Coinbase API
//     // For this example, we'll return an empty array

//     return NextResponse.json({
//       orders: [],
//     })
//   } catch (error: any) {
//     console.error("Error fetching orders:", error)
//     return NextResponse.json({ error: error.message || "Failed to fetch orders" }, { status: 500 })
//   }
// }
