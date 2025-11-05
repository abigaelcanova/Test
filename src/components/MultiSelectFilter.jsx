import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ChevronDown, Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MultiSelectFilter({ 
  options, 
  selectedValues, 
  onChange, 
  placeholder = "Select...",
  className,
  formatLabel
}) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleToggle = (value) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  const handleSelectAll = () => {
    if (selectedValues.length === filteredOptions.length) {
      // Deselect all filtered options
      onChange(selectedValues.filter(v => !filteredOptions.includes(v)))
    } else {
      // Select all filtered options
      const allValues = [...new Set([...selectedValues, ...filteredOptions])]
      onChange(allValues)
    }
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange([])
  }

  const getLabel = (option) => {
    if (formatLabel) return formatLabel(option)
    return option
  }

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options
    return options.filter(option => 
      getLabel(option).toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery, formatLabel])

  const isAllSelected = filteredOptions.length > 0 && 
    filteredOptions.every(option => selectedValues.includes(option))
  const isSomeSelected = filteredOptions.some(option => selectedValues.includes(option)) && !isAllSelected

  const hasSelections = selectedValues.length > 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal gap-3 bg-white hover:bg-white hover:border-gray-900 border-gray-200", className)}
        >
          <span className="truncate flex items-center gap-2">
            <span className={hasSelections ? "text-primary font-medium" : "text-gray-600"}>
              {placeholder}
            </span>
            {hasSelections && (
              <span className="inline-flex items-center justify-center rounded-md bg-primary text-white text-xs font-semibold px-2 py-0.5 min-w-[20px]">
                {selectedValues.length}
              </span>
            )}
          </span>
          <div className="flex items-center gap-3 shrink-0">
            {hasSelections && (
              <>
                <button
                  onClick={handleClear}
                  className="hover:bg-gray-200 rounded p-0.5 text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="w-px h-5 bg-gray-300" />
              </>
            )}
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-0" align="start">
        {/* Search Input */}
        <div className="p-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-gray-50 border-gray-200 focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto px-3 pb-3">
          {filteredOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              No options available
            </div>
          ) : (
            <div className="space-y-0.5">
              {/* Select All */}
              <label className="flex items-center gap-3 px-3 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeSelected
                  }}
                  onChange={handleSelectAll}
                  className="rounded-md"
                />
                <span className="text-sm font-medium flex-1 text-gray-900">Select all</span>
              </label>

              {/* Options */}
              {filteredOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center gap-3 px-3 py-3 hover:bg-gray-50 rounded-xl cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedValues.includes(option)}
                    onChange={() => handleToggle(option)}
                    className="rounded-md"
                  />
                  <span className="text-sm flex-1 text-gray-900">{getLabel(option)}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

