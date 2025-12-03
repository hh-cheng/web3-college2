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

    // contracts - server-side only
    YDTOKEN_ADDRESS: process.env.YDTOKEN_ADDRESS,
    YDFAUCET_ADDRESS: process.env.YDFAUCET_ADDRESS,
    YDETH_SWAP_ADDRESS: process.env.YDETH_SWAP_ADDRESS,
    COURSE_MANAGER_ADDRESS: process.env.COURSE_MANAGER_ADDRESS,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '1024mb',
    },
  },
}

export default nextConfig
