import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Download, Upload } from "lucide-react"

export function Step1VisitorInfo({ data, onNext, onToggleBulkUpload, onBack }) {
  const [visitors, setVisitors] = useState(data.visitors)
  const [visitorMode, setVisitorMode] = useState(visitors.length > 1 ? 'multiple' : 'single')
  const [groupVisitSummary, setGroupVisitSummary] = useState(data.visitors[0]?.visitSummary || '')
  
  // Multiple visitors group fields
  const [uploadedFile, setUploadedFile] = useState(null)

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

  const handleSubmit = (e) => {
    e.preventDefault()
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

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Visitor information</h2>
        <p className="text-sm text-gray-600 mt-1">Who will be visiting?</p>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`firstName-${index}`}>
                  First name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`firstName-${index}`}
                  placeholder="e.g. John"
                  value={visitor.firstName}
                  onChange={(e) => updateVisitor(index, 'firstName', e.target.value)}
                  className="visitor-firstname"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`lastName-${index}`}>
                  Last name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id={`lastName-${index}`}
                  placeholder="e.g. Smith"
                  value={visitor.lastName}
                  onChange={(e) => updateVisitor(index, 'lastName', e.target.value)}
                  className="visitor-lastname"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`phone-${index}`}>Phone number (optional)</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor={`company-${index}`}>
                Affiliation / company name <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`company-${index}`}
                placeholder="e.g. Acme Corp"
                value={visitor.company}
                onChange={(e) => updateVisitor(index, 'company', e.target.value)}
                className="visitor-company"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`visitSummary-${index}`}>
                Visit summary <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`visitSummary-${index}`}
                placeholder="e.g. Quarterly business review"
                value={visitor.visitSummary}
                onChange={(e) => updateVisitor(index, 'visitSummary', e.target.value)}
                className="visitor-summary"
              />
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
              onChange={(e) => setGroupVisitSummary(e.target.value)}
              rows={3}
            />
          </div>

          {/* CSV Upload Section */}
          <div className="space-y-4 pt-4 border-t">
            <div>
              <h3 className="font-medium mb-2">Upload visitor list</h3>
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
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Label htmlFor="csvUpload" className="cursor-pointer">
                  <div className="flex items-center justify-center h-10 px-4 py-2 bg-background border border-input rounded-md hover:bg-accent hover:text-accent-foreground">
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadedFile ? uploadedFile.name : 'Upload CSV'}
                  </div>
                </Label>
              </div>
            </div>

            {uploadedFile && (
              <div className="text-sm text-green-600 flex items-center gap-2">
                <span>✓</span>
                <span>File uploaded: {uploadedFile.name}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  )
}

