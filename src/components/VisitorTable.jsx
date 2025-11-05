import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Edit2, XCircle, MoreVertical } from "lucide-react"
import { formatDate, formatTime } from "@/lib/utils"

export function VisitorTable({ visits, onEdit, onCancel }) {
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

  return (
    <div className="overflow-hidden rounded border border-gray-200 bg-white" data-testid="visitor-table">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Visitor</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Expected</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Host</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Invite</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Floor</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Status</th>
            <th className="px-4 py-3.5 text-left text-sm font-medium text-gray-900">Badge</th>
            <th className="px-4 py-3.5 text-right text-sm font-medium text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {visits.map((visit, index) => (
            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-4 py-4 text-sm font-medium" data-testid="visitor-name">
                <button className="text-primary hover:text-primary/80 hover:underline text-left">
                  {visit.visitorName}
                </button>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900" data-testid="visitor-date">
                <div className="flex flex-col">
                  <span className="text-gray-900">{formatDate(visit.date)}, {visit.startTime ? formatTime(visit.startTime) : 'All day'}</span>
                  {visit.endTime && (
                    <span className="text-gray-600 text-xs">End time: {formatTime(visit.endTime)}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-host">
                <div className="flex flex-col">
                  {visit.host ? (
                    <button className="text-primary hover:text-primary/80 hover:underline text-left">
                      {visit.host}
                    </button>
                  ) : (
                    <span className="text-gray-600">–</span>
                  )}
                  {visit.company && (
                    <span className="text-gray-600 text-xs">{visit.company}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                –
              </td>
              <td className="px-4 py-4 text-sm text-gray-900" data-testid="visitor-floor">
                {visit.floor ? `Floor ${visit.floor}${visit.suite ? `, Suite ${visit.suite}` : ''}` : '–'}
              </td>
              <td className="px-4 py-4" data-testid="visitor-status">
                <Badge variant={getStatusVariant(visit.status)}>
                  <span className={`mr-1.5 text-[8px] ${getStatusDotColor(visit.status)}`}>●</span> 
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1).replace('-', ' ')}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-gray-900">
                –
              </td>
              <td className="px-4 py-4 text-right">
                {visit.status !== 'cancelled' && (onEdit || onCancel) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(visit)} data-testid="edit-visit">
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {onCancel && (
                        <DropdownMenuItem 
                          onClick={() => onCancel(visit.id)}
                          className="text-destructive focus:text-destructive"
                          data-testid="cancel-visit"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Cancel
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

