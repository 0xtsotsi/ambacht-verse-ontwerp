import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, ChefHat, Clock, Calendar, Users } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "secondary" | "muted";
}

export const LoadingSpinner = ({ 
  size = "md", 
  className,
  color = "primary" 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6", 
    lg: "h-8 w-8"
  };

  const colorClasses = {
    primary: "text-[#CC7A00]",
    secondary: "text-[#D4AF37]",
    muted: "text-muted-foreground"
  };

  return (
    <Loader2 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        colorClasses[color],
        className
      )} 
    />
  );
};

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export const Skeleton = ({ 
  className, 
  variant = "rectangular",
  width,
  height 
}: SkeletonProps) => {
  const variantClasses = {
    text: "h-4 w-full rounded",
    circular: "rounded-full",
    rectangular: "rounded"
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={cn(
        "animate-pulse bg-gradient-to-r from-[#F9F6F1] via-[#FEFBF5] to-[#F9F6F1] bg-[length:200%_100%] animate-shimmer",
        variantClasses[variant],
        className
      )}
      style={style}
    />
  );
};

// Gallery skeleton loader
export const GallerySkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="space-y-3">
        <Skeleton className="aspect-[4/3] w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    ))}
  </div>
);

// Service cards skeleton
export const ServicesSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="p-6 space-y-4 border rounded-lg">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-6 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    ))}
  </div>
);

// Booking form skeleton
export const BookingFormSkeleton = () => (
  <div className="max-w-2xl mx-auto space-y-6">
    <div className="text-center space-y-2">
      <Skeleton className="h-8 w-1/2 mx-auto" />
      <Skeleton className="h-4 w-3/4 mx-auto" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
    
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-32 w-full" />
    </div>
    
    <Skeleton className="h-12 w-full rounded-lg" />
  </div>
);

// Navigation skeleton
export const NavigationSkeleton = () => (
  <header className="bg-[#F9F6F1] border-b">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between h-16">
        <Skeleton className="h-8 w-32" />
        <div className="hidden md:flex space-x-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-16" />
          ))}
        </div>
        <Skeleton className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </header>
);

// Custom themed loading states
interface CateringLoadingProps {
  type: "booking" | "menu" | "availability" | "quote";
  message?: string;
  className?: string;
}

export const CateringLoading = ({ 
  type, 
  message,
  className 
}: CateringLoadingProps) => {
  const configs = {
    booking: {
      icon: Calendar,
      defaultMessage: "Beschikbaarheid controleren...",
      color: "text-[#CC7A00]"
    },
    menu: {
      icon: ChefHat,
      defaultMessage: "Menu laden...",
      color: "text-[#D4AF37]"
    },
    availability: {
      icon: Clock,
      defaultMessage: "Tijdslots controleren...",
      color: "text-[#2C2C2C]"
    },
    quote: {
      icon: Users,
      defaultMessage: "Offerte berekenen...",
      color: "text-[#CC7A00]"
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center py-12 px-4",
      className
    )}>
      <div className="relative">
        <Icon className={cn("h-12 w-12 mb-4", config.color)} />
        <LoadingSpinner 
          size="lg" 
          className="absolute -top-1 -right-1" 
          color="primary"
        />
      </div>
      <p className="text-[#2C2C2C] font-medium">
        {message || config.defaultMessage}
      </p>
      <div className="mt-4 w-48">
        <div className="h-1 bg-[#F9F6F1] rounded-full overflow-hidden">
          <div className="h-full bg-[#CC7A00] rounded-full animate-pulse" 
               style={{ width: "60%" }} />
        </div>
      </div>
    </div>
  );
};

// Full page loading overlay
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  children: React.ReactNode;
}

export const LoadingOverlay = ({ 
  isLoading, 
  message = "Laden...", 
  children 
}: LoadingOverlayProps) => {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-[#2C2C2C] font-medium">{message}</p>
        </div>
      </div>
    </div>
  );
};

// Button loading state
interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  children: React.ReactNode;
  loadingText?: string;
}

export const LoadingButton = ({ 
  isLoading = false,
  children,
  loadingText,
  disabled,
  className,
  ...props 
}: LoadingButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" />}
      {isLoading ? (loadingText || "Laden...") : children}
    </button>
  );
};

// Add shimmer animation to your CSS
export const shimmerAnimation = `
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.animate-shimmer {
  animation: shimmer 2s ease-in-out infinite;
}
`;