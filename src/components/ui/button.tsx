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
        // Organic Sophistication variants
        "organic-primary": "bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-terracotta-600 hover:from-terracotta-500 hover:via-terracotta-600 hover:to-terracotta-700 text-white rounded-3xl font-elegant-body font-semibold transition-all duration-500 transform hover:scale-105 shadow-organic-natural hover:shadow-organic-floating animate-organic-breathe",
        "organic-soft": "bg-gradient-to-br from-terracotta-50 via-terracotta-100 to-terracotta-150 hover:from-terracotta-100 hover:via-terracotta-200 hover:to-terracotta-250 text-terracotta-700 border border-terracotta-200/60 hover:border-terracotta-300/80 rounded-full font-elegant-body font-medium transition-all duration-400 transform hover:scale-105 shadow-organic-soft hover:shadow-organic-natural",
        "organic-floating": "bg-gradient-to-br from-elegant-light/90 via-terracotta-50/70 to-elegant-light/85 backdrop-blur-sm text-terracotta-600 border border-terracotta-200/40 hover:border-terracotta-300/60 hover:bg-gradient-to-br hover:from-terracotta-100/80 hover:via-terracotta-150/70 hover:to-terracotta-100/75 rounded-3xl font-elegant-body font-medium transition-all duration-500 transform hover:scale-105 shadow-organic-soft hover:shadow-organic-floating animate-organic-float",
        // Minimalist Luxury variants
        "luxury-primary": "bg-terracotta-600 hover:bg-terracotta-700 text-white font-elegant-body font-medium transition-all duration-300 border-0 shadow-none",
        "luxury-outline": "border border-terracotta-600 text-terracotta-600 bg-transparent hover:bg-terracotta-600 hover:text-white font-elegant-body font-medium transition-all duration-300 shadow-none",
        "luxury-ghost": "text-terracotta-600 hover:text-terracotta-700 bg-transparent hover:bg-transparent font-elegant-body font-medium transition-all duration-300 border-0 shadow-none",
        // Interactive Elegance variants
        "interactive-primary": "relative bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white shadow-elegant-button hover:shadow-elegant-button-hover rounded-2xl font-elegant-body font-bold transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-r before:from-terracotta-600/0 before:via-terracotta-400/30 before:to-terracotta-600/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 animate-elegant-glow",
        "interactive-outline": "relative border-2 border-terracotta-500 text-terracotta-600 bg-transparent hover:bg-terracotta-600 hover:text-white hover:border-terracotta-600 rounded-2xl font-elegant-body font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 group overflow-hidden before:absolute before:inset-0 before:bg-terracotta-600 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-500 before:-z-10",
        "interactive-glass": "relative bg-gradient-to-br from-white/60 via-terracotta-50/40 to-white/60 backdrop-blur-md border border-terracotta-300/50 text-terracotta-700 hover:from-terracotta-100/70 hover:via-terracotta-100/60 hover:to-terracotta-50/70 hover:border-terracotta-400/70 rounded-2xl font-elegant-body font-semibold transition-all duration-700 transform hover:scale-105 hover:-translate-y-1 shadow-elegant-soft hover:shadow-elegant-panel group before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-terracotta-200/20 before:to-transparent before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700",
        "interactive-glow": "relative bg-terracotta-600 text-white rounded-full font-elegant-body font-bold transition-all duration-500 transform hover:scale-110 shadow-lg hover:shadow-terracotta-600/50 group overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-terracotta-400 before:to-terracotta-700 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500 after:absolute after:inset-0 after:rounded-full after:shadow-[inset_0_0_20px_rgba(224,138,79,0.5)] after:opacity-0 hover:after:opacity-100 after:transition-opacity after:duration-700",
        "interactive-float": "relative bg-gradient-to-br from-terracotta-400 via-terracotta-500 to-terracotta-600 hover:from-terracotta-500 hover:via-terracotta-600 hover:to-terracotta-700 text-white rounded-3xl font-elegant-body font-semibold transition-all duration-700 transform hover:scale-105 hover:-translate-y-3 shadow-organic-natural hover:shadow-organic-floating animate-organic-float group before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-t before:from-transparent before:to-white/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // Classic Elegance sizes
        elegant: "h-12 px-8 py-3 text-base",
        "elegant-lg": "h-14 px-10 py-4 text-lg",
        // Organic Sophistication sizes
        "organic": "h-12 px-8 py-3 text-base",
        "organic-lg": "h-14 px-12 py-4 text-lg",
        "organic-xl": "h-16 px-14 py-5 text-xl",
        // Minimalist Luxury sizes
        "luxury": "h-12 px-12 py-3 text-base",
        "luxury-lg": "h-14 px-16 py-4 text-lg",
        "luxury-xl": "h-16 px-20 py-5 text-xl",
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
