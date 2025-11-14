import type { Visit } from '@/msw/types'

const API_BASE_URL = '/api'

/**
 * Type for creating a new visit (omits id and status which are set by server)
 */
export type CreateVisitPayload = Omit<Visit, 'id' | 'status'> & {
  status?: Visit['status'] // Optional, defaults to 'expected'
}

/**
 * Type for updating a visit (all fields optional except id)
 */
export type UpdateVisitPayload = Partial<Omit<Visit, 'id'>> & {
  id: number
}

/**
 * Query parameters for filtering visits
 */
export type VisitsQueryParams = {
  search?: string
  date?: string
  dateStart?: string
  dateEnd?: string
  host?: string[]
  company?: string[]
  status?: string[]
}

/**
 * Fetches all visits from the API with optional filtering
 */
export const fetchVisits = async (queryParams?: VisitsQueryParams): Promise<Visit[]> => {
  // Build query string from params
  let url = `${API_BASE_URL}/visits`
  const searchParams = new URLSearchParams()
  
  if (queryParams) {
    if (queryParams.search) {
      searchParams.set('search', queryParams.search)
    }
    if (queryParams.date) {
      searchParams.set('date', queryParams.date)
    }
    if (queryParams.dateStart) {
      searchParams.set('dateStart', queryParams.dateStart)
    }
    if (queryParams.dateEnd) {
      searchParams.set('dateEnd', queryParams.dateEnd)
    }
    if (queryParams.host && queryParams.host.length > 0) {
      searchParams.set('host', queryParams.host.join(','))
    }
    if (queryParams.company && queryParams.company.length > 0) {
      searchParams.set('company', queryParams.company.join(','))
    }
    if (queryParams.status && queryParams.status.length > 0) {
      searchParams.set('status', queryParams.status.join(','))
    }
  }
  
  const queryString = searchParams.toString()
  if (queryString) {
    url += `?${queryString}`
  }
  
  const response = await fetch(url)
  
  if (!response.ok) {
    console.error('[API] fetchVisits failed:', response.statusText)
    throw new Error(`Failed to fetch visits: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

/**
 * Creates a new visit
 */
export const createVisit = async (visitData: CreateVisitPayload): Promise<Visit> => {
  const response = await fetch(`${API_BASE_URL}/visits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitData),
  })
  
  if (!response.ok) {
    console.error('[API] createVisit failed:', response.statusText)
    throw new Error(`Failed to create visit: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

/**
 * Updates an existing visit
 */
export const updateVisit = async (id: number, visitData: Partial<Omit<Visit, 'id'>>): Promise<Visit> => {
  const response = await fetch(`${API_BASE_URL}/visits/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(visitData),
  })
  
  if (!response.ok) {
    console.error('[API] updateVisit failed:', response.statusText)
    throw new Error(`Failed to update visit: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

/**
 * Cancels a visit (updates status to 'cancelled')
 */
export const cancelVisit = async (id: number, cancelAllFuture: boolean = false): Promise<Visit> => {
  const response = await fetch(`${API_BASE_URL}/visits/${id}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ cancelAllFuture }),
  })
  
  if (!response.ok) {
    console.error('[API] cancelVisit failed:', response.statusText)
    throw new Error(`Failed to cancel visit: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data
}

