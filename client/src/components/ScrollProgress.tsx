import React from "react";
import { motion, useScroll } from "framer-motion";

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#CC7A00] to-[#D4AF37] z-50 origin-left"
      style={{ scaleX: scrollYProgress }}
    />
  );
};

// Enhanced scroll-based text reveal
interface ScrollTextRevealProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollTextReveal = ({ children, className }: ScrollTextRevealProps) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%" }}
        whileInView={{ y: "0%" }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
};