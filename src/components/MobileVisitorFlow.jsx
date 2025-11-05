import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Users, MapPin, User, CheckSquare, ChevronRight, X } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { formatDate } from "@/lib/utils"

export function MobileVisitorFlow({ open, onOpenChange, onSubmit }) {
  const [activeSection, setActiveSection] = useState(null)
  const [formData, setFormData] = useState({
    visitDate: null,
    selectedDates: [],
    isMultiDay: false,
    startTime: '',
    endTime: '',
    visitors: [{ firstName: '', lastName: '', email: '', phone: '', company: '', visitSummary: '' }],
    checkIn: 'bypass',
    hostType: '',
    hostName: '',
    floor: '1',
    suite: '1001',
    numEntries: '1',
    receiveCopyInvitation: true,
    receiveCheckInNotifications: true,
    additionalOrganizers: ''
  })

  const getSectionSummary = (section) => {
    switch(section) {
      case 'when':
        if (formData.isMultiDay && formData.selectedDates.length > 0) {
          return `${formData.selectedDates.length} days selected`
        }
        return formData.visitDate ? formatDate(formData.visitDate) : 'Add date'
      case 'who':
        const validVisitors = formData.visitors.filter(v => v.firstName && v.lastName)
        return validVisitors.length > 0 ? `${validVisitors.length} visitor${validVisitors.length > 1 ? 's' : ''}` : 'Add visitors'
      case 'where':
        return formData.floor && formData.suite ? `Floor ${formData.floor}, Suite ${formData.suite}` : 'Add location'
      case 'host':
        if (formData.hostType === 'me') return 'I am the host'
        return formData.hostName || 'Select host'
      case 'checkin':
        return formData.checkIn === 'bypass' ? 'Bypass check-in' : 'Standard check-in'
      default:
        return 'Add details'
    }
  }

  const isComplete = () => {
    return (
      (formData.visitDate || formData.selectedDates.length > 0) &&
      formData.visitors.some(v => v.firstName && v.lastName && v.email) &&
      formData.hostType &&
      (formData.hostType === 'me' || formData.hostName)
    )
  }

  const handleSubmit = () => {
    if (isComplete()) {
      onSubmit(formData)
      onOpenChange(false)
    }
  }

  return (
    <>
      {/* Main Sheet */}
      <Sheet open={open && !activeSection} onOpenChange={onOpenChange}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <SheetHeader className="text-left mb-6">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl">Create visit</SheetTitle>
              <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          <div className="space-y-3 pb-24">
            {/* When Section */}
            <button
              onClick={() => setActiveSection('when')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <CalendarIcon className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">When</span>
                  </div>
                  <p className="text-gray-600 ml-8">{getSectionSummary('when')}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            {/* Who Section */}
            <button
              onClick={() => setActiveSection('who')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <Users className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">Who</span>
                  </div>
                  <p className="text-gray-600 ml-8">{getSectionSummary('who')}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            {/* Where Section */}
            <button
              onClick={() => setActiveSection('where')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <MapPin className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">Where</span>
                  </div>
                  <p className="text-gray-600 ml-8">{getSectionSummary('where')}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            {/* Host Section */}
            <button
              onClick={() => setActiveSection('host')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">Host</span>
                  </div>
                  <p className="text-gray-600 ml-8">{getSectionSummary('host')}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>

            {/* Check-in Section */}
            <button
              onClick={() => setActiveSection('checkin')}
              className="w-full bg-white border border-gray-200 rounded-2xl p-6 text-left hover:border-gray-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <CheckSquare className="h-5 w-5 text-gray-600" />
                    <span className="font-semibold text-lg">Check-in</span>
                  </div>
                  <p className="text-gray-600 ml-8">{getSectionSummary('checkin')}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          </div>

          {/* Bottom Action */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
            <Button
              onClick={handleSubmit}
              disabled={!isComplete()}
              className="w-full h-14 text-lg rounded-xl"
            >
              Create visit
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* When Section Sheet */}
      <WhenSection
        open={activeSection === 'when'}
        onClose={() => setActiveSection(null)}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Who Section Sheet */}
      <WhoSection
        open={activeSection === 'who'}
        onClose={() => setActiveSection(null)}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Where Section Sheet */}
      <WhereSection
        open={activeSection === 'where'}
        onClose={() => setActiveSection(null)}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Host Section Sheet */}
      <HostSection
        open={activeSection === 'host'}
        onClose={() => setActiveSection(null)}
        formData={formData}
        setFormData={setFormData}
      />

      {/* Check-in Section Sheet */}
      <CheckInSection
        open={activeSection === 'checkin'}
        onClose={() => setActiveSection(null)}
        formData={formData}
        setFormData={setFormData}
      />
    </>
  )
}

// When Section Component
function WhenSection({ open, onClose, formData, setFormData }) {
  const [localDate, setLocalDate] = useState(formData.visitDate)
  const [localSelectedDates, setLocalSelectedDates] = useState(formData.selectedDates)
  const [isMultiDay, setIsMultiDay] = useState(formData.isMultiDay)
  const [startTime, setStartTime] = useState(formData.startTime)
  const [endTime, setEndTime] = useState(formData.endTime)

  const handleSave = () => {
    setFormData({
      ...formData,
      visitDate: isMultiDay ? null : localDate,
      selectedDates: isMultiDay ? localSelectedDates : [],
      isMultiDay,
      startTime,
      endTime
    })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl">When is your visit?</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="multiday"
              checked={isMultiDay}
              onChange={(e) => setIsMultiDay(e.target.checked)}
              className="rounded-md"
            />
            <Label htmlFor="multiday" className="text-base cursor-pointer">
              Multi-day visit
            </Label>
          </div>

          <Calendar
            selected={isMultiDay ? localSelectedDates : localDate}
            onSelect={isMultiDay ? setLocalSelectedDates : setLocalDate}
            isMultiSelect={isMultiDay}
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start time</Label>
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>End time</Label>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={handleSave} className="w-full h-14 text-lg rounded-xl">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Who Section Component
function WhoSection({ open, onClose, formData, setFormData }) {
  const [visitors, setVisitors] = useState(formData.visitors)

  const addVisitor = () => {
    setVisitors([...visitors, { firstName: '', lastName: '', email: '', phone: '', company: '', visitSummary: '' }])
  }

  const removeVisitor = (index) => {
    if (visitors.length > 1) {
      setVisitors(visitors.filter((_, i) => i !== index))
    }
  }

  const updateVisitor = (index, field, value) => {
    const updated = [...visitors]
    updated[index][field] = value
    setVisitors(updated)
  }

  const handleSave = () => {
    setFormData({ ...formData, visitors })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl">Who's visiting?</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          {visitors.map((visitor, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-4">
              {visitors.length > 1 && (
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Visitor {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVisitor(index)}
                  >
                    Remove
                  </Button>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="First name"
                  value={visitor.firstName}
                  onChange={(e) => updateVisitor(index, 'firstName', e.target.value)}
                />
                <Input
                  placeholder="Last name"
                  value={visitor.lastName}
                  onChange={(e) => updateVisitor(index, 'lastName', e.target.value)}
                />
              </div>
              <Input
                type="email"
                placeholder="Email"
                value={visitor.email}
                onChange={(e) => updateVisitor(index, 'email', e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Phone (optional)"
                value={visitor.phone}
                onChange={(e) => updateVisitor(index, 'phone', e.target.value)}
              />
              <Input
                placeholder="Company"
                value={visitor.company}
                onChange={(e) => updateVisitor(index, 'company', e.target.value)}
              />
              <Textarea
                placeholder="Visit summary"
                value={visitor.visitSummary}
                onChange={(e) => updateVisitor(index, 'visitSummary', e.target.value)}
                rows={2}
              />
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addVisitor}
            className="w-full h-12 rounded-xl"
          >
            Add another visitor
          </Button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={handleSave} className="w-full h-14 text-lg rounded-xl">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Where Section Component
function WhereSection({ open, onClose, formData, setFormData }) {
  const [floor, setFloor] = useState(formData.floor)
  const [suite, setSuite] = useState(formData.suite)
  const [numEntries, setNumEntries] = useState(formData.numEntries)

  const handleSave = () => {
    setFormData({ ...formData, floor, suite, numEntries })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl">Where's the visit?</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          <div className="space-y-2">
            <Label>Floor</Label>
            <Select value={floor} onValueChange={setFloor}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Floor 1</SelectItem>
                <SelectItem value="2">Floor 2</SelectItem>
                <SelectItem value="3">Floor 3</SelectItem>
                <SelectItem value="14">Floor 14</SelectItem>
                <SelectItem value="15">Floor 15</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Suite</Label>
            <Select value={suite} onValueChange={setSuite}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1001">#1001</SelectItem>
                <SelectItem value="1002">#1002</SelectItem>
                <SelectItem value="1003">#1003</SelectItem>
                <SelectItem value="1004">#1004</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Number of entries</Label>
            <Select value={numEntries} onValueChange={setNumEntries}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 entry</SelectItem>
                <SelectItem value="2">2 entries</SelectItem>
                <SelectItem value="3">3 entries</SelectItem>
                <SelectItem value="4">4 entries</SelectItem>
                <SelectItem value="5">5 entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={handleSave} className="w-full h-14 text-lg rounded-xl">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Host Section Component
function HostSection({ open, onClose, formData, setFormData }) {
  const [hostType, setHostType] = useState(formData.hostType)
  const [hostName, setHostName] = useState(formData.hostName)
  const [receiveCopyInvitation, setReceiveCopyInvitation] = useState(formData.receiveCopyInvitation)
  const [receiveCheckInNotifications, setReceiveCheckInNotifications] = useState(formData.receiveCheckInNotifications)
  const [additionalOrganizers, setAdditionalOrganizers] = useState(formData.additionalOrganizers)

  const handleSave = () => {
    setFormData({
      ...formData,
      hostType,
      hostName,
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers
    })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-y-auto">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl">Who's hosting?</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-24">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setHostType('me')}
              className={`border-2 rounded-xl p-6 text-center transition-colors ${
                hostType === 'me' ? 'border-primary bg-blue-50' : 'border-gray-200'
              }`}
            >
              <span className="font-semibold">I am</span>
            </button>
            <button
              onClick={() => setHostType('someone')}
              className={`border-2 rounded-xl p-6 text-center transition-colors ${
                hostType === 'someone' ? 'border-primary bg-blue-50' : 'border-gray-200'
              }`}
            >
              <span className="font-semibold">Someone else</span>
            </button>
          </div>

          {hostType === 'someone' && (
            <div className="space-y-2">
              <Label>Host name</Label>
              <Input
                placeholder="Search or enter host name"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
              />
            </div>
          )}

          {hostType && (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold">Host preferences</h3>
                
                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="invitation"
                    checked={receiveCopyInvitation}
                    onChange={(e) => setReceiveCopyInvitation(e.target.checked)}
                    className="rounded-md mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="invitation" className="cursor-pointer font-medium">
                      Receive copy of invitation
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Get an email copy when visitors are invited
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl">
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={receiveCheckInNotifications}
                    onChange={(e) => setReceiveCheckInNotifications(e.target.checked)}
                    className="rounded-md mt-0.5"
                  />
                  <div className="flex-1">
                    <Label htmlFor="notifications" className="cursor-pointer font-medium">
                      Receive check-in notifications
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Get notified when visitors arrive and check in
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Additional organizers (optional)</Label>
                <Textarea
                  placeholder="Enter email addresses separated by commas"
                  value={additionalOrganizers}
                  onChange={(e) => setAdditionalOrganizers(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Additional organizers will receive host communications
                </p>
              </div>
            </>
          )}
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={handleSave} className="w-full h-14 text-lg rounded-xl">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

// Check-in Section Component
function CheckInSection({ open, onClose, formData, setFormData }) {
  const [checkIn, setCheckIn] = useState(formData.checkIn)

  const handleSave = () => {
    setFormData({ ...formData, checkIn })
    onClose()
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-2xl">Check-in preference</SheetTitle>
        </SheetHeader>

        <div className="space-y-4 pb-24">
          <button
            onClick={() => setCheckIn('bypass')}
            className={`w-full border-2 rounded-xl p-6 text-left transition-colors ${
              checkIn === 'bypass' ? 'border-primary bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h3 className="font-semibold mb-2">Bypass check-in</h3>
            <p className="text-sm text-gray-600">
              Visitor can go directly to destination without checking in
            </p>
          </button>

          <button
            onClick={() => setCheckIn('standard')}
            className={`w-full border-2 rounded-xl p-6 text-left transition-colors ${
              checkIn === 'standard' ? 'border-primary bg-blue-50' : 'border-gray-200'
            }`}
          >
            <h3 className="font-semibold mb-2">Standard check-in</h3>
            <p className="text-sm text-gray-600">
              Visitor must check in at reception desk before proceeding
            </p>
          </button>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button onClick={handleSave} className="w-full h-14 text-lg rounded-xl">
            Save
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

