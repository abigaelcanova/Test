import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createVisit } from '../api'
import type { CreateVisitPayload } from '../api'
import type { Visit } from '@/msw/types'

/**
 * Hook to create a new visit
 */
export const useCreateVisit = () => {
  const queryClient = useQueryClient()

  return useMutation<Visit, Error, CreateVisitPayload>({
    mutationFn: async (data) => {
      console.log('[useCreateVisit] Creating visit:', data)
      const result = await createVisit(data)
      console.log('[useCreateVisit] Visit created:', result.id)
      return result
    },
    onSuccess: (data) => {
      console.log('[useCreateVisit] onSuccess - Invalidating queries for visit:', data.id)
      // Invalidate and refetch all visits queries (with any params)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
    onError: (error) => {
      console.error('[useCreateVisit] Error creating visit:', error)
    },
  })
}

