import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step3DateTime({ data, onNext, onSubmit, onBack }) {
  const [hostType, setHostType] = useState(data.hostType)
  const [hostName, setHostName] = useState(data.hostName)
  const [receiveCopyInvitation, setReceiveCopyInvitation] = useState(data.receiveCopyInvitation)
  const [receiveCheckInNotifications, setReceiveCheckInNotifications] = useState(data.receiveCheckInNotifications)
  const [additionalOrganizers, setAdditionalOrganizers] = useState(data.additionalOrganizers)
  const [floor, setFloor] = useState(data.floor || '1')
  const [suite, setSuite] = useState(data.suite || '1001')

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = {
      hostType,
      hostName,
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers,
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
      {/* Who is hosting section */}
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Who is hosting?</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            type="button"
            variant={hostType === 'me' ? 'default' : 'outline'}
            className="h-20 text-base"
            onClick={() => setHostType('me')}
          >
            I am
          </Button>
          <Button
            type="button"
            variant={hostType === 'someone' ? 'default' : 'outline'}
            className="h-20 text-base"
            onClick={() => setHostType('someone')}
          >
            Someone else
          </Button>
        </div>

        {hostType === 'someone' && (
          <div className="space-y-2">
            <Label htmlFor="hostName">Host name <span className="text-destructive">*</span></Label>
            <Input
              id="hostName"
              placeholder="Search or enter host name"
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Host Preferences */}
      {hostType && (
        <div className="border-t pt-6 space-y-6">
          <h3 className="font-medium text-gray-900">Host preferences</h3>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="receiveCopyInvitation"
                  checked={receiveCopyInvitation}
                  onChange={(e) => setReceiveCopyInvitation(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="receiveCopyInvitation" className="cursor-pointer font-medium">
                  Receive copy of invitation
                </Label>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center h-5">
                <input
                  type="checkbox"
                  id="receiveCheckInNotifications"
                  checked={receiveCheckInNotifications}
                  onChange={(e) => setReceiveCheckInNotifications(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="receiveCheckInNotifications" className="cursor-pointer font-medium">
                  Receive check-in notifications
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalOrganizers">Additional organizers (optional)</Label>
            <Textarea
              id="additionalOrganizers"
              placeholder="Enter email addresses separated by commas"
              value={additionalOrganizers}
              onChange={(e) => setAdditionalOrganizers(e.target.value)}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Additional organizers will receive host communications (invitations, check-in notifications)
            </p>
          </div>
        </div>
      )}

      {/* Floor and Suite */}
      <div className="border-t pt-6 space-y-6">
        <h3 className="font-medium text-gray-900">Location</h3>
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
      </div>
    </form>
  )
}

