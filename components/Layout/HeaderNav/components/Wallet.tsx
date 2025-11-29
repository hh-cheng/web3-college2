'use client'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import { isNotNil } from 'es-toolkit'
import {
  Copy,
  LogOut,
  ChevronDown,
  ExternalLink,
  Wallet as WalletIcon,
} from 'lucide-react'

import useWeb3 from '@/lib/hooks/useWeb3'
import { truncateAddress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu'
import { use, useMemo } from 'react'

export default function Wallet() {
  const {
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
  } = useWeb3()

  const hasConnected = status === 'connected' && isNotNil(address)

  const balance = use(
    isNotNil(address)
      ? getBalance(address)
      : Promise.resolve({ wei: BigInt(0), eth: '0' }),
  )

  const copy = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  if (!hasConnected) {
    return (
      <Button variant="outline" onClick={connect} disabled={isConnecting}>
        Connect Wallet
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <WalletIcon className="w-4 h-4" />
          {truncateAddress(address)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {/* 账户信息 */}
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-br from-purple-400 to-blue-600 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-600 font-medium">
                Connected Account
              </p>
              <p className="text-sm font-semibold text-slate-900 truncate">
                {address}
              </p>
            </div>
          </div>

          {/* 余额 */}
          <div className="bg-slate-700/50 rounded-lg p-3">
            <p className="text-xs text-slate-300 font-medium mb-1">Balance</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-white">
                {balance.eth}
              </span>
              <span className="text-sm text-slate-200 font-medium">
                {process.env.CHAIN_NATIVE_SYMBOL}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenuItem>
          <Copy className="w-4 h-4" onClick={() => copy(address)} />
          {truncateAddress(address)}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
