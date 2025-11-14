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
      console.log('[useCancelVisit] Cancelling visit:', id, 'cancelAllFuture:', cancelAllFuture)
      const result = await cancelVisit(id, cancelAllFuture ?? false)
      console.log('[useCancelVisit] Visit cancelled:', result.id)
      return result
    },
    onSuccess: (data) => {
      console.log('[useCancelVisit] onSuccess - Invalidating queries for visit:', data.id)
      // Invalidate and refetch all visits queries (with any params)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
    onError: (error) => {
      console.error('[useCancelVisit] Error cancelling visit:', error)
    },
  })
}

