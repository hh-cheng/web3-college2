'use client'

import { defineChain } from 'viem'
import { sepolia } from 'viem/chains'

const envChainId = process.env.CHAIN_ID!
const envRpcUrl = process.env.CHAIN_RPC_URL!
const envChainName = process.env.CHAIN_NAME!
const envNativeSymbol = process.env.CHAIN_NATIVE_SYMBOL!
const envNativeName = process.env.CHAIN_NATIVE_NAME!
const envBlockExplorerUrl = process.env.CHAIN_BLOCK_EXPLORER_URL!

const hasCustomChainConfig =
  envChainId ||
  envRpcUrl ||
  envChainName !== 'Custom Chain' ||
  envNativeSymbol !== 'ETH' ||
  envNativeName !== 'Ether' ||
  envBlockExplorerUrl

const customChain = defineChain({
  id: Number(envChainId ?? sepolia.id),
  name: envChainName,
  nativeCurrency: {
    name: envNativeName,
    symbol: envNativeSymbol,
    decimals: 18,
  },
  rpcUrls: {
    default: { http: envRpcUrl ? [envRpcUrl] : sepolia.rpcUrls.default.http },
  },
  blockExplorers: envBlockExplorerUrl
    ? { default: { name: 'Block Explorer', url: envBlockExplorerUrl } }
    : sepolia.blockExplorers,
})

export const targetChain = hasCustomChainConfig ? customChain : sepolia
export const targetRpcUrl = targetChain.rpcUrls.default.http[0]
export const targetChainIdHex = `0x${targetChain.id.toString(16)}`

// Debug logging
if (typeof window !== 'undefined') {
  console.log('🔍 Chain Configuration:', {
    chainId: targetChain.id,
    chainName: targetChain.name,
    rpcUrl: targetRpcUrl,
    envChainId,
    envRpcUrl,
  })
}
