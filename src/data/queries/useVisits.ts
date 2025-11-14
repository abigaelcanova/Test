import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { fetchVisits, type VisitsQueryParams } from '../api'
import type { Visit } from '@/msw/types'

/**
 * Normalize query params to ensure consistent query key generation
 * This ensures that objects with the same values produce the same key
 */
const normalizeParams = (params?: VisitsQueryParams): VisitsQueryParams | undefined => {
  if (!params || Object.keys(params).length === 0) {
    return undefined
  }
  
  // Create a new object with only defined values, sorted by key for consistency
  const normalized: VisitsQueryParams = {}
  
  if (params.search) normalized.search = params.search
  if (params.date) normalized.date = params.date
  if (params.dateStart) normalized.dateStart = params.dateStart
  if (params.dateEnd) normalized.dateEnd = params.dateEnd
  if (params.host && params.host.length > 0) normalized.host = [...params.host].sort()
  if (params.company && params.company.length > 0) normalized.company = [...params.company].sort()
  if (params.status && params.status.length > 0) normalized.status = [...params.status].sort()
  
  return Object.keys(normalized).length > 0 ? normalized : undefined
}

/**
 * Query key factory for visits
 * Serializes params to ensure React Query detects changes
 */
export const visitsQueryKey = (params?: VisitsQueryParams) => {
  const normalized = normalizeParams(params)
  // Serialize to string to ensure React Query detects changes
  const serialized = normalized ? JSON.stringify(normalized) : undefined
  return ['visits', serialized] as const
}

/**
 * Hook to fetch visits with optional filtering
 */
export const useVisits = (queryParams?: VisitsQueryParams) => {
  // Memoize the query key to ensure it updates when params change
  const queryKey = useMemo(() => visitsQueryKey(queryParams), [JSON.stringify(queryParams)])
  
  return useQuery<Visit[]>({
    queryKey,
    queryFn: async () => {
      const result = await fetchVisits(queryParams)
      return result
    },
  })
}

