import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Plus, Search, X, ChevronLeft, ChevronRight, Download, Pin, SlidersHorizontal } from "lucide-react"
import { VisitorCard } from "@/components/VisitorCard"
import { VisitorTable } from "@/components/VisitorTable"
import { EmptyState } from "@/components/EmptyState"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { VisitorModal } from "@/components/VisitorModal"
import { MobileVisitorFlow } from "@/components/MobileVisitorFlow"
import { ConfirmationModal } from "@/components/ConfirmationModal"
import { MultiSelectFilter } from "@/components/MultiSelectFilter"

function App() {
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '2'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '3'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '1'
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
      numEntries: '2'
    }
  ])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [confirmedVisit, setConfirmedVisit] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [editingVisit, setEditingVisit] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDate, setFilterDate] = useState("")
  const [filterHosts, setFilterHosts] = useState([])
  const [filterHostCompanies, setFilterHostCompanies] = useState([])
  const [filterStatuses, setFilterStatuses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isPinned, setIsPinned] = useState(false)
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const itemsPerPage = 10

  const handleAddVisitor = (formData) => {
    // Create visit entries from form data
    const visitorNames = formData.visitors
      .filter(v => v.firstName && v.lastName)
      .map(v => `${v.firstName} ${v.lastName}`)
      .join(', ')

    if (editingVisit) {
      // Update existing visit
      const updatedVisit = {
        ...editingVisit,
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
      setVisits(prev => prev.map(v => v.id === editingVisit.id ? updatedVisit : v))
      setEditingVisit(null)
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
    setIsModalOpen(false)
  }

  const handleEditVisit = (visit) => {
    setEditingVisit(visit)
    setIsModalOpen(true)
  }

  const handleCancelVisit = (visitId) => {
    setVisits(prev => prev.map(v => 
      v.id === visitId ? { ...v, status: 'cancelled' } : v
    ))
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

  // Pagination logic
  const paginateVisits = (visitsList) => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return visitsList.slice(startIndex, endIndex)
  }

  const upcomingVisits = paginateVisits(filteredUpcomingVisits)
  const pastVisits = paginateVisits(filteredPastVisits)

  const totalUpcomingPages = Math.ceil(filteredUpcomingVisits.length / itemsPerPage)
  const totalPastPages = Math.ceil(filteredPastVisits.length / itemsPerPage)
  const totalPages = activeTab === 'upcoming' ? totalUpcomingPages : totalPastPages
  const totalFilteredItems = activeTab === 'upcoming' ? filteredUpcomingVisits.length : filteredPastVisits.length

  const clearFilters = () => {
    setSearchQuery("")
    setFilterDate("")
    setFilterHosts([])
    setFilterHostCompanies([])
    setFilterStatuses([])
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || filterDate || filterHosts.length > 0 || filterHostCompanies.length > 0 || filterStatuses.length > 0

  // Reset to page 1 when switching tabs or filters change
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterDate, filterHosts, filterHostCompanies, filterStatuses])

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
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 py-4 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Visitor Management</h1>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="upcoming" className="flex-1" data-testid="tab-upcoming">
                Upcoming
              </TabsTrigger>
              <TabsTrigger value="past" className="flex-1" data-testid="tab-past">
                Past
              </TabsTrigger>
            </TabsList>
          </Tabs>

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
                  {hasActiveFilters && (
                    <span className="bg-primary text-white text-xs font-semibold rounded-md px-2 py-0.5 min-w-[20px] text-center">
                      {[filterDate, ...filterHosts, ...filterHostCompanies, ...filterStatuses].filter(Boolean).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Date Picker */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      placeholder="Filter by date"
                    />
                  </div>

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
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearFilters()
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

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <div className="bg-white border-b">
          <div className="max-w-[1600px] mx-auto px-12 pt-12 pb-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-800">Visitor Management</h1>
              <Button onClick={() => setIsModalOpen(true)} data-testid="add-visitor-desktop" className="shadow-sm">
                Create visit
              </Button>
            </div>
            
            {/* Horizontal Navigation Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="bg-transparent p-0 h-auto border-b border-gray-200 rounded-none w-auto items-end">
                <TabsTrigger 
                  value="upcoming" 
                  data-testid="tab-upcoming"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-4 pb-3 pt-0 text-base text-gray-600"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  data-testid="tab-past"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary px-4 pb-3 pt-0 text-base text-gray-600"
                >
                  Past
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 py-12">
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
                {/* Date Picker */}
                <Input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  placeholder="Filter by date"
                  className="w-48"
                />

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
              </div>
            </div>
          </div>

          {/* Pagination Controls - Top */}
          {totalPages > 0 && (
            <div className="flex items-center justify-end mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalFilteredItems)} of {totalFilteredItems}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          )}

          <div className="min-h-[600px]">

                {isLoading ? (
                  <LoadingSkeleton />
                ) : activeTab === 'upcoming' ? (
                  filteredUpcomingVisits.length === 0 ? (
                    <EmptyState filtered={hasActiveFilters && allUpcomingVisits.length > 0} />
                  ) : (
                    <>
                      {/* Mobile: Cards */}
                      <div className="md:hidden space-y-3">
                        {upcomingVisits.map(visit => (
                          <VisitorCard 
                            key={visit.id} 
                            visit={visit}
                            onEdit={handleEditVisit}
                            onCancel={handleCancelVisit}
                          />
                        ))}
                      </div>
                      {/* Desktop: Table */}
                      <div className="hidden md:block">
                        <VisitorTable 
                          visits={upcomingVisits}
                          onEdit={handleEditVisit}
                          onCancel={handleCancelVisit}
                        />
                      </div>
                    </>
                  )
                ) : (
                  filteredPastVisits.length === 0 ? (
                    <EmptyState type="past" filtered={hasActiveFilters && allPastVisits.length > 0} />
                  ) : (
                    <>
                      {/* Mobile: Cards */}
                      <div className="md:hidden space-y-3">
                        {pastVisits.map(visit => (
                          <VisitorCard key={visit.id} visit={visit} />
                        ))}
                      </div>
                      {/* Desktop: Table */}
                      <div className="hidden md:block">
                        <VisitorTable visits={pastVisits} />
                      </div>
                    </>
                  )
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
          onClick={() => setIsModalOpen(true)}
          data-testid="add-visitor-fab"
        >
          <Plus className="h-6 w-6 text-white" />
        </Button>
      </div>

      {/* Modals */}
      {/* Desktop Modal */}
      <div className="hidden md:block">
        <VisitorModal
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setEditingVisit(null)
          }}
          onSubmit={handleAddVisitor}
          editingVisit={editingVisit}
        />
      </div>

      {/* Mobile Flow */}
      <div className="md:hidden">
        <MobileVisitorFlow
          open={isModalOpen}
          onOpenChange={(open) => {
            setIsModalOpen(open)
            if (!open) setEditingVisit(null)
          }}
          onSubmit={handleAddVisitor}
        />
      </div>

      <ConfirmationModal
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        visitData={confirmedVisit}
      />
    </div>
  )
}

export default App

