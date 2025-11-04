import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, User, Edit2, XCircle } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export function VisitorCard({ visit, onEdit, onCancel }) {
  const getStatusVariant = (status) => {
    const variants = {
      'invited': 'secondary',
      'confirmed': 'default',
      'checked-in': 'success',
      'cancelled': 'destructive',
      'late': 'warning'
    }
    return variants[status] || 'default'
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
              {visit.status}
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
        
        <div className="space-y-2.5 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span data-testid="visitor-date">{formatDate(visit.date)}</span>
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
              <span data-testid="visitor-host">{visit.host}</span>
            </div>
          )}
          
          {(visit.floor || visit.suite) && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span data-testid="visitor-location">
                {visit.floor && `Floor ${visit.floor}`}
                {visit.floor && visit.suite && ', '}
                {visit.suite && `Suite ${visit.suite}`}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

