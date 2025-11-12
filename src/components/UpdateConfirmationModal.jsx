import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Calendar, Pencil } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export function UpdateConfirmationModal({ open, onOpenChange, visitData, onEditStep }) {
  if (!visitData) return null

  const visitorNames = visitData.visitors
    .filter(v => v.firstName && v.lastName)
    .map(v => `${v.firstName} ${v.lastName}`)
    .join(', ')

  const handleEditDate = () => {
    onEditStep(0) // Go to date/time step
  }

  const handleEditVisitors = () => {
    onEditStep(2) // Go to visitor info step (step 2)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="space-y-6 pt-6">
          {/* Centered confirmation header */}
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-semibold">Visit updated</h2>
            <p className="text-sm text-muted-foreground">
              Your visit has been successfully updated
            </p>
          </div>

          {/* Visit details */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <h3 className="font-semibold text-lg">Updated visit details</h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium" data-testid="confirm-date">
                        {formatDate(visitData.visitDate)}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditDate}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground ml-6" data-testid="confirm-time">
                    {visitData.startTime
                      ? `${formatTime(visitData.startTime)}${visitData.endTime ? ` - ${formatTime(visitData.endTime)}` : ''}`
                      : 'All day visit'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Visitor name(s)</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEditVisitors}>
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

