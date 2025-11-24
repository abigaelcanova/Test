import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function Step3DateTime({ data, onNext, onSubmit, onBack, visits = [] }) {
  const [hostType, setHostType] = useState(data.hostType)
  const [hostName, setHostName] = useState(data.hostName)
  const [receiveCopyInvitation, setReceiveCopyInvitation] = useState(data.receiveCopyInvitation)
  const [receiveCheckInNotifications, setReceiveCheckInNotifications] = useState(data.receiveCheckInNotifications)
  const [additionalOrganizers, setAdditionalOrganizers] = useState(data.additionalOrganizers)
  const [floor, setFloor] = useState(data.floor || '1')
  
  // Track if hostName was set from data prop (editing) vs user input
  const hostNameFromDataRef = useRef(data.hostName || '')
  
  // Error states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Update state when data prop changes (for editing visits)
  useEffect(() => {
    if (data.hostType !== undefined) {
      setHostType(data.hostType)
    }
    if (data.hostName !== undefined) {
      hostNameFromDataRef.current = data.hostName
      setHostName(data.hostName)
    }
    // Always update floor when data changes
    if (data.floor !== undefined) {
      setFloor(data.floor)
    }
    if (data.receiveCopyInvitation !== undefined) {
      setReceiveCopyInvitation(data.receiveCopyInvitation)
    }
    if (data.receiveCheckInNotifications !== undefined) {
      setReceiveCheckInNotifications(data.receiveCheckInNotifications)
    }
    if (data.additionalOrganizers !== undefined) {
      setAdditionalOrganizers(data.additionalOrganizers || '')
    }
  }, [data.hostType, data.hostName, data.floor, data.receiveCopyInvitation, data.receiveCheckInNotifications, data.additionalOrganizers])

  // Auto-populate floor when host is selected (only when user manually types host, not when editing)
  useEffect(() => {
    // Only auto-populate if:
    // 1. hostName was changed by user (not from data prop)
    // 2. hostName is different from what was set from data
    const isUserInput = hostName && hostName !== hostNameFromDataRef.current
    
    if (isUserInput && hostType === 'someone' && hostName.trim().length > 0) {
      // Always try to get visits from localStorage first, then fall back to passed prop
      let allVisits = []
      try {
        const storedVisits = localStorage.getItem('visits')
        if (storedVisits) {
          allVisits = JSON.parse(storedVisits)
        } else if (visits && visits.length > 0) {
          allVisits = visits
        }
      } catch (e) {
        console.error('Error reading visits from localStorage:', e)
        if (visits && visits.length > 0) {
          allVisits = visits
        }
      }
      
      if (allVisits.length > 0) {
        // Find the most recent visit for this host (case-insensitive match)
        const hostVisits = allVisits.filter(v => {
          if (!v.host) return false
          return v.host.toLowerCase().trim() === hostName.toLowerCase().trim()
        })
        
        if (hostVisits.length > 0) {
          // Sort by date (most recent first) and get the first one
          const sortedVisits = hostVisits.sort((a, b) => {
            const dateA = new Date(a.date)
            const dateB = new Date(b.date)
            return dateB - dateA
          })
          const mostRecentVisit = sortedVisits[0]
          if (mostRecentVisit.floor) {
            setFloor(String(mostRecentVisit.floor))
          }
        }
      }
    }
  }, [hostName, hostType, visits, data.floor])

  const validateForm = () => {
    const newErrors = {}
    
    // Validate host name if "someone else" is selected
    if (hostType === 'someone' && !hostName?.trim()) {
      newErrors.hostName = 'Host name is required'
    }
    
    // Floor is always required
    if (!floor) {
      newErrors.floor = 'Floor is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark relevant fields as touched
    const allTouched = { floor: true }
    if (hostType === 'someone') {
      allTouched.hostName = true
    }
    setTouched(allTouched)
    
    // Validate and submit
    if (!validateForm()) {
      return
    }
    
    const stepData = {
      hostType,
      hostName,
      receiveCopyInvitation,
      receiveCheckInNotifications,
      additionalOrganizers,
      floor
    }
    
    if (onNext) {
      onNext(stepData)
    } else if (onSubmit) {
      onSubmit(stepData)
    }
  }
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
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
            className="h-12 text-base"
            onClick={() => setHostType('me')}
          >
            I am
          </Button>
          <Button
            type="button"
            variant={hostType === 'someone' ? 'default' : 'outline'}
            className="h-12 text-base"
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
              onChange={(e) => {
                setHostName(e.target.value)
                if (touched.hostName) {
                  validateForm()
                }
              }}
              onBlur={() => handleBlur('hostName')}
              className={errors.hostName && touched.hostName ? 'border-destructive' : ''}
            />
            {errors.hostName && touched.hostName && (
              <p className="text-sm text-destructive">{errors.hostName}</p>
            )}
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

      {/* Floor */}
      <div className="border-t pt-6 space-y-6">
        <h3 className="font-medium text-gray-900">Location</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="floor">
              Floor <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={floor} 
              onValueChange={(value) => {
                setFloor(value)
                if (touched.floor) {
                  validateForm()
                }
              }}
            >
              <SelectTrigger 
                id="floor"
                className={errors.floor && touched.floor ? 'border-destructive' : ''}
                onBlur={() => handleBlur('floor')}
              >
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
            {errors.floor && touched.floor && (
              <p className="text-sm text-destructive">{errors.floor}</p>
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

