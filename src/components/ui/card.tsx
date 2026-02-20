import type { ReactNode } from "react"
import { cn } from "../../utils/cn"

interface CardProps {
  children: ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn("rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm", className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: CardProps) {
  return <div className={cn("p-4", className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn("p-4 pt-0", className)}>{children}</div>
}
