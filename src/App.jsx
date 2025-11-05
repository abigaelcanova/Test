import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { VisitorCard } from "@/components/VisitorCard"
import { VisitorTable } from "@/components/VisitorTable"
import { EmptyState } from "@/components/EmptyState"
import { LoadingSkeleton } from "@/components/LoadingSkeleton"
import { VisitorModal } from "@/components/VisitorModal"
import { ConfirmationModal } from "@/components/ConfirmationModal"

function App() {
  const [visits, setVisits] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false)
  const [confirmedVisit, setConfirmedVisit] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upcoming")
  const [editingVisit, setEditingVisit] = useState(null)

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
        status: 'confirmed',
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

  const upcomingVisits = visits.filter(v => 
    new Date(v.date) >= new Date() && v.status !== 'cancelled'
  )
  
  const pastVisits = visits.filter(v => 
    new Date(v.date) < new Date() || v.status === 'cancelled'
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Visitor registration</h1>
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
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold text-gray-900">Visitor registration</h1>
              <Button onClick={() => setIsModalOpen(true)} data-testid="add-visitor-desktop" className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add new visitor
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-8">
          <div className="grid grid-cols-12 gap-8">
            {/* Left Sidebar - Desktop Navigation */}
            <div className="col-span-3 lg:col-span-2">
              <div className="sticky top-8">
                <nav className="space-y-1">
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'upcoming'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('upcoming')}
                    data-testid="nav-upcoming"
                  >
                    Upcoming
                  </button>
                  <button
                    className={`w-full text-left px-3 py-2.5 rounded-lg font-medium transition-all ${
                      activeTab === 'past'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setActiveTab('past')}
                    data-testid="nav-past"
                  >
                    Past
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-9 lg:col-span-10">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[600px]">

                {isLoading ? (
                  <LoadingSkeleton />
                ) : activeTab === 'upcoming' ? (
                  upcomingVisits.length === 0 ? (
                    <EmptyState />
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
                  pastVisits.length === 0 ? (
                    <EmptyState />
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
            <EmptyState />
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

