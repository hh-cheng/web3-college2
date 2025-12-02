import { useQuery } from '@tanstack/react-query'

import { getCourses } from './actions'
import useWeb3 from '@/lib/hooks/useWeb3'

export default function useMarket() {
  const { chainID, address, connect, isConnecting } = useWeb3()

  const { data, isLoading, error } = useQuery({
    enabled: !!chainID,
    queryKey: ['courses', chainID, address],
    queryFn: () => getCourses(chainID!, address || undefined),
  })

  return { data, isLoading, error, chainID, address, connect, isConnecting }
}
