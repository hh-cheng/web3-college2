'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

import useWeb3 from '@/lib/hooks/useWeb3'
import {
  YD_TOKEN_ADDRESS,
  COURSE_MANAGER_ADDRESS,
} from '@/lib/config/contracts'
import YDTokenABI from '@/app/abi/YDToken.json'
import CourseManagerABI from '@/app/abi/CourseManager.json'
import { createPurchaseRecord } from './actions'

export function useApproveToken() {
  const { writeContract, address, chainID } = useWeb3()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      amount,
      coursePrice,
    }: {
      amount: bigint
      coursePrice: string
    }) => {
      if (!address || !chainID) {
        throw new Error('Wallet not connected')
      }

      if (YD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('YD Token contract address not configured')
      }

      if (
        COURSE_MANAGER_ADDRESS === '0x0000000000000000000000000000000000000000'
      ) {
        throw new Error('CourseManager contract address not configured')
      }

      if (amount <= BigInt(0)) {
        throw new Error('Approval amount must be greater than 0')
      }

      try {
        const result = await writeContract({
          abi: YDTokenABI.abi as any,
          address: YD_TOKEN_ADDRESS,
          functionName: 'approve',
          args: [COURSE_MANAGER_ADDRESS, amount],
          waitForReceipt: true,
        })

        return result
      } catch (error: any) {
        // Handle user rejection
        if (error?.code === 4001 || error?.message?.includes('User rejected')) {
          throw new Error('Transaction rejected by user')
        }
        // Handle insufficient balance
        if (
          error?.message?.includes('insufficient funds') ||
          error?.message?.includes('insufficient balance')
        ) {
          throw new Error('Insufficient token balance')
        }
        // Re-throw with original message
        throw new Error(error?.message || 'Approval transaction failed')
      }
    },
    onSuccess: () => {
      toast.success('Token approval successful')
      // Invalidate allowance queries to refresh UI
      queryClient.invalidateQueries({ queryKey: ['allowance'] })
    },
    onError: (error: Error) => {
      console.error('Approve error:', error)
      const errorMessage =
        error.message || 'Failed to approve tokens. Please try again.'
      toast.error(`Approval failed: ${errorMessage}`)
    },
  })
}

export function usePurchaseCourse() {
  const { writeContract, address, chainID } = useWeb3()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      courseId,
      courseOnchainId,
      price,
    }: {
      courseId: number
      courseOnchainId: string
      price: string
    }) => {
      if (!address || !chainID) {
        throw new Error('Wallet not connected')
      }

      if (YD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000') {
        throw new Error('YD Token contract address not configured')
      }

      if (
        COURSE_MANAGER_ADDRESS === '0x0000000000000000000000000000000000000000'
      ) {
        throw new Error('CourseManager contract address not configured')
      }

      // Use the on-chain course ID from the database
      const courseIdBigInt = BigInt(courseOnchainId)

      try {
        // Call CourseManager.purchase() on-chain
        const result = await writeContract({
          abi: CourseManagerABI.abi as any,
          address: COURSE_MANAGER_ADDRESS,
          functionName: 'purchase',
          args: [courseIdBigInt],
          waitForReceipt: true,
        })

        // Create purchase record in database after successful transaction
        if (result.receipt && address && chainID) {
          const purchaseResult = await createPurchaseRecord({
            courseOnchainId,
            buyerAddress: address,
            txHash: result.receipt.transactionHash,
            chainID,
            amount: price,
          })

          if (!purchaseResult.success) {
            console.error(
              'Failed to create purchase record:',
              purchaseResult.msg,
            )
            // Don't throw error here - on-chain purchase succeeded, DB record is secondary
          }
        }

        return result
      } catch (error: any) {
        // Handle user rejection
        if (error?.code === 4001 || error?.message?.includes('User rejected')) {
          throw new Error('Transaction rejected by user')
        }
        // Handle insufficient allowance
        if (
          error?.message?.includes('insufficient allowance') ||
          error?.message?.includes('ERC20: insufficient allowance')
        ) {
          throw new Error('Insufficient token allowance. Please approve first.')
        }
        // Handle course not found or inactive
        if (
          error?.message?.includes('course does not exist') ||
          error?.message?.includes('not active')
        ) {
          throw new Error('Course is not available for purchase')
        }
        // Handle already purchased
        if (
          error?.message?.includes('already purchased') ||
          error?.message?.includes('hasPurchased')
        ) {
          throw new Error('You have already purchased this course')
        }
        // Re-throw with original message
        throw new Error(error?.message || 'Purchase transaction failed')
      }
    },
    onSuccess: () => {
      toast.success('Course purchased successfully!')
      // Invalidate courses query to refresh ownership status
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
    onError: (error: Error) => {
      console.error('Purchase error:', error)
      const errorMessage =
        error.message || 'Failed to purchase course. Please try again.'
      toast.error(`Purchase failed: ${errorMessage}`)
    },
  })
}

export function useCheckAllowance() {
  const { readContract, address } = useWeb3()

  return async (coursePrice: string): Promise<boolean> => {
    if (!address) return false

    if (
      COURSE_MANAGER_ADDRESS === '0x0000000000000000000000000000000000000000' ||
      YD_TOKEN_ADDRESS === '0x0000000000000000000000000000000000000000'
    ) {
      return false
    }

    try {
      const allowance = (await readContract({
        abi: YDTokenABI.abi as any,
        address: YD_TOKEN_ADDRESS,
        functionName: 'allowance',
        args: [address, COURSE_MANAGER_ADDRESS],
      })) as bigint

      // Parse price - YD Token has 0 decimals per README
      // So price string like "10" means 10 tokens (no decimal places)
      const priceInSmallestUnit = BigInt(Math.floor(parseFloat(coursePrice)))

      return allowance >= priceInSmallestUnit
    } catch (error) {
      console.error('Error checking allowance:', error)
      return false
    }
  }
}
