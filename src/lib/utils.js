import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  // Parse the date string manually to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number)
  // Create date in local timezone (month is 0-indexed)
  const dateObj = new Date(year, month - 1, day)
  return dateObj.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
}

export function formatTime(time) {
  if (!time) return 'All day visit'
  const [hours, minutes] = time.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}

