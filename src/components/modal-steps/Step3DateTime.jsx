import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Bell, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

export function Step3DateTime({ data, onNext, onSubmit }) {
  const [numEntries, setNumEntries] = useState(data.numEntries)
  const [floor, setFloor] = useState(data.floor)
  const [suite, setSuite] = useState(data.suite)
  const [hostType, setHostType] = useState(data.hostType)
  const [hostName, setHostName] = useState(data.hostName)
  const [receiveCopyInvitation, setReceiveCopyInvitation] = useState(data.receiveCopyInvitation)
  const [receiveCheckInNotifications, setReceiveCheckInNotifications] = useState(data.receiveCheckInNotifications)
  const [additionalOrganizers, setAdditionalOrganizers] = useState(data.additionalOrganizers)

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = {
      numEntries,
      floor,
      suite,
      hostType,
      hostName,
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers
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
        <div className="text-sm text-gray-600 mt-1">
          {data.isMultiDay && data.selectedDates && data.selectedDates.length > 1 ? (
            <>
              <p>Visit scheduled for <span className="font-medium text-gray-900">{data.selectedDates.length} days</span>:</p>
              <p className="mt-1 text-xs">
                {data.selectedDates.map((date, i) => (
                  <span key={i}>
                    {formatDate(date)}
                    {i < data.selectedDates.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </p>
            </>
          ) : (
            <p>
              Visit scheduled for <span className="font-medium text-gray-900">{formatDate(data.visitDate)}</span>
            </p>
          )}
          {data.recurring && <span className="ml-1">({data.frequency})</span>}
          {data.startTime && data.endTime && (
            <p className="mt-1">
              Time: {data.startTime} - {data.endTime}
            </p>
          )}
        </div>
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

      {/* Who is hosting section */}
      <div className="border-t pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold">Who is hosting?</h3>
          <p className="text-sm text-gray-600 mt-1">Select the host for this visit</p>
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
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="receiveCopyInvitation" className="cursor-pointer font-medium">
                    Receive copy of invitation
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Get an email copy when visitors are invited
                </p>
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
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-gray-500" />
                  <Label htmlFor="receiveCheckInNotifications" className="cursor-pointer font-medium">
                    Receive check-in notifications
                  </Label>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Get notified when visitors arrive and check in
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <Label htmlFor="additionalOrganizers">Additional organizers (optional)</Label>
            </div>
            <Textarea
              id="additionalOrganizers"
              placeholder="Enter email addresses separated by commas&#10;e.g. john@example.com, jane@example.com"
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

      <Button type="submit" className="w-full">
        Continue
      </Button>
    </form>
  )
}

