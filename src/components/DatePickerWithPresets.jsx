import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDate } from "@/lib/utils"

export function DatePickerWithPresets({ 
  value, 
  valueEnd, 
  onValueChange,
  onValueEndChange,
  selectedTimeFrame,
  onTimeFrameChange,
  getTimeFrameDateRange,
  className 
}) {
  const [open, setOpen] = useState(false)
  const [endDateOpen, setEndDateOpen] = useState(false)

  const timeFrameOptions = [
    { value: 'today', label: 'Today' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' },
    { value: 'nextWeek', label: 'Next Week' },
    { value: 'nextMonth', label: 'Next Month' }
  ]

  const handleTimeFrameSelect = (timeFrame) => {
    onTimeFrameChange(timeFrame)
    const range = getTimeFrameDateRange(timeFrame)
    onValueChange(range.start)
    if (range.end && range.end !== range.start && onValueEndChange) {
      onValueEndChange(range.end)
    }
    // Clear end date if it's a single date (like 'today')
    if (range.end === range.start && onValueEndChange) {
      onValueEndChange('')
    }
    setOpen(false)
  }

  const handleDateSelect = (date) => {
    if (date && typeof date === 'string') {
      onValueChange(date)
      // Clear the time frame when manually selecting a date
      onTimeFrameChange('')
      // Clear end date when manually selecting a single date
      if (onValueEndChange) {
        onValueEndChange('')
      }
      // Close popover after selection
      setOpen(false)
    }
  }

  const handleEndDateSelect = (date) => {
    if (date && onValueEndChange) {
      onValueEndChange(date)
      setEndDateOpen(false)
    }
  }

  // Get the label for the selected time frame
  const getTimeFrameLabel = () => {
    const option = timeFrameOptions.find(opt => opt.value === selectedTimeFrame)
    return option ? option.label : null
  }

  // Display the date(s) in the button - always show just the start date
  const getDisplayValue = () => {
    if (!value) return "Select date"
    try {
      return formatDate(value)
    } catch (e) {
      // If formatDate fails, just return the raw value
      return value
    }
  }

  const displayValue = getDisplayValue()
  const showEndDate = (selectedTimeFrame === 'thisWeek' || selectedTimeFrame === 'thisMonth' || selectedTimeFrame === 'nextWeek' || selectedTimeFrame === 'nextMonth') && valueEnd
  const timeFrameLabel = getTimeFrameLabel()
  const showTimeFrameLabel = selectedTimeFrame && timeFrameLabel

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {/* Time frame label above the date picker */}
      {showTimeFrameLabel && (
        <div className="text-sm font-medium text-gray-700">
          {timeFrameLabel}
        </div>
      )}
      <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full sm:w-[240px] justify-start text-left font-normal h-10 !pl-3 pr-4 text-base",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-5 w-5 shrink-0" />
            <span className="truncate text-base">{displayValue}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex flex-col md:flex-row">
            {/* Calendar on the left / top */}
            <div className="p-4">
              <Calendar
                mode="single"
                selected={value || undefined}
                onSelect={handleDateSelect}
                className="rounded-md border-0"
              />
            </div>
            
            {/* Time frame options on the right (desktop) / below (mobile) */}
            <div className="border-t md:border-t-0 md:border-l border-gray-200 p-4 min-w-[160px] flex items-start">
              <div className="w-full space-y-0.5">
                {timeFrameOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTimeFrameSelect(option.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors flex items-center justify-between gap-2",
                      selectedTimeFrame === option.value && "bg-primary/10 text-primary font-medium"
                    )}
                  >
                    <span className="flex-1">{option.label}</span>
                    {selectedTimeFrame === option.value && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {showEndDate && (
        <>
          <span className="text-gray-500">-</span>
          <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[240px] justify-start text-left font-normal h-10 !pl-3 pr-4 text-base",
                  !valueEnd && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-5 w-5 shrink-0" />
                <span className="truncate text-base">{valueEnd ? formatDate(valueEnd) : "End date"}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={valueEnd || undefined}
                onSelect={handleEndDateSelect}
                className="rounded-md border-0"
              />
            </PopoverContent>
          </Popover>
        </>
      )}
      </div>
    </div>
  )
}

