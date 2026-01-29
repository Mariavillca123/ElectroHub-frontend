import type { ReactNode } from "react"
import { cn } from "../../utils/cn"

interface BadgeProps {
  children: ReactNode
  variant?: "default" | "secondary" | "destructive"
  className?: string
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800"
  }

  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", variants[variant], className)}>
      {children}
    </span>
  )
}
