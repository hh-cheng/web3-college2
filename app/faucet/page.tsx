'use client'

import {
  Wallet as WalletIcon,
  Loader2,
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import useFaucet from './service'
import useWeb3 from '@/lib/hooks/useWeb3'
import { Button } from '@/components/ui/button'
import { useClaimTokens } from './hooks'

export default function FaucetPage() {
  const { connect, isConnecting, address, chainID } = useWeb3()
  const { claimAmount, hasClaimed, isLoading, amountError, claimStatusError } =
    useFaucet()
  const claimMutation = useClaimTokens()

  // Wallet not connected state
  if (!chainID || !address) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Token Faucet</h1>
          <p className="text-lg text-muted-foreground">
            Claim test tokens to purchase courses on the platform
          </p>
        </div>
        <div className="p-12 border rounded-lg text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
              <WalletIcon className="w-8 h-8 text-muted-foreground" />
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Wallet Not Connected</h2>
            <p className="text-muted-foreground">
              Please connect your wallet to claim tokens
            </p>
          </div>
          <Button
            onClick={connect}
            disabled={isConnecting}
            className="mt-4"
            size="lg"
          >
            <WalletIcon className="w-4 h-4" />
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </Button>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Token Faucet</h1>
          <p className="text-lg text-muted-foreground">
            Claim test tokens to purchase courses on the platform
          </p>
        </div>
        <div className="p-12 border rounded-lg text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Loading faucet information...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (amountError || claimStatusError) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Token Faucet</h1>
          <p className="text-lg text-muted-foreground">
            Claim test tokens to purchase courses on the platform
          </p>
        </div>
        <div className="p-8 border border-destructive rounded-lg text-center">
          <XCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">
            Failed to load faucet information. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  // YD Token has 0 decimals, so display raw amount
  const claimAmountFormatted =
    claimAmount !== undefined ? claimAmount.toString() : '0'
  const isClaiming = claimMutation.isPending
  const canClaim = !hasClaimed && !isClaiming && claimAmount !== undefined

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Token Faucet</h1>
        <p className="text-lg text-muted-foreground">
          Claim test tokens to purchase courses on the platform
        </p>
      </div>

      <div className="p-8 border rounded-lg space-y-6">
        {/* Claim Amount Display */}
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Claim Amount</p>
          <p className="text-4xl font-bold">
            {claimAmountFormatted} <span className="text-2xl">YD</span>
          </p>
        </div>

        {/* Claim Status */}
        <div className="text-center space-y-2">
          {hasClaimed ? (
            <>
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-lg">You have already claimed tokens</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Each wallet address can only claim once
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <p className="text-lg">You are eligible to claim tokens</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the button below to claim {claimAmountFormatted} YD tokens
              </p>
            </>
          )}
        </div>

        {/* Claim Button */}
        <div className="flex justify-center">
          <Button
            onClick={() => claimMutation.mutate()}
            disabled={!canClaim}
            size="lg"
            className="min-w-[200px]"
          >
            {isClaiming ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Claiming...
              </>
            ) : hasClaimed ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Already Claimed
              </>
            ) : (
              'Claim Tokens'
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            Connected wallet: <span className="font-mono">{address}</span>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Make sure you have enough ETH for gas fees
          </p>
        </div>
      </div>
    </div>
  )
}
