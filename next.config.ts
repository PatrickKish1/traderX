import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "cryptologos.cc"
      },
      {
        protocol: 'https',
        hostname: "wallet-api-production.s3.amazonaws.com"
      },
      {
        protocol: 'https',
        hostname: "d3r81g40ycuhqg.cloudfront.net"
      },
      {
        protocol: 'https',
        hostname: "go.wallet.coinbase.com"
      },
    ]
  }
};

export default nextConfig;
