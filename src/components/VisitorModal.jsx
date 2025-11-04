import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Step0DateSelect } from "./modal-steps/Step0DateSelect"
import { Step1VisitorInfo } from "./modal-steps/Step1VisitorInfo"
import { Step1bCheckIn } from "./modal-steps/Step1bCheckIn"
import { Step2BulkUpload } from "./modal-steps/Step2BulkUpload"
import { Step3DateTime } from "./modal-steps/Step3DateTime"

export function VisitorModal({ open, onOpenChange, onSubmit, editingVisit }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
    checkIn: 'bypass',
    visitorNote: '',
    hostType: '',
    hostName: '',
    floor: '1',
    suite: '1001',
    visitDate: new Date().toISOString().split('T')[0],
    isMultiDay: false,
    selectedDates: [new Date().toISOString().split('T')[0]],
    recurring: false,
    frequency: '',
    recurringEnd: '',
    startTime: '',
    endTime: '',
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
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const handleFinalSubmit = (stepData) => {
    const finalData = { ...formData, ...stepData }
    onSubmit(finalData)
    // Reset form
    setCurrentStep(0)
    setFormData({
      visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
      checkIn: 'bypass',
      visitorNote: '',
      hostType: '',
      hostName: '',
      floor: '1',
      suite: '1001',
      visitDate: new Date().toISOString().split('T')[0],
      isMultiDay: false,
      selectedDates: [new Date().toISOString().split('T')[0]],
      recurring: false,
      frequency: '',
      recurringEnd: '',
      startTime: '',
      endTime: '',
      numEntries: '1',
      receiveCopyInvitation: true,
      receiveCheckInNotifications: true,
      additionalOrganizers: ''
    })
  }

  const handleClose = () => {
    onOpenChange(false)
    // Reset after close animation
    setTimeout(() => {
      setCurrentStep(0)
      setFormData({
        visitors: [{ email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }],
        checkIn: 'bypass',
        visitorNote: '',
        hostType: '',
        hostName: '',
        floor: '1',
        suite: '1001',
        visitDate: new Date().toISOString().split('T')[0],
        isMultiDay: false,
        selectedDates: [new Date().toISOString().split('T')[0]],
        recurring: false,
        frequency: '',
        recurringEnd: '',
        startTime: '',
        endTime: '',
        numEntries: '1',
        receiveCopyInvitation: true,
        receiveCheckInNotifications: true,
        additionalOrganizers: ''
      })
    }, 300)
  }

  const totalSteps = 4
  const progress = (currentStep / totalSteps) * 100
  const [showBulkUpload, setShowBulkUpload] = useState(false)

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
        {currentStep > 0 && (
          <DialogHeader>
            <div className="flex items-center gap-4 mb-4 pr-8">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  data-testid="modal-back"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              <div className="flex-1">
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                    data-testid="progress-bar"
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2" data-testid="step-text">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
          </DialogHeader>
        )}

        {currentStep === 0 && (
          <Step0DateSelect
            data={formData}
            onNext={(data) => {
              handleNext(data)
            }}
          />
        )}

        {currentStep === 1 && (
          <Step3DateTime
            data={formData}
            onNext={handleNext}
          />
        )}

        {/* Bulk upload option appears at step 2 */}
        {currentStep === 2 && (
          <div className="mb-4 flex justify-end">
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setShowBulkUpload(!showBulkUpload)}
              className="text-xs"
            >
              {showBulkUpload ? '← Add visitors manually' : 'Upload CSV instead →'}
            </Button>
          </div>
        )}

        {currentStep === 2 && !showBulkUpload && (
          <Step1VisitorInfo
            data={formData}
            onNext={handleNext}
          />
        )}

        {currentStep === 2 && showBulkUpload && (
          <Step2BulkUpload
            data={formData}
            onNext={(data) => {
              handleNext(data)
              setCurrentStep(3) // Skip check-in step for bulk upload
            }}
            onSkip={() => {
              setShowBulkUpload(false)
            }}
          />
        )}

        {currentStep === 3 && (
          <Step1bCheckIn
            data={formData}
            onSubmit={handleFinalSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}

