import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

export function Step0DateSelect({ data, onNext }) {
  const [visitDate, setVisitDate] = useState(data.visitDate)
  const [isMultiDay, setIsMultiDay] = useState(data.isMultiDay)
  const [selectedDates, setSelectedDates] = useState(data.selectedDates || [data.visitDate])
  const [recurring, setRecurring] = useState(data.recurring)
  const [frequency, setFrequency] = useState(data.frequency)
  const [recurringEnd, setRecurringEnd] = useState(data.recurringEnd)
  const [startTime, setStartTime] = useState(data.startTime)
  const [endTime, setEndTime] = useState(data.endTime)

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ 
      visitDate: isMultiDay ? selectedDates[0] : visitDate,
      isMultiDay,
      selectedDates: isMultiDay ? selectedDates : [visitDate],
      recurring,
      frequency: recurring ? frequency : '',
      recurringEnd: recurring ? recurringEnd : '',
      startTime,
      endTime
    })
  }

  const handleDateToggle = (date) => {
    if (!isMultiDay) return
    
    const dateIndex = selectedDates.indexOf(date)
    if (dateIndex > -1) {
      // Remove date if already selected
      const newDates = selectedDates.filter(d => d !== date)
      setSelectedDates(newDates.length > 0 ? newDates : [visitDate])
    } else {
      // Add date and sort chronologically
      const newDates = [...selectedDates, date].sort()
      setSelectedDates(newDates)
    }
  }

  const isDateSelected = (date) => {
    if (isMultiDay) {
      return selectedDates.includes(date)
    }
    return visitDate === date
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number)
    // Create date in local timezone (month is 0-indexed)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-900">
          When is your visit?
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Multi-day mode info */}
        {isMultiDay && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm font-medium text-blue-900">
              Multi-day mode: Click multiple dates to select specific days for this visit
            </p>
          </div>
        )}

        {/* Calendar Component */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <CalendarComponent
            selected={isMultiDay ? selectedDates : visitDate}
            onSelect={(date) => {
              if (isMultiDay) {
                handleDateToggle(date)
              } else {
                setVisitDate(date)
              }
            }}
            isMultiSelect={isMultiDay}
          />
        </div>

        {/* Selected Date(s) Display */}
        {!isMultiDay && visitDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Selected Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDisplayDate(visitDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        {isMultiDay && selectedDates.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CalendarIcon className="h-5 w-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-600 uppercase mb-2">
                  Selected Dates ({selectedDates.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDates.map((date, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-blue-300 rounded-full text-sm font-medium text-gray-900"
                    >
                      {formatDisplayDate(date)}
                      <button
                        type="button"
                        onClick={() => handleDateToggle(date)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Multi-day Visit Option */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="multiDay"
              checked={isMultiDay}
              onChange={(e) => {
                setIsMultiDay(e.target.checked)
                if (e.target.checked) {
                  // Initialize with current selected date
                  setSelectedDates([visitDate])
                }
              }}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="multiDay" className="cursor-pointer font-medium">
              Multi-day visit
            </Label>
          </div>
          {isMultiDay && (
            <p className="text-xs text-gray-500 pl-6">
              Select multiple specific dates on the calendar above (e.g., Nov 5, Nov 12, Nov 20)
            </p>
          )}
        </div>

        {/* Start and End Time */}
        <div className="border-t pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start time</Label>
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger id="startTime">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime">End time</Label>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger id="endTime">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                  <SelectItem value="10:00">10:00 AM</SelectItem>
                  <SelectItem value="11:00">11:00 AM</SelectItem>
                  <SelectItem value="12:00">12:00 PM</SelectItem>
                  <SelectItem value="13:00">1:00 PM</SelectItem>
                  <SelectItem value="14:00">2:00 PM</SelectItem>
                  <SelectItem value="15:00">3:00 PM</SelectItem>
                  <SelectItem value="16:00">4:00 PM</SelectItem>
                  <SelectItem value="17:00">5:00 PM</SelectItem>
                  <SelectItem value="18:00">6:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Recurring Visit Options */}
        <div className="border-t pt-4 space-y-4">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recurring"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label htmlFor="recurring" className="cursor-pointer font-medium">
              Recurring visit
            </Label>
          </div>

          {recurring && (
            <>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recurringEnd">Repeat until</Label>
                <Input
                  id="recurringEnd"
                  type="date"
                  value={recurringEnd}
                  onChange={(e) => setRecurringEnd(e.target.value)}
                />
              </div>
            </>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
        >
          Continue
        </Button>
      </form>
    </div>
  )
}

