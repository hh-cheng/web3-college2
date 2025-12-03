import { useQuery } from '@tanstack/react-query'

import useWeb3 from '@/lib/hooks/useWeb3'
import { YD_FAUCET_ADDRESS } from '@/lib/config/contracts'
import YDFaucetABI from '@/app/abi/YDFaucet.json'

export default function useFaucet() {
  const { readContract, address, chainID } = useWeb3()

  // Fetch claim amount
  const {
    data: claimAmount,
    isLoading: isLoadingAmount,
    error: amountError,
  } = useQuery({
    enabled:
      !!chainID &&
      YD_FAUCET_ADDRESS !== '0x0000000000000000000000000000000000000000',
    queryKey: ['faucet', 'amountPerClaim', chainID],
    queryFn: async () => {
      if (!chainID) throw new Error('Chain ID not available')

      const amount = (await readContract({
        abi: YDFaucetABI.abi as any,
        address: YD_FAUCET_ADDRESS,
        functionName: 'amountPerClaim',
        args: [],
      })) as bigint

      return amount
    },
  })

  // Check if user has claimed
  const {
    data: hasClaimed,
    isLoading: isLoadingClaimStatus,
    error: claimStatusError,
  } = useQuery({
    enabled:
      !!address &&
      !!chainID &&
      YD_FAUCET_ADDRESS !== '0x0000000000000000000000000000000000000000',
    queryKey: ['faucet', 'hasClaimed', address, chainID],
    queryFn: async () => {
      if (!address) throw new Error('Address not available')

      const claimed = (await readContract({
        abi: YDFaucetABI.abi as any,
        address: YD_FAUCET_ADDRESS,
        functionName: 'hasClaimed',
        args: [address],
      })) as boolean

      return claimed
    },
  })

  return {
    claimAmount,
    hasClaimed,
    isLoadingAmount,
    isLoadingClaimStatus,
    isLoading: isLoadingAmount || isLoadingClaimStatus,
    amountError,
    claimStatusError,
    address,
    chainID,
  }
}
