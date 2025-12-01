'use client'

import { isNotNil } from 'es-toolkit'
import {
  Wallet as WalletIcon,
  RefreshCw,
  CheckCircle2,
  Network,
  Copy,
  ExternalLink,
  Save,
  X,
} from 'lucide-react'

import useMe from './service'
import { Button } from '@/components/ui/button'
import { targetChain } from '@/lib/config/chain'

export default function MePage() {
  const {
    address,
    chainID,
    connect,
    isConnecting,
    isConnected,
    nickname,
    editingNickname,
    nicknameInput,
    setNicknameInput,
    formattedBalance,
    isRefreshing,
    refreshBalance,
    copyAddress,
    copied,
    explorerUrl,
    startEditing,
    cancelEditing,
    saveNickname,
    isSaving,
  } = useMe()

  // Disconnected state
  if (!isConnected) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
            <WalletIcon className="w-10 h-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Connect Your Wallet</h1>
          <p className="text-muted-foreground mb-8 max-w-md">
            Connect your wallet to view your profile and manage your settings.
          </p>
          <Button
            variant="default"
            size="lg"
            onClick={connect}
            disabled={isConnecting}
            className="gap-2"
          >
            <WalletIcon className="w-5 h-5" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          Manage your wallet information and profile settings
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Wallet Info Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <div className="w-16 h-16 bg-linear-to-br from-purple-500 via-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                {address?.slice(2, 4).toUpperCase()}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-1">
                Connected Wallet
              </p>
              {isNotNil(nickname) && nickname !== address && (
                <p className="text-lg font-semibold text-foreground truncate mb-1">
                  {nickname}
                </p>
              )}
              <p className="text-sm font-mono text-foreground truncate">
                {address}
              </p>
            </div>
          </div>

          {/* Network Info */}
          <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-lg border mb-4">
            <Network className="w-5 h-5 text-muted-foreground" />
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

          {/* Balance Section */}
          <div className="px-4 py-3 bg-muted/30 rounded-lg border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground font-medium">
                Balance
              </p>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={refreshBalance}
                disabled={isRefreshing}
                className="h-7 w-7"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
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
          <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={copyAddress}
              className="flex-1 gap-2"
            >
              {copied ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>{copied ? 'Copied!' : 'Copy Address'}</span>
            </Button>
            {explorerUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(explorerUrl, '_blank')}
                className="flex-1 gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Explorer</span>
              </Button>
            )}
          </div>
        </div>

        {/* Profile Settings Card */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

          {/* Nickname Section */}
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Nickname
            </label>
            {editingNickname ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  placeholder="Enter your nickname"
                  maxLength={50}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={isSaving}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      saveNickname()
                    } else if (e.key === 'Escape') {
                      cancelEditing()
                    }
                  }}
                />
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={saveNickname}
                    disabled={isSaving}
                    className="flex-1 gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save'}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEditing}
                    disabled={isSaving}
                    className="gap-2"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {nicknameInput.length}/50 characters
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="px-3 py-2 rounded-md border border-input bg-muted/30 min-h-10 flex items-center">
                  <span className="text-foreground">
                    {nickname || (
                      <span className="text-muted-foreground italic">
                        No nickname set
                      </span>
                    )}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startEditing}
                  className="w-full"
                >
                  {nickname ? 'Edit Nickname' : 'Set Nickname'}
                </Button>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Your nickname will be displayed across the platform
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
