import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Calendar as CalendarIcon } from "lucide-react"

export function Step0DateSelect({ data, onNext }) {
  const [visitDate, setVisitDate] = useState(data.visitDate)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!visitDate) {
      alert('Please select a date from the calendar')
      return
    }
    onNext({ visitDate })
  }

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="space-y-8 py-4">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-semibold text-gray-900">
          When is your visit?
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        {/* Calendar Component */}
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <CalendarComponent
            selected={visitDate}
            onSelect={setVisitDate}
          />
        </div>

        {/* Selected Date Display */}
        {visitDate && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <CalendarIcon className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs font-medium text-gray-600 uppercase">Selected Date</p>
                <p className="text-base font-semibold text-gray-900">
                  {formatDisplayDate(visitDate)}
                </p>
              </div>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full h-12 text-base"
          disabled={!visitDate}
        >
          Continue
        </Button>
      </form>
    </div>
  )
}

