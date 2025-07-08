import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-terracotta-200/50 bg-white/90 backdrop-blur-sm px-4 py-3 text-base font-elegant-body text-elegant-dark ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-elegant-grey-400 placeholder:font-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400/50 focus-visible:ring-offset-2 focus-visible:border-terracotta-400 focus-visible:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:border-terracotta-300/70 hover:bg-white hover:shadow-elegant-subtle md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
