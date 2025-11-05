import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, History } from "lucide-react"

export function EmptyState({ type = "upcoming" }) {
  const isPast = type === "past"
  
  return (
    <Card className="border-dashed border-2 bg-gray-50" data-testid="empty-state">
      <CardContent className="flex flex-col items-center justify-center py-8 px-4">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          {isPast ? (
            <History className="w-12 h-12 text-gray-400" />
          ) : (
            <UserPlus className="w-12 h-12 text-gray-400" />
          )}
        </div>
        <h2 className="text-2xl font-semibold mb-3 text-gray-900">
          {isPast ? "No past visitors" : "No visitors"}
        </h2>
        <p className="text-center text-gray-600 max-w-md leading-relaxed">
          {isPast 
            ? "You have no past visitors yet. Once visits are completed or cancelled, they will appear here."
            : "You have no upcoming visitors."
          }
        </p>
        {!isPast && (
          <>
            {/* Mobile helper text */}
            <p className="md:hidden text-center text-gray-600 max-w-md leading-relaxed mt-2">
              Click the "+" button at the bottom right to register a new visitor.
            </p>
            {/* Desktop helper text */}
            <p className="hidden md:block text-center text-gray-600 max-w-md leading-relaxed mt-2">
              Click "Create visit" at the top right to register a new visitor.
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

