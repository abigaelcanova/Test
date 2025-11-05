import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { Upload, X, CheckCircle2, AlertCircle, Download } from "lucide-react"

export function Step2BulkUpload({ data, onNext, onSkip, onBack }) {
  const [file, setFile] = useState(null)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedVisitors, setUploadedVisitors] = useState([])
  const [errors, setErrors] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const processCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim())
    if (lines.length === 0) return { visitors: [], errors: ['CSV file is empty'] }
    
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim())
    const requiredFields = ['firstname', 'lastname', 'email', 'company']
    const missingFields = requiredFields.filter(field => !headers.includes(field))
    
    if (missingFields.length > 0) {
      return { 
        visitors: [], 
        errors: [`Missing required columns: ${missingFields.join(', ')}. Required: firstname, lastname, email, company, phone (optional)`] 
      }
    }

    const visitors = []
    const errors = []
    const emailIndex = headers.indexOf('email')
    const firstNameIndex = headers.indexOf('firstname')
    const lastNameIndex = headers.indexOf('lastname')
    const companyIndex = headers.indexOf('company')
    const phoneIndex = headers.indexOf('phone')

    for (let i = 1; i < lines.length && visitors.length < 100; i++) {
      const values = lines[i].split(',').map(v => v.trim())
      
      const email = values[emailIndex] || ''
      const firstName = values[firstNameIndex] || ''
      const lastName = values[lastNameIndex] || ''
      const company = values[companyIndex] || ''
      const phone = phoneIndex >= 0 ? (values[phoneIndex] || '') : ''

      if (!firstName || !lastName || !email || !company) {
        errors.push(`Line ${i + 1}: Missing required field(s)`)
        continue
      }

      if (!validateEmail(email)) {
        errors.push(`Line ${i + 1}: Invalid email address (${email})`)
        continue
      }

      visitors.push({
        email,
        firstName,
        lastName,
        company,
        phone,
        visitSummary: data.visitSummary || ''
      })
    }

    if (lines.length > 101) { // 1 header + 100 data rows
      errors.push(`CSV contains more than 100 visitors. Only first 100 will be processed.`)
    }

    return { visitors, errors }
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      processFile(selectedFile)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      processFile(droppedFile)
    } else {
      setErrors(['Please upload a CSV file'])
    }
  }

  const processFile = (selectedFile) => {
    setFile(selectedFile)
    setIsProcessing(true)
    setErrors([])
    
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target.result
      const { visitors, errors: parseErrors } = processCSV(text)
      setUploadedVisitors(visitors)
      setErrors(parseErrors)
      setIsProcessing(false)
    }
    reader.onerror = () => {
      setErrors(['Error reading file'])
      setIsProcessing(false)
    }
    reader.readAsText(selectedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleRemoveFile = () => {
    setFile(null)
    setUploadedVisitors([])
    setErrors([])
  }

  const handleContinue = () => {
    if (uploadedVisitors.length > 0) {
      onNext({ visitors: uploadedVisitors })
    }
  }

  const handleSkip = () => {
    if (onSkip) {
      onSkip()
    }
  }

  const downloadTemplate = () => {
    const template = "firstname,lastname,email,company,phone\nJohn,Doe,john.doe@example.com,Acme Corp,+11234567890\nJane,Smith,jane.smith@example.com,Tech Inc,+10987654321"
    const blob = new Blob([template], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'visitor_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Bulk add visitors</h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload a CSV file with up to 100 visitors
        </p>
      </div>

      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900">Need a template?</p>
          <p className="text-xs text-gray-600 mt-1">Download our CSV template to get started</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={downloadTemplate}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging
            ? 'border-primary bg-primary/5'
            : file
            ? 'border-green-500 bg-green-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {!file ? (
          <>
            <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <Label htmlFor="csv-upload" className="cursor-pointer">
              <span className="text-primary font-medium">Click to upload</span> or drag and drop
            </Label>
            <p className="text-sm text-gray-500 mt-1">CSV file (max 100 visitors)</p>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </>
        ) : (
          <div className="flex items-center justify-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">{file.name}</p>
              <p className="text-sm text-gray-600">
                {uploadedVisitors.length} visitor{uploadedVisitors.length !== 1 ? 's' : ''} loaded
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleRemoveFile}
              className="ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <Alert key={index} variant="destructive" className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <span className="text-sm">{error}</span>
            </Alert>
          ))}
        </div>
      )}

      {uploadedVisitors.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">
                {uploadedVisitors.length} visitor{uploadedVisitors.length !== 1 ? 's' : ''} ready
              </p>
              <p className="text-sm text-gray-600 mt-1">
                All visitors will share the same visit details (date, time, floor, suite)
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

