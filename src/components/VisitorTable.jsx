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

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200" data-testid="visitor-table">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Visitor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Expected</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Host</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Invite</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Floor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Status</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 tracking-wider">Badge</th>
            <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visits.map((visit, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-sm font-medium text-gray-900" data-testid="visitor-name">
                {visit.visitorName}
              </td>
              <td className="px-4 py-4 text-sm text-gray-900" data-testid="visitor-date">
                <div className="flex flex-col">
                  <span>{formatDate(visit.date)}, {visit.startTime ? formatTime(visit.startTime) : 'All day'}</span>
                  {visit.endTime && (
                    <span className="text-gray-500 text-xs">End time: {formatTime(visit.endTime)}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-host">
                <div className="flex flex-col">
                  <span className="text-gray-900">{visit.host || '-'}</span>
                  {visit.company && (
                    <span className="text-gray-500 text-xs">{visit.company}</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                -
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-floor">
                {visit.floor ? `Floor ${visit.floor}${visit.suite ? `, Suite ${visit.suite}` : ''}` : '-'}
              </td>
              <td className="px-4 py-4" data-testid="visitor-status">
                <Badge variant={getStatusVariant(visit.status)}>
                  {visit.status}
                </Badge>
              </td>
              <td className="px-4 py-4 text-sm text-gray-600">
                -
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

