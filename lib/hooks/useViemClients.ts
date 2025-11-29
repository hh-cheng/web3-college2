'use client'
import { useMemo } from 'react'
import { http, custom, createPublicClient, createWalletClient } from 'viem'

import { useWalletStore } from '@/stores/useWalletStore'
import { targetChain, targetRpcUrl } from '../config/chain'

const publicClient = createPublicClient({
  chain: targetChain,
  transport: http(targetRpcUrl),
})

export default function useViemClients() {
  const { address, ethereum } = useWalletStore((state) => ({
    address: state.address,
    ethereum: state.ethereum,
  }))

  const walletClient = useMemo(() => {
    if (!ethereum || !address) return
    return createWalletClient({
      chain: targetChain,
      transport: custom(ethereum),
    })
  }, [ethereum, address])

  return { publicClient, walletClient, address }
}
