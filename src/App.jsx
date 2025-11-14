import { useState, useMemo, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Plus, Search, X, Download, Pin, SlidersHorizontal, Repeat } from "lucide-react"
import { VisitorCard } from "@/components/VisitorCard"
import { VisitorTable } from "@/components/VisitorTable"
import { EmptyState } from "@/components/EmptyState"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { UpdateConfirmationModal } from "@/components/UpdateConfirmationModal"
import { MultiSelectFilter } from "@/components/MultiSelectFilter"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePickerWithPresets } from "@/components/DatePickerWithPresets"
import { formatDate, formatTime, cn } from "@/lib/utils"
import { useVisits } from "@/data/queries/useVisits"
import { useCreateVisit } from "@/data/mutations/useCreateVisit"
import { useUpdateVisit } from "@/data/mutations/useUpdateVisit"
import { useCancelVisit } from "@/data/mutations/useCancelVisit"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Helper to get today's date in user's local timezone (YYYY-MM-DD format)
  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState(() => getLocalDateString()) // Default to today
  const [filterDateEnd, setFilterDateEnd] = useState("") // End date for range filters
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("today") // Default to today
  const [filterHosts, setFilterHosts] = useState([])
  const [filterHostCompanies, setFilterHostCompanies] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])
  
  // Helper function to get date range for time frames
  const getTimeFrameDateRange = (timeFrame) => {
    const today = new Date()
    const todayStr = getLocalDateString(today)
    
    switch (timeFrame) {
      case 'today':
        return { start: todayStr, end: todayStr }
      case 'thisWeek': {
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
        const endOfWeek = new Date(startOfWeek)
        endOfWeek.setDate(startOfWeek.getDate() + 6) // Saturday
        return { 
          start: getLocalDateString(startOfWeek), 
          end: getLocalDateString(endOfWeek) 
        }
      }
      case 'thisMonth': {
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        return { 
          start: getLocalDateString(startOfMonth), 
          end: getLocalDateString(endOfMonth) 
        }
      }
      case 'nextWeek': {
        const nextWeekStart = new Date(today)
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()))
        const nextWeekEnd = new Date(nextWeekStart)
        nextWeekEnd.setDate(nextWeekStart.getDate() + 6) // Saturday
        return { 
          start: getLocalDateString(nextWeekStart), 
          end: getLocalDateString(nextWeekEnd) 
        }
      }
      case 'nextMonth': {
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0)
        return { 
          start: getLocalDateString(nextMonthStart), 
          end: getLocalDateString(nextMonthEnd) 
        }
      }
      default:
        return { start: '', end: '' }
    }
  }
  
  // Build query params from filter state
  const queryParams = useMemo(() => {
    const params = {}
    
    // Search query
    if (searchQuery) {
      params.search = searchQuery
    }
    
    // Date filtering based on selectedTimeFrame
    if (selectedTimeFrame === 'today' && filterDate) {
      params.date = filterDate
    } else if (selectedTimeFrame === 'custom') {
      if (filterDate) params.dateStart = filterDate
      if (filterDateEnd) params.dateEnd = filterDateEnd
    } else if (selectedTimeFrame && filterDate) {
      // For time frames like thisWeek, thisMonth, etc., use dateStart and dateEnd
      // But respect manually selected end date if set
      const range = getTimeFrameDateRange(selectedTimeFrame)
      if (range.start) params.dateStart = range.start
      // Use manually selected end date if available, otherwise use computed range end
      if (filterDateEnd) {
        params.dateEnd = filterDateEnd
      } else if (range.end) {
        params.dateEnd = range.end
      }
    } else if (!selectedTimeFrame && filterDate) {
      // Manual date selection (selectedTimeFrame is empty string) - treat as single date
      params.date = filterDate
    }
    
    // Host filter
    if (filterHosts.length > 0) {
      params.host = filterHosts
    }
    
    // Company filter
    if (filterHostCompanies.length > 0) {
      params.company = filterHostCompanies
    }
    
    // Status filter
    if (filterStatuses.length > 0) {
      params.status = filterStatuses
    }
    
    return params
  }, [searchQuery, filterDate, filterDateEnd, selectedTimeFrame, filterHosts, filterHostCompanies, filterStatuses])
  
  // Fetch visits using TanStack Query with filter params
  const { data: visitsData = [], isLoading: isLoadingVisits, error } = useVisits(queryParams)
  
  // Mutation hooks
  const createVisitMutation = useCreateVisit()
  const updateVisitMutation = useUpdateVisit()
  const cancelVisitMutation = useCancelVisit()
  
  // Use query data as source of truth
  const visits = visitsData
  
  // Track processed visit submissions to prevent duplicate processing
  const processedVisitRef = useRef(null)
  
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] = useState(false)
  const [confirmedVisit, setConfirmedVisit] = useState(null)
  const isLoading = isLoadingVisits
  const [isPinned, setIsPinned] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [visitToCancel, setVisitToCancel] = useState(null)

  const handleEditVisit = (visit) => {
    navigate('/visits/new', { state: { editingVisit: visit } })
  }

  const handleEditStep = (step) => {
    // Close confirmation modal and navigate to visit creation at specific step
    setIsConfirmationOpen(false)
    setIsUpdateConfirmationOpen(false)
    navigate('/visits/new', { state: { editingVisit: confirmedVisit, initialStep: step } })
  }

  // Handle incoming visits from CreateVisitPage
  useEffect(() => {
    const newVisit = location.state?.newVisit
    const editingVisitId = location.state?.editingVisitId
    
    if (!newVisit) {
      // Reset processed ref when there's no new visit
      processedVisitRef.current = null
      return
    }
    
    // Create a unique key for this submission to prevent duplicate processing
    const submissionKey = `${editingVisitId || 'new'}-${JSON.stringify(newVisit).slice(0, 100)}`
    
    // Skip if we've already processed this submission
    if (processedVisitRef.current === submissionKey) {
      return
    }
    
    // Mark as processed immediately
    processedVisitRef.current = submissionKey
    
    // Clear the location state immediately to prevent re-triggering
    window.history.replaceState({}, document.title)
    
    const formData = newVisit
    
    // Create visit entries from form data
    const visitorNames = formData.visitors
      .filter(v => v.firstName && v.lastName)
      .map(v => `${v.firstName} ${v.lastName}`)
      .join(', ')
    
    // Extract visitor company (use first visitor's company, or join if multiple)
    const visitorCompanies = formData.visitors
      .filter(v => v.company)
      .map(v => v.company)
    const visitorCompany = visitorCompanies.length > 0 
      ? (visitorCompanies.length === 1 ? visitorCompanies[0] : visitorCompanies.join(', '))
      : undefined
    
    // Extract visitor emails (join with commas for multiple visitors)
    const visitorEmails = formData.visitors
      .filter(v => v.email)
      .map(v => v.email)
    const visitorEmail = visitorEmails.length > 0 
      ? (visitorEmails.length === 1 ? visitorEmails[0] : visitorEmails.join(', '))
      : undefined
    
    // Extract visitor phones (join with commas for multiple visitors)
    const visitorPhones = formData.visitors
      .filter(v => v.phone)
      .map(v => v.phone)
    const visitorPhone = visitorPhones.length > 0 
      ? (visitorPhones.length === 1 ? visitorPhones[0] : visitorPhones.join(', '))
      : undefined

    if (editingVisitId) {
      // Update existing visit
      const existingVisit = visits.find(v => v.id === editingVisitId)
      if (existingVisit) {
        updateVisitMutation.mutate(
          {
            id: editingVisitId,
            data: {
              visitorName: visitorNames,
              visitorCompany: visitorCompany,
              visitorEmail: visitorEmail,
              visitorPhone: visitorPhone,
              date: formData.visitDate,
              startTime: formData.startTime,
              endTime: formData.endTime,
              host: formData.hostName,
              floor: formData.floor,
              suite: formData.suite,
              visitSummary: formData.visitors?.[0]?.visitSummary || existingVisit.visitSummary,
            },
          },
          {
            onSuccess: () => {
              setConfirmedVisit({ ...formData, visitorName: visitorNames, visitorCompany: visitorCompany })
              setIsUpdateConfirmationOpen(true)
              // Reset processed ref after a delay to allow for new submissions
              setTimeout(() => {
                processedVisitRef.current = null
              }, 1000)
            },
          }
        )
      }
    } else {
      // Create new visit
      createVisitMutation.mutate(
        {
          visitorName: visitorNames,
          visitorCompany: visitorCompany,
          visitorEmail: visitorEmail,
          visitorPhone: visitorPhone,
          date: formData.visitDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          host: formData.hostName,
          floor: formData.floor,
          suite: formData.suite,
          status: 'expected',
          checkIn: formData.checkIn || 'standard',
          numEntries: formData.numEntries || '1',
          recurring: formData.recurring,
          frequency: formData.frequency,
          visitSummary: formData.visitors?.[0]?.visitSummary || formData.visitSummary,
        },
        {
          onSuccess: () => {
            setConfirmedVisit({ ...formData, visitorName: visitorNames, visitorCompany: visitorCompany })
            setIsConfirmationOpen(true)
            // Reset processed ref after a delay to allow for new submissions
            setTimeout(() => {
              processedVisitRef.current = null
            }, 1000)
          },
        }
      )
    }
    // Only depend on location.state to avoid re-running when visits or mutations change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state])

  const handleCancelVisit = (visitId) => {
    const visit = visits.find(v => v.id === visitId)
    setVisitToCancel(visit)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelVisit = (cancelAllFuture = false) => {
    if (visitToCancel) {
      cancelVisitMutation.mutate(
        {
          id: visitToCancel.id,
          cancelAllFuture: cancelAllFuture && visitToCancel.recurring,
        },
        {
          onSuccess: () => {
            setIsCancelDialogOpen(false)
            setVisitToCancel(null)
          },
        }
      )
    } else {
      setIsCancelDialogOpen(false)
      setVisitToCancel(null)
    }
  }

  // Get unique values for filter dropdowns
  const uniqueHosts = useMemo(() => {
    const hosts = [...new Set(visits.map(v => v.host).filter(Boolean))]
    return hosts.sort()
  }, [visits])

  const uniqueHostCompanies = useMemo(() => {
    const companies = [...new Set(visits.map(v => v.company).filter(Boolean))]
    return companies.sort()
  }, [visits])

  const availableStatuses = ['expected', 'checked-in', 'checked-out', 'cancelled']

  const getTodayDate = () => getLocalDateString()
  
  const getTimeFrameDates = (timeFrame) => {
    const today = new Date()
    
    switch (timeFrame) {
      case 'today':
        return getLocalDateString(today)
      case 'thisWeek':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
        return getLocalDateString(startOfWeek)
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        return getLocalDateString(startOfMonth)
      case 'nextWeek':
        const nextWeekStart = new Date(today)
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()))
        return getLocalDateString(nextWeekStart)
      case 'nextMonth':
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        return getLocalDateString(nextMonthStart)
      default:
        return ''
    }
  }

  // Separate visits into upcoming and past (client-side since it's a UI concern)
  // Server-side filtering already handles search, date, host, company, status filters
  // Get today's date string in local timezone for comparison
  const todayDateString = useMemo(() => {
    return getLocalDateString()
  }, [])
  
  // Check if we're filtering by a specific date (not a range)
  const isFilteringBySpecificDate = useMemo(() => {
    return selectedTimeFrame === 'today' && filterDate && !filterDateEnd
  }, [selectedTimeFrame, filterDate, filterDateEnd])
  
  // Check if we're filtering by a date range
  const isFilteringByDateRange = useMemo(() => {
    return !!(filterDate && filterDateEnd && filterDate !== filterDateEnd)
  }, [filterDate, filterDateEnd])
  
  const pastVisits = useMemo(() => {
    // If filtering by a specific date, show all cancelled visits for that date
    if (isFilteringBySpecificDate) {
      return visits.filter(v => v.status === 'cancelled')
    }
    // If filtering by a date range, show all cancelled visits in that range
    // (server already filtered by date range, so just filter by status)
    if (isFilteringByDateRange) {
      return visits.filter(v => v.status === 'cancelled')
    }
    // Otherwise, show past visits (before today or cancelled)
    // Compare date strings directly (YYYY-MM-DD format) to avoid timezone issues
    return visits.filter(v => {
      return v.date < todayDateString || v.status === 'cancelled'
    })
  }, [visits, todayDateString, isFilteringBySpecificDate, isFilteringByDateRange])

  const clearFilters = () => {
    setSearchQuery("")
    // Don't clear date - date selection is independent from filters
    setFilterHosts([])
    setFilterHostCompanies([])
    setFilterStatuses([])
    // Don't reset time frame - date selection is independent
  }
  
  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value)
    // If value is empty string, it means a manual date was selected - don't change dates
    if (value === '' || value === null || value === undefined) {
      return
    }
    if (value === 'custom') {
      setFilterDate('')
      setFilterDateEnd('')
    } else {
      const range = getTimeFrameDateRange(value)
      setFilterDate(range.start)
      setFilterDateEnd(range.end)
    }
  }
  
  const getCurrentTimeFrame = () => {
    // Use stored selectedTimeFrame if available, otherwise detect from filterDate
    if (selectedTimeFrame && filterDate) {
      return selectedTimeFrame
    }
    if (!filterDate) return 'custom'
    const today = getTodayDate()
    if (filterDate === today) return 'today'
    
    const thisWeekStart = getTimeFrameDates('thisWeek')
    const thisMonthStart = getTimeFrameDates('thisMonth')
    const nextWeekStart = getTimeFrameDates('nextWeek')
    const nextMonthStart = getTimeFrameDates('nextMonth')
    
    if (filterDate >= thisWeekStart && filterDate < nextWeekStart) return 'thisWeek'
    if (filterDate >= thisMonthStart && filterDate < nextMonthStart) return 'thisMonth'
    if (filterDate >= nextWeekStart && filterDate < nextMonthStart) return 'nextWeek'
    if (filterDate >= nextMonthStart) return 'nextMonth'
    
    return 'custom'
  }
  
  const hasActiveFilters = searchQuery || filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0


  // Load pinned filters from localStorage on mount
  useEffect(() => {
    const savedPinned = localStorage.getItem('visitorFilters:pinned')
    if (savedPinned === 'true') {
      setIsPinned(true)
      const savedFilters = localStorage.getItem('visitorFilters:data')
      if (savedFilters) {
        try {
          const filters = JSON.parse(savedFilters)
          setSearchQuery(filters.searchQuery || "")
          setFilterDate(filters.filterDate || "")
          setFilterDateEnd(filters.filterDateEnd || "")
          setSelectedTimeFrame(filters.selectedTimeFrame || "today")
          setFilterHosts(filters.filterHosts || [])
          setFilterHostCompanies(filters.filterHostCompanies || [])
          setFilterStatuses(filters.filterStatuses || [])
        } catch (e) {
          console.error('Failed to load saved filters:', e)
        }
      }
    }
  }, [])

  // Save filters to localStorage when pinned
  useEffect(() => {
    if (isPinned) {
      localStorage.setItem('visitorFilters:pinned', 'true')
      localStorage.setItem('visitorFilters:data', JSON.stringify({
        searchQuery,
        filterDate,
        filterDateEnd,
        selectedTimeFrame,
        filterHosts,
        filterHostCompanies,
        filterStatuses
      }))
    } else {
      localStorage.removeItem('visitorFilters:pinned')
      localStorage.removeItem('visitorFilters:data')
    }
  }, [isPinned, searchQuery, filterDate, filterDateEnd, selectedTimeFrame, filterHosts, filterHostCompanies, filterStatuses])

  return (
    <div className="h-full bg-white">
      {/* Page Header */}
      <div className="hidden md:block bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-4 md:px-12 pt-4 md:pt-12 pb-4 md:pb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold" style={{ color: '#2D3338' }}>Visitor Management</h1>
            <Button onClick={() => navigate('/visits/new')} data-testid="add-visitor-desktop" className="shadow-sm">
              Create visit
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 py-4 space-y-4">
          {/* Mobile Date Picker - Prominent Position */}
          <div className="mb-4">
            <DatePickerWithPresets
              value={filterDate}
              valueEnd={filterDateEnd}
              onValueChange={setFilterDate}
              onValueEndChange={setFilterDateEnd}
              selectedTimeFrame={selectedTimeFrame}
              onTimeFrameChange={handleTimeFrameChange}
              getTimeFrameDateRange={getTimeFrameDateRange}
              className="w-full"
              disablePast={false}
            />
          </div>

          {/* Mobile Search and Filters */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, email, phone, host, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4"
              />
            </div>

            {/* Filters Button */}
            <Sheet open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="gap-2 bg-blue-50 border-blue-100 text-primary hover:bg-blue-100 hover:text-primary shrink-0"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="font-semibold">Filters</span>
                  {(filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0) && (
                    <span className="bg-primary text-white text-xs font-semibold rounded-md px-2 py-0.5 min-w-[20px] text-center">
                      {[...filterHosts, ...filterHostCompanies, ...filterStatuses].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="bottom" 
                className="md:!inset-y-0 md:!inset-x-auto md:!right-0 md:!left-auto md:!top-0 md:!bottom-auto md:!h-full md:!w-[400px] md:!border-l md:!border-t-0 md:!rounded-none w-full h-[85vh] rounded-t-3xl border-t-4 border-gray-200 [&>button]:hidden md:[&>button]:block"
              >
                <div className="flex flex-col h-full">
                  <SheetHeader className="pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <SheetTitle className="text-xl font-semibold">Filters</SheetTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsFiltersOpen(false)}
                        className="h-8 w-8"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto mt-6 space-y-6 pb-24">
                    {/* Host Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Host</label>
                      <MultiSelectFilter
                        options={uniqueHosts}
                        selectedValues={filterHosts}
                        onChange={setFilterHosts}
                        placeholder="Host"
                        className="w-full"
                      />
                    </div>

                    {/* Host Company Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <MultiSelectFilter
                        options={uniqueHostCompanies}
                        selectedValues={filterHostCompanies}
                        onChange={setFilterHostCompanies}
                        placeholder="Company"
                        className="w-full"
                      />
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <MultiSelectFilter
                        options={availableStatuses}
                        selectedValues={filterStatuses}
                        onChange={setFilterStatuses}
                        placeholder="Status"
                        className="w-full"
                        formatLabel={(status) => status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      />
                    </div>
                  </div>

                  {/* Fixed bottom action buttons */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-3">
                    {(filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0) && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setFilterHosts([])
                          setFilterHostCompanies([])
                          setFilterStatuses([])
                        }}
                        className="flex-1"
                      >
                        Clear all
                      </Button>
                    )}
                    <Button
                      onClick={() => setIsFiltersOpen(false)}
                      className={cn(
                        "flex-1",
                        (filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0) 
                          ? "" 
                          : "w-full"
                      )}
                    >
                      Show results
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Main Content - Desktop */}
      <div className="hidden md:block">
        <div className="max-w-[1600px] mx-auto px-12 py-12">
          {/* Date Picker - Prominent Position */}
          <div className="mb-6">
            <DatePickerWithPresets
              value={filterDate}
              valueEnd={filterDateEnd}
              onValueChange={setFilterDate}
              onValueEndChange={setFilterDateEnd}
              selectedTimeFrame={selectedTimeFrame}
              onTimeFrameChange={handleTimeFrameChange}
              getTimeFrameDateRange={getTimeFrameDateRange}
              disablePast={false}
            />
          </div>

          {/* Filters Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, email, phone, host, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </div>

              {/* Pin Button - Desktop only */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setIsPinned(!isPinned)}
                      className={isPinned ? "bg-gray-100" : ""}
                    >
                      <Pin className={`h-4 w-4 ${isPinned ? "fill-current" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pin filters to make them persist</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Desktop Filters */}
              <div className="flex items-center gap-4">
                {/* Host Filter */}
                <MultiSelectFilter
                  options={uniqueHosts}
                  selectedValues={filterHosts}
                  onChange={setFilterHosts}
                  placeholder="Host"
                  className="w-[200px]"
                />

                {/* Host Company Filter */}
                <MultiSelectFilter
                  options={uniqueHostCompanies}
                  selectedValues={filterHostCompanies}
                  onChange={setFilterHostCompanies}
                  placeholder="Company"
                  className="w-[200px]"
                />

                {/* Status Filter */}
                <MultiSelectFilter
                  options={availableStatuses}
                  selectedValues={filterStatuses}
                  onChange={setFilterStatuses}
                  placeholder="Status"
                  className="w-[200px]"
                  formatLabel={(status) => status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                />

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="whitespace-nowrap"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                )}

                {/* Download Button */}
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="min-h-[600px]">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Error loading visits: {error.message}</p>
              </div>
            ) : visits.length === 0 ? (
              <EmptyState filtered={hasActiveFilters} />
            ) : (
              <VisitorTable 
                visits={visits}
                onEdit={handleEditVisit}
                onCancel={handleCancelVisit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden px-4 py-4 pb-24">
        {/* Mobile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Error loading visits: {error.message}</p>
              </div>
            ) : visits.length === 0 ? (
              <EmptyState filtered={hasActiveFilters} />
            ) : (
              <div className="space-y-3">
                {visits.map(visit => (
                  <VisitorCard 
                    key={visit.id} 
                    visit={visit}
                    onEdit={handleEditVisit}
                    onCancel={handleCancelVisit}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past" className="mt-4">
            {isLoading ? (
              <LoadingSkeleton />
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Error loading visits: {error.message}</p>
              </div>
            ) : pastVisits.length === 0 ? (
              <EmptyState type="past" filtered={hasActiveFilters} />
            ) : (
              <div className="space-y-3">
                {pastVisits.map(visit => (
                  <VisitorCard key={visit.id} visit={visit} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button - Mobile Only */}
      <div className="md:hidden fixed bottom-5 right-5 z-20">
        <Button
          size="icon"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl"
          onClick={() => navigate('/visits/new')}
          data-testid="add-visitor-fab"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        visitData={confirmedVisit}
        onEditStep={handleEditStep}
      />

      {/* Update Confirmation Modal */}
      <UpdateConfirmationModal
        open={isUpdateConfirmationOpen}
        onOpenChange={setIsUpdateConfirmationOpen}
        visitData={confirmedVisit}
        onEditStep={handleEditStep}
      />

      {/* Cancel Confirmation Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Cancel visit</DialogTitle>
            <DialogDescription>
              {visitToCancel?.recurring 
                ? "This is a recurring visit. Would you like to cancel only this visit or all future visits?"
                : "Are you sure you want to cancel this visit? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          {visitToCancel && (
            <div className="py-4 space-y-2 text-sm">
              <div>
                <span className="font-medium">Visitor: </span>
                <span>{visitToCancel.visitorName}</span>
              </div>
              <div>
                <span className="font-medium">Date: </span>
                <span>{formatDate(visitToCancel.date)}</span>
              </div>
              {visitToCancel.startTime && (
                <div>
                  <span className="font-medium">Time: </span>
                  <span>
                    {formatTime(visitToCancel.startTime)}
                    {visitToCancel.endTime && ` - ${formatTime(visitToCancel.endTime)}`}
                  </span>
                </div>
              )}
              {visitToCancel.recurring && visitToCancel.frequency && (
                <div className="flex items-center gap-2 pt-2">
                  <Repeat className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {visitToCancel.frequency === 'weekdays' 
                      ? 'Repeats every weekday (Monday to Friday)'
                      : `Repeats ${visitToCancel.frequency}`}
                  </span>
                </div>
              )}
            </div>
          )}
          {visitToCancel?.recurring ? (
            <DialogFooter className="flex flex-col gap-2 sm:flex-col">
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setIsCancelDialogOpen(false)}
                  className="flex-1"
                >
                  Keep visit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => confirmCancelVisit(false)}
                  className="flex-1"
                >
                  Cancel only this visit
                </Button>
              </div>
              <Button
                variant="destructive"
                onClick={() => confirmCancelVisit(true)}
                className="w-full"
              >
                Cancel all future visits
              </Button>
            </DialogFooter>
          ) : (
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Keep visit
              </Button>
              <Button
                variant="destructive"
                onClick={() => confirmCancelVisit(false)}
              >
                Cancel visit
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default App

