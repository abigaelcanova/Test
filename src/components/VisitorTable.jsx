import { Badge } from "@/components/ui/badge"
import { formatDate, formatTime } from "@/lib/utils"

export function VisitorTable({ visits }) {
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
    <div className="overflow-hidden rounded-lg border border-gray-200" data-testid="visitor-table">
      <table className="w-full">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Time</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Host</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {visits.map((visit, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-4 text-sm text-gray-900" data-testid="visitor-date">
                {formatDate(visit.date)}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-time">
                {visit.startTime ? formatTime(visit.startTime) : 'All day'}
              </td>
              <td className="px-4 py-4 text-sm font-medium text-gray-900" data-testid="visitor-name">
                {visit.visitorName}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-host">
                {visit.host || '-'}
              </td>
              <td className="px-4 py-4 text-sm text-gray-600" data-testid="visitor-location">
                {visit.floor || visit.suite 
                  ? `${visit.floor ? `Floor ${visit.floor}` : ''}${visit.floor && visit.suite ? ', ' : ''}${visit.suite ? `Suite ${visit.suite}` : ''}`
                  : '-'}
              </td>
              <td className="px-4 py-4" data-testid="visitor-status">
                <Badge variant={getStatusVariant(visit.status)}>
                  {visit.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

