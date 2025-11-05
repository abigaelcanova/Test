import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-blue-50 text-blue-600 hover:bg-blue-100",
        secondary:
          "border-transparent bg-purple-50 text-purple-600 hover:bg-purple-100",
        destructive:
          "border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200",
        success:
          "border-transparent bg-teal-50 text-teal-600 hover:bg-teal-100",
        warning:
          "border-transparent bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

