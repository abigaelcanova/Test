import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatDate } from "@/lib/utils"

export function Step3DateTime({ data, onNext, onSubmit }) {
  const [numEntries, setNumEntries] = useState(data.numEntries)
  const [floor, setFloor] = useState(data.floor)
  const [suite, setSuite] = useState(data.suite)

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = {
      numEntries,
      floor,
      suite
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
        <h2 className="text-xl font-semibold">Visit details</h2>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor">
            Floor <span className="text-destructive">*</span>
          </Label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger id="floor">
              <SelectValue placeholder="Select floor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1</SelectItem>
              <SelectItem value="2">2</SelectItem>
              <SelectItem value="3">3</SelectItem>
              <SelectItem value="14">14</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="suite">
            Suite <span className="text-destructive">*</span>
          </Label>
          <Select value={suite} onValueChange={setSuite}>
            <SelectTrigger id="suite">
              <SelectValue placeholder="Select suite" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1001">#1001</SelectItem>
              <SelectItem value="1002">#1002</SelectItem>
              <SelectItem value="1003">#1003</SelectItem>
              <SelectItem value="1004">#1004</SelectItem>
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
        Continue
      </Button>
    </form>
  )
}

