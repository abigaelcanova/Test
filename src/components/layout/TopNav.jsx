import { Search, Bell, ChevronDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function TopNav() {
  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-gray-50 px-6">
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900">
            <span className="text-white text-xs font-bold">HqO</span>
          </div>
          <span className="font-semibold text-gray-900">HqO</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Building/Location Selector */}
        <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 min-w-[220px]">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-300">
            <span className="text-gray-600 text-xs">🏢</span>
          </div>
          <Select defaultValue="cobblestone">
            <SelectTrigger className="border-0 shadow-none p-0 h-auto focus:ring-0 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cobblestone">Cobblestone Collaborative</SelectItem>
              <SelectItem value="other">Other Building</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Search Icon */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Search className="h-5 w-5 text-gray-600" />
        </button>
        
        {/* Notifications */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
        </button>
        
        {/* User Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold text-gray-700">
          AC
        </div>
      </div>
    </div>
  )
}

