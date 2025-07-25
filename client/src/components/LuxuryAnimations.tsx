import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Premium Page Transition Component
export const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] // Premium easing curve
      }}
    >
      {children}
    </motion.div>
  );
};

// Staggered Content Reveal - Soprano's Style
interface StaggeredRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const StaggeredReveal = ({ children, delay = 0, className }: StaggeredRevealProps) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            delayChildren: delay,
            staggerChildren: 0.15
          }
        }
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: {
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Luxury Card with 3D Hover Effects
interface LuxuryCardProps {
  children: React.ReactNode;
  className?: string;
}

export const LuxuryCard = ({ children, className }: LuxuryCardProps) => {
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: {
          scale: 1,
          rotateY: 0,
          rotateX: 0,
        },
        hover: {
          scale: 1.02,
          rotateY: 5,
          rotateX: 5,
          transition: {
            duration: 0.4,
            ease: "easeOut"
          }
        }
      }}
      style={{
        transformStyle: "preserve-3d",
        transformOrigin: "center center"
      }}
    >
      <motion.div
        variants={{
          initial: { boxShadow: "0 4px 20px rgba(0,0,0,0.1)" },
          hover: { boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }
        }}
        className="rounded-xl"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Magnetic Button Effect - Soprano's Interactive Style
interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MagneticButton = ({ children, className, onClick }: MagneticButtonProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (e.clientX - centerX) * 0.15;
    const deltaY = (e.clientY - centerY) * 0.15;
    
    setMousePosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={buttonRef}
      className={className}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      animate={{
        x: mousePosition.x,
        y: mousePosition.y,
        scale: isHovered ? 1.05 : 1
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
};

// Parallax Scroll Effect
interface ParallaxScrollProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const ParallaxScroll = ({ children, offset = 50, className }: ParallaxScrollProps) => {
  const [scrollY, setScrollY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrollPercent = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        setScrollY(scrollPercent * offset);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${scrollY}px)`
      }}
    >
      {children}
    </motion.div>
  );
};

// Smooth Scroll Indicator - Like Soprano's Style
export const ScrollIndicator = () => {
  return (
    <motion.div
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center cursor-pointer"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <motion.div
          animate={{ y: [0, 16, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-1 h-3 bg-white/70 rounded-full mt-2"
        />
      </motion.div>
    </motion.div>
  );
};