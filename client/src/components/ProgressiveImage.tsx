import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  placeholder,
  className,
  priority = false,
  onClick
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  return (
    <div className={cn("relative overflow-hidden", className)} onClick={onClick}>
      {/* Placeholder/Loading state */}
      {(!isLoaded || hasError) && (
        <div className="absolute inset-0 bg-gradient-to-br from-warm-gold/20 to-heritage-orange/20 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </div>
      )}
      
      {/* Low quality placeholder if provided */}
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110"
        />
      )}
      
      {/* Main image */}
      <motion.img
        src={src}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-all duration-700",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        initial={{ scale: 1.1 }}
        animate={{ scale: isLoaded ? 1 : 1.1 }}
        transition={{ duration: 0.7 }}
      />
    </div>
  );
}