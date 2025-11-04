import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/utils"

export function Step3DateTime({ data, onNext, onSubmit }) {
  const [numEntries, setNumEntries] = useState(data.numEntries)

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = {
      numEntries
    }
    
    if (onNext) {
      onNext(stepData)
    } else if (onSubmit) {
      onSubmit(stepData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Number of entries</h2>
        <p className="text-sm text-gray-600 mt-1">
          Visit scheduled for <span className="font-medium text-gray-900">{formatDate(data.visitDate)}</span>
          {data.recurring && <span className="ml-1">({data.frequency})</span>}
          {data.startTime && data.endTime && (
            <span className="ml-1">
              • {data.startTime} - {data.endTime}
            </span>
          )}
        </p>
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
        Continue
      </Button>
    </form>
  )
}

