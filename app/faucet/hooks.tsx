'use client'

import Link from 'next/link'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import useWeb3 from '@/lib/hooks/useWeb3'
import { targetChain } from '@/lib/config/chain'
import YDFaucetABI from '@/app/abi/YDFaucet.json'
import { YD_FAUCET_ADDRESS } from '@/lib/config/contracts'

export function useClaimTokens() {
  const { writeContract, address, chainID } = useWeb3()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      if (!address || !chainID) {
        throw new Error('Wallet not connected')
      }

      if (YD_FAUCET_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('Faucet contract address not configured')
      }

      try {
        const result = await writeContract({
          abi: YDFaucetABI.abi as any,
          address: YD_FAUCET_ADDRESS,
          functionName: 'claim',
          args: [],
          waitForReceipt: true,
        })

        return result
      } catch (error: any) {
        // Handle user rejection
        if (error?.code === 4001 || error?.message?.includes('User rejected')) {
          throw new Error('Transaction cancelled')
        }
        // Handle already claimed
        if (
          error?.message?.includes('Already claimed') ||
          error?.message?.includes('already claimed')
        ) {
          throw new Error('You have already claimed tokens')
        }
        // Handle insufficient balance (faucet has no tokens)
        if (
          error?.message?.includes('insufficient funds') ||
          error?.message?.includes('insufficient balance')
        ) {
          throw new Error('Faucet has insufficient balance')
        }
        // Re-throw with original message
        throw new Error(error?.message || 'Claim transaction failed')
      }
    },
    onSuccess: (result) => {
      toast.success('Tokens claimed successfully!')
      // Invalidate claim status query to refresh UI
      queryClient.invalidateQueries({ queryKey: ['faucet', 'hasClaimed'] })
      // Show transaction hash if available
      if (result.receipt?.transactionHash) {
        const explorerUrl = targetChain.blockExplorers?.default?.url
        if (explorerUrl) {
          const txUrl = `${explorerUrl}/tx/${result.receipt.transactionHash}`
          toast.info(
            <Link
              href={txUrl}
              target="_blank"
              className="underline"
              rel="noopener noreferrer"
            >
              View transaction on block explorer
            </Link>,
            { duration: 3000 },
          )
        }
      }
    },
    onError: (error: Error) => {
      console.error('Claim error:', error)
      const errorMessage =
        error.message || 'Failed to claim tokens. Please try again.'
      // Don't show error toast for user cancellation
      if (error.message === 'Transaction cancelled') {
        toast.info('Transaction cancelled')
      } else {
        toast.error(`Claim failed: ${errorMessage}`)
      }
    },
  })
}
