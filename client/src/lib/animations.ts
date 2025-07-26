import { useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";

// PREMIUM ANIMATION UTILITIES
export const premiumAnimations = {
  // Hero sequence
  revealText: (delay = 0) => ({
    initial: { opacity: 0, y: 60, rotateX: -15 },
    animate: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: {
        delay,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  }),
  
  // Staggered container
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  },
  
  // Magnetic interaction
  magneticHover: {
    whileHover: { scale: 1.05, y: -4 },
    whileTap: { scale: 0.95 },
    transition: { type: "spring", stiffness: 400, damping: 30 }
  },
  
  // 3D card effect
  luxuryCard: {
    whileHover: {
      rotateY: 8,
      rotateX: 8,
      scale: 1.02,
      transition: { duration: 0.4 }
    }
  },
  
  // Page transitions
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// Fade in up animation
export const fadeInUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

// Reveal animation for scroll
export const revealAnimation = ({ delay = 0, duration = 0.8 } = {}) => ({
  initial: { opacity: 0, y: 50 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      delay,
      duration,
      ease: [0.22, 1, 0.36, 1]
    }
  }
});

// Scroll-based reveal
export const useScrollReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });
  
  return {
    ref,
    animation: {
      initial: { opacity: 0, y: 50 },
      animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 },
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
    }
  };
};

// Performance optimized parallax
export const useParallax = (offset = 50) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, offset]);
  return y;
};