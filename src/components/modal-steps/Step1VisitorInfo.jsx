import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { X, Download, Upload, Info } from "lucide-react"

export function Step1VisitorInfo({ data, onNext, onToggleBulkUpload, onBack }) {
  const [visitors, setVisitors] = useState(data.visitors)
  const [visitorMode, setVisitorMode] = useState(visitors.length > 1 ? 'multiple' : 'single')
  const [groupVisitSummary, setGroupVisitSummary] = useState(data.visitors[0]?.visitSummary || '')
  
  // Multiple visitors group fields
  const [uploadedFile, setUploadedFile] = useState(null)
  const [guestCount, setGuestCount] = useState(null)
  
  // Error states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const addVisitor = () => {
    setVisitors([...visitors, { email: '', firstName: '', lastName: '', phone: '', company: '', visitSummary: '' }])
  }

  const handleModeChange = (mode) => {
    setVisitorMode(mode)
    if (mode === 'single' && visitors.length > 1) {
      // Keep only the first visitor when switching to single
      setVisitors([visitors[0]])
    } else if (mode === 'multiple' && visitors.length === 1) {
      // Add a second visitor when switching to multiple
      addVisitor()
    }
    // Reset file upload when switching modes
    setUploadedFile(null)
    setGuestCount(null)
  }

  const removeVisitor = (index) => {
    if (visitors.length > 1) {
      setVisitors(visitors.filter((_, i) => i !== index))
    }
  }

  const updateVisitor = (index, field, value) => {
    const updated = [...visitors]
    updated[index][field] = value
    setVisitors(updated)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (visitorMode === 'single') {
      // Validate each visitor
      visitors.forEach((visitor, index) => {
        if (!visitor.firstName?.trim()) {
          newErrors[`firstName-${index}`] = 'First name is required'
        }
        if (!visitor.lastName?.trim()) {
          newErrors[`lastName-${index}`] = 'Last name is required'
        }
        if (!visitor.company?.trim()) {
          newErrors[`company-${index}`] = 'Affiliation / company name is required'
        }
        if (!visitor.visitSummary?.trim()) {
          newErrors[`visitSummary-${index}`] = 'Visit summary is required'
        }
      })
    } else {
      // Validate group visit
      if (!groupVisitSummary?.trim()) {
        newErrors.groupVisitSummary = 'Visit summary is required'
      }
      if (!uploadedFile) {
        newErrors.uploadedFile = 'Please upload a visitor list CSV file'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = {}
    if (visitorMode === 'single') {
      visitors.forEach((_, index) => {
        allTouched[`firstName-${index}`] = true
        allTouched[`lastName-${index}`] = true
        allTouched[`company-${index}`] = true
        allTouched[`visitSummary-${index}`] = true
      })
    } else {
      allTouched.groupVisitSummary = true
      allTouched.uploadedFile = true
    }
    setTouched(allTouched)
    
    // Validate and submit
    if (!validateForm()) {
      return
    }
    
    if (visitorMode === 'multiple') {
      // For multiple visitors, pass the group details
      onNext({ 
        visitSummary: groupVisitSummary,
        uploadedFile: uploadedFile,
        multipleVisitors: true
      })
    } else {
      // For single visitor, pass visitor data
      onNext({ visitors })
    }
  }
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const handleDownloadTemplate = () => {
    // Create CSV template
    const csvContent = "First Name,Last Name,Email,Phone,Company\nJohn,Doe,john.doe@example.com,+1234567890,Acme Corp\n"
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'visitors_template.csv'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      
      // Parse CSV to count guests
      try {
        const text = await file.text()
        const lines = text.split('\n').filter(line => line.trim() !== '')
        // Subtract 1 for header row, but ensure at least 0
        const count = Math.max(0, lines.length - 1)
        setGuestCount(count)
      } catch (error) {
        console.error('Error parsing CSV:', error)
        setGuestCount(0)
      }
    }
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold">Visitor information</h2>
          <p className="text-sm text-gray-600 mt-1">Provide details about who is visiting</p>
        </div>

      {/* Visitor Mode Selection */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Are you inviting one visitor or multiple?</Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={visitorMode === 'single' ? 'default' : 'outline'}
            className="h-12"
            onClick={() => handleModeChange('single')}
          >
            One visitor
          </Button>
          <Button
            type="button"
            variant={visitorMode === 'multiple' ? 'default' : 'outline'}
            className="h-12"
            onClick={() => handleModeChange('multiple')}
          >
            Multiple visitors
          </Button>
        </div>
      </div>

      {visitorMode === 'single' ? (
        /* Single Visitor Mode - Individual Cards */
        <div className="space-y-6">
          {visitors.map((visitor, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            {visitors.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeVisitor(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            
            {visitors.length > 1 && (
              <h3 className="font-medium">Visitor {index + 1}</h3>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${index}`}>
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`firstName-${index}`}
                  placeholder="e.g. John"
                  value={visitor.firstName}
                  onChange={(e) => {
                    updateVisitor(index, 'firstName', e.target.value)
                    if (touched[`firstName-${index}`]) {
                      validateForm()
                    }
                  }}
                  onBlur={() => handleBlur(`firstName-${index}`)}
                  className={`visitor-firstname ${errors[`firstName-${index}`] && touched[`firstName-${index}`] ? 'border-destructive' : ''}`}
                />
                {errors[`firstName-${index}`] && touched[`firstName-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`firstName-${index}`]}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lastName-${index}`}>
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`lastName-${index}`}
                  placeholder="e.g. Smith"
                  value={visitor.lastName}
                  onChange={(e) => {
                    updateVisitor(index, 'lastName', e.target.value)
                    if (touched[`lastName-${index}`]) {
                      validateForm()
                    }
                  }}
                  onBlur={() => handleBlur(`lastName-${index}`)}
                  className={`visitor-lastname ${errors[`lastName-${index}`] && touched[`lastName-${index}`] ? 'border-destructive' : ''}`}
                />
                {errors[`lastName-${index}`] && touched[`lastName-${index}`] && (
                  <p className="text-sm text-destructive">{errors[`lastName-${index}`]}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`email-${index}`}>Visitor's email</Label>
              <Input
                id={`email-${index}`}
                type="email"
                placeholder="Enter email address"
                value={visitor.email}
                onChange={(e) => updateVisitor(index, 'email', e.target.value)}
                className="visitor-email"
              />
              <p className="text-xs text-gray-500">Optional: Used to send visit invitations</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone number</Label>
              <div className="flex gap-2">
                <div className="w-12 h-10 flex items-center justify-center border rounded-md bg-muted">
                  🇺🇸
                </div>
                <Input
                  id={`phone-${index}`}
                  type="tel"
                  placeholder="e.g. +1234567890"
                  value={visitor.phone}
                  onChange={(e) => updateVisitor(index, 'phone', e.target.value)}
                  className="flex-1 visitor-phone"
                />
              </div>
              <p className="text-xs text-gray-500">Optional: Contact number for the visitor</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>
                Affiliation / company name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`company-${index}`}
                placeholder="e.g. Acme Corp"
                value={visitor.company}
                onChange={(e) => {
                  updateVisitor(index, 'company', e.target.value)
                  if (touched[`company-${index}`]) {
                    validateForm()
                  }
                }}
                onBlur={() => handleBlur(`company-${index}`)}
                className={`visitor-company ${errors[`company-${index}`] && touched[`company-${index}`] ? 'border-destructive' : ''}`}
              />
              {errors[`company-${index}`] && touched[`company-${index}`] && (
                <p className="text-sm text-destructive">{errors[`company-${index}`]}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor={`visitSummary-${index}`}>
                Visit summary <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`visitSummary-${index}`}
                placeholder="e.g. Quarterly business review"
                value={visitor.visitSummary}
                onChange={(e) => {
                  updateVisitor(index, 'visitSummary', e.target.value)
                  if (touched[`visitSummary-${index}`]) {
                    validateForm()
                  }
                }}
                onBlur={() => handleBlur(`visitSummary-${index}`)}
                className={`visitor-summary ${errors[`visitSummary-${index}`] && touched[`visitSummary-${index}`] ? 'border-destructive' : ''}`}
              />
              {errors[`visitSummary-${index}`] && touched[`visitSummary-${index}`] && (
                <p className="text-sm text-destructive">{errors[`visitSummary-${index}`]}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      ) : (
        /* Multiple Visitors Mode - Visit Summary + CSV Upload */
        <div className="space-y-6">
          {/* Visit Summary */}
          <div className="space-y-2">
            <Label htmlFor="groupVisitSummary">
              Visit summary <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="groupVisitSummary"
              placeholder="e.g. Quarterly business review"
              value={groupVisitSummary}
              onChange={(e) => {
                setGroupVisitSummary(e.target.value)
                if (touched.groupVisitSummary) {
                  validateForm()
                }
              }}
              onBlur={() => handleBlur('groupVisitSummary')}
              className={errors.groupVisitSummary && touched.groupVisitSummary ? 'border-destructive' : ''}
              rows={3}
            />
            {errors.groupVisitSummary && touched.groupVisitSummary && (
              <p className="text-sm text-destructive">{errors.groupVisitSummary}</p>
            )}
          </div>

          {/* CSV Upload Section */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">Upload visitor list</h3>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Use our CSV template to add multiple visitors at once with their contact information</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Download our template, fill in your visitor details, and upload the completed file
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleDownloadTemplate}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>

              <div className="flex-1">
                <input
                  type="file"
                  id="csvUpload"
                  accept=".csv"
                  onChange={(e) => {
                    handleFileUpload(e)
                    if (touched.uploadedFile) {
                      validateForm()
                    }
                  }}
                  onBlur={() => handleBlur('uploadedFile')}
                  className="hidden"
                />
                <Label htmlFor="csvUpload" className="cursor-pointer">
                  <div className={`flex items-center justify-center h-10 px-4 py-2 bg-background border rounded-md hover:bg-accent hover:text-accent-foreground ${errors.uploadedFile && touched.uploadedFile ? 'border-destructive' : 'border-input'}`}>
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadedFile ? uploadedFile.name : 'Upload CSV'}
                  </div>
                </Label>
              </div>
            </div>

            {errors.uploadedFile && touched.uploadedFile && (
              <p className="text-sm text-destructive">{errors.uploadedFile}</p>
            )}

            {uploadedFile && guestCount !== null && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <span>✓</span>
                <span>{guestCount} {guestCount === 1 ? 'guest' : 'guests'} found in your file</span>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
    </TooltipProvider>
  )
}

