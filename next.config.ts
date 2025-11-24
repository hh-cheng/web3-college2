import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: { CHAIN_RPC_URL: process.env.CHAIN_RPC_URL },
}

export default nextConfig
