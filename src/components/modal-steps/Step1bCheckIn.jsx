import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step1bCheckIn({ data, onNext }) {
  const [checkIn, setCheckIn] = useState(data.checkIn)
  const [visitorNote, setVisitorNote] = useState(data.visitorNote)

  const handleSubmit = (e) => {
    e.preventDefault()
    onNext({ checkIn, visitorNote })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Check-in preferences</h2>
        <p className="text-sm text-gray-600 mt-1">Set arrival instructions for your visitor</p>
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
        <Label htmlFor="visitorNote">Note for visitor</Label>
        <Textarea
          id="visitorNote"
          placeholder="e.g. Go to security desk"
          value={visitorNote}
          onChange={(e) => setVisitorNote(e.target.value)}
          rows={4}
        />
      </div>

      <Button type="submit" className="w-full">Continue</Button>
    </form>
  )
}

