import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Calendar, Pencil } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export function ConfirmationModal({ open, onOpenChange, visitData }) {
  if (!visitData) return null

  const visitorNames = visitData.visitors
    .filter(v => v.firstName && v.lastName)
    .map(v => `${v.firstName} ${v.lastName}`)
    .join(', ')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Left column */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">Visit confirmed</h2>
                <p className="text-muted-foreground">
                  Your visitor registration is confirmed for{' '}
                  <span className="font-medium text-foreground">
                    {formatDate(visitData.visitDate)}
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Right column - Visit details */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-lg">Visit details</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium" data-testid="confirm-date">
                        {formatDate(visitData.visitDate)}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6" data-testid="confirm-time">
                    {visitData.startTime
                      ? `${formatTime(visitData.startTime)}${visitData.endTime ? ` - ${formatTime(visitData.endTime)}` : ''}`
                      : 'All day visit'}
                  </p>
                  <a href="#" className="text-sm text-destructive ml-6 hover:underline">
                    Cancel visit
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Visitor name(s)</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm" data-testid="confirm-visitor-names">
                    {visitorNames}
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                onClick={() => onOpenChange(false)}
                data-testid="back-to-visits"
              >
                Back to visits
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

