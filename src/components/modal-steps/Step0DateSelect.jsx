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

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ 
      visitDate,
      recurring,
      frequency: recurring ? frequency : '',
      recurringEnd: recurring ? recurringEnd : ''
    })
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
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

