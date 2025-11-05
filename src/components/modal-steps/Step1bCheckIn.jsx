import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step1bCheckIn({ data, onSubmit, onBack }) {
  const [checkIn, setCheckIn] = useState(data.checkIn)
  const [numEntries, setNumEntries] = useState(data.numEntries)
  const [visitorNote, setVisitorNote] = useState(data.visitorNote)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ checkIn, numEntries, visitorNote })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Check-in preferences</h2>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkIn">
          Check-in <span className="text-destructive">*</span>
        </Label>
        <Select value={checkIn} onValueChange={setCheckIn}>
          <SelectTrigger id="checkIn">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desk">Stop at desk</SelectItem>
            <SelectItem value="bypass">Bypass desk</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="numEntries">
          Max number of entries <span className="text-destructive">*</span>
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

      <div className="space-y-2">
        <Label htmlFor="visitorNote">Note for visitor</Label>
        <Textarea
          id="visitorNote"
          placeholder="e.g. Go to security desk"
          value={visitorNote}
          onChange={(e) => setVisitorNote(e.target.value)}
          rows={4}
        />
      </div>

      <div className="flex gap-3">
        {onBack && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}
        <Button type="submit" className="flex-1">Add visit</Button>
      </div>
    </form>
  )
}

