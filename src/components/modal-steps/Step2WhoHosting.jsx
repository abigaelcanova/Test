import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Bell, Users } from "lucide-react"

export function Step2WhoHosting({ data, onNext, onSubmit }) {
  const [hostType, setHostType] = useState(data.hostType)
  const [hostName, setHostName] = useState(data.hostName)
  const [receiveCopyInvitation, setReceiveCopyInvitation] = useState(data.receiveCopyInvitation)
  const [receiveCheckInNotifications, setReceiveCheckInNotifications] = useState(data.receiveCheckInNotifications)
  const [additionalOrganizers, setAdditionalOrganizers] = useState(data.additionalOrganizers)

  const handleHostTypeSelect = (type) => {
    setHostType(type)
  }

  const handleContinueAsMe = () => {
    const stepData = { 
      hostType: 'me', 
      hostName: 'Current User',
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers
    }
    if (onSubmit) {
      onSubmit(stepData)
    } else if (onNext) {
      onNext(stepData)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const stepData = { 
      hostType, 
      hostName,
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers
    }
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

      {hostType === 'someone' && (
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          <div>
            <h3 className="text-lg font-semibold mb-4">Host details</h3>
          </div>

      <div className="space-y-2">
        <Label htmlFor="hostName">Host name <span className="text-destructive">*</span></Label>
        <Input
          id="hostName"
          placeholder="Search or enter host name"
          value={hostName}
          onChange={(e) => setHostName(e.target.value)}
        />
      </div>

          <Button type="submit" className="w-full">Continue</Button>
        </form>
      )}

      {/* Host Preferences - shown for both "I am" and "Someone else" */}
      {hostType && (
        <div className="border-t pt-6 space-y-6 mt-6">
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

          {hostType === 'me' && (
            <Button onClick={handleContinueAsMe} className="w-full">
              Submit Visitor Request
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

