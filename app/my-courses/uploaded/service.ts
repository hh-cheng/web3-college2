import { useQuery } from '@tanstack/react-query'

import { getUploadedCourses } from './actions'
import useWeb3 from '@/lib/hooks/useWeb3'

export default function useUploadedCourses() {
  const { address, chainID, connect, isConnecting } = useWeb3()

  const { data, isLoading, error } = useQuery({
    enabled: !!address && !!chainID,
    queryKey: ['uploaded-courses', address, chainID],
    queryFn: () => getUploadedCourses(address!, chainID!),
  })

  return { data, isLoading, error, address, chainID, connect, isConnecting }
}
