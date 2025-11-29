import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    CHAIN_ID: process.env.CHAIN_ID,
    CHAIN_RPC_URL: process.env.CHAIN_RPC_URL,
    CHAIN_NAME: process.env.CHAIN_NAME,
    CHAIN_NATIVE_SYMBOL: process.env.CHAIN_NATIVE_SYMBOL,
    CHAIN_NATIVE_NAME: process.env.CHAIN_NATIVE_NAME,
    CHAIN_BLOCK_EXPLORER_URL: process.env.CHAIN_BLOCK_EXPLORER_URL,
  },
}

export default nextConfig
