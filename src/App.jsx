import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, X, ChevronLeft, ChevronRight, Download } from "lucide-react"
import { VisitorCard } from "@/components/VisitorCard"
import { VisitorTable } from "@/components/VisitorTable"
import { EmptyState } from "@/components/EmptyState"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { VisitorModal } from "@/components/VisitorModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"

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
  const [filterHost, setFilterHost] = useState("")
  const [filterHostCompany, setFilterHostCompany] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
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
      
      // Host filter
      const hostMatch = !filterHost || visit.host === filterHost
      
      // Host Company filter
      const companyMatch = !filterHostCompany || visit.company === filterHostCompany
      
      // Status filter
      const statusMatch = !filterStatus || visit.status === filterStatus
      
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
    setFilterHost("")
    setFilterHostCompany("")
    setFilterStatus("")
    setCurrentPage(1)
  }

  const hasActiveFilters = searchQuery || filterDate || filterHost || filterHostCompany || filterStatus

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
  }, [searchQuery, filterDate, filterHost, filterHostCompany, filterStatus])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Visitor Management</h1>
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
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:block">
        {/* Desktop Header */}
        <div className="bg-white border-b">
          <div className="max-w-[1600px] mx-auto px-12 py-12">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Visitor Management</h1>
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
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-base"
                >
                  Upcoming
                </TabsTrigger>
                <TabsTrigger 
                  value="past" 
                  data-testid="tab-past"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 pt-0 text-base"
                >
                  Past
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-12 py-12">
          {/* Filters Bar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
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

              {/* Right-aligned filters */}
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
                <Select 
                  value={filterHost || "all"} 
                  onValueChange={(value) => setFilterHost(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All hosts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All hosts</SelectItem>
                    {uniqueHosts.map(host => (
                      <SelectItem key={host} value={host}>
                        {host}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Host Company Filter */}
                <Select 
                  value={filterHostCompany || "all"} 
                  onValueChange={(value) => setFilterHostCompany(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All companies" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All companies</SelectItem>
                    {uniqueHostCompanies.map(company => (
                      <SelectItem key={company} value={company}>
                        {company}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Status Filter */}
                <Select 
                  value={filterStatus || "all"} 
                  onValueChange={(value) => setFilterStatus(value === "all" ? "" : value)}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    {availableStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalFilteredItems)} of {totalFilteredItems} results
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-gray-600 px-3">
                    {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
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
      <VisitorModal
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open)
          if (!open) setEditingVisit(null)
        }}
        onSubmit={handleAddVisitor}
        editingVisit={editingVisit}
      />

      <ConfirmationModal
        open={isConfirmationOpen}
        onOpenChange={setIsConfirmationOpen}
        visitData={confirmedVisit}
      />
    </div>
  )
}

export default App

