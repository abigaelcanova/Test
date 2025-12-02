import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar as CalendarIcon, Check, Info } from "lucide-react"
import { cn } from "@/lib/utils"

// Helper function to generate time options in 15-minute increments
const generateTimeOptions = (startHour = 8, endHour = 18) => {
  const options = []
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const hour24 = hour
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
      const ampm = hour < 12 ? 'AM' : 'PM'
      const time24 = `${hour24.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      const time12 = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`
      options.push({ value: time24, label: time12 })
    }
  }
  return options
}

// Helper function to get today's date in user's local timezone (YYYY-MM-DD format)
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Helper function to calculate end time from start time and duration (in hours)
const calculateEndTime = (startTime, durationHours) => {
  if (!startTime || !durationHours) return startTime
  
  const [hours, minutes] = startTime.split(':').map(Number)
  const startDate = new Date()
  startDate.setHours(hours, minutes, 0, 0)
  
  const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000)
  const endHours = endDate.getHours()
  const endMinutes = endDate.getMinutes()
  
  return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
}

// Helper function to calculate duration from start and end times (in hours)
const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return null
  
  const [startHours, startMinutes] = startTime.split(':').map(Number)
  const [endHours, endMinutes] = endTime.split(':').map(Number)
  
  const startDate = new Date()
  startDate.setHours(startHours, startMinutes, 0, 0)
  
  const endDate = new Date()
  endDate.setHours(endHours, endMinutes, 0, 0)
  
  // Handle case where end time is next day
  if (endDate < startDate) {
    endDate.setDate(endDate.getDate() + 1)
  }
  
  const diffMs = endDate - startDate
  const diffHours = diffMs / (1000 * 60 * 60)
  
  // Round to nearest hour
  return Math.round(diffHours)
}

export function Step0DateSelect({ data, onNext }) {
  const initialDate = data.visitDate || getLocalDateString()
  const [dateRange, setDateRange] = useState({ 
    from: initialDate, 
    to: data.visitDateEnd || initialDate
  })
  const [repeatOption, setRepeatOption] = useState(data.recurring ? (data.frequency || 'custom') : 'none')
  const [selectedDays, setSelectedDays] = useState(data.selectedDays || [])
  const [recurringEnd, setRecurringEnd] = useState(data.recurringEnd || '')
  const [startTime, setStartTime] = useState(data.startTime || '09:00')
  const [endTime, setEndTime] = useState(data.endTime || '17:00')
  const [timeMode, setTimeMode] = useState('duration') // 'endTime' or 'duration' - default to duration
  const [duration, setDuration] = useState(() => {
    // Try to calculate duration from existing start/end times
    if (data.startTime && data.endTime) {
      const calculatedDuration = calculateDuration(data.startTime, data.endTime)
      return calculatedDuration ? String(calculatedDuration) : '1'
    }
    return '1'
  })
  
  // Error states
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  // Update state when data prop changes (for editing visits)
  useEffect(() => {
    if (data.visitDate) {
      setDateRange({
        from: data.visitDate,
        to: data.visitDateEnd || data.visitDate
      })
    }
    if (data.startTime) {
      setStartTime(data.startTime)
    }
    if (data.endTime) {
      setEndTime(data.endTime)
      // Try to calculate duration if we have both times
      if (data.startTime && data.endTime) {
        const calculatedDuration = calculateDuration(data.startTime, data.endTime)
        if (calculatedDuration) {
          setDuration(String(calculatedDuration))
        }
      }
    }
    if (data.recurring !== undefined) {
      setRepeatOption(data.recurring ? (data.frequency || 'custom') : 'none')
    }
    if (data.selectedDays !== undefined) {
      setSelectedDays(data.selectedDays || [])
    }
    if (data.recurringEnd !== undefined) {
      setRecurringEnd(data.recurringEnd || '')
    }
  }, [data.visitDate, data.visitDateEnd, data.startTime, data.endTime, data.recurring, data.frequency, data.selectedDays, data.recurringEnd])

  // Calculate end time when duration mode is selected and duration or start time changes
  useEffect(() => {
    if (timeMode === 'duration' && startTime && duration) {
      const calculatedEndTime = calculateEndTime(startTime, Number(duration))
      if (calculatedEndTime) {
        setEndTime(calculatedEndTime)
      }
    }
  }, [timeMode, startTime, duration])

  // Handle mode switching - calculate duration from existing times when switching to duration mode
  const handleModeChange = (newMode) => {
    if (newMode === 'duration' && timeMode === 'endTime' && startTime && endTime) {
      // Calculate duration from existing start and end times
      const calculatedDuration = calculateDuration(startTime, endTime)
      if (calculatedDuration && calculatedDuration > 0 && calculatedDuration <= 8) {
        setDuration(String(calculatedDuration))
      }
    }
    setTimeMode(newMode)
  }


  const getRepeatLabel = () => {
    if (!dateRange.from) return 'Does not repeat'
    const date = new Date(dateRange.from)
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
    const monthDay = date.getDate()
    const monthName = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
    
    return {
      none: 'Does not repeat',
      daily: 'Daily',
      weekly: `Weekly on ${dayName}`,
      monthly: `Monthly on day ${monthDay}`,
      annually: `Annually on ${monthName}`,
      weekdays: 'Every weekday (Monday to Friday)',
      custom: 'Custom'
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Validate date range
    if (!dateRange.from) {
      newErrors.startDate = 'Start date is required'
    }
    if (!dateRange.to) {
      newErrors.endDate = 'End date is required'
    }
    
    // Validate start date is before or equal to end date
    if (dateRange.from && dateRange.to && dateRange.from > dateRange.to) {
      newErrors.startDate = 'Start date must be before or equal to end date'
      newErrors.endDate = 'End date must be after or equal to start date'
    }
    
    // Validate start time and end time
    if (startTime && endTime) {
      const [startHours, startMinutes] = startTime.split(':').map(Number)
      const [endHours, endMinutes] = endTime.split(':').map(Number)
      const startTimeInMinutes = startHours * 60 + startMinutes
      const endTimeInMinutes = endHours * 60 + endMinutes
      
      // Only validate if it's the same day (single day visit)
      if (dateRange.from === dateRange.to && startTimeInMinutes >= endTimeInMinutes) {
        newErrors.endTime = 'End time must be after start time'
      }
    }
    
    // Validate custom repeat days
    if (repeatOption === 'custom' && selectedDays.length === 0) {
      newErrors.selectedDays = 'Please select at least one day'
    }
    
    // Validate recurring end date
    if (repeatOption !== 'none' && !recurringEnd) {
      newErrors.recurringEnd = 'Please select when the recurring visit should end'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Mark all fields as touched
    const allTouched = {
      startDate: true,
      endDate: true,
      startTime: true,
      endTime: true
    }
    if (repeatOption === 'custom') {
      allTouched.selectedDays = true
    }
    if (repeatOption !== 'none') {
      allTouched.recurringEnd = true
    }
    setTouched(allTouched)
    
    // Validate and submit
    if (!validateForm()) {
      return
    }
    
    const recurring = repeatOption !== 'none'
    onNext({ 
      visitDate: dateRange.from,
      visitDateEnd: dateRange.to,
      recurring,
      frequency: recurring ? repeatOption : '',
      selectedDays: repeatOption === 'custom' ? selectedDays : [],
      recurringEnd: recurring ? recurringEnd : '',
      startTime,
      endTime
    })
  }
  
  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' }
  ]

  const toggleDay = (day) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(d => d !== day)
      } else {
        return [...prev, day]
      }
    })
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    // Parse the date string manually to avoid timezone issues
    const [year, month, day] = dateStr.split('-').map(Number)
    // Create date in local timezone (month is 0-indexed)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <TooltipProvider>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-base sm:text-lg font-semibold">When is your visit?</h3>
          <p className="text-sm text-gray-600 mt-1">Select the date and time for your visit</p>
        </div>

      <div className="space-y-4 sm:space-y-5">
        {/* Calendar and Time Selection */}
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
          {/* Left Side - Calendar */}
          <div className="w-full md:flex-shrink-0 md:w-auto">
            <div className="bg-gray-50 rounded-lg p-2 sm:p-3 border border-gray-200 w-full md:w-fit overflow-x-auto">
              <CalendarComponent
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  if (range) {
                    setDateRange(range)
                    // Mark dates as touched and validate
                    if (range.from) {
                      setTouched(prev => ({ ...prev, startDate: true, endDate: true }))
                    }
                    setTimeout(() => validateForm(), 0)
                  }
                }}
                className="w-full"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Click a start date, then click an end date to select a range
            </p>
          </div>

          {/* Right Side - Time Selection */}
          <div className="w-full md:flex-1 space-y-4">
            {/* Start and End Date/Time */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateRange.from}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, from: e.target.value })
                      if (touched.startDate || touched.endDate) {
                        setTimeout(() => validateForm(), 0)
                      }
                    }}
                    onBlur={() => handleBlur('startDate')}
                    className={errors.startDate && touched.startDate ? 'border-destructive' : ''}
                  />
                  {errors.startDate && touched.startDate && (
                    <p className="text-sm text-destructive">{errors.startDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start time</Label>
                  <Select 
                    value={startTime} 
                    onValueChange={(value) => {
                      setStartTime(value)
                      if (touched.startTime || touched.endTime) {
                        setTimeout(() => validateForm(), 0)
                      }
                    }}
                  >
                    <SelectTrigger 
                      id="startTime"
                      className={errors.startTime && touched.startTime ? 'border-destructive' : ''}
                      onBlur={() => handleBlur('startTime')}
                    >
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      {generateTimeOptions(8, 18).map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.startTime && touched.startTime && (
                    <p className="text-sm text-destructive">{errors.startTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateRange.to || dateRange.from}
                    onChange={(e) => {
                      setDateRange({ ...dateRange, to: e.target.value })
                      if (touched.endDate || touched.startDate || touched.startTime || touched.endTime) {
                        setTimeout(() => validateForm(), 0)
                      }
                    }}
                    onBlur={() => handleBlur('endDate')}
                    className={errors.endDate && touched.endDate ? 'border-destructive' : ''}
                  />
                  {errors.endDate && touched.endDate && (
                    <p className="text-sm text-destructive">{errors.endDate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-6 mb-2 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="timeMode"
                        value="duration"
                        checked={timeMode === 'duration'}
                        onChange={() => handleModeChange('duration')}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-900">Duration</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="timeMode"
                        value="endTime"
                        checked={timeMode === 'endTime'}
                        onChange={() => handleModeChange('endTime')}
                        className="h-4 w-4 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-900">End time</span>
                    </label>
                    <Tooltip>
                      <TooltipTrigger type="button">
                        <Info className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Choose "Duration" to set visit length in hours, or "End time" to specify an exact end time</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  {timeMode === 'endTime' ? (
                    <>
                      <Select 
                        value={endTime} 
                        onValueChange={(value) => {
                          setEndTime(value)
                          if (touched.endTime || touched.startTime) {
                            setTimeout(() => validateForm(), 0)
                          }
                        }}
                      >
                        <SelectTrigger 
                          id="endTime"
                          className={errors.endTime && touched.endTime ? 'border-destructive' : ''}
                          onBlur={() => handleBlur('endTime')}
                        >
                          <SelectValue placeholder="Select end time" />
                        </SelectTrigger>
                        <SelectContent>
                          {generateTimeOptions(8, 18).map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.endTime && touched.endTime && (
                        <p className="text-sm text-destructive">{errors.endTime}</p>
                      )}
                    </>
                  ) : (
                    <Select 
                      value={duration} 
                      onValueChange={(value) => {
                        setDuration(value)
                        if (touched.endTime) {
                          setTimeout(() => validateForm(), 0)
                        }
                      }}
                    >
                      <SelectTrigger id="duration">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                          <SelectItem key={hours} value={String(hours)}>
                            {hours} {hours === 1 ? 'hour' : 'hours'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {timeMode === 'duration' && endTime && (
                    <p className="text-xs text-gray-500 mt-1">
                      End time: {generateTimeOptions(8, 18).find(opt => opt.value === endTime)?.label || endTime}
                    </p>
                  )}
                  {timeMode === 'duration' && errors.endTime && touched.endTime && (
                    <p className="text-sm text-destructive">{errors.endTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Repeat Dropdown */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="repeat">Repeat</Label>
                <Tooltip>
                  <TooltipTrigger type="button">
                    <Info className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">Set up recurring visits that repeat on a schedule (daily, weekly, monthly, etc.)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={repeatOption} onValueChange={setRepeatOption}>
                <SelectTrigger id="repeat">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{getRepeatLabel().none}</SelectItem>
                  <SelectItem value="daily">{getRepeatLabel().daily}</SelectItem>
                  <SelectItem value="weekly">{getRepeatLabel().weekly}</SelectItem>
                  <SelectItem value="monthly">{getRepeatLabel().monthly}</SelectItem>
                  <SelectItem value="annually">{getRepeatLabel().annually}</SelectItem>
                  <SelectItem value="weekdays">{getRepeatLabel().weekdays}</SelectItem>
                  <SelectItem value="custom">{getRepeatLabel().custom}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Days Selection */}
            {repeatOption === 'custom' && (
              <div className="space-y-2">
                <Label>Select days</Label>
                <p className="text-xs text-gray-500 mb-2">Choose which days of the week this visit should repeat</p>
                <div className="grid grid-cols-2 gap-3">
                  {daysOfWeek.map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => {
                        toggleDay(day.value)
                        if (touched.selectedDays) {
                          validateForm()
                        }
                      }}
                      onBlur={() => handleBlur('selectedDays')}
                      className="flex items-center gap-2 py-2 text-sm transition-colors hover:opacity-80"
                    >
                      <div className={cn(
                        "h-4 w-4 border rounded flex items-center justify-center flex-shrink-0",
                        selectedDays.includes(day.value) ? "bg-primary border-primary" : "border-gray-300"
                      )}>
                        {selectedDays.includes(day.value) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <span className="flex-1 text-left text-gray-900">{day.label}</span>
                    </button>
                  ))}
                </div>
                {errors.selectedDays && touched.selectedDays && (
                  <p className="text-sm text-destructive">{errors.selectedDays}</p>
                )}
              </div>
            )}

            {repeatOption !== 'none' && (
              <div className="space-y-2">
                <Label htmlFor="recurringEnd">Repeat until <span className="text-destructive">*</span></Label>
                <Input
                  id="recurringEnd"
                  type="date"
                  value={recurringEnd}
                  onChange={(e) => {
                    setRecurringEnd(e.target.value)
                    if (touched.recurringEnd) {
                      validateForm()
                    }
                  }}
                  onBlur={() => handleBlur('recurringEnd')}
                  className={errors.recurringEnd && touched.recurringEnd ? 'border-destructive' : ''}
                />
                {errors.recurringEnd && touched.recurringEnd ? (
                  <p className="text-sm text-destructive">{errors.recurringEnd}</p>
                ) : (
                  <p className="text-xs text-gray-500">The last date this recurring visit will occur</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
    </TooltipProvider>
  )
}

