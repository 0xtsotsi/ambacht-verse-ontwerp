import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-4 py-2 text-sm font-elegant-body font-medium transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-terracotta-400/50 focus:ring-offset-2 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-terracotta-600 text-white hover:bg-terracotta-700 hover:scale-110 hover:shadow-elegant-button",
        secondary:
          "border-transparent bg-terracotta-100/70 text-terracotta-700 hover:bg-terracotta-200/80 hover:scale-110 hover:shadow-elegant-soft",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-110",
        outline:
          "border-terracotta-300/50 text-terracotta-700 hover:bg-terracotta-50/50 hover:border-terracotta-400/70 hover:scale-110",
        interactive:
          "border-terracotta-300/50 bg-white/90 backdrop-blur-sm text-terracotta-700 hover:bg-terracotta-100/80 hover:border-terracotta-400 hover:scale-110 hover:shadow-elegant-soft hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
