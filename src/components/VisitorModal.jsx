import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Step0DateSelect } from "./modal-steps/Step0DateSelect"
import { Step1VisitorInfo } from "./modal-steps/Step1VisitorInfo"
import { Step1bCheckIn } from "./modal-steps/Step1bCheckIn"
import { Step2BulkUpload } from "./modal-steps/Step2BulkUpload"
import { Step3DateTime } from "./modal-steps/Step3DateTime"

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

export function VisitorModal({ open, onOpenChange, onSubmit, editingVisit }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const defaultTimes = getDefaultTimes()
  const [formData, setFormData] = useState({
    visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
    checkIn: 'bypass',
    visitorNote: '',
    hostType: 'me',
    hostName: '',
    floor: '1',
    suite: '1001',
    visitDate: new Date().toISOString().split('T')[0],
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
    onSubmit(finalData)
    // Reset form with fresh default times
    const resetTimes = getDefaultTimes()
    setCurrentStep(0)
    setFormData({
      visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
      checkIn: 'bypass',
      visitorNote: '',
      hostType: 'me',
      hostName: '',
      floor: '1',
      suite: '1001',
      visitDate: new Date().toISOString().split('T')[0],
      isMultiDay: false,
      selectedDates: [new Date().toISOString().split('T')[0]],
      recurring: false,
      frequency: '',
      recurringEnd: '',
      startTime: resetTimes.startTime,
      endTime: resetTimes.endTime,
      numEntries: '1',
      receiveCopyInvitation: true,
      receiveCheckInNotifications: true,
      additionalOrganizers: ''
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after close animation with fresh default times
    setTimeout(() => {
      const resetTimes = getDefaultTimes()
      setCurrentStep(0)
      setFormData({
        visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
        checkIn: 'bypass',
        visitorNote: '',
        hostType: 'me',
        hostName: '',
        floor: '1',
        suite: '1001',
        visitDate: new Date().toISOString().split('T')[0],
        isMultiDay: false,
        selectedDates: [new Date().toISOString().split('T')[0]],
        recurring: false,
        frequency: '',
        recurringEnd: '',
        startTime: resetTimes.startTime,
        endTime: resetTimes.endTime,
        numEntries: '1',
        receiveCopyInvitation: true,
        receiveCheckInNotifications: true,
        additionalOrganizers: ''
      })
    }, 300)
  }

  const totalSteps = 4
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  const stepLabels = ['When', 'Host', 'Visitors', 'Access']

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
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="flex-shrink-0 px-6 pt-6">
          {/* Step Navigation */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {stepLabels.map((label, index) => (
              <div key={index} className="flex items-center">
                <button
                  onClick={() => handleStepChange(index)}
                  disabled={isTransitioning}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
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
                  <span className="text-sm font-medium">{label}</span>
                </button>
                {index < stepLabels.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </DialogHeader>

        <div 
          className={`relative transition-opacity duration-150 ease-in-out overflow-y-auto flex-1 px-6 pb-6 min-h-[500px] ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {currentStep === 0 && (
            <div key="step-0" className="min-h-[500px]">
              <Step0DateSelect
                data={formData}
                onNext={(data) => {
                  handleNext(data)
                }}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div key="step-1" className="min-h-[500px]">
              <Step3DateTime
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
              />
            </div>
          )}

          {currentStep === 2 && !showBulkUpload && (
            <div key="step-2" className="min-h-[500px]">
              <Step1VisitorInfo
                data={formData}
                onNext={handleNext}
                onBack={handleBack}
                onToggleBulkUpload={() => setShowBulkUpload(true)}
              />
            </div>
          )}

          {currentStep === 2 && showBulkUpload && (
            <div key="step-2-bulk" className="min-h-[500px]">
              <Step2BulkUpload
                data={formData}
                onNext={(data) => {
                  handleNext(data)
                  setCurrentStep(3) // Skip check-in step for bulk upload
                }}
                onBack={handleBack}
                onSkip={() => {
                  setShowBulkUpload(false)
                }}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div key="step-3" className="min-h-[500px]">
              <Step1bCheckIn
                data={formData}
                onSubmit={handleFinalSubmit}
                onBack={handleBack}
              />
            </div>
          )}
        </div>

        {/* Sticky Footer for Buttons */}
        <div className="flex-shrink-0 border-t bg-white px-6 py-4">
          <div className="flex gap-3">
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
            {currentStep < 3 ? (
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
                Add visit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
