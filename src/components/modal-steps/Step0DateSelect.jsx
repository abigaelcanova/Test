import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

export function Step0DateSelect({ data, onNext }) {
  const [dateRange, setDateRange] = useState({ 
    from: data.visitDate || new Date().toISOString().split('T')[0], 
    to: data.visitDateEnd || data.visitDate || new Date().toISOString().split('T')[0]
  })
  const [repeatOption, setRepeatOption] = useState(data.recurring ? (data.frequency || 'custom') : 'none')
  const [recurringEnd, setRecurringEnd] = useState(data.recurringEnd || '')
  const [startTime, setStartTime] = useState(data.startTime || '09:00')
  const [endTime, setEndTime] = useState(data.endTime || '17:00')

  const getRepeatLabel = () => {
    if (!dateRange.from) return 'Does not repeat'
    const date = new Date(dateRange.from)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.getDate()
    const monthName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    
    return {
      none: 'Does not repeat',
      daily: 'Daily',
      weekly: `Weekly on ${dayName}`,
      monthly: `Monthly on day ${monthDay}`,
      annually: `Annually on ${monthName}`,
      weekdays: 'Every weekday (Monday to Friday)'
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const recurring = repeatOption !== 'none'
    onNext({ 
      visitDate: dateRange.from,
      visitDateEnd: dateRange.to,
      recurring,
      frequency: recurring ? repeatOption : '',
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">When is your visit?</h3>
      </div>

      <div className="space-y-5">
        {/* Date range mode info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-blue-900">
            Select a date range: Click a start date, then click an end date
          </p>
        </div>

        {/* Calendar and Time Selection */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Left Side - Calendar */}
          <div className="w-full md:flex-shrink-0 md:w-auto">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200 w-full md:w-fit">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range) {
                    setDateRange(range)
                  }
                }}
              />
            </div>

          </div>

          {/* Right Side - Time Selection */}
          <div className="w-full md:flex-1 space-y-4">
            {/* Start and End Date/Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  />
                </div>
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
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.to || dateRange.from}
                    onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  />
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

            {/* Repeat Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="repeat">Repeat</Label>
              <Select value={repeatOption} onValueChange={setRepeatOption}>
                <SelectTrigger id="repeat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{getRepeatLabel().none}</SelectItem>
                  <SelectItem value="daily">{getRepeatLabel().daily}</SelectItem>
                  <SelectItem value="weekly">{getRepeatLabel().weekly}</SelectItem>
                  <SelectItem value="monthly">{getRepeatLabel().monthly}</SelectItem>
                  <SelectItem value="annually">{getRepeatLabel().annually}</SelectItem>
                  <SelectItem value="weekdays">{getRepeatLabel().weekdays}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {repeatOption !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="recurringEnd">Repeat until</Label>
                <Input
                  id="recurringEnd"
                  type="date"
                  value={recurringEnd}
                  onChange={(e) => setRecurringEnd(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

