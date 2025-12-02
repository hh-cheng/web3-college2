'use client'

import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import useWeb3 from '@/lib/hooks/useWeb3'
import { COURSE_MANAGER_ADDRESS } from '@/lib/config/contracts'
import CourseManagerABI from '@/app/abi/CourseManager.json'

export function useCreateCourseOnChain() {
  const { writeContract, address, chainID } = useWeb3()

  return useMutation({
    mutationFn: async ({
      price,
      metadataUri,
    }: {
      price: string
      metadataUri: string
    }) => {
      if (!address || !chainID) {
        throw new Error('Wallet not connected')
      }

      if (
        COURSE_MANAGER_ADDRESS === '0x0000000000000000000000000000000000000000'
      ) {
        throw new Error('CourseManager contract address not configured')
      }

      // YD Token has 0 decimals, so parse price as integer
      const priceInSmallestUnit = BigInt(Math.floor(parseFloat(price)))

      if (priceInSmallestUnit <= BigInt(0)) {
        throw new Error('Price must be greater than 0')
      }

      try {
        const result = await writeContract({
          abi: CourseManagerABI.abi as any,
          address: COURSE_MANAGER_ADDRESS,
          functionName: 'createCourse',
          args: [priceInSmallestUnit, metadataUri],
          waitForReceipt: true,
        })

        // Parse the course ID from the event logs
        const courseCreatedEvent = result.receipt?.logs.find((log: any) => {
          // CourseCreated event signature
          const eventSignature =
            '0x4d626564656e74206973207468697320636f7572736520637265617465640000'
          return log.topics && log.topics.length > 1
        })

        let courseId: bigint
        if (
          courseCreatedEvent &&
          courseCreatedEvent.topics &&
          courseCreatedEvent.topics[1]
        ) {
          // Course ID is the second topic (first is event signature)
          courseId = BigInt(courseCreatedEvent.topics[1])
        } else {
          // Fallback: assume it's the next course ID
          // In production, you should query the contract for nextCourseId - 1
          console.warn(
            'Could not find CourseCreated event, assuming courseId from nextCourseId',
          )
          throw new Error('Failed to get course ID from transaction')
        }

        return {
          courseId,
          transactionHash: result.receipt?.transactionHash,
        }
      } catch (error: any) {
        // Handle user rejection
        if (error?.code === 4001 || error?.message?.includes('User rejected')) {
          throw new Error('Transaction rejected by user')
        }
        // Re-throw with original message
        throw new Error(error?.message || 'Failed to create course on-chain')
      }
    },
    onError: (error: Error) => {
      console.error('Create course error:', error)
      toast.error(`Failed to create course: ${error.message}`)
    },
  })
}
