import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Step0DateSelect } from "@/components/modal-steps/Step0DateSelect"
import { Step1VisitorInfo } from "@/components/modal-steps/Step1VisitorInfo"
import { Step2BulkUpload } from "@/components/modal-steps/Step2BulkUpload"
import { Step3DateTime } from "@/components/modal-steps/Step3DateTime"

// Helper function to get default times (next hour, 1 hour duration)
const getDefaultTimes = () => {
  const now = new Date()
  const nextHour = new Date(now)
  nextHour.setHours(now.getHours() + 1)
  nextHour.setMinutes(0)
  nextHour.setSeconds(0)
  
  const endTime = new Date(nextHour)
  endTime.setHours(nextHour.getHours() + 1)
  
  const startTime = nextHour.toTimeString().slice(0, 5) // HH:MM format
  const endTimeStr = endTime.toTimeString().slice(0, 5) // HH:MM format
  
  return { startTime, endTime: endTimeStr }
}

// Helper function to get today's date in user's local timezone (YYYY-MM-DD format)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Transform a Visit object from the API into form data structure
 */
const transformVisitToFormData = (visit) => {
  if (!visit) return null

  // Parse visitorName into firstName and lastName
  const parseVisitorName = (name) => {
    if (!name) return { firstName: '', lastName: '' }
    const parts = name.trim().split(/\s+/)
    if (parts.length === 0) return { firstName: '', lastName: '' }
    if (parts.length === 1) return { firstName: parts[0], lastName: '' }
    const lastName = parts.slice(-1)[0]
    const firstName = parts.slice(0, -1).join(' ')
    return { firstName, lastName }
  }

  // Split comma-separated values into arrays
  const splitCommaSeparated = (value) => {
    if (!value) return []
    return value.split(',').map(v => v.trim()).filter(Boolean)
  }

  // Parse first visitor name
  const { firstName, lastName } = parseVisitorName(visit.visitorName)
  
  // Split emails and phones if comma-separated
  const emails = splitCommaSeparated(visit.visitorEmail)
  const phones = splitCommaSeparated(visit.visitorPhone)
  
  // Build visitors array
  const visitors = []
  const maxVisitors = Math.max(1, emails.length, phones.length)
  
  for (let i = 0; i < maxVisitors; i++) {
    const visitorNameParts = i === 0 
      ? parseVisitorName(visit.visitorName)
      : { firstName: '', lastName: '' }
    
    visitors.push({
      firstName: visitorNameParts.firstName || '',
      lastName: visitorNameParts.lastName || '',
      email: emails[i] || '',
      phone: phones[i] || '',
      company: i === 0 ? (visit.visitorCompany || '') : '',
      visitSummary: i === 0 ? (visit.visitSummary || '') : ''
    })
  }

  // Determine hostType based on whether host is set
  const hostType = visit.host ? 'someone' : 'me'

  return {
    visitors,
    checkIn: visit.checkIn || 'standard',
    visitorNote: '', // Not stored in visit object
    hostType,
    hostName: visit.host || '',
    floor: visit.floor || '1',
    suite: visit.suite || '1001',
    visitDate: visit.date || getLocalDateString(),
    visitDateEnd: visit.date || getLocalDateString(), // Single day visit
    isMultiDay: false, // Not stored in visit object
    selectedDates: visit.date ? [visit.date] : [getLocalDateString()],
    recurring: visit.recurring || false,
    frequency: visit.frequency || '',
    recurringEnd: '', // Not stored in visit object
    startTime: visit.startTime || getDefaultTimes().startTime,
    endTime: visit.endTime || getDefaultTimes().endTime,
    numEntries: visit.numEntries || '1',
    receiveCopyInvitation: true, // Default value
    receiveCheckInNotifications: true, // Default value
    additionalOrganizers: '' // Not stored in visit object
  }
}

export function CreateVisitPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const editingVisit = location.state?.editingVisit
  const initialStep = location.state?.initialStep || 0

  const [currentStep, setCurrentStep] = useState(initialStep)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const defaultTimes = getDefaultTimes()
  const [formData, setFormData] = useState({
    visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
    checkIn: '',
    visitorNote: '',
    hostType: 'me',
    hostName: '',
    floor: '1',
    suite: '1001',
    visitDate: new Date().toISOString().split('T')[0],
    visitDateEnd: new Date().toISOString().split('T')[0],
    isMultiDay: false,
    selectedDates: [new Date().toISOString().split('T')[0]],
    recurring: false,
    frequency: '',
    recurringEnd: '',
    startTime: defaultTimes.startTime,
    endTime: defaultTimes.endTime,
    numEntries: '1',
    receiveCopyInvitation: true,
    receiveCheckInNotifications: true,
    additionalOrganizers: ''
  })

  // Update current step when initialStep changes
  useEffect(() => {
    setCurrentStep(initialStep)
  }, [initialStep])

  // Populate form data when editing a visit
  useEffect(() => {
    if (editingVisit) {
      const transformedData = transformVisitToFormData(editingVisit)
      if (transformedData) {
        setFormData(transformedData)
      }
    }
  }, [editingVisit])

  const handleNext = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }))
    setCurrentStep(prev => prev + 1)
  }

  const handleBack = () => {
    if (currentStep > 0 && !isTransitioning) {
      handleStepChange(currentStep - 1)
    }
  }

  const handleFinalSubmit = (stepData) => {
    const finalData = { ...formData, ...stepData }
    
    // Navigate back to home with the form data
    navigate('/', { 
      state: { 
        newVisit: finalData,
        editingVisitId: editingVisit?.id 
      } 
    })
  }

  const handleCancel = () => {
    navigate('/')
  }

  const [showBulkUpload, setShowBulkUpload] = useState(false)

  const stepLabels = ['When', 'Host', 'Visitors']

  const handleStepChange = (newStep) => {
    if (newStep === currentStep || isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentStep(newStep)
      setTimeout(() => {
        setIsTransitioning(false)
      }, 30)
    }, 150)
  }

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="bg-white">
        <div className="px-1 sm:px-6 lg:px-12 py-3 sm:py-6 flex justify-center">
          <div className="w-full max-w-6xl">
            {/* Breadcrumb */}
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-3 sm:mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Visitor Management</span>
            </button>
            
            {/* Main Heading */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-gray-900">
                {editingVisit ? 'Edit visit' : 'New visit'}
              </h1>
              <Button
                variant="outline"
                onClick={handleCancel}
                className="hidden sm:block"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-3 sm:px-2 lg:px-12 py-4 sm:py-8 bg-white flex justify-center">
        <div className="w-full max-w-6xl">
        {/* Progress Steps */}
        <div className="bg-white rounded-lg border shadow-sm mb-4 sm:mb-6 p-2 sm:p-3">
          <div className="flex items-center justify-center gap-1 sm:gap-2 scale-[0.5] sm:scale-100 origin-center w-full">
            {stepLabels.map((label, index) => (
              <>
              <div key={index} className="flex items-center flex-shrink-0">
                <button
                  onClick={() => handleStepChange(index)}
                  disabled={isTransitioning}
                  className={`flex items-center gap-1 sm:gap-2 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    index === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80'
                  } ${isTransitioning ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-primary-foreground text-primary'
                      : index < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}>
                    {index + 1}
                  </span>
                  <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{label}</span>
                </button>
              </div>
              {index < stepLabels.length - 1 && (
                <div className={`w-2 sm:w-4 h-0.5 mx-0.5 sm:mx-0.5 transition-all duration-300 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
              </>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border shadow-sm p-3 sm:p-3">
          <div 
            className={`transition-opacity duration-150 ease-in-out min-h-[400px] sm:min-h-[500px] ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {currentStep === 0 && (
              <div key="step-0">
                <Step0DateSelect
                  data={formData}
                  onNext={(data) => {
                    handleNext(data)
                  }}
                />
              </div>
            )}

            {currentStep === 1 && (
              <div key="step-1">
                <Step3DateTime
                  data={formData}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              </div>
            )}

            {currentStep === 2 && !showBulkUpload && (
              <div key="step-2">
                <Step1VisitorInfo
                  data={formData}
                  onNext={handleFinalSubmit}
                  onBack={handleBack}
                  onToggleBulkUpload={() => setShowBulkUpload(true)}
                />
              </div>
            )}

            {currentStep === 2 && showBulkUpload && (
              <div key="step-2-bulk">
                <Step2BulkUpload
                  data={formData}
                  onNext={(data) => {
                    handleFinalSubmit(data)
                  }}
                  onBack={handleBack}
                  onSkip={() => {
                    setShowBulkUpload(false)
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-3 flex gap-3">
            {currentStep > 0 && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleBack} 
                className="flex-1"
                disabled={isTransitioning}
              >
                Back
              </Button>
            )}
            {currentStep < 2 ? (
              <Button 
                onClick={() => {
                  // Trigger form submission in the active step
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="flex-1"
                disabled={isTransitioning}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                className="flex-1"
                disabled={isTransitioning}
              >
                {editingVisit 
                  ? 'Update visit' 
                  : (formData.multipleVisitors || formData.visitors?.length > 1 || formData.uploadedFile)
                    ? 'Add visits'
                    : 'Add visit'}
              </Button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

