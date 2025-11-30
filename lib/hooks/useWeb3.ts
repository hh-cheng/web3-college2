'use client'

import { toast } from 'sonner'
import { formatEther } from 'viem'
import { isNotNil } from 'es-toolkit'
import type { Abi, Address, Hex, TransactionReceipt } from 'viem'

import useViemClients from './useViemClients'
import { useWalletStore, type WalletStatus } from '@/stores/useWalletStore'

type UseWeb3Result = {
  //* 钱包状态
  status: WalletStatus
  isConnected: boolean
  isConnecting: boolean
  address: Address | null
  chainID: number | null

  //* 连接控制
  disconnect: () => void
  connect: () => Promise<void>

  //* 常用链上能力
  getBalance(addr?: Address): Promise<{ wei: bigint; eth: string }>

  readContract(params: {
    abi: Abi
    address: Address
    functionName: string
    args: readonly unknown[]
  }): Promise<unknown>

  writeContract(params: {
    abi: Abi
    address: Address
    functionName: string
    args: readonly unknown[]
    waitForReceipt?: boolean
  }): Promise<{ hash: Hex; receipt: TransactionReceipt | null }>
}

export default function useWeb3(): UseWeb3Result {
  // Use separate selectors to avoid creating new object references on each render
  const status = useWalletStore((s) => s.status)
  const address = useWalletStore((s) => s.address)
  const chainID = useWalletStore((s) => s.chainID)
  const connect = useWalletStore((s) => s.connect)
  const disconnect = useWalletStore((s) => s.disconnect)
  const { publicClient, walletClient } = useViemClients()

  const isConnecting = status === 'connecting'
  const isConnected = status === 'connected' && isNotNil(address)

  // 查询余额: 默认查当前地址，范围 wei + 格式化 ETH 字符串
  const getBalance: UseWeb3Result['getBalance'] = async (addr?: Address) => {
    const targetAddr = addr ?? address
    if (!targetAddr) {
      toast.error('No address to query balance')
      throw new Error('No address to query balance')
    }

    const wei = await publicClient.getBalance({ address: targetAddr })
    return { wei, eth: formatEther(wei) }
  }

  // 合约只读
  const readContract: UseWeb3Result['readContract'] = async (params) => {
    const { abi, address, functionName, args = [] } = params
    return publicClient.readContract({ abi, address, functionName, args })
  }

  // 合约写入
  const writeContract: UseWeb3Result['writeContract'] = async (params) => {
    const {
      abi,
      args = [],
      functionName,
      waitForReceipt = true,
      address: contractAddress,
    } = params

    if (!walletClient || !address) {
      toast.error('No wallet client or address')
      throw new Error('No wallet client or address')
    }

    const hash = await walletClient.writeContract({
      abi,
      args,
      functionName,
      account: address,
      address: contractAddress,
    })

    let receipt: TransactionReceipt | null = null
    if (waitForReceipt) {
      receipt = await publicClient.waitForTransactionReceipt({ hash })
    }

    return { hash, receipt }
  }

  return {
    status,
    address,
    chainID,
    connect,
    disconnect,
    getBalance,
    isConnected,
    isConnecting,
    readContract,
    writeContract,
  }
}
