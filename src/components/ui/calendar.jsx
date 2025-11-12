import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Calendar({ selected, onSelect, className, isMultiSelect = false, mode = 'single' }) {
  const [currentMonth, setCurrentMonth] = React.useState(() => {
    try {
      if (!selected) return new Date()
      if (mode === 'range' && selected?.from) return new Date(selected.from)
      if (Array.isArray(selected) && selected[0]) return new Date(selected[0])
      if (typeof selected === 'string') return new Date(selected)
      return new Date()
    } catch (e) {
      return new Date()
    }
  })
  
  const [rangeStart, setRangeStart] = React.useState(null)
  const [rangeEnd, setRangeEnd] = React.useState(null)

  // Initialize and sync range state
  React.useEffect(() => {
    if (mode === 'range' && selected) {
      setRangeStart(selected.from || null)
      setRangeEnd(selected.to || null)
    }
  }, [mode, selected])

  const daysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const handleDateClick = (day) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    
    if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        // Start new range
        setRangeStart(dateString)
        setRangeEnd(null)
        onSelect({ from: dateString, to: null })
      } else {
        // Complete the range
        const start = new Date(rangeStart)
        const end = new Date(dateString)
        
        if (end >= start) {
          setRangeEnd(dateString)
          onSelect({ from: rangeStart, to: dateString })
        } else {
          // If end is before start, swap them
          setRangeStart(dateString)
          setRangeEnd(rangeStart)
          onSelect({ from: dateString, to: rangeStart })
        }
      }
    } else {
      onSelect(dateString)
    }
  }

  const isInRange = (day) => {
    if (mode !== 'range' || !rangeStart) return false
    
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    const current = new Date(dateString)
    
    if (!rangeEnd) {
      return dateString === rangeStart
    }
    
    const start = new Date(rangeStart)
    const end = new Date(rangeEnd)
    
    return current >= start && current <= end
  }

  const isRangeEdge = (day) => {
    if (mode !== 'range' || !rangeStart) return false
    
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    const dateString = `${year}-${month}-${dayStr}`
    
    return dateString === rangeStart || dateString === rangeEnd
  }

  const isSelected = (day) => {
    if (!selected) return false
    
    if (mode === 'range') {
      return isInRange(day)
    }
    
    if (Array.isArray(selected)) {
      // Multi-select mode
      const year = currentMonth.getFullYear()
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
      const dayStr = String(day).padStart(2, '0')
      const dateString = `${year}-${month}-${dayStr}`
      return selected.includes(dateString)
    } else {
      // Single select mode
      const [year, month, dayStr] = selected.split('-')
      return (
        parseInt(dayStr) === day &&
        parseInt(month) - 1 === currentMonth.getMonth() &&
        parseInt(year) === currentMonth.getFullYear()
      )
    }
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isPast = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const renderDays = () => {
    const days = []
    const totalDays = daysInMonth(currentMonth)
    const firstDay = firstDayOfMonth(currentMonth)

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-10 h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const selected = isSelected(day)
      const today = isToday(day)
      const past = isPast(day)
      const inRange = mode === 'range' && isInRange(day)
      const rangeEdge = mode === 'range' && isRangeEdge(day)

      days.push(
        <div key={day} className="flex items-center justify-center">
          <button
            type="button"
            onClick={() => handleDateClick(day)}
            disabled={past}
            className={cn(
              "w-10 h-10 rounded-lg text-sm font-medium transition-all hover:bg-gray-100 flex items-center justify-center",
              rangeEdge && "bg-primary text-white hover:bg-primary/90",
              inRange && !rangeEdge && "bg-primary/20 text-primary hover:bg-primary/30",
              selected && mode !== 'range' && "bg-primary text-white hover:bg-primary/90",
              today && !selected && !inRange && "border-2 border-primary text-primary",
              past && "text-gray-300 cursor-not-allowed hover:bg-transparent",
              !selected && !today && !past && !inRange && "text-gray-700"
            )}
          >
            {day}
          </button>
        </div>
      )
    }

    return days
  }

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      {/* Month/Year Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="flex items-center justify-center text-xs font-semibold text-gray-500 uppercase h-8"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-2">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded border-2 border-primary"></div>
          <span>Today</span>
        </div>
        {selected && (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span>Selected</span>
          </div>
        )}
      </div>
    </div>
  )
}

