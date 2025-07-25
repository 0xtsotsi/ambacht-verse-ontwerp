import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressiveImageProps {
  src: string;
  placeholder?: string;
  alt: string;
  className?: string;
}

export const ProgressiveImage = ({ 
  src, 
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI0ZBRjhGNSIvPjwvc3ZnPg==",
  alt, 
  className 
}: ProgressiveImageProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(placeholder);
  
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageLoaded(true);
    };
    img.src = src;
  }, [src]);
  
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.img
        src={imageSrc}
        alt={alt}
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0.7 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full h-full object-cover"
      />
      {!imageLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#F5E6D3] to-[#FAF8F5]"
          animate={{
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};