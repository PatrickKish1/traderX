import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ status: 'ok' });
}


// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { type NextRequest, NextResponse } from "next/server"

// type RouteContext = {
//   params: {
//     orderId: string
//   }
// }

// export async function DELETE(
//   request: NextRequest,
//   context: RouteContext
// ) {
//   try {
//     const orderId = context.params.orderId

//     // In a real implementation, you would call the Coinbase API
//     // For this example, we'll return a success response

//     return NextResponse.json({
//       success: true,
//       order_id: orderId,
//     })
//   } catch (error: any) {
//     console.error("Error cancelling order:", error)
//     return NextResponse.json({ error: error.message || "Failed to cancel order" }, { status: 500 })
//   }
// }
