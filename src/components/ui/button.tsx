import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

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
        // V5 Interactive Elegance variants only
        "interactive-primary":
          "relative bg-gradient-to-r from-terracotta-500 to-terracotta-600 hover:from-terracotta-600 hover:to-terracotta-700 text-white shadow-elegant-button hover:shadow-elegant-button-hover rounded-2xl font-elegant-body font-bold transition-all duration-700 transform hover:scale-110 hover:-translate-y-2 overflow-hidden group before:absolute before:inset-0 before:bg-gradient-to-r before:from-terracotta-600/0 before:via-terracotta-400/30 before:to-terracotta-600/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-1000 animate-elegant-glow",
        "interactive-outline":
          "relative border-2 border-terracotta-500 text-terracotta-600 bg-transparent hover:bg-terracotta-600 hover:text-white hover:border-terracotta-600 rounded-2xl font-elegant-body font-bold transition-all duration-500 transform hover:scale-110 hover:rotate-1 group overflow-hidden before:absolute before:inset-0 before:bg-terracotta-600 before:translate-y-full hover:before:translate-y-0 before:transition-transform before:duration-500 before:-z-10",
        "interactive-glass":
          "relative bg-gradient-to-br from-white/60 via-terracotta-50/40 to-white/60 backdrop-blur-md border border-terracotta-300/50 text-terracotta-700 hover:from-terracotta-100/70 hover:via-terracotta-100/60 hover:to-terracotta-50/70 hover:border-terracotta-400/70 rounded-2xl font-elegant-body font-semibold transition-all duration-700 transform hover:scale-105 hover:-translate-y-1 shadow-elegant-soft hover:shadow-elegant-panel group before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:via-terracotta-200/20 before:to-transparent before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-700",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        // V5 Interactive Elegance sizes
        "elegant-lg": "h-14 px-10 py-4 text-lg",
        "luxury-xl": "h-16 px-20 py-5 text-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
