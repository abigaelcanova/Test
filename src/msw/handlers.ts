import { http, HttpResponse } from 'msw'
import type { Visit } from './types'

// In-memory store for visits (persists across requests)
let visitsStore: Visit[] = []

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

// Generate visits with dates computed from today
const generateVisits = (): Visit[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Reset to start of day
  
  // Base visit data from App.jsx
  const baseVisits: Omit<Visit, 'date'>[] = [
    {
      id: 1,
      visitorName: 'Jennifer Lee',
      visitorCompany: 'CloudTech Solutions',
      visitorEmail: 'jennifer.lee@cloudtech.com',
      visitorPhone: '+1-555-0101',
      startTime: '09:00',
      endTime: '10:00',
      host: 'John Smith',
      company: 'Acme Corporation',
      floor: '3',
      suite: '301',
      status: 'expected',
      checkIn: 'standard',
      numEntries: '1',
      recurring: true,
      frequency: 'weekly',
      visitSummary: 'Quarterly business review'
    },
    {
      id: 2,
      visitorName: 'Christopher Taylor',
      visitorCompany: 'Digital Ventures',
      visitorEmail: 'ctaylor@digitalventures.com',
      visitorPhone: '+1-555-0102',
      startTime: '14:00',
      endTime: '15:30',
      host: 'Sarah Johnson',
      company: 'Tech Innovations Inc',
      floor: '5',
      suite: '502',
      status: 'expected',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Product demo and partnership discussion'
    },
    {
      id: 3,
      visitorName: 'Amanda Anderson',
      visitorCompany: 'Strategic Partners Inc',
      visitorEmail: 'a.anderson@strategicpartners.com',
      visitorPhone: '+1-555-0103',
      startTime: '11:30',
      endTime: '13:00',
      host: 'Michael Chen',
      company: 'Global Solutions',
      floor: '2',
      suite: '205',
      status: 'expected',
      checkIn: 'bypass',
      numEntries: '2',
      visitSummary: 'Contract negotiation and lunch meeting'
    },
    {
      id: 4,
      visitorName: 'Matthew Thomas',
      visitorCompany: 'Creative Design Co',
      visitorEmail: 'mthomas@creativedesign.com',
      visitorPhone: '+1-555-0104',
      startTime: '15:30',
      endTime: '17:00',
      host: 'Emily Davis',
      company: 'Design Studio LLC',
      floor: '4',
      suite: '401',
      status: 'expected',
      checkIn: 'standard',
      numEntries: '1',
      recurring: true,
      frequency: 'daily',
      visitSummary: 'Design consultation'
    },
    {
      id: 5,
      visitorName: 'Lisa Rodriguez',
      visitorCompany: 'Brand Marketing Group',
      visitorEmail: 'lisa.r@brandmarketing.com',
      visitorPhone: '+1-555-0105',
      startTime: '10:00',
      endTime: '11:30',
      host: 'David Wilson',
      company: 'Marketing Pro',
      floor: '1',
      suite: '102',
      status: 'expected',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Marketing campaign review'
    },
    {
      id: 6,
      visitorName: 'Robert Brown',
      visitorCompany: 'Business Strategy LLC',
      visitorEmail: 'rbrown@bizstrategy.com',
      visitorPhone: '+1-555-0106',
      startTime: '13:00',
      endTime: '14:30',
      host: 'Sarah Johnson',
      company: 'Consulting Group',
      floor: '3',
      suite: '310',
      status: 'expected',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Strategic planning session'
    },
    {
      id: 7,
      visitorName: 'Jessica Martinez',
      visitorCompany: 'Finance & Audit Corp',
      visitorEmail: 'j.martinez@financeaudit.com',
      visitorPhone: '+1-555-0107',
      startTime: '09:30',
      endTime: '11:00',
      host: 'John Smith',
      company: 'Financial Services',
      floor: '5',
      suite: '505',
      status: 'expected',
      checkIn: 'bypass',
      numEntries: '3',
      visitSummary: 'Financial audit and compliance review'
    },
    // Past visits
    {
      id: 8,
      visitorName: 'Daniel Garcia',
      visitorCompany: 'Innovation Labs',
      visitorEmail: 'd.garcia@innovationlabs.com',
      visitorPhone: '+1-555-0108',
      startTime: '10:00',
      endTime: '11:00',
      host: 'Michael Chen',
      company: 'Tech Startup Inc',
      floor: '2',
      suite: '201',
      status: 'checked-in',
      checkIn: 'standard',
      numEntries: '1',
      recurring: true,
      frequency: 'monthly',
      visitSummary: 'Monthly check-in meeting'
    },
    {
      id: 9,
      visitorName: 'Patricia White',
      visitorCompany: 'Health Systems Inc',
      visitorEmail: 'pwhite@healthsystems.com',
      visitorPhone: '+1-555-0109',
      startTime: '14:30',
      endTime: '16:00',
      host: 'Emily Davis',
      company: 'Healthcare Partners',
      floor: '4',
      suite: '402',
      status: 'checked-in',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Healthcare partnership proposal'
    },
    {
      id: 10,
      visitorName: 'James Miller',
      visitorCompany: 'Property Development Group',
      visitorEmail: 'j.miller@propertydev.com',
      visitorPhone: '+1-555-0110',
      startTime: '11:00',
      endTime: '12:30',
      host: 'David Wilson',
      company: 'Real Estate Group',
      floor: '1',
      suite: '105',
      status: 'cancelled',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Property investment discussion'
    },
    {
      id: 11,
      visitorName: 'Maria Lopez',
      visitorCompany: 'Learning Solutions',
      visitorEmail: 'maria.lopez@learningsolutions.com',
      visitorPhone: '+1-555-0111',
      startTime: '09:00',
      endTime: '10:30',
      host: 'Sarah Johnson',
      company: 'Education Services',
      floor: '3',
      suite: '305',
      status: 'checked-in',
      checkIn: 'standard',
      numEntries: '1',
      recurring: true,
      frequency: 'weekdays',
      visitSummary: 'Training session'
    },
    {
      id: 12,
      visitorName: 'Thomas Scott',
      visitorCompany: 'Industrial Systems Co',
      visitorEmail: 'tscott@industrialsystems.com',
      visitorPhone: '+1-555-0112',
      startTime: '15:00',
      endTime: '16:30',
      host: 'John Smith',
      company: 'Manufacturing Co',
      floor: '5',
      suite: '501',
      status: 'checked-out',
      checkIn: 'standard',
      numEntries: '1',
      visitSummary: 'Supply chain optimization meeting'
    },
    {
      id: 13,
      visitorName: 'Sandra Hall',
      visitorCompany: 'Legal Advisory Services',
      visitorEmail: 's.hall@legaladvisory.com',
      visitorPhone: '+1-555-0113',
      startTime: '10:30',
      endTime: '12:00',
      host: 'Michael Chen',
      company: 'Legal Associates',
      floor: '2',
      suite: '208',
      status: 'checked-in',
      checkIn: 'bypass',
      numEntries: '2',
      visitSummary: 'Legal compliance and contract review'
    }
  ]

  // Date offsets: spread visits across past, today, and future
  // First 3 are in the past, rest are today and future
  const dateOffsets = [
    -7,  // 1 week ago
    -5,  // 5 days ago
    -2,  // 2 days ago
    0,   // today
    0,   // today
    0,   // today
    0,   // today
    1,   // tomorrow
    2,   // 2 days from now
    2,   // 3 days from now
    3,   // 5 days from now
    3,   // 1 week from now
    3,  // 10 days from now
  ]

  // Status assignments based on date
  // Past visits (indices 0-2): checked-out
  // Today's visits (indices 3-6): mix of expected and checked-in
  // Future visits (indices 7-12): expected, except one cancelled (index 9)
  const statusAssignments = [
    'checked-out',  // index 0: past
    'checked-out',  // index 1: past
    'checked-out',  // index 2: past
    'expected',     // index 3: today
    'checked-in',   // index 4: today
    'expected',     // index 5: today
    'checked-in',   // index 6: today
    'expected',     // index 7: future
    'expected',     // index 8: future
    'cancelled',    // index 9: future (one cancelled)
    'expected',     // index 10: future
    'expected',     // index 11: future
    'expected',     // index 12: future
  ]

  return baseVisits.map((visit, index) => {
    const visitDate = addDays(today, dateOffsets[index])
    return {
      ...visit,
      date: formatDate(visitDate),
      status: statusAssignments[index] as Visit['status']
    }
  })
}

// Initialize store with generated visits if empty
const initializeStore = () => {
  if (visitsStore.length === 0) {
    visitsStore = generateVisits()
  }
}

export const handlers = [
  // Handler for GET /api/visits - returns visits from store with optional filtering
  http.get('/api/visits', ({ request }) => {
    console.log('[MSW] GET /api/visits handler called')
    initializeStore()
    
    // Extract query parameters
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const date = url.searchParams.get('date') || ''
    const dateStart = url.searchParams.get('dateStart') || ''
    const dateEnd = url.searchParams.get('dateEnd') || ''
    const host = url.searchParams.get('host') || ''
    const company = url.searchParams.get('company') || ''
    const status = url.searchParams.get('status') || ''
    
    console.log('[MSW] GET /api/visits query params:', { search, date, dateStart, dateEnd, host, company, status })
    
    // Filter visits based on query parameters
    let filtered = [...visitsStore]
    
    // Search filter (case-insensitive, searches in multiple fields)
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(visit => {
        return (
          visit.visitorName?.toLowerCase().includes(searchLower) ||
          visit.visitorEmail?.toLowerCase().includes(searchLower) ||
          visit.visitorPhone?.toLowerCase().includes(searchLower) ||
          visit.visitorCompany?.toLowerCase().includes(searchLower) ||
          visit.host?.toLowerCase().includes(searchLower) ||
          visit.visitSummary?.toLowerCase().includes(searchLower) ||
          visit.floor?.toLowerCase().includes(searchLower) ||
          visit.suite?.toLowerCase().includes(searchLower)
        )
      })
    }
    
    // Date filter - exact match
    if (date) {
      filtered = filtered.filter(visit => visit.date === date)
    }
    
    // Date range filter - start date
    if (dateStart) {
      filtered = filtered.filter(visit => visit.date >= dateStart)
    }
    
    // Date range filter - end date
    if (dateEnd) {
      filtered = filtered.filter(visit => visit.date <= dateEnd)
    }
    
    // Host filter (supports comma-separated values)
    if (host) {
      const hostValues = host.split(',').map(h => h.trim())
      filtered = filtered.filter(visit => 
        visit.host && hostValues.some(h => visit.host === h)
      )
    }
    
    // Company filter (supports comma-separated values)
    if (company) {
      const companyValues = company.split(',').map(c => c.trim())
      filtered = filtered.filter(visit => 
        visit.company && companyValues.some(c => visit.company === c)
      )
    }
    
    // Status filter (supports comma-separated values)
    if (status) {
      const statusValues = status.split(',').map(s => s.trim())
      filtered = filtered.filter(visit => 
        statusValues.includes(visit.status)
      )
    }
    
    console.log('[MSW] GET /api/visits returning', filtered.length, 'filtered visits out of', visitsStore.length, 'total')
    return HttpResponse.json(filtered)
  }),

  // Handler for POST /api/visits - creates a new visit
  http.post('/api/visits', async ({ request }) => {
    console.log('[MSW] POST /api/visits handler called')
    initializeStore()
    const visitData = await request.json() as Omit<Visit, 'id'> & { status?: Visit['status'] }
    console.log('[MSW] POST /api/visits data:', visitData)
    
    const newVisit: Visit = {
      id: Date.now(), // Generate ID
      status: visitData.status || 'expected',
      visitorName: visitData.visitorName,
      visitorCompany: visitData.visitorCompany,
      visitorEmail: visitData.visitorEmail,
      visitorPhone: visitData.visitorPhone,
      date: visitData.date,
      startTime: visitData.startTime,
      endTime: visitData.endTime,
      host: visitData.host,
      company: visitData.company,
      floor: visitData.floor,
      suite: visitData.suite,
      checkIn: visitData.checkIn,
      numEntries: visitData.numEntries,
      recurring: visitData.recurring,
      frequency: visitData.frequency,
      visitSummary: visitData.visitSummary,
    }
    
    visitsStore.push(newVisit)
    console.log('[MSW] POST /api/visits created visit with id:', newVisit.id, 'Total visits:', visitsStore.length)
    return HttpResponse.json(newVisit, { status: 201 })
  }),

  // Handler for PUT /api/visits/:id - updates an existing visit
  http.put('/api/visits/:id', async ({ params, request }) => {
    console.log('[MSW] PUT /api/visits/:id handler called for id:', params.id)
    initializeStore()
    const id = Number(params.id)
    const updateData = await request.json() as Partial<Omit<Visit, 'id'>>
    console.log('[MSW] PUT /api/visits/:id update data:', updateData)
    
    const visitIndex = visitsStore.findIndex(v => v.id === id)
    if (visitIndex === -1) {
      console.error('[MSW] PUT /api/visits/:id visit not found:', id)
      return HttpResponse.json({ error: 'Visit not found' }, { status: 404 })
    }
    
    const updatedVisit: Visit = {
      ...visitsStore[visitIndex],
      ...updateData,
      id, // Ensure ID doesn't change
    }
    
    visitsStore[visitIndex] = updatedVisit
    console.log('[MSW] PUT /api/visits/:id updated visit:', id)
    return HttpResponse.json(updatedVisit)
  }),

  // Handler for PATCH /api/visits/:id/cancel - cancels a visit
  http.patch('/api/visits/:id/cancel', async ({ params, request }) => {
    console.log('[MSW] PATCH /api/visits/:id/cancel handler called for id:', params.id)
    initializeStore()
    const id = Number(params.id)
    const { cancelAllFuture } = await request.json() as { cancelAllFuture?: boolean }
    console.log('[MSW] PATCH /api/visits/:id/cancel cancelAllFuture:', cancelAllFuture)
    
    const visitIndex = visitsStore.findIndex(v => v.id === id)
    if (visitIndex === -1) {
      console.error('[MSW] PATCH /api/visits/:id/cancel visit not found:', id)
      return HttpResponse.json({ error: 'Visit not found' }, { status: 404 })
    }
    
    const visit = visitsStore[visitIndex]
    const updatedVisit: Visit = {
      ...visit,
      status: 'cancelled',
      ...(cancelAllFuture && visit.recurring ? { recurring: false } : {}),
    }
    
    visitsStore[visitIndex] = updatedVisit
    console.log('[MSW] PATCH /api/visits/:id/cancel cancelled visit:', id)
    return HttpResponse.json(updatedVisit)
  }),

  // Handler for DELETE /api/visits/:id - sets status to cancelled instead of deleting
  http.delete('/api/visits/:id', async ({ params }) => {
    console.log('[MSW] DELETE /api/visits/:id handler called for id:', params.id)
    initializeStore()
    const id = Number(params.id)
    
    const visitIndex = visitsStore.findIndex(v => v.id === id)
    if (visitIndex === -1) {
      console.error('[MSW] DELETE /api/visits/:id visit not found:', id)
      return HttpResponse.json({ error: 'Visit not found' }, { status: 404 })
    }
    
    const visit = visitsStore[visitIndex]
    const updatedVisit: Visit = {
      ...visit,
      status: 'cancelled',
    }
    
    visitsStore[visitIndex] = updatedVisit
    console.log('[MSW] DELETE /api/visits/:id set visit to cancelled:', id)
    return HttpResponse.json(updatedVisit)
  }),
]
