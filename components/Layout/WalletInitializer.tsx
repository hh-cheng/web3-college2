'use client'

import { useEffect } from 'react'

import { useWalletStore } from '@/stores/useWalletStore'

/**
 * WalletInitializer component
 * Initializes wallet connection on app mount by checking for existing connections
 * and setting up event listeners for account/chain changes.
 */
export default function WalletInitializer() {
  const initialize = useWalletStore((state) => state.initialize)

  useEffect(() => {
    initialize()
  }, [initialize])

  return null
}
