import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    // chain - server-side only
    CHAIN_ID: process.env.CHAIN_ID,
    CHAIN_RPC_URL: process.env.CHAIN_RPC_URL,
    CHAIN_NAME: process.env.CHAIN_NAME,
    CHAIN_NATIVE_SYMBOL: process.env.CHAIN_NATIVE_SYMBOL,
    CHAIN_NATIVE_NAME: process.env.CHAIN_NATIVE_NAME,
    CHAIN_BLOCK_EXPLORER_URL: process.env.CHAIN_BLOCK_EXPLORER_URL,

    // chain - client-side accessible (NEXT_PUBLIC_ prefix required)
    NEXT_PUBLIC_CHAIN_ID:
      process.env.NEXT_PUBLIC_CHAIN_ID || process.env.CHAIN_ID,
    NEXT_PUBLIC_CHAIN_RPC_URL:
      process.env.NEXT_PUBLIC_CHAIN_RPC_URL || process.env.CHAIN_RPC_URL,
    NEXT_PUBLIC_CHAIN_NAME:
      process.env.NEXT_PUBLIC_CHAIN_NAME || process.env.CHAIN_NAME,
    NEXT_PUBLIC_CHAIN_NATIVE_SYMBOL:
      process.env.NEXT_PUBLIC_CHAIN_NATIVE_SYMBOL ||
      process.env.CHAIN_NATIVE_SYMBOL,
    NEXT_PUBLIC_CHAIN_NATIVE_NAME:
      process.env.NEXT_PUBLIC_CHAIN_NATIVE_NAME ||
      process.env.CHAIN_NATIVE_NAME,
    NEXT_PUBLIC_CHAIN_BLOCK_EXPLORER_URL:
      process.env.NEXT_PUBLIC_CHAIN_BLOCK_EXPLORER_URL ||
      process.env.CHAIN_BLOCK_EXPLORER_URL,

    // contracts - server-side only
    YDTOKEN_ADDRESS: process.env.YDTOKEN_ADDRESS,
    YDFAUCET_ADDRESS: process.env.YDFAUCET_ADDRESS,
    YDETH_SWAP_ADDRESS: process.env.YDETH_SWAP_ADDRESS,
    COURSE_MANAGER_ADDRESS: process.env.COURSE_MANAGER_ADDRESS,

    // contracts - client-side accessible (NEXT_PUBLIC_ prefix required)
    NEXT_PUBLIC_YD_TOKEN_ADDRESS:
      process.env.NEXT_PUBLIC_YD_TOKEN_ADDRESS || process.env.YDTOKEN_ADDRESS,
    NEXT_PUBLIC_COURSE_MANAGER_ADDRESS:
      process.env.NEXT_PUBLIC_COURSE_MANAGER_ADDRESS ||
      process.env.COURSE_MANAGER_ADDRESS,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1024mb',
    },
  },
}

export default nextConfig
