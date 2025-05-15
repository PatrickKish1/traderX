/**
 * Formats a PEM private key string to ensure it has the correct format
 * for JWT signing with ES256 algorithm
 */
export function formatPrivateKey(privateKey: string): string {
  // If the key doesn't have the proper PEM format, add it
  if (!privateKey.includes("-----BEGIN EC PRIVATE KEY-----")) {
    privateKey = `-----BEGIN EC PRIVATE KEY-----\n${privateKey}\n-----END EC PRIVATE KEY-----`
  }

  // Ensure the key has proper line breaks
  if (!privateKey.includes("\n")) {
    privateKey = privateKey
      .replace("-----BEGIN EC PRIVATE KEY-----", "-----BEGIN EC PRIVATE KEY-----\n")
      .replace("-----END EC PRIVATE KEY-----", "\n-----END EC PRIVATE KEY-----")
  }

  return privateKey
}
