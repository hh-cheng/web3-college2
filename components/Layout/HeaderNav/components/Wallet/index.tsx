'use client'
import { isNotNil } from 'es-toolkit'
import {
  Copy,
  LogOut,
  ChevronDown,
  ExternalLink,
  Wallet as WalletIcon,
  RefreshCw,
  CheckCircle2,
  Network,
} from 'lucide-react'

import useWallet from './service'
import { truncateAddress } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { targetChain } from '@/lib/config/chain'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export default function Wallet() {
  const {
    hasConnected,
    address,
    chainID,
    connect,
    isConnecting,
    disconnect,
    nickname,
    formattedBalance,
    isRefreshing,
    refreshBalance,
    copyAddress,
    copied,
    explorerUrl,
  } = useWallet()

  if (!hasConnected) {
    return (
      <Button
        variant="outline"
        onClick={connect}
        disabled={isConnecting}
        className="cursor-pointer"
      >
        <WalletIcon className="w-4 h-4" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 cursor-pointer">
          <div className="relative">
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full border-2 border-background" />
            <WalletIcon className="w-4 h-4" />
          </div>
          <span className="font-medium">
            {isNotNil(nickname) && nickname !== address
              ? nickname
              : truncateAddress(address || '')}
          </span>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        {/* Header Section */}
        <div className="p-4 bg-linear-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                {address?.slice(2, 4).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Connected Wallet
              </p>
              {isNotNil(nickname) && nickname !== address && (
                <p className="text-sm font-semibold text-foreground truncate mb-1">
                  {nickname}
                </p>
              )}
              <p className="text-sm font-semibold text-foreground truncate font-mono">
                {address}
              </p>
            </div>
          </div>

          {/* Network Info */}
          <div className="flex items-center gap-2 px-3 py-2 bg-background/50 rounded-lg border">
            <Network className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Network</p>
              <p className="text-sm font-medium text-foreground truncate">
                {targetChain.name}
              </p>
            </div>
            {chainID && (
              <span className="text-xs text-muted-foreground font-mono">
                {chainID}
              </span>
            )}
          </div>
        </div>

        {/* Balance Section */}
        <div className="p-4 border-b bg-muted/30">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-muted-foreground font-medium">Balance</p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={refreshBalance}
              disabled={isRefreshing}
              className="h-6 w-6"
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {formattedBalance}
            </span>
            <span className="text-sm text-muted-foreground font-medium">
              {targetChain.nativeCurrency.symbol}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="p-1">
          <DropdownMenuItem onClick={copyAddress} className="cursor-pointer">
            {copied ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </DropdownMenuItem>

          {explorerUrl && (
            <DropdownMenuItem
              onClick={() => window.open(explorerUrl, '_blank')}
              className="cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span>View on Explorer</span>
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={disconnect}
            className="cursor-pointer text-destructive focus:text-destructive"
            variant="destructive"
          >
            <LogOut className="w-4 h-4" />
            <span>Disconnect</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
