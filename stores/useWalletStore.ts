'use client'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { Eip1193Provider } from 'ethers'

import { targetChain, targetChainIdHex, targetRpcUrl } from '@/lib/config/chain'

export type WalletStatus = 'disconnected' | 'connected' | 'connecting'

type WalletState = {
  chainID: number | null
  status: WalletStatus
  address: `0x${string}` | null
  ethereum: Eip1193Provider | null

  disconnect: () => void
  connect: () => Promise<void>
  switchToTargetChain: () => Promise<boolean>
}

export const useWalletStore = create<WalletState>((set, get) => ({
  chainID: null,
  address: null,
  ethereum: null,
  status: 'disconnected',

  async connect() {
    if (typeof window === 'undefined') return

    const eth = window.ethereum
    if (!eth) {
      toast.error('Please install MetaMask first')
      set({ status: 'disconnected' })
      return
    }

    set({ status: 'connecting' })

    const accounts: `0x${string}`[] = await eth.request({
      method: 'eth_requestAccounts',
    })

    const chainIDHex = await eth.request({ method: 'eth_chainId' })

    let chainID = parseInt(chainIDHex, 16)

    if (chainID !== targetChain.id) {
      const switched = await get().switchToTargetChain()
      if (!switched) {
        set({ status: 'disconnected' })
        return
      }
      const newChainHex = await eth.request({ method: 'eth_chainId' })
      chainID = parseInt(newChainHex, 16)
    }

    set({
      ethereum: eth,
      status: 'connected',
      address: accounts[0],
      chainID,
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

  async switchToTargetChain() {
    if (typeof window === 'undefined') return false

    const eth = window.ethereum
    if (!eth) {
      toast.error('Please install MetaMask first')
      return false
    }

    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainIdHex }],
      })
      set({ chainID: targetChain.id, ethereum: eth })
      return true
    } catch (err: any) {
      const isUnrecognizedChain = err?.code === 4902
      const isRejected = err?.code === 4001

      if (isRejected) {
        toast.error('Chain switch rejected')
        return false
      }

      if (isUnrecognizedChain) {
        try {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: targetChainIdHex,
                chainName: targetChain.name,
                rpcUrls: [targetRpcUrl],
                nativeCurrency: targetChain.nativeCurrency,
                blockExplorerUrls: targetChain.blockExplorers?.default
                  ? [targetChain.blockExplorers.default.url]
                  : [],
              },
            ],
          })
          set({ chainID: targetChain.id, ethereum: eth })
          return true
        } catch (addErr: any) {
          const addRejected = addErr?.code === 4001
          toast.error(
            addRejected
              ? 'User rejected adding the chain'
              : 'Failed to add chain',
          )
          return false
        }
      }

      toast.error('Failed to switch chain')
      return false
    }
  },
}))
