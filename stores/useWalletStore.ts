'use client'
import { toast } from 'sonner'
import { create } from 'zustand'
import type { Eip1193Provider } from 'ethers'

import { targetChain, targetChainIdHex, targetRpcUrl } from '@/lib/config/chain'

// Extended provider type that includes event listener methods
type EthereumProvider = Eip1193Provider & {
  on(event: 'accountsChanged', handler: (accounts: string[]) => void): void
  on(event: 'chainChanged', handler: (chainId: string) => void): void
  removeAllListeners(event?: 'accountsChanged' | 'chainChanged'): void
}

export type WalletStatus =
  | 'disconnected'
  | 'connected'
  | 'connecting'
  | 'initializing'

type WalletState = {
  chainID: number | null
  status: WalletStatus
  address: `0x${string}` | null
  ethereum: EthereumProvider | null
  _listenersSetup: boolean

  disconnect: () => void
  connect: () => Promise<void>
  switchToTargetChain: () => Promise<boolean>
  checkConnection: () => Promise<void>
  initialize: () => Promise<void>
  _setupEventListeners: (eth: EthereumProvider) => void
  _cleanupEventListeners: () => void
}

export const useWalletStore = create<WalletState>((set, get) => ({
  chainID: null,
  address: null,
  ethereum: null,
  status: 'disconnected',
  _listenersSetup: false,

  async checkConnection() {
    if (typeof window === 'undefined') return

    const eth = window.ethereum
    if (!eth) {
      set({ status: 'disconnected' })
      return
    }

    try {
      const accounts: `0x${string}`[] = await eth.request({
        method: 'eth_accounts',
      })

      if (accounts.length === 0) {
        set({ status: 'disconnected' })
        return
      }

      const chainIDHex = await eth.request({ method: 'eth_chainId' })
      const chainID = parseInt(chainIDHex, 16)

      // Cast to EthereumProvider to include event listener methods
      const ethProvider = eth as EthereumProvider

      set({
        ethereum: ethProvider,
        status: 'connected',
        address: accounts[0],
        chainID,
      })

      // Setup event listeners if not already done
      if (!get()._listenersSetup) {
        get()._setupEventListeners(ethProvider)
      }
    } catch (err) {
      console.error('Error checking wallet connection:', err)
      set({ status: 'disconnected' })
    }
  },

  async initialize() {
    if (typeof window === 'undefined') return

    const eth = window.ethereum
    if (!eth) {
      set({ status: 'disconnected' })
      return
    }

    // Prevent concurrent initialization
    if (get().status === 'initializing' || get().status === 'connecting') {
      return
    }

    set({ status: 'initializing' })

    // Check for existing connection
    await get().checkConnection()

    // Setup event listeners if we have a connection
    const connectedEth = get().ethereum
    if (connectedEth && !get()._listenersSetup) {
      get()._setupEventListeners(connectedEth)
    }

    // If no connection found, set status to disconnected
    if (get().status === 'initializing') {
      set({ status: 'disconnected' })
    }
  },

  _setupEventListeners(eth: EthereumProvider) {
    if (get()._listenersSetup) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected wallet
        get().disconnect()
      } else {
        // User switched accounts
        const newAddress = accounts[0] as `0x${string}`
        const currentAddress = get().address

        if (newAddress !== currentAddress) {
          set({
            address: newAddress,
            status: 'connected',
          })
        }
      }
    }

    const handleChainChanged = async (chainIdHex: string) => {
      const chainID = parseInt(chainIdHex, 16)
      const currentChainID = get().chainID

      if (chainID !== currentChainID) {
        // Update chainID to reflect the actual current chain
        set({ chainID })

        // If chain doesn't match target chain, try to switch
        // Note: This will prompt the user, but they can reject and we'll still
        // have the correct chainID set above
        if (chainID !== targetChain.id) {
          await get().switchToTargetChain()
        }
      }
    }

    eth.on('accountsChanged', handleAccountsChanged)
    eth.on('chainChanged', handleChainChanged)

    set({ _listenersSetup: true })
  },

  _cleanupEventListeners() {
    const eth = get().ethereum
    if (!eth || !get()._listenersSetup) return

    eth.removeAllListeners('accountsChanged')
    eth.removeAllListeners('chainChanged')

    set({ _listenersSetup: false })
  },

  async connect() {
    if (typeof window === 'undefined') return

    const eth = window.ethereum
    if (!eth) {
      toast.error('Please install MetaMask first')
      set({ status: 'disconnected' })
      return
    }

    // Prevent concurrent connection attempts
    if (get().status === 'connecting' || get().status === 'initializing') {
      return
    }

    set({ status: 'connecting' })

    try {
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

      // Cast to EthereumProvider to include event listener methods
      const ethProvider = eth as EthereumProvider

      set({
        ethereum: ethProvider,
        status: 'connected',
        address: accounts[0],
        chainID,
      })

      // Setup event listeners if not already done
      if (!get()._listenersSetup) {
        get()._setupEventListeners(ethProvider)
      }
    } catch (err) {
      console.error('Error connecting wallet:', err)
      set({ status: 'disconnected' })
    }
  },

  disconnect() {
    // Cleanup event listeners
    get()._cleanupEventListeners()

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
      set({ chainID: targetChain.id, ethereum: eth as EthereumProvider })
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
          set({ chainID: targetChain.id, ethereum: eth as EthereumProvider })
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
