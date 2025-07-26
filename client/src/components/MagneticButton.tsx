import { forwardRef, useRef, useState, useCallback, ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const magneticButtonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 overflow-hidden",
  {
    variants: {
      variant: {
        primary: "bg-heritage-orange hover:bg-heritage-orange/90 text-white shadow-lg",
        secondary: "bg-warm-gold hover:bg-warm-gold/90 text-elegant-charcoal",
        outline: "border-2 border-heritage-orange text-heritage-orange hover:bg-heritage-orange hover:text-white",
        ghost: "hover:bg-heritage-orange/10 text-heritage-orange",
      },
      size: {
        sm: "px-4 py-2 text-sm",
        md: "px-6 py-3 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-12 py-6 text-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface MagneticButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragEnd' | 'onDragStart'>,
    VariantProps<typeof magneticButtonVariants> {
  children: ReactNode;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, className, size = "md", variant = "primary", ...props }, ref) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return;
      
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;
      
      setPosition({ x: deltaX, y: deltaY });
    }, []);
    
    const handleMouseLeave = useCallback(() => {
      setPosition({ x: 0, y: 0 });
    }, []);
    
    return (
      <motion.button
        ref={buttonRef}
        className={cn(magneticButtonVariants({ variant, size }), className)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type={props.type || "button"}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        <motion.div
          className="absolute inset-0 bg-white/20 rounded-full"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
        <span className="relative z-10">{children}</span>
      </motion.button>
    );
  }
);

MagneticButton.displayName = "MagneticButton";