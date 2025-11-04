import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(
      "relative w-full rounded-lg border p-4",
      {
        "bg-white border-gray-200": !variant,
        "bg-destructive/10 border-destructive/20 text-destructive": variant === "destructive",
      },
      className
    )}
    {...props}
  />
))
Alert.displayName = "Alert"

export { Alert }

