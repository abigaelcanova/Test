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
      const result = await createVisit(data)
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch all visits queries (with any params)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
    onError: (error) => {
      console.error('[useCreateVisit] Error creating visit:', error)
    },
  })
}

