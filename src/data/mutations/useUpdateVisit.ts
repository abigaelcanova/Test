import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateVisit } from '../api'
import type { Visit } from '@/msw/types'

/**
 * Hook to update an existing visit
 */
export const useUpdateVisit = () => {
  const queryClient = useQueryClient()

  return useMutation<Visit, Error, { id: number; data: Partial<Omit<Visit, 'id'>> }>({
    mutationFn: async ({ id, data }) => {
      const result = await updateVisit(id, data)
      return result
    },
    onSuccess: () => {
      // Invalidate and refetch all visits queries (with any params)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
    onError: (error) => {
      console.error('[useUpdateVisit] Error updating visit:', error)
    },
  })
}

