import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step2WhoHosting({ data, onNext, onSubmit }) {
  const [hostType, setHostType] = useState(data.hostType)
  const [hostName, setHostName] = useState(data.hostName)
  const [floor, setFloor] = useState(data.floor)
  const [suite, setSuite] = useState(data.suite)

  const handleHostTypeSelect = (type) => {
    setHostType(type)
  }

  const handleContinueAsMe = () => {
    const stepData = { hostType: 'me', hostName: 'Current User' }
    if (onSubmit) {
      onSubmit(stepData)
    } else if (onNext) {
      onNext(stepData)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = { hostType, hostName, floor, suite }
    if (onSubmit) {
      onSubmit(stepData)
    } else if (onNext) {
      onNext(stepData)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Who is hosting?</h2>
        <p className="text-sm text-gray-600 mt-1">Select the host for this visit</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant={hostType === 'me' ? 'default' : 'outline'}
          className="h-20 text-base"
          onClick={() => handleHostTypeSelect('me')}
          data-testid="host-me"
        >
          I am
        </Button>
        <Button
          variant={hostType === 'someone' ? 'default' : 'outline'}
          className="h-20 text-base"
          onClick={() => handleHostTypeSelect('someone')}
          data-testid="host-someone"
        >
          Someone else
        </Button>
      </div>

      {hostType === 'me' && (
        <Button onClick={handleContinueAsMe} className="w-full">
          Continue
        </Button>
      )}

      {hostType === 'someone' && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Host details</h3>
          </div>

      <div className="space-y-2">
        <Label htmlFor="hostName">Host name</Label>
        <Input
          id="hostName"
          placeholder="Search host name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="building">Building</Label>
        <Input
          id="building"
          value="Current building"
          disabled
          className="bg-muted"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="floor">Floor</Label>
          <Select value={floor} onValueChange={setFloor}>
            <SelectTrigger id="floor">
              <SelectValue placeholder="e.g. 14" />
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
          <Label htmlFor="suite">Suite</Label>
          <Select value={suite} onValueChange={setSuite}>
            <SelectTrigger id="suite">
              <SelectValue placeholder="e.g. #1004" />
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

          <Button type="submit" className="w-full">Continue</Button>
        </form>
      )}
    </div>
  )
}

