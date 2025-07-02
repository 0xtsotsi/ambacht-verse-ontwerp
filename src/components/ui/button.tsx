import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // Classic Elegance variants
        elegant: "bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white shadow-elegant-button hover:shadow-elegant-button-hover rounded-xl font-elegant-body font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5",
        "elegant-outline": "border-2 border-terracotta-400 text-terracotta-600 bg-transparent hover:bg-terracotta-50 hover:border-terracotta-500 rounded-xl font-elegant-body font-semibold transition-all duration-300 transform hover:scale-105",
        "elegant-ghost": "text-terracotta-600 hover:bg-terracotta-100 hover:text-terracotta-700 font-elegant-body font-medium transition-all duration-300 rounded-lg",
        // Modern Fusion variants
        "fusion-primary": "bg-gradient-to-r from-terracotta-500 via-terracotta-600 to-terracotta-700 hover:from-terracotta-600 hover:via-terracotta-700 hover:to-terracotta-800 text-white shadow-elegant-button hover:shadow-elegant-button-hover rounded-2xl font-elegant-body font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-elegant-glow",
        "fusion-outline": "border-3 border-gradient-to-r from-terracotta-400 to-terracotta-600 text-terracotta-600 bg-gradient-to-r from-transparent to-terracotta-50/30 hover:bg-gradient-to-r hover:from-terracotta-50 hover:to-terracotta-100 rounded-2xl font-elegant-body font-bold transition-all duration-300 transform hover:scale-110 hover:rotate-1",
        "fusion-glass": "bg-gradient-to-r from-elegant-light/80 via-terracotta-50/60 to-elegant-light/80 backdrop-blur-md border border-terracotta-200/50 text-terracotta-700 hover:bg-gradient-to-r hover:from-terracotta-100/80 hover:via-terracotta-100/70 hover:to-terracotta-50/80 hover:border-terracotta-300/70 rounded-2xl font-elegant-body font-semibold transition-all duration-300 transform hover:scale-105 shadow-elegant-subtle hover:shadow-elegant-soft",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Classic Elegance sizes
        elegant: "h-12 px-8 py-3 text-base",
        "elegant-lg": "h-14 px-10 py-4 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
