import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Calendar, Clock, MapPin, User, Edit2, XCircle, Repeat } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export function VisitorCard({ visit, onEdit, onCancel }) {
  const getStatusVariant = (status) => {
    const variants = {
      'expected': 'secondary',
      'checked-in': 'success',
      'checked-out': 'default',
      'cancelled': 'destructive'
    }
    return variants[status] || 'default'
  }

  const getStatusDotColor = (status) => {
    const colors = {
      'expected': 'text-purple-600',
      'checked-in': 'text-teal-600',
      'checked-out': 'text-blue-600',
      'cancelled': 'text-gray-600'
    }
    return colors[status] || 'text-blue-600'
  }

  const formatFrequency = (frequency) => {
    if (!frequency) return ''
    if (frequency === 'weekdays') return 'Repeats every weekday (Monday to Friday)'
    return `Repeats ${frequency}`
  }

  return (
    <Card className="hover:shadow-md transition-all border-gray-200" data-testid="visitor-card">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-2 text-gray-900" data-testid="visitor-name">
              {visit.visitorName}
            </h3>
            <Badge variant={getStatusVariant(visit.status)} data-testid="visitor-status">
              <span className={`mr-1.5 text-[8px] ${getStatusDotColor(visit.status)}`}>●</span> 
              {visit.status.charAt(0).toUpperCase() + visit.status.slice(1).replace('-', ' ')}
            </Badge>
          </div>
          {visit.status !== 'cancelled' && (onEdit || onCancel) && (
            <div className="flex gap-1">
              {onEdit && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(visit)}
                  className="h-8 w-8"
                  data-testid="edit-visit"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onCancel(visit.id)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  data-testid="cancel-visit"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>
        
        {visit.visitSummary && (
          <p className="text-sm text-gray-700 mb-3">{visit.visitSummary}</p>
        )}
        
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <div className="flex items-center gap-1">
              <span data-testid="visitor-date">{formatDate(visit.date)}</span>
              {visit.recurring && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Repeat className="h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{formatFrequency(visit.frequency)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          
          {visit.startTime && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span data-testid="visitor-time">
                {formatTime(visit.startTime)}
                {visit.endTime && ` - ${formatTime(visit.endTime)}`}
              </span>
            </div>
          )}
          
          {visit.host && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600" data-testid="visitor-host">
                {visit.host}
              </span>
            </div>
          )}
          
          {visit.floor && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span data-testid="visitor-location">
                Floor {visit.floor}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

