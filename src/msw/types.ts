export type VisitStatus = 'expected' | 'checked-in' | 'checked-out' | 'cancelled'
export type CheckInType = 'standard' | 'bypass'
export type RecurringFrequency = 'weekly' | 'daily' | 'monthly' | 'weekdays'

export interface Visit {
  id: number
  visitorName: string
  visitorCompany?: string
  visitorEmail?: string // Comma-separated for multiple visitors
  visitorPhone?: string // Comma-separated for multiple visitors
  date: string // YYYY-MM-DD format
  startTime: string // HH:MM format
  endTime: string // HH:MM format
  host: string
  company?: string
  floor: string
  suite: string
  status: VisitStatus
  checkIn: CheckInType
  numEntries: string
  recurring?: boolean
  frequency?: RecurringFrequency
  visitSummary?: string
}

