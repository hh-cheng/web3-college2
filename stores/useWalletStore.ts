'use client'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { Eip1193Provider } from 'ethers'

export type WalletStatus = 'disconnected' | 'connected' | 'connecting'

type WalletState = {
  chainID: number | null
  status: WalletStatus
  address: `0x${string}` | null
  ethereum: Eip1193Provider | null

  disconnect: () => void
  connect: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set) => ({
  chainID: null,
  address: null,
  ethereum: null,
  status: 'disconnected',

  async connect() {
    if (typeof window === 'undefined') return

    const eth = window.ethereum
    if (!eth) {
      toast.error('Please install MetaMask first')
      return
    }

    set({ status: 'connecting' })

    const accounts: `0x${string}`[] = await eth.request({
      method: 'eth_requestAccounts',
    })

    const chainIDHex = await eth.request({ method: 'eth_chainId' })

    set({
      ethereum: eth,
      status: 'connected',
      address: accounts[0],
      chainID: parseInt(chainIDHex, 16),
    })
  },

  disconnect() {
    set({
      chainID: null,
      address: null,
      ethereum: null,
      status: 'disconnected',
    })
  },
}))
