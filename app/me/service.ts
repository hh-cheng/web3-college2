'use client'

import { toast } from 'sonner'
import { useState, useEffect, useTransition, useMemo } from 'react'

import useWeb3 from '@/lib/hooks/useWeb3'
import { updateNickname } from './actions'
import { targetChain } from '@/lib/config/chain'
import { getOrCreateUser } from '@/components/Layout/HeaderNav/components/Wallet/actions'

export default function useMe() {
  const {
    status,
    address,
    chainID,
    connect,
    isConnecting,
    isConnected,
    getBalance,
  } = useWeb3()

  const [nickname, setNickname] = useState<string | null>(null)
  const [editingNickname, setEditingNickname] = useState(false)
  const [nicknameInput, setNicknameInput] = useState('')
  const [balance, setBalance] = useState<{ wei: bigint; eth: string } | null>(
    null,
  )
  const [isRefreshing, startRefreshing] = useTransition()
  const [isSaving, startSaving] = useTransition()
  const [copied, setCopied] = useState(false)

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
    navigator.clipboard.writeText(address).then(() => {
      setCopied(true)
      toast.success('Address copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const refreshBalance = async () => {
    if (!address || isRefreshing) return
    startRefreshing(async () => {
      try {
        const balanceData = await getBalance(address)
        setBalance(balanceData)
        toast.success('Balance refreshed')
      } catch (err) {
        toast.error('Failed to refresh balance')
      }
    })
  }

  const startEditing = () => {
    setNicknameInput(nickname || '')
    setEditingNickname(true)
  }

  const cancelEditing = () => {
    setEditingNickname(false)
    setNicknameInput('')
  }

  const saveNickname = () => {
    if (!address) return

    const trimmed = nicknameInput.trim()
    if (trimmed.length === 0) {
      toast.error('Nickname cannot be empty')
      return
    }

    if (trimmed.length > 50) {
      toast.error('Nickname cannot exceed 50 characters')
      return
    }

    startSaving(async () => {
      try {
        const result = await updateNickname(address, trimmed)
        if (result.success) {
          setNickname(result.data.nickname)
          setEditingNickname(false)
          toast.success('Nickname updated successfully')
        } else {
          toast.error(result.msg || 'Failed to update nickname')
        }
      } catch (err) {
        toast.error('Failed to update nickname')
      }
    })
  }

  // Fetch user data and balance when wallet connects
  useEffect(() => {
    if (!address) {
      setNickname(null)
      setBalance(null)
      return
    }

    let cancelled = false

    // Fetch balance
    getBalance(address)
      .then((balanceData) => {
        if (!cancelled) {
          setBalance(balanceData)
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to fetch balance:', err)
        }
      })

    // Sync user data
    const syncUser = async () => {
      try {
        const result = await getOrCreateUser(address)
        if (!cancelled && result.success) {
          setNickname(result.data.nickname)
        } else if (!cancelled && !result.success) {
          console.error('Failed to sync user:', result.msg)
          setNickname(null)
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Error syncing user:', err)
          setNickname(null)
        }
      }
    }

    syncUser()

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  return {
    // Connection state
    status,
    address,
    chainID,
    connect,
    isConnecting,
    isConnected,

    // User data
    nickname,
    editingNickname,
    nicknameInput,
    setNicknameInput,

    // Balance
    balance,
    formattedBalance,
    isRefreshing,
    refreshBalance,

    // Actions
    copyAddress,
    copied,
    explorerUrl,
    startEditing,
    cancelEditing,
    saveNickname,
    isSaving,
  }
}
