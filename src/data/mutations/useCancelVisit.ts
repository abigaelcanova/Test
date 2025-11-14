import { useMutation, useQueryClient } from '@tanstack/react-query'
import { cancelVisit } from '../api'
import type { Visit } from '@/msw/types'

/**
 * Hook to cancel a visit
 */
export const useCancelVisit = () => {
  const queryClient = useQueryClient()

  return useMutation<Visit, Error, { id: number; cancelAllFuture?: boolean }>({
    mutationFn: async ({ id, cancelAllFuture }) => {
      const result = await cancelVisit(id, cancelAllFuture ?? false)
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch all visits queries (with any params)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
    onError: (error) => {
      console.error('[useCancelVisit] Error cancelling visit:', error)
    },
  })
}

