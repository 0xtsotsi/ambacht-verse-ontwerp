import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LoaderProps {
  type?: "page" | "button" | "skeleton";
  className?: string;
}

export const SmartLoader = ({ type = "page", className }: LoaderProps) => {
  const loaderVariants = {
    page: {
      initial: { opacity: 1 },
      animate: { 
        opacity: [1, 0.7, 1],
        transition: { duration: 1.5, repeat: Infinity }
      }
    },
    button: {
      animate: { rotate: 360 },
      transition: { duration: 1, repeat: Infinity, ease: "linear" }
    },
    skeleton: {
      animate: { 
        background: [
          "linear-gradient(90deg, #FAF8F5 25%, #F5E6D3 50%, #FAF8F5 75%)",
          "linear-gradient(90deg, #F5E6D3 25%, #FAF8F5 50%, #F5E6D3 75%)"
        ]
      },
      transition: { duration: 1.5, repeat: Infinity }
    }
  };
  
  if (type === "page") {
    return (
      <motion.div
        className={cn("flex items-center justify-center min-h-screen bg-gradient-to-br from-[#FAF8F5] to-[#F5E6D3]", className)}
        variants={loaderVariants.page}
        initial="initial"
        animate="animate"
      >
        <div className="text-center">
          <motion.div
            className="w-16 h-16 border-4 border-[#D4AF37] border-t-transparent rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-[#2F2F2F] font-medium" style={{ fontFamily: 'Open Sans, sans-serif' }}>
            Wesley's Ambacht laden...
          </p>
        </div>
      </motion.div>
    );
  }
  
  if (type === "button") {
    return (
      <motion.div
        className={cn("w-5 h-5 border-2 border-white border-t-transparent rounded-full", className)}
        variants={loaderVariants.button}
        animate="animate"
      />
    );
  }
  
  if (type === "skeleton") {
    return (
      <motion.div
        className={cn("h-4 rounded bg-gray-200", className)}
        variants={loaderVariants.skeleton}
        animate="animate"
      />
    );
  }
  
  return null;
};