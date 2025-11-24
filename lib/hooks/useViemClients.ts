'use client'
import { useMemo } from 'react'
import { sepolia } from 'viem/chains'
import { http, custom, createPublicClient, createWalletClient } from 'viem'

import { useWalletStore } from '@/stores/useWalletStore'

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(process.env.CHAIN_RPC_URL),
})

export default function useViemClients() {
  const { address, ethereum } = useWalletStore((state) => ({
    address: state.address,
    ethereum: state.ethereum,
  }))

  const walletClient = useMemo(() => {
    if (!ethereum || !address) return
    return createWalletClient({ chain: sepolia, transport: custom(ethereum) })
  }, [ethereum, address])

  return { publicClient, walletClient, address }
}
