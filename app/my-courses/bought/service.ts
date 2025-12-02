import { useQuery } from '@tanstack/react-query'

import useWeb3 from '@/lib/hooks/useWeb3'
import { getBoughtCourses } from './actions'

export default function useBoughtCourses() {
  const { address, chainID, connect, isConnecting } = useWeb3()

  const { data, isLoading, error } = useQuery({
    enabled: !!address && !!chainID,
    queryKey: ['bought-courses', address, chainID],
    queryFn: () => getBoughtCourses(address!, chainID!),
  })

  return { data, isLoading, error, address, chainID, connect, isConnecting }
}
