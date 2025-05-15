/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Add caching for tokens
const tokenCache = new Map<string, {token: string, expires: number}>();

export const makeCoinbaseRequest = async (method: string, path: string, body?: any, extraOptions?: RequestInit) => {
  const cacheKey = `${method}-${path}`;
  const now = Date.now();
  const cached = tokenCache.get(cacheKey);

  let token;
  if (cached && cached.expires > now) {
    token = cached.token;
  } else {
    const tokenResponse = await fetch("/api/coinbase-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method,
        path,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error(`Failed to get authentication token: ${tokenResponse.statusText}`)
    }

    const { token: newToken } = await tokenResponse.json();
    token = newToken;
    
    // Cache token for 1 minute (tokens expire after 2 minutes)
    tokenCache.set(cacheKey, {
      token: newToken,
      expires: now + 60000
    });
  }

  // Now use the token to make the actual Coinbase API request
  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`https://api.coinbase.com/${path}`, options)

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Coinbase API error (${response.status}): ${errorText}`)
  }

  return response.json()
}
