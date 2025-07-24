import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className,
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-terracotta-100/50 backdrop-blur-sm transition-all duration-300 hover:bg-terracotta-100/70">
      <SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-terracotta-500 to-terracotta-600 transition-all duration-300" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block h-6 w-6 rounded-full border-2 border-terracotta-600 bg-white shadow-elegant-button ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-terracotta-400/50 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-125 hover:shadow-elegant-button-hover cursor-pointer" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
