import { useState, useMemo, useEffect } from "react"
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
import { formatDate, formatTime } from "@/lib/utils"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [visits, setVisits] = useState([
    // Upcoming visits
    {
      id: 1,
      visitorName: 'Jennifer Lee',
      visitorCompany: 'CloudTech Solutions',
      date: '2025-11-05',
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
      date: '2025-11-08',
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
      date: '2025-11-12',
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
      date: '2025-11-15',
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
      date: '2025-11-20',
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
      date: '2025-11-22',
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
      date: '2025-11-25',
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
      date: '2024-10-15',
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
      date: '2024-10-20',
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
      date: '2024-10-22',
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
      date: '2024-10-28',
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
      date: '2024-11-01',
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
      date: '2024-11-02',
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
  ])
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [isUpdateConfirmationOpen, setIsUpdateConfirmationOpen] = useState(false)
  const [confirmedVisit, setConfirmedVisit] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState("") // Default to empty (show all)
  const [selectedTimeFrame, setSelectedTimeFrame] = useState("custom") // Track selected time frame
  const [filterHosts, setFilterHosts] = useState([])
  const [filterHostCompanies, setFilterHostCompanies] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])
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
    if (location.state?.newVisit) {
      const formData = location.state.newVisit
      const editingVisitId = location.state.editingVisitId
      
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

      if (editingVisitId) {
        // Update existing visit - preserve existing fields like status, company, etc.
        const existingVisit = visits.find(v => v.id === editingVisitId)
        const updatedVisit = {
          ...existingVisit,
          visitorName: visitorNames,
          visitorCompany: visitorCompany,
          date: formData.visitDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          host: formData.hostName,
          floor: formData.floor,
          suite: formData.suite,
          visitSummary: formData.visitors?.[0]?.visitSummary || existingVisit?.visitSummary
        }
        setVisits(prev => prev.map(v => v.id === editingVisitId ? updatedVisit : v))
        setConfirmedVisit({ ...formData, visitorName: visitorNames, visitorCompany: visitorCompany })
        setIsUpdateConfirmationOpen(true)
      } else {
        // Create new visit
        const newVisit = {
          id: Date.now(),
          visitorName: visitorNames,
          visitorCompany: visitorCompany,
          date: formData.visitDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          host: formData.hostName,
          floor: formData.floor,
          suite: formData.suite,
          status: 'expected',
          visitSummary: formData.visitors?.[0]?.visitSummary || formData.visitSummary
        }
        setVisits(prev => [...prev, newVisit])
        setConfirmedVisit({ ...formData, visitorName: visitorNames, visitorCompany: visitorCompany })
        setIsConfirmationOpen(true)
      }
      
      // Clear the location state
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const handleCancelVisit = (visitId) => {
    const visit = visits.find(v => v.id === visitId)
    setVisitToCancel(visit)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelVisit = (cancelAllFuture = false) => {
    if (visitToCancel) {
      if (cancelAllFuture && visitToCancel.recurring) {
        // Cancel this visit and all future recurring visits
        // For this demo, we'll just cancel the current visit and mark it
        // In a real app, you'd cancel all future instances
        setVisits(prev => prev.map(v => 
          v.id === visitToCancel.id ? { ...v, status: 'cancelled', recurring: false } : v
        ))
      } else {
        // Cancel just this single visit
        setVisits(prev => prev.map(v => 
          v.id === visitToCancel.id ? { ...v, status: 'cancelled' } : v
        ))
      }
    }
    setIsCancelDialogOpen(false)
    setVisitToCancel(null)
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

  const getTodayDate = () => new Date().toISOString().split('T')[0]
  
  const getTimeFrameDates = (timeFrame) => {
    const today = new Date()
    const todayStr = today.toISOString().split('T')[0]
    
    switch (timeFrame) {
      case 'today':
        return todayStr
      case 'thisWeek':
        const startOfWeek = new Date(today)
        startOfWeek.setDate(today.getDate() - today.getDay()) // Sunday
        return startOfWeek.toISOString().split('T')[0]
      case 'thisMonth':
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
        return startOfMonth.toISOString().split('T')[0]
      case 'nextWeek':
        const nextWeekStart = new Date(today)
        nextWeekStart.setDate(today.getDate() + (7 - today.getDay()))
        return nextWeekStart.toISOString().split('T')[0]
      case 'nextMonth':
        const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1)
        return nextMonthStart.toISOString().split('T')[0]
      default:
        return ''
    }
  }

  const filterVisits = (visitsList) => {
    let filtered = visitsList.filter(visit => {
      // Search filter (searches name, host, location)
      const searchMatch = !searchQuery || 
        visit.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.host?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.floor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.suite?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Date filter - handle date ranges for time frames
      let dateMatch = true
      if (filterDate) {
        if (selectedTimeFrame === 'today') {
          dateMatch = visit.date === filterDate
        } else if (selectedTimeFrame === 'thisWeek') {
          const startDate = getTimeFrameDates('thisWeek')
          const endDate = getTimeFrameDates('nextWeek')
          dateMatch = visit.date >= startDate && visit.date < endDate
        } else if (selectedTimeFrame === 'thisMonth') {
          const startDate = getTimeFrameDates('thisMonth')
          const endDate = getTimeFrameDates('nextMonth')
          dateMatch = visit.date >= startDate && visit.date < endDate
        } else if (selectedTimeFrame === 'nextWeek') {
          const startDate = getTimeFrameDates('nextWeek')
          const endDate = getTimeFrameDates('nextMonth')
          dateMatch = visit.date >= startDate && visit.date < endDate
        } else if (selectedTimeFrame === 'nextMonth') {
          const startDate = getTimeFrameDates('nextMonth')
          // For next month, show all dates >= start of next month
          dateMatch = visit.date >= startDate
        } else {
          // Custom or exact match
          dateMatch = visit.date === filterDate
        }
      }
      
      // Host filter (multi-select)
      const hostMatch = filterHosts.length === 0 || filterHosts.includes(visit.host)
      
      // Host Company filter (multi-select)
      const companyMatch = filterHostCompanies.length === 0 || filterHostCompanies.includes(visit.company)
      
      // Status filter (multi-select)
      const statusMatch = filterStatuses.length === 0 || filterStatuses.includes(visit.status)
      
      return searchMatch && dateMatch && hostMatch && companyMatch && statusMatch
    })
    
    // For demo purposes: if no results, show some mock data
    if (filtered.length === 0 && visitsList.length > 0) {
      // Return first few visits as fallback for demo
      return visitsList.slice(0, 4)
    }
    
    return filtered
  }

  const allUpcomingVisits = visits.filter(v => 
    new Date(v.date) >= new Date() && v.status !== 'cancelled'
  )
  
  const allPastVisits = visits.filter(v => 
    new Date(v.date) < new Date() || v.status === 'cancelled'
  )

  const filteredUpcomingVisits = filterVisits(allUpcomingVisits)
  const filteredPastVisits = filterVisits(allPastVisits)

  const upcomingVisits = filteredUpcomingVisits
  const pastVisits = filteredPastVisits

  const clearFilters = () => {
    setSearchQuery("")
    setFilterDate("") // Clear date to show all
    setFilterHosts([])
    setFilterHostCompanies([])
    setFilterStatuses([])
    setSelectedTimeFrame("custom")
  }
  
  const handleTimeFrameChange = (value) => {
    setSelectedTimeFrame(value)
    if (value === 'custom') {
      setFilterDate('')
    } else {
      setFilterDate(getTimeFrameDates(value))
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
  
  const hasActiveFilters = searchQuery || filterDate || filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0

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
        filterHosts,
        filterHostCompanies,
        filterStatuses
      }))
    } else {
      localStorage.removeItem('visitorFilters:pinned')
      localStorage.removeItem('visitorFilters:data')
    }
  }, [isPinned, searchQuery, filterDate, filterHosts, filterHostCompanies, filterStatuses])

  return (
    <div className="h-full bg-white">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-12 pt-12 pb-6">
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
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 shrink-0">Date:</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Select date"
                className="flex-1"
              />
              <Select value={getCurrentTimeFrame()} onValueChange={handleTimeFrameChange}>
                <SelectTrigger className="w-[120px] shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="nextWeek">Next Week</SelectItem>
                  <SelectItem value="nextMonth">Next Month</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile Search and Filters */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by visitor name, host, or location..."
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
              <SheetContent side="right" className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
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

                  {/* Clear Filters Button */}
                  {(filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0) && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilterHosts([])
                        setFilterHostCompanies([])
                        setFilterStatuses([])
                        setIsFiltersOpen(false)
                      }}
                      className="w-full"
                    >
                      Clear all
                    </Button>
                  )}
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
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700">Date:</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Select date"
                className="w-64"
              />
              <Select value={getCurrentTimeFrame()} onValueChange={handleTimeFrameChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="thisWeek">This Week</SelectItem>
                  <SelectItem value="thisMonth">This Month</SelectItem>
                  <SelectItem value="nextWeek">Next Week</SelectItem>
                  <SelectItem value="nextMonth">Next Month</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by visitor name, host, or location..."
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
            ) : filteredUpcomingVisits.length === 0 ? (
              <EmptyState filtered={hasActiveFilters && allUpcomingVisits.length > 0} />
            ) : (
              <VisitorTable 
                visits={upcomingVisits}
                onEdit={handleEditVisit}
                onCancel={handleCancelVisit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content */}
      <div className="md:hidden px-4 py-4 pb-24">
        {isLoading ? (
          <LoadingSkeleton />
        ) : activeTab === 'upcoming' ? (
          upcomingVisits.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {upcomingVisits.map(visit => (
                <VisitorCard 
                  key={visit.id} 
                  visit={visit}
                  onEdit={handleEditVisit}
                  onCancel={handleCancelVisit}
                />
              ))}
            </div>
          )
        ) : (
          pastVisits.length === 0 ? (
            <EmptyState type="past" />
          ) : (
            <div className="space-y-3">
              {pastVisits.map(visit => (
                <VisitorCard key={visit.id} visit={visit} />
              ))}
            </div>
          )
        )}
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

