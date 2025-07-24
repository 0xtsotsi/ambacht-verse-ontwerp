import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative w-full rounded-2xl border p-6 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6 [&>svg]:text-foreground backdrop-blur-sm shadow-elegant-soft transition-all duration-500 hover:shadow-elegant-panel",
  {
    variants: {
      variant: {
        default:
          "bg-white/90 border-terracotta-200/30 text-elegant-dark [&>svg]:text-terracotta-600",
        destructive:
          "bg-red-50/90 border-red-300/50 text-red-800 [&>svg]:text-red-600",
        success:
          "bg-green-50/90 border-green-300/50 text-green-800 [&>svg]:text-green-600",
        warning:
          "bg-amber-50/90 border-amber-300/50 text-amber-800 [&>svg]:text-amber-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
