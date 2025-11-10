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
import { MultiSelectFilter } from "@/components/MultiSelectFilter"
import { formatDate, formatTime } from "@/lib/utils"

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const [visits, setVisits] = useState([
    // Upcoming visits
    {
      id: 1,
      visitorName: 'Jennifer Lee',
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
  const [confirmedVisit, setConfirmedVisit] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("visits")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState("") // Default to empty (show all)
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

      if (editingVisitId) {
        // Update existing visit
        const updatedVisit = {
          id: editingVisitId,
          visitorName: visitorNames,
          date: formData.visitDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          host: formData.hostName,
          floor: formData.floor,
          suite: formData.suite,
          checkIn: formData.checkIn,
          note: formData.visitorNote,
          numEntries: formData.numEntries
        }
        setVisits(prev => prev.map(v => v.id === editingVisitId ? updatedVisit : v))
      } else {
        // Create new visit
        const newVisit = {
          id: Date.now(),
          visitorName: visitorNames,
          date: formData.visitDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          host: formData.hostName,
          floor: formData.floor,
          suite: formData.suite,
          status: 'expected',
          checkIn: formData.checkIn,
          note: formData.visitorNote,
          numEntries: formData.numEntries
        }
        setVisits(prev => [...prev, newVisit])
        setConfirmedVisit({ ...formData, visitorName: visitorNames })
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

  const filterVisits = (visitsList) => {
    return visitsList.filter(visit => {
      // Search filter (searches name, host, location)
      const searchMatch = !searchQuery || 
        visit.visitorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.host?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.floor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        visit.suite?.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Date filter
      const dateMatch = !filterDate || visit.date === filterDate
      
      // Host filter (multi-select)
      const hostMatch = filterHosts.length === 0 || filterHosts.includes(visit.host)
      
      // Host Company filter (multi-select)
      const companyMatch = filterHostCompanies.length === 0 || filterHostCompanies.includes(visit.company)
      
      // Status filter (multi-select)
      const statusMatch = filterStatuses.length === 0 || filterStatuses.includes(visit.status)
      
      return searchMatch && dateMatch && hostMatch && companyMatch && statusMatch
    })
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
  }

  const getTodayDate = () => new Date().toISOString().split('T')[0]
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
      <div className="border-b">
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-semibold text-gray-900">Visitor Management</h1>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Scan LP
              </Button>
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                Scan QR
              </Button>
              <Button variant="outline" className="gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
                Scan ID
              </Button>
              <Button onClick={() => navigate('/visits/new')} className="gap-1">
                Create visit
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full justify-start bg-transparent border-b-0 h-auto p-0 space-x-6">
              <TabsTrigger 
                value="visits" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Visits
              </TabsTrigger>
              <TabsTrigger 
                value="visitors" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Visitors
              </TabsTrigger>
              <TabsTrigger 
                value="vendors" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Vendors
              </TabsTrigger>
              <TabsTrigger 
                value="employees" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Tenant Employees
              </TabsTrigger>
              <TabsTrigger 
                value="requests" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Requests
              </TabsTrigger>
              <TabsTrigger 
                value="watchlist" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                <span className="flex items-center gap-2">
                  Watchlist
                  <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">1</span>
                </span>
              </TabsTrigger>
              <TabsTrigger 
                value="groups" 
                className="data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none bg-transparent pb-3"
              >
                Groups
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div className="border-b bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Date Selector */}
            <div className="flex items-center gap-2 text-sm">
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Nov 10, 2025
              </span>
              <button className="p-1 hover:bg-gray-100 rounded">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-6 ml-8">
              <div className="text-sm">
                <span className="font-semibold text-2xl">{visits.length}</span>
                <span className="text-gray-600 ml-2">Total Visits</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span className="font-semibold">{allUpcomingVisits.length}</span>
                <span className="text-gray-600">Expected</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="font-semibold">0</span>
                <span className="text-gray-600">Checked-in</span>
              </div>
              <div className="text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                <span className="font-semibold">{visits.filter(v => v.status === 'cancelled').length}</span>
                <span className="text-gray-600">Cancelled</span>
              </div>
            </div>
          </div>
          
          {/* Color Bar */}
          <div className="flex h-2 w-64 rounded-full overflow-hidden">
            <div className="bg-purple-500 flex-1"></div>
            <div className="bg-teal-500 flex-1"></div>
            <div className="bg-gray-400 flex-1"></div>
          </div>
        </div>
      </div>

      {/* Mobile Filters and Search */}
      <div className="md:hidden bg-gray-50 border-b">
        <div className="px-4 py-4 space-y-4">

          {/* Mobile Date Picker - Prominent Position */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <label className="text-sm font-medium text-gray-700 shrink-0">Date:</label>
              <Input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                placeholder="Select date"
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterDate(getTodayDate())}
                className="flex-1"
              >
                Today
              </Button>
              {filterDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterDate("")}
                  className="flex-1 text-gray-500 hover:text-gray-700"
                >
                  Clear
                </Button>
              )}
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
      <div className="hidden md:block bg-gray-50">
        <div className="px-6 py-6">
          {/* Filters Bar */}
          <div className="mb-4">
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
      <div className="md:hidden px-4 py-4 pb-24 bg-gray-50">
        {isLoading ? (
          <LoadingSkeleton />
        ) : activeTab === 'visits' ? (
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
          <div className="text-center py-12 text-gray-500">
            <p>Select a tab to view content</p>
          </div>
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

