import { toast } from 'sonner'
import { isNotNil } from 'es-toolkit'
import { useEffect, useMemo, useState, useTransition } from 'react'

import useWeb3 from '@/lib/hooks/useWeb3'
import { getOrCreateUser } from './actions'
import { targetChain } from '@/lib/config/chain'

export default function useWallet() {
  const {
    status,
    address,
    chainID,
    connect,
    disconnect,
    getBalance,
    isConnecting,
  } = useWeb3()

  const [copied, setCopied] = useState(false)
  const [isRefreshing, startRefreshing] = useTransition()
  const [balance, setBalance] = useState<{ wei: bigint; eth: string } | null>(
    null,
  )
  const [nickname, setNickname] = useState<string | null>(null)

  const hasConnected = status === 'connected' && isNotNil(address)

  const formattedBalance = useMemo(() => {
    if (!balance?.eth) return '0.00'
    const num = parseFloat(balance.eth)
    if (num === 0) return '0.00'
    if (num < 0.0001) return '< 0.0001'
    return num.toLocaleString('en-US', {
      maximumFractionDigits: 4,
      minimumFractionDigits: 2,
    })
  }, [balance?.eth])

  const explorerUrl = useMemo(() => {
    if (!address || !targetChain.blockExplorers?.default) return null
    return `${targetChain.blockExplorers.default.url}/address/${address}`
  }, [address])

  const copyAddress = () => {
    if (!address) return
    startRefreshing(async () => {
      try {
        await navigator.clipboard.writeText(address)
        setCopied(true)
        toast.success('Address copied to clipboard')
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        toast.error('Failed to copy address')
      }
    })
  }

  const refreshBalance = async () => {
    if (!address || isRefreshing) return
    startRefreshing(async () => {
      try {
        const balance = await getBalance(address)
        setBalance(balance)
        toast.success('Balance refreshed')
      } catch (err) {
        toast.error('Failed to refresh balance')
      }
    })
  }

  const handleDisconnect = () => {
    disconnect()
    setNickname(null) // Clear nickname on disconnect
    toast.success('Wallet disconnected')
  }

  useEffect(() => {
    if (!address) {
      setNickname(null)
      return
    }
    refreshBalance()

    // Sync user data when wallet connects
    let cancelled = false
    const syncUser = async () => {
      try {
        const result = await getOrCreateUser(address)
        if (!cancelled && result.success) {
          setNickname(result.data.nickname)
        } else if (!cancelled && !result.success) {
          // Error occurred but don't break wallet connection
          console.error('Failed to sync user:', result.msg)
          toast.error('Failed to sync user data')
          // Fallback: use address as display name
          setNickname(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error syncing user:', err)
          toast.error('Failed to sync user data')
          setNickname(null)
        }
      }
    }

    syncUser()

    return () => {
      cancelled = true
    }
  }, [address])

  return {
    // Connection state
    hasConnected,
    address,
    chainID,
    connect,
    isConnecting,
    disconnect: handleDisconnect,

    // User data
    nickname,

    // Balance
    formattedBalance,
    isRefreshing,
    refreshBalance,

    // Actions
    copyAddress,
    copied,
    explorerUrl,
  }
}
