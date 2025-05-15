/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server"
import * as jwt from "jsonwebtoken"
import * as crypto from "crypto"
import { headers } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    // Add CORS headers
    const headersList = headers();
    const origin = (await headersList).get('origin') || '';
    
    // Parse request body safely
    const body = await request.json().catch(() => ({}));
    const { method, path } = body;

    if (!method || !path) {
      return NextResponse.json(
        { error: "Missing required parameters" }, 
        { 
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      );
    }

    // Get API credentials from environment variables
    const keyName = process.env.CDP_APP_ID;
    const keySecret = process.env.CDP_SECRET

    if (!keyName || !keySecret) {
      return NextResponse.json({ error: "API credentials not configured" }, { status: 500 })
    }

    const requestHost = "api.coinbase.com"
    const algorithm = "ES256"
    const uri = `${method} ${requestHost}${path}`

    // Create the JWT payload
    const payload = {
      iss: "cdp",
      nbf: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 120, // Token expires after 2 minutes
      sub: keyName,
      uri,
    }

    // Create the JWT header
    const header = {
      alg: algorithm,
      kid: keyName,
      nonce: crypto.randomBytes(16).toString("hex"),
    }

    try {
      // Sign the JWT
      const token = jwt.sign(payload, keySecret, {
        algorithm,
        header,
      })

      return NextResponse.json({ token }, {
        headers: {
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      });
    } catch (signError: any) {
      console.error("JWT signing error:", signError)
      return NextResponse.json({ error: `JWT signing error: ${signError.message}` }, { status: 500 })
    }
  } catch (error: any) {
    console.error("Token generation error:", error)
    return NextResponse.json({ error: `Token generation error: ${error.message}` }, { status: 500 })
  }
}

// Add OPTIONS handler for CORS preflight
export async function OPTIONS(request: NextRequest) {
  const headersList = headers();
  const origin = (await headersList).get('origin') || '';

  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': origin,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  );
}
