import { useQuery } from '@tanstack/react-query'

import { getCourses } from './actions'
import useWeb3 from '@/lib/hooks/useWeb3'

export default function useMarket() {
  const { chainID, connect, isConnecting } = useWeb3()

  const { data, isLoading, error } = useQuery({
    enabled: !!chainID,
    queryKey: ['courses', chainID],
    queryFn: () => getCourses(chainID!),
  })

  return { data, isLoading, error, chainID, connect, isConnecting }
}
