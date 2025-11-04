import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"

export function Step3DateTime({ data, onSubmit }) {
  const [recurring, setRecurring] = useState(data.recurring)
  const [frequency, setFrequency] = useState(data.frequency)
  const [recurringEnd, setRecurringEnd] = useState(data.recurringEnd)
  const [startTime, setStartTime] = useState(data.startTime)
  const [endTime, setEndTime] = useState(data.endTime)
  const [numEntries, setNumEntries] = useState(data.numEntries)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({
      recurring,
      frequency: recurring ? frequency : '',
      recurringEnd: recurring ? recurringEnd : '',
      startTime,
      endTime,
      numEntries
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Visit time details</h2>
        <p className="text-sm text-gray-600 mt-1">
          Visit scheduled for <span className="font-medium text-gray-900">{formatDate(data.visitDate)}</span>
        </p>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={recurring}
          onChange={(e) => setRecurring(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
        <Label htmlFor="recurring" className="cursor-pointer">
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

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      <div className="space-y-2">
        <Label htmlFor="numEntries">
          Number of Entries <span className="text-destructive">*</span>
        </Label>
        <Select value={numEntries} onValueChange={setNumEntries}>
          <SelectTrigger id="numEntries">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="5">5</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Submit Visitor Request
      </Button>
    </form>
  )
}

