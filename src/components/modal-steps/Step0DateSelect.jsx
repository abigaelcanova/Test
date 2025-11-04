import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

export function Step0DateSelect({ data, onNext }) {
  const [visitDate, setVisitDate] = useState(data.visitDate)
  const [recurring, setRecurring] = useState(data.recurring)
  const [frequency, setFrequency] = useState(data.frequency)
  const [recurringEnd, setRecurringEnd] = useState(data.recurringEnd)
  const [startTime, setStartTime] = useState(data.startTime)
  const [endTime, setEndTime] = useState(data.endTime)

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ 
      visitDate,
      recurring,
      frequency: recurring ? frequency : '',
      recurringEnd: recurring ? recurringEnd : '',
      startTime,
      endTime
    })
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
        {/* Calendar Component */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <CalendarComponent
            selected={visitDate}
            onSelect={setVisitDate}
          />
        </div>

        {/* Selected Date Display */}
        {visitDate && (
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

